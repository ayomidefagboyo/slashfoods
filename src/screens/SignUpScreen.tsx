import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { authService } from '../services/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export default function SignUpScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { data, error } = await authService.signUp(
      email.trim(),
      password,
      fullName.trim(),
      phone.trim()
    );
    setLoading(false);

    if (error) {
      Alert.alert('Sign Up Failed', 'Unable to create account. Please try again.');
      return;
    }

    Alert.alert(
      'Success!',
      'Your account has been created successfully.',
      [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>🍲</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join SlashFoods today!</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            mode="outlined"
            style={styles.input}
            outlineColor="#E0E0E0"
            activeOutlineColor="#E53935"
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            outlineColor="#E0E0E0"
            activeOutlineColor="#E53935"
          />

          <TextInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            keyboardType="phone-pad"
            placeholder="e.g., 08012345678"
            style={styles.input}
            outlineColor="#E0E0E0"
            activeOutlineColor="#E53935"
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={styles.input}
            outlineColor="#E0E0E0"
            activeOutlineColor="#E53935"
          />

          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={styles.input}
            outlineColor="#E0E0E0"
            activeOutlineColor="#E53935"
          />

          <Button
            mode="contained"
            onPress={handleSignUp}
            loading={loading}
            disabled={loading}
            style={styles.button}
            buttonColor="#E53935"
          >
            Sign Up
          </Button>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('Login')}
            >
              Login
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    paddingVertical: 6,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  link: {
    fontSize: 14,
    color: '#E53935',
    fontWeight: 'bold',
  },
});
