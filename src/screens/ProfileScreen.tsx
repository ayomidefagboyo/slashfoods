import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Card, Button, Divider, Avatar } from 'react-native-paper';
import { authService } from '../services/auth';
import { supabase } from '../config/supabase';

interface UserProfile {
  full_name: string;
  email: string;
  phone: string;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { user } = await authService.getCurrentUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfile(data);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            await authService.signOut();
            setLoading(false);
            // Navigation will be handled automatically by auth state change
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.avatarContainer}>
              <Avatar.Text
                size={80}
                label={profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                style={styles.avatar}
              />
            </View>

            <Text style={styles.name}>{profile?.full_name || 'User'}</Text>
            <Text style={styles.email}>{profile?.email || ''}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Account Information</Text>
            <Divider style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.label}>📧 Email</Text>
              <Text style={styles.value} numberOfLines={1}>
                {profile?.email || 'N/A'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>📱 Phone</Text>
              <Text style={styles.value}>{profile?.phone || 'N/A'}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>About Slash Foods</Text>
            <Divider style={styles.divider} />

            <Text style={styles.aboutText}>
              Slash Foods helps you save money and reduce food waste by connecting you with
              restaurants offering surprise packs of delicious leftover food at amazing prices.
            </Text>

            <Text style={styles.aboutText}>
              🌍 Save the planet{'\n'}
              💰 Save money{'\n'}
              🍽️ Enjoy quality food
            </Text>

            <Text style={styles.version}>Version 1.0.0</Text>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleLogout}
          loading={loading}
          disabled={loading}
          style={styles.logoutButton}
          buttonColor="#E53935"
        >
          Logout
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
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
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#E53935',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  version: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  logoutButton: {
    paddingVertical: 6,
    marginTop: 8,
  },
});
