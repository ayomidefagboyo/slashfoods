import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card } from 'react-native-paper';
import { FoodPack } from '../types';
import { formatNaira, calculateDiscount } from '../utils/currency';

interface FoodPackCardProps {
  pack: FoodPack;
  onPress: () => void;
}

export default function FoodPackCard({ pack, onPress }: FoodPackCardProps) {
  const discount = calculateDiscount(pack.original_price, pack.discounted_price);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.imageContainer}>
          {pack.image_url ? (
            <Image source={{ uri: pack.image_url }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>🍲</Text>
            </View>
          )}
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        </View>

        <Card.Content style={styles.content}>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {pack.restaurant?.name || 'Restaurant'}
          </Text>
          <Text style={styles.title} numberOfLines={2}>
            {pack.title}
          </Text>

          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>
              📍 {pack.restaurant?.area || 'Lagos'}
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <View>
              <Text style={styles.originalPrice}>
                {formatNaira(pack.original_price)}
              </Text>
              <Text style={styles.discountedPrice}>
                {formatNaira(pack.discounted_price)}
              </Text>
            </View>
            <View style={styles.quantityBadge}>
              <Text style={styles.quantityText}>
                {pack.available_quantity} left
              </Text>
            </View>
          </View>

          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              🕐 Pick up: {pack.pickup_start_time} - {pack.pickup_end_time}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 3,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
    height: 160,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  placeholderText: {
    fontSize: 48,
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#E53935',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    paddingTop: 12,
  },
  restaurantName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  locationContainer: {
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E53935',
  },
  quantityBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quantityText: {
    fontSize: 12,
    color: '#F57C00',
    fontWeight: '600',
  },
  timeContainer: {
    marginTop: 4,
  },
  timeText: {
    fontSize: 13,
    color: '#666',
  },
});
