# SlashFood Backend API

FastAPI backend for SlashFood - Nigeria's premier food waste reduction platform.

## 🚀 Features

- **FastAPI Framework**: High-performance, easy-to-use, fast to code
- **Automatic API Documentation**: Interactive Swagger UI at `/docs`
- **Database Integration**: Supabase PostgreSQL with real-time capabilities
- **Payment Processing**: Flutterwave integration with webhook support
- **Input Validation**: Pydantic models with automatic validation
- **Error Handling**: Comprehensive error responses
- **Location Services**: Distance calculation and nearby deals
- **Order Management**: Complete order lifecycle tracking
- **Partner Analytics**: Business insights and metrics

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── core/
│   │   ├── config.py        # Configuration settings
│   │   └── database.py      # Database connection and utilities
│   ├── models/
│   │   └── schemas.py       # Pydantic models
│   ├── api/v1/
│   │   ├── deals.py         # Deals endpoints
│   │   ├── orders.py        # Orders endpoints
│   │   ├── payments.py      # Payment and webhook endpoints
│   │   ├── partners.py      # Partner management
│   │   └── customers.py     # Customer endpoints
│   └── services/            # Business logic (future)
├── scripts/
│   └── run_dev.py          # Development server runner
├── requirements.txt         # Python dependencies
├── Dockerfile              # Container configuration
└── .env.example            # Environment variables template
```

## 🛠️ Setup

### Prerequisites

- Python 3.11+
- Supabase account and project
- Flutterwave account (for payments)

### Installation

1. **Clone and navigate to backend**:
```bash
cd backend
```

2. **Create virtual environment**:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your actual keys
```

5. **Configure Supabase**:
   - Follow the main `SUPABASE_SETUP.md` guide
   - Get your service role key from Supabase dashboard
   - Update `.env` with your Supabase credentials

6. **Configure Flutterwave**:
   - Get your secret key from Flutterwave dashboard
   - Set webhook URL to: `https://your-api-domain.com/api/v1/payments/webhook/flutterwave`
   - Update `.env` with your Flutterwave keys

## 🚀 Running the API

### Development Mode

```bash
# Using Python directly
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Using the development script
python scripts/run_dev.py

# Using the app directly
cd app && python main.py
```

### Production Mode

```bash
# Using Gunicorn (recommended for production)
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Using Docker
docker build -t slashfood-api .
docker run -p 8000:8000 --env-file .env slashfood-api
```

## 📚 API Documentation

Once running, access:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 🔗 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/health` | Health check |
| GET | `/api/v1` | API v1 root |

### Deals

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/deals/` | Get paginated deals |
| POST | `/api/v1/deals/nearby` | Get deals near location |
| GET | `/api/v1/deals/{deal_id}` | Get specific deal |
| GET | `/api/v1/deals/categories/list` | Get all categories |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/orders/` | Create new order |
| GET | `/api/v1/orders/{order_id}` | Get order by ID |
| GET | `/api/v1/orders/pickup-code/{code}` | Get order by pickup code |
| PATCH | `/api/v1/orders/{order_id}` | Update order status |
| GET | `/api/v1/orders/customer/{email}` | Get customer orders |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/payments/webhook/flutterwave` | Flutterwave webhook |
| GET | `/api/v1/payments/verify/{transaction_id}` | Verify payment |
| GET | `/api/v1/payments/status/{order_id}` | Get payment status |
| POST | `/api/v1/payments/refund/{order_id}` | Initiate refund |

### Partners

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/partners/` | Get partners list |
| GET | `/api/v1/partners/{partner_id}` | Get partner details |
| GET | `/api/v1/partners/{partner_id}/deals` | Get partner deals |
| GET | `/api/v1/partners/{partner_id}/orders` | Get partner orders |
| GET | `/api/v1/partners/{partner_id}/analytics` | Get partner analytics |

### Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/customers/{email}` | Get customer by email |
| POST | `/api/v1/customers/` | Create customer |
| PATCH | `/api/v1/customers/{email}` | Update customer |
| GET | `/api/v1/customers/{email}/analytics` | Get customer analytics |

## 🔧 Configuration

### Environment Variables

Key environment variables in `.env`:

```bash
# Core
ENVIRONMENT=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Payment
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your-secret-key
FLUTTERWAVE_WEBHOOK_HASH=your-webhook-hash

# Security
SECRET_KEY=your-secret-key-min-32-chars
```

### CORS Configuration

Update `ALLOWED_ORIGINS` in `.env` to include your frontend domains:

```bash
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:5173","https://yourdomain.com"]
```

## 🔐 Security

- **Environment-based config**: Sensitive data in environment variables
- **Input validation**: Pydantic models validate all inputs
- **CORS protection**: Configurable allowed origins
- **Webhook verification**: Signature verification for payment webhooks
- **SQL injection protection**: Parameterized queries via Supabase

## 📊 Monitoring

### Health Checks

```bash
curl http://localhost:8000/health
```

### Logs

The API uses Python's built-in logging. In production, configure log aggregation:

```python
import logging
logging.basicConfig(level=logging.INFO)
```

## 🚀 Deployment

### Railway (Recommended)

1. Connect your GitHub repo to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### Heroku

1. Create `Procfile`:
```
web: gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
```

2. Set config vars in Heroku dashboard
3. Deploy

### Docker

Build and run with Docker:

```bash
docker build -t slashfood-api .
docker run -p 8000:8000 --env-file .env slashfood-api
```

## 🧪 Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest

# Run with coverage
pytest --cov=app tests/
```

## 📈 Performance

- **Async/await**: Full async support for I/O operations
- **Connection pooling**: Efficient database connections
- **Pydantic**: Fast serialization/validation
- **Uvicorn**: High-performance ASGI server

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

- **API Documentation**: `/docs` endpoint
- **Issues**: GitHub issues
- **Email**: support@slashfood.ng

---

Built with ❤️ using FastAPI for SlashFood Nigeria