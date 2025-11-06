import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Chip } from 'react-native-paper';
import { foodPacksService } from '../services/foodPacks';
import { authService } from '../services/auth';
import { Order } from '../types';
import { formatNaira } from '../utils/currency';

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    const { user } = await authService.getCurrentUser();
    if (!user) return;

    const { data } = await foodPacksService.getUserOrders(user.id);
    if (data) {
      setOrders(data);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FFA726';
      case 'confirmed':
        return '#42A5F5';
      case 'picked_up':
        return '#66BB6A';
      case 'cancelled':
        return '#EF5350';
      default:
        return '#999';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'picked_up':
        return 'Picked Up';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const renderOrderCard = ({ item: order }: { item: Order }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Text style={styles.restaurantName}>
            {order.food_pack?.restaurant?.name || 'Restaurant'}
          </Text>
          <Chip
            style={[styles.statusChip, { backgroundColor: getStatusColor(order.status) }]}
            textStyle={styles.statusText}
          >
            {getStatusLabel(order.status)}
          </Chip>
        </View>

        <Text style={styles.packTitle} numberOfLines={2}>
          {order.food_pack?.title || 'Food Pack'}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>📍 Location</Text>
          <Text style={styles.value}>{order.food_pack?.restaurant?.area}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>🕐 Pickup</Text>
          <Text style={styles.value}>
            {order.food_pack?.pickup_start_time} - {order.food_pack?.pickup_end_time}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>📅 Date</Text>
          <Text style={styles.value}>
            {order.food_pack?.available_date
              ? new Date(order.food_pack.available_date).toLocaleDateString('en-NG')
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.codeSection}>
          <Text style={styles.codeLabel}>Pickup Code</Text>
          <Text style={styles.code}>{order.pickup_code}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.totalLabel}>Total Paid</Text>
          <Text style={styles.totalPrice}>{formatNaira(order.total_price)}</Text>
        </View>

        <Text style={styles.orderDate}>
          Ordered on {new Date(order.created_at).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </Card.Content>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>📦</Text>
      <Text style={styles.emptyText}>No orders yet</Text>
      <Text style={styles.emptySubText}>
        Start saving food and money by grabbing a surprise pack!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>My Orders</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderCard}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#E53935']} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  titleContainer: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  statusChip: {
    height: 28,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  packTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  codeSection: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  codeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  code: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    letterSpacing: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E53935',
  },
  orderDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
