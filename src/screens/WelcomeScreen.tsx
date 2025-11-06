import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>🍲</Text>
        <Text style={styles.title}>Slash Foods</Text>
        <Text style={styles.subtitle}>Save Food. Save Money.</Text>
        <Text style={styles.description}>
          Discover delicious surprise packs from your favorite restaurants at amazing prices.
          {'\n\n'}
          Pick up between 7-9PM and enjoy quality food while reducing waste!
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('SignUp')}
          style={styles.button}
          buttonColor="#E53935"
        >
          Get Started
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Login')}
          style={styles.button}
          textColor="#E53935"
        >
          I have an account
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 6,
  },
});
