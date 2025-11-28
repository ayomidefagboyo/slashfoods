import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Linking } from 'react-native';
import { Text, Button } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function Hero() {
  const handleRegister = () => {
    // Scroll to contact section or open registration form
    console.log('Register clicked');
  };

  const handleLearnMore = () => {
    // Scroll to programs section
    console.log('Learn more clicked');
  };

  return (
    <View style={styles.container}>
      {/* Navigation */}
      <View style={styles.nav}>
        <Text style={styles.logo}>✨ Tronic Lab</Text>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navText}>Programs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navText}>Contact</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Content */}
      <View style={styles.heroContent}>
        <View style={styles.textContainer}>
          <Text style={styles.badge}>🚀 Real STEM for Nigerian Schools</Text>

          <Text style={styles.headline}>
            Building the{'\n'}
            <Text style={styles.highlightOrange}>Next Generation</Text>
            {'\n'}of{' '}
            <Text style={styles.highlightTeal}>Tech Innovators</Text>
          </Text>

          <Text style={styles.subheadline}>
            We partner with schools to teach children robotics, AI, coding, 3D printing, and app development through hands-on, interactive sessions during school hours.
          </Text>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>100+</Text>
              <Text style={styles.statLabel}>Students Trained</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12 Weeks</Text>
              <Text style={styles.statLabel}>Program Duration</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2x/Week</Text>
              <Text style={styles.statLabel}>Interactive Sessions</Text>
            </View>
          </View>

          <View style={styles.ctaButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
              <Text style={styles.primaryButtonText}>Partner With Us</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleLearnMore}>
              <Text style={styles.secondaryButtonText}>Learn More →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.features}>
            <View style={styles.featureTag}>
              <Text style={styles.featureIcon}>🤖</Text>
              <Text style={styles.featureText}>Robotics</Text>
            </View>
            <View style={styles.featureTag}>
              <Text style={styles.featureIcon}>💻</Text>
              <Text style={styles.featureText}>Voice Coding</Text>
            </View>
            <View style={styles.featureTag}>
              <Text style={styles.featureIcon}>📱</Text>
              <Text style={styles.featureText}>App Development</Text>
            </View>
            <View style={styles.featureTag}>
              <Text style={styles.featureIcon}>🎨</Text>
              <Text style={styles.featureText}>3D Printing</Text>
            </View>
          </View>
        </View>

        {/* Decorative Elements - Character-inspired */}
        <View style={styles.decorativeElements}>
          <View style={[styles.floatingShape, styles.shape1]}>
            <Text style={styles.shapeEmoji}>🎁</Text>
          </View>
          <View style={[styles.floatingShape, styles.shape2]}>
            <Text style={styles.shapeEmoji}>🤖</Text>
          </View>
          <View style={[styles.floatingShape, styles.shape3]}>
            <Text style={styles.shapeEmoji}>💡</Text>
          </View>
          <View style={[styles.floatingShape, styles.shape4]}>
            <Text style={styles.shapeEmoji}>⚡</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F9FC',
    paddingTop: 20,
    paddingBottom: 80,
    minHeight: 700,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width > 768 ? 60 : 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  logo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FF6B35',
    marginRight: 'auto',
  },
  navButton: {
    marginLeft: 30,
  },
  navText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  heroContent: {
    paddingHorizontal: width > 768 ? 60 : 20,
    paddingTop: 60,
    position: 'relative',
  },
  textContainer: {
    maxWidth: 800,
    zIndex: 10,
  },
  badge: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4ECDC4',
    backgroundColor: '#E8F9F7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  headline: {
    fontSize: width > 768 ? 56 : 42,
    fontWeight: '900',
    color: '#2C3E50',
    lineHeight: width > 768 ? 68 : 52,
    marginBottom: 20,
  },
  highlightOrange: {
    color: '#FF6B35',
  },
  highlightTeal: {
    color: '#4ECDC4',
  },
  subheadline: {
    fontSize: 18,
    color: '#7F8C8D',
    lineHeight: 28,
    marginBottom: 40,
    maxWidth: 600,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 40,
    gap: 30,
  },
  statItem: {
    marginRight: 20,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FF6B35',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  ctaButtons: {
    flexDirection: width > 768 ? 'row' : 'column',
    gap: 15,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  secondaryButtonText: {
    color: '#4ECDC4',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E8F9F7',
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width > 768 ? 400 : 200,
    height: 600,
    zIndex: 1,
  },
  floatingShape: {
    position: 'absolute',
    borderRadius: 50,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  shape1: {
    backgroundColor: '#FFD23F',
    top: 50,
    right: 50,
    width: 80,
    height: 80,
  },
  shape2: {
    backgroundColor: '#E91E63',
    top: 180,
    right: 150,
    width: 100,
    height: 100,
  },
  shape3: {
    backgroundColor: '#4ECDC4',
    top: 320,
    right: 80,
    width: 70,
    height: 70,
  },
  shape4: {
    backgroundColor: '#9B59B6',
    top: 450,
    right: 180,
    width: 90,
    height: 90,
  },
  shapeEmoji: {
    fontSize: 40,
    textAlign: 'center',
  },
});
