import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function Programs() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionBadge}>📚 Our Programs</Text>
        <Text style={styles.sectionTitle}>
          Tailored Learning for{'\n'}
          <Text style={styles.highlight}>Every Age Group</Text>
        </Text>
        <Text style={styles.sectionSubtitle}>
          Two comprehensive programs designed to introduce Nigerian children to cutting-edge technology through hands-on making
        </Text>
      </View>

      <View style={styles.programsGrid}>
        {/* Primary Level Program */}
        <View style={[styles.programCard, styles.primaryCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🎨</Text>
            <View style={styles.ageBadge}>
              <Text style={styles.ageBadgeText}>Ages 9-12</Text>
            </View>
          </View>

          <Text style={styles.cardTitle}>Young Makers Lab</Text>
          <Text style={styles.cardSubtitle}>Primary Level Program</Text>

          <Text style={styles.cardDescription}>
            Build first, learn while making! Every session = something tangible to take home from Day 1.
          </Text>

          <View style={styles.topicsList}>
            <View style={styles.topicItem}>
              <Text style={styles.topicIcon}>⚡</Text>
              <View style={styles.topicContent}>
                <Text style={styles.topicTitle}>Electricity & Circuits</Text>
                <Text style={styles.topicDescription}>Light-up badges, buzzers, LED art</Text>
              </View>
            </View>

            <View style={styles.topicItem}>
              <Text style={styles.topicIcon}>🎨</Text>
              <View style={styles.topicContent}>
                <Text style={styles.topicTitle}>3D Design</Text>
                <Text style={styles.topicDescription}>Tinkercad, keychains, pencil holders</Text>
              </View>
            </View>

            <View style={styles.topicItem}>
              <Text style={styles.topicIcon}>🎤</Text>
              <View style={styles.topicContent}>
                <Text style={styles.topicTitle}>Voice Coding</Text>
                <Text style={styles.topicDescription}>Build games by talking!</Text>
              </View>
            </View>

            <View style={styles.topicItem}>
              <Text style={styles.topicIcon}>📱</Text>
              <View style={styles.topicContent}>
                <Text style={styles.topicTitle}>Mobile Apps</Text>
                <Text style={styles.topicDescription}>Create real apps for phones</Text>
              </View>
            </View>

            <View style={styles.topicItem}>
              <Text style={styles.topicIcon}>⚙️</Text>
              <View style={styles.topicContent}>
                <Text style={styles.topicTitle}>Simple Machines</Text>
                <Text style={styles.topicDescription}>Catapults, gears, pulleys</Text>
              </View>
            </View>
          </View>

          <View style={styles.priceSection}>
            <View style={styles.priceTier}>
              <Text style={styles.priceLabel}>High-End Private</Text>
              <Text style={styles.priceAmount}>₦90,000</Text>
              <Text style={styles.pricePeriod}>12 weeks</Text>
            </View>
            <View style={styles.priceTier}>
              <Text style={styles.priceLabel}>Mid-Range</Text>
              <Text style={styles.priceAmount}>₦60,000</Text>
              <Text style={styles.pricePeriod}>12 weeks</Text>
            </View>
          </View>
        </View>

        {/* JSS Level Program */}
        <View style={[styles.programCard, styles.jssCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🚀</Text>
            <View style={[styles.ageBadge, styles.ageBadgeJSS]}>
              <Text style={styles.ageBadgeText}>Ages 12-15</Text>
            </View>
          </View>

          <Text style={styles.cardTitle}>Future Engineers Lab</Text>
          <Text style={styles.cardSubtitle}>JSS Level Program</Text>

          <Text style={styles.cardDescription}>
            Advanced hands-on engineering with Arduino, AI-powered coding, IoT, and professional mobile app development.
          </Text>

          <View style={styles.topicsList}>
            <View style={styles.topicItem}>
              <Text style={styles.topicIcon}>🤖</Text>
              <View style={styles.topicContent}>
                <Text style={styles.topicTitle}>Arduino & Robotics</Text>
                <Text style={styles.topicDescription}>Sensors, servos, robots</Text>
              </View>
            </View>

            <View style={styles.topicItem}>
              <Text style={styles.topicIcon}>🎨</Text>
              <View style={styles.topicContent}>
                <Text style={styles.topicTitle}>3D Engineering Design</Text>
                <Text style={styles.topicDescription}>Precision CAD, printable projects</Text>
              </View>
            </View>

            <View style={styles.topicItem}>
              <Text style={styles.topicIcon}>🎙️</Text>
              <View style={styles.topicContent}>
                <Text style={styles.topicTitle}>AI & Voice Coding</Text>
                <Text style={styles.topicDescription}>GitHub Copilot, voice programming</Text>
              </View>
            </View>

            <View style={styles.topicItem}>
              <Text style={styles.topicIcon}>📱</Text>
              <View style={styles.topicContent}>
                <Text style={styles.topicTitle}>Advanced App Dev</Text>
                <Text style={styles.topicDescription}>AI-powered apps, Firebase</Text>
              </View>
            </View>

            <View style={styles.topicItem}>
              <Text style={styles.topicIcon}>🌐</Text>
              <View style={styles.topicContent}>
                <Text style={styles.topicTitle}>IoT & Smart Devices</Text>
                <Text style={styles.topicDescription}>WiFi modules, remote control</Text>
              </View>
            </View>
          </View>

          <View style={styles.priceSection}>
            <View style={styles.priceTier}>
              <Text style={styles.priceLabel}>High-End Private</Text>
              <Text style={styles.priceAmount}>₦120,000</Text>
              <Text style={styles.pricePeriod}>12 weeks</Text>
            </View>
            <View style={styles.priceTier}>
              <Text style={styles.priceLabel}>Mid-Range</Text>
              <Text style={styles.priceAmount}>₦80,000</Text>
              <Text style={styles.pricePeriod}>12 weeks</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Day 1 Promise */}
      <View style={styles.promiseSection}>
        <Text style={styles.promiseTitle}>✨ Our Day 1 Promise</Text>
        <Text style={styles.promiseText}>
          "Every student makes something that lights up, moves, or works on the very first day!"
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: width > 768 ? 60 : 20,
    paddingTop: 80,
    paddingBottom: 80,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 50,
    alignItems: 'center',
  },
  sectionBadge: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9B59B6',
    backgroundColor: '#F3E5F5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: width > 768 ? 42 : 32,
    fontWeight: '900',
    color: '#2C3E50',
    textAlign: 'center',
    lineHeight: width > 768 ? 52 : 40,
    marginBottom: 15,
  },
  highlight: {
    color: '#FF6B35',
  },
  sectionSubtitle: {
    fontSize: 18,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 700,
  },
  programsGrid: {
    flexDirection: width > 1024 ? 'row' : 'column',
    gap: 30,
    marginBottom: 60,
  },
  programCard: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    borderRadius: 20,
    padding: 30,
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  primaryCard: {
    borderColor: '#FFD23F',
    backgroundColor: '#FFFEF7',
  },
  jssCard: {
    borderColor: '#4ECDC4',
    backgroundColor: '#F0FDFC',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardIcon: {
    fontSize: 48,
  },
  ageBadge: {
    backgroundColor: '#FFD23F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ageBadgeJSS: {
    backgroundColor: '#4ECDC4',
  },
  ageBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C3E50',
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
    marginBottom: 15,
  },
  cardDescription: {
    fontSize: 16,
    color: '#7F8C8D',
    lineHeight: 24,
    marginBottom: 30,
  },
  topicsList: {
    marginBottom: 30,
  },
  topicItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  topicIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  topicContent: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 3,
  },
  topicDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  priceSection: {
    borderTopWidth: 2,
    borderTopColor: '#E0E0E0',
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  priceTier: {
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7F8C8D',
    marginBottom: 5,
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FF6B35',
    marginBottom: 2,
  },
  pricePeriod: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  promiseSection: {
    backgroundColor: '#E8F9F7',
    padding: 30,
    borderRadius: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#4ECDC4',
  },
  promiseTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center',
  },
  promiseText: {
    fontSize: 18,
    color: '#2C3E50',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 28,
  },
});
