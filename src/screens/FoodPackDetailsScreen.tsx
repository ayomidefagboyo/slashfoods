import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Button, Divider } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, FoodPack } from '../types';
import { foodPacksService } from '../services/foodPacks';
import { authService } from '../services/auth';
import { formatNaira, calculateDiscount } from '../utils/currency';

type Props = NativeStackScreenProps<RootStackParamList, 'FoodPackDetails'>;

export default function FoodPackDetailsScreen({ route, navigation }: Props) {
  const { packId } = route.params;
  const [pack, setPack] = useState<FoodPack | null>(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    fetchPackDetails();
  }, [packId]);

  const fetchPackDetails = async () => {
    const { data } = await foodPacksService.getFoodPackById(packId);
    if (data) {
      setPack(data);
    }
    setLoading(false);
  };

  const handleReserve = async () => {
    if (!pack) return;

    const { user } = await authService.getCurrentUser();
    if (!user) {
      Alert.alert('Error', 'Please login to reserve a pack');
      return;
    }

    Alert.alert(
      'Confirm Reservation',
      `Reserve this surprise pack for ${formatNaira(pack.discounted_price)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setReserving(true);
            const { data, error } = await foodPacksService.createOrder(
              user.id,
              pack.id,
              1,
              pack.discounted_price
            );
            setReserving(false);

            if (error) {
              Alert.alert('Error', 'Failed to reserve pack. Please try again.');
              return;
            }

            Alert.alert(
              'Success! 🎉',
              `Your pack is reserved!\n\nPickup Code: ${data?.pickup_code}\n\nShow this code when picking up your order.`,
              [
                {
                  text: 'View Orders',
                  onPress: () => navigation.navigate('MainTabs'),
                },
              ]
            );
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  if (!pack) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Pack not found</Text>
      </View>
    );
  }

  const discount = calculateDiscount(pack.original_price, pack.discounted_price);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          {pack.image_url ? (
            <Image source={{ uri: pack.image_url }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>🍲</Text>
            </View>
          )}
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>Save {discount}%</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{pack.title}</Text>
          <Text style={styles.restaurantName}>{pack.restaurant?.name}</Text>

          <View style={styles.priceSection}>
            <View>
              <Text style={styles.label}>Was</Text>
              <Text style={styles.originalPrice}>{formatNaira(pack.original_price)}</Text>
            </View>
            <View>
              <Text style={styles.label}>Now</Text>
              <Text style={styles.discountedPrice}>{formatNaira(pack.discounted_price)}</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📍 Location</Text>
              <Text style={styles.infoValue}>{pack.restaurant?.area}</Text>
            </View>
            <Text style={styles.address}>{pack.restaurant?.address}</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🕐 Pickup Time</Text>
              <Text style={styles.infoValue}>
                {pack.pickup_start_time} - {pack.pickup_end_time}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📦 Available</Text>
              <Text style={styles.infoValue}>{pack.available_quantity} packs</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📅 Date</Text>
              <Text style={styles.infoValue}>
                {new Date(pack.available_date).toLocaleDateString('en-NG')}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About this pack</Text>
            <Text style={styles.description}>{pack.description}</Text>
          </View>

          <View style={styles.noteSection}>
            <Text style={styles.noteTitle}>⚠️ Important Notes</Text>
            <Text style={styles.noteText}>
              • You won't know exactly what's in your surprise pack{'\n'}
              • All sales are final - no refunds{'\n'}
              • Must pick up during specified time window{'\n'}
              • Show your pickup code at the restaurant
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerPriceContainer}>
          <Text style={styles.footerLabel}>Total</Text>
          <Text style={styles.footerPrice}>{formatNaira(pack.discounted_price)}</Text>
        </View>
        <Button
          mode="contained"
          onPress={handleReserve}
          loading={reserving}
          disabled={reserving || pack.available_quantity === 0}
          style={styles.reserveButton}
          buttonColor="#E53935"
        >
          {pack.available_quantity === 0 ? 'Sold Out' : 'Reserve Now'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  imageContainer: {
    position: 'relative',
    height: 250,
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
    fontSize: 80,
  },
  discountBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#E53935',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  priceSection: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E53935',
  },
  divider: {
    marginVertical: 20,
  },
  infoSection: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  address: {
    fontSize: 14,
    color: '#999',
    marginTop: -8,
    marginLeft: 24,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  noteSection: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 100,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F57C00',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  footerLabel: {
    fontSize: 16,
    color: '#666',
  },
  footerPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E53935',
  },
  reserveButton: {
    paddingVertical: 6,
  },
});
