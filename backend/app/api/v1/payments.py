from fastapi import APIRouter, HTTPException, Depends, Request, Header
from typing import Optional
import logging
import httpx
import hashlib
import hmac
import json

from ...core.database import get_db, get_database_service, DatabaseService
from ...core.config import settings
from ...models.schemas import (
    PaymentWebhook, PaymentVerificationResponse, OrderUpdate, PaymentStatus
)

router = APIRouter()
logger = logging.getLogger(__name__)

def verify_flutterwave_signature(payload: bytes, signature: str) -> bool:
    """Verify Flutterwave webhook signature"""
    if not settings.FLUTTERWAVE_WEBHOOK_HASH:
        logger.warning("Flutterwave webhook hash not configured")
        return False

    expected_signature = hmac.new(
        settings.FLUTTERWAVE_WEBHOOK_HASH.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(signature, expected_signature)

async def verify_payment_with_flutterwave(transaction_id: str) -> dict:
    """Verify payment with Flutterwave API"""
    url = f"https://api.flutterwave.com/v3/transactions/{transaction_id}/verify"
    headers = {
        "Authorization": f"Bearer {settings.FLUTTERWAVE_SECRET_KEY}",
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        response.raise_for_status()
        return response.json()

@router.post("/webhook/flutterwave")
async def flutterwave_webhook(
    request: Request,
    verif_hash: Optional[str] = Header(None, alias="verif-hash"),
    db: DatabaseService = Depends(get_database_service)
):
    """Handle Flutterwave payment webhooks"""
    try:
        # Get raw body for signature verification
        body = await request.body()

        # Verify signature (in production)
        if settings.ENVIRONMENT == "production" and verif_hash:
            if not verify_flutterwave_signature(body, verif_hash):
                logger.warning("Invalid Flutterwave webhook signature")
                raise HTTPException(status_code=401, detail="Invalid signature")

        # Parse webhook data
        try:
            webhook_data = json.loads(body.decode('utf-8'))
        except json.JSONDecodeError:
            logger.error("Invalid JSON in webhook payload")
            raise HTTPException(status_code=400, detail="Invalid JSON payload")

        logger.info(f"Received Flutterwave webhook: {webhook_data.get('event', 'unknown')}")

        # Handle charge.completed event
        if webhook_data.get('event') == 'charge.completed':
            payment_data = webhook_data.get('data', {})

            if not payment_data:
                logger.error("No payment data in webhook")
                raise HTTPException(status_code=400, detail="No payment data")

            transaction_id = payment_data.get('id')
            tx_ref = payment_data.get('tx_ref')  # This should be our order_id
            status = payment_data.get('status')
            amount = payment_data.get('amount')
            currency = payment_data.get('currency')

            logger.info(f"Processing payment: {transaction_id}, order: {tx_ref}, status: {status}")

            # Verify payment with Flutterwave API
            try:
                verification = await verify_payment_with_flutterwave(transaction_id)
                verified_data = verification.get('data', {})

                if verification.get('status') != 'success':
                    logger.error(f"Payment verification failed: {verification}")
                    return {"status": "error", "message": "Payment verification failed"}

                # Double check the payment details
                if verified_data.get('tx_ref') != tx_ref:
                    logger.error(f"Transaction reference mismatch: {verified_data.get('tx_ref')} != {tx_ref}")
                    return {"status": "error", "message": "Transaction reference mismatch"}

                if verified_data.get('currency') != 'NGN':
                    logger.warning(f"Unexpected currency: {verified_data.get('currency')}")

            except httpx.HTTPError as e:
                logger.error(f"Failed to verify payment with Flutterwave: {e}")
                return {"status": "error", "message": "Payment verification failed"}

            # Find and update order
            try:
                order_result = db.client.table('orders').select('*').eq('order_id', tx_ref).single().execute()

                if not order_result.data:
                    logger.error(f"Order not found for tx_ref: {tx_ref}")
                    return {"status": "error", "message": "Order not found"}

                order = order_result.data

                # Check if payment is successful
                if status == 'successful' and verified_data.get('status') == 'successful':
                    # Verify amount matches (allow small floating point differences)
                    expected_amount = float(order['total_amount'])
                    received_amount = float(amount)

                    if abs(expected_amount - received_amount) > 0.01:
                        logger.error(f"Amount mismatch: expected {expected_amount}, got {received_amount}")
                        return {"status": "error", "message": "Amount mismatch"}

                    # Update order as paid
                    updates = {
                        'payment_status': 'completed',
                        'payment_reference': str(transaction_id),
                        'updated_at': '1970-01-01T00:00:00Z'  # Will be overridden by trigger
                    }

                    updated_order = await db.update_with_optimistic_locking(
                        'orders',
                        order['id'],
                        updates
                    )

                    if updated_order:
                        logger.info(f"Order {tx_ref} payment confirmed successfully")

                        # Here you could add additional logic like:
                        # - Send confirmation email to customer
                        # - Notify partner about new order
                        # - Update inventory
                        # - Trigger other business logic

                        return {"status": "success", "message": "Payment processed successfully"}
                    else:
                        logger.error(f"Failed to update order {tx_ref}")
                        return {"status": "error", "message": "Failed to update order"}

                else:
                    # Payment failed or was not successful
                    updates = {
                        'payment_status': 'failed',
                        'payment_reference': str(transaction_id),
                        'updated_at': '1970-01-01T00:00:00Z'
                    }

                    await db.update_with_optimistic_locking(
                        'orders',
                        order['id'],
                        updates
                    )

                    logger.info(f"Order {tx_ref} payment failed with status: {status}")
                    return {"status": "failed", "message": "Payment was not successful"}

            except Exception as e:
                logger.error(f"Error updating order for payment {transaction_id}: {e}")
                return {"status": "error", "message": "Failed to process payment"}

        else:
            logger.info(f"Unhandled webhook event: {webhook_data.get('event')}")
            return {"status": "ignored", "message": "Event not handled"}

        return {"status": "success", "message": "Webhook processed"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing Flutterwave webhook: {e}")
        raise HTTPException(status_code=500, detail="Failed to process webhook")

@router.get("/verify/{transaction_id}", response_model=PaymentVerificationResponse)
async def verify_payment(
    transaction_id: str,
    db: DatabaseService = Depends(get_database_service)
):
    """Manually verify a payment with Flutterwave"""
    try:
        # Verify with Flutterwave API
        verification = await verify_payment_with_flutterwave(transaction_id)

        if verification.get('status') != 'success':
            raise HTTPException(status_code=400, detail="Payment verification failed")

        payment_data = verification.get('data', {})
        tx_ref = payment_data.get('tx_ref')

        # Find corresponding order
        if tx_ref:
            order_result = db.client.table('orders').select('*').eq('order_id', tx_ref).single().execute()
            if order_result.data:
                order = order_result.data

                # Update order if payment is successful and not already updated
                if (payment_data.get('status') == 'successful' and
                    order['payment_status'] != 'completed'):

                    updates = {
                        'payment_status': 'completed',
                        'payment_reference': str(transaction_id),
                        'updated_at': '1970-01-01T00:00:00Z'
                    }

                    await db.update_with_optimistic_locking(
                        'orders',
                        order['id'],
                        updates
                    )

        return PaymentVerificationResponse(
            status=verification.get('status'),
            message=verification.get('message', 'Payment verification completed'),
            data=payment_data
        )

    except httpx.HTTPError as e:
        logger.error(f"Failed to verify payment {transaction_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to verify payment")
    except Exception as e:
        logger.error(f"Error verifying payment {transaction_id}: {e}")
        raise HTTPException(status_code=500, detail="Payment verification error")

@router.get("/status/{order_id}")
async def get_payment_status(
    order_id: str,
    db: DatabaseService = Depends(get_database_service)
):
    """Get payment status for an order"""
    try:
        order_result = db.client.table('orders').select(
            'order_id, payment_status, payment_reference, total_amount, created_at'
        ).eq('order_id', order_id).single().execute()

        if not order_result.data:
            raise HTTPException(status_code=404, detail="Order not found")

        order = order_result.data

        return {
            "order_id": order['order_id'],
            "payment_status": order['payment_status'],
            "payment_reference": order.get('payment_reference'),
            "total_amount": order['total_amount'],
            "created_at": order['created_at']
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching payment status for order {order_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch payment status")

@router.post("/refund/{order_id}")
async def initiate_refund(
    order_id: str,
    db: DatabaseService = Depends(get_database_service)
):
    """Initiate refund for an order (admin only)"""
    # Note: This would need proper authentication/authorization in production
    try:
        order_result = db.client.table('orders').select('*').eq('order_id', order_id).single().execute()

        if not order_result.data:
            raise HTTPException(status_code=404, detail="Order not found")

        order = order_result.data

        if order['payment_status'] != 'completed':
            raise HTTPException(status_code=400, detail="Cannot refund unpaid order")

        # Here you would integrate with Flutterwave refund API
        # For now, we'll just update the status

        updates = {
            'payment_status': 'refunded',
            'order_status': 'expired',
            'updated_at': '1970-01-01T00:00:00Z'
        }

        updated_order = await db.update_with_optimistic_locking(
            'orders',
            order['id'],
            updates
        )

        if not updated_order:
            raise HTTPException(status_code=500, detail="Failed to update order")

        # TODO: Call Flutterwave refund API here
        # refund_result = await initiate_flutterwave_refund(
        #     order['payment_reference'],
        #     order['total_amount']
        # )

        return {
            "status": "success",
            "message": "Refund initiated successfully",
            "order_id": order_id
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error initiating refund for order {order_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to initiate refund")