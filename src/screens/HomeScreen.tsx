import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Searchbar, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { foodPacksService } from '../services/foodPacks';
import { FoodPack } from '../types';
import FoodPackCard from '../components/FoodPackCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [foodPacks, setFoodPacks] = useState<FoodPack[]>([]);
  const [filteredPacks, setFilteredPacks] = useState<FoodPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const areas = ['All', 'Lekki', 'VI', 'Ikeja', 'Yaba', 'Surulere'];

  const fetchFoodPacks = async () => {
    const { data, error } = await foodPacksService.getAvailablePacks();
    if (data) {
      setFoodPacks(data);
      setFilteredPacks(data);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchFoodPacks();
  }, []);

  useEffect(() => {
    let filtered = foodPacks;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (pack) =>
          pack.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pack.restaurant?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by area
    if (selectedArea && selectedArea !== 'All') {
      filtered = filtered.filter((pack) => pack.restaurant?.area === selectedArea);
    }

    setFilteredPacks(filtered);
  }, [searchQuery, selectedArea, foodPacks]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFoodPacks();
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.greeting}>Discover Amazing Deals 🎉</Text>
      <Text style={styles.subGreeting}>Grab your surprise pack today!</Text>

      <Searchbar
        placeholder="Search food packs or restaurants"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={areas}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Chip
            selected={selectedArea === item || (item === 'All' && !selectedArea)}
            onPress={() => setSelectedArea(item === 'All' ? null : item)}
            style={styles.chip}
            selectedColor="#E53935"
          >
            {item}
          </Chip>
        )}
        style={styles.chipContainer}
      />

      {filteredPacks.length > 0 && (
        <Text style={styles.resultCount}>
          {filteredPacks.length} pack{filteredPacks.length !== 1 ? 's' : ''} available
        </Text>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>🍽️</Text>
      <Text style={styles.emptyText}>No food packs available</Text>
      <Text style={styles.emptySubText}>
        Check back later for amazing deals!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredPacks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FoodPackCard
            pack={item}
            onPress={() => navigation.navigate('FoodPackDetails', { packId: item.id })}
          />
        )}
        ListHeaderComponent={renderHeader}
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
  listContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  searchBar: {
    marginBottom: 16,
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  chipContainer: {
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
  },
  resultCount: {
    fontSize: 14,
    color: '#666',
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
  },
});
