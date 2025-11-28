import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function CurriculumHighlights() {
  const highlights = [
    {
      icon: '🎯',
      title: 'Hands-On from Day 1',
      description: 'No boring lectures! Students build working projects in the very first session. Light-up circuits, moving robots, and real apps they can show off immediately.',
      color: '#FF6B35',
      bgColor: '#FFE8E0',
    },
    {
      icon: '🎤',
      title: 'AI-Powered Learning',
      description: 'Students learn voice coding and AI-assisted programming — the future of software development. Build apps by talking and code with GitHub Copilot!',
      color: '#9B59B6',
      bgColor: '#F3E5F5',
    },
    {
      icon: '📱',
      title: 'Real-World Projects',
      description: 'Create actual mobile apps that work on phones, 3D designs ready for printing, and Arduino systems that solve real problems. Portfolio-ready work!',
      color: '#4ECDC4',
      bgColor: '#E8F9F7',
    },
    {
      icon: '🤖',
      title: 'Robotics & Hardware',
      description: 'Build robots, design circuits, program Arduino, and create IoT devices. Physical computing brings code to life with motors, sensors, and lights.',
      color: '#2ECC71',
      bgColor: '#E8F8F0',
    },
    {
      icon: '🎨',
      title: '3D Design & Printing',
      description: 'Learn Tinkercad and create 3D models. Top projects get 3D printed! Students design keychains, phone stands, and functional prototypes.',
      color: '#E91E63',
      bgColor: '#FCE4EC',
    },
    {
      icon: '📊',
      title: 'Showcase & Certificates',
      description: 'Capstone Maker Showcase where students present to parents and guests. Everyone receives certificates and takes home 20+ completed projects!',
      color: '#FFD23F',
      bgColor: '#FFF9E6',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionBadge}>💡 Why Tronic Lab?</Text>
        <Text style={styles.sectionTitle}>
          <Text style={styles.highlight}>Curriculum</Text> That Works
        </Text>
        <Text style={styles.sectionSubtitle}>
          Every activity is designed for maximum engagement, immediate results, and lasting skills
        </Text>
      </View>

      <View style={styles.highlightsGrid}>
        {highlights.map((highlight, index) => (
          <View
            key={index}
            style={[
              styles.highlightCard,
              { backgroundColor: highlight.bgColor },
            ]}
          >
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: highlight.color },
              ]}
            >
              <Text style={styles.icon}>{highlight.icon}</Text>
            </View>

            <Text style={styles.highlightTitle}>{highlight.title}</Text>
            <Text style={styles.highlightDescription}>
              {highlight.description}
            </Text>
          </View>
        ))}
      </View>

      {/* What Students Build Section */}
      <View style={styles.buildSection}>
        <Text style={styles.buildTitle}>
          What Will Your Students Build?
        </Text>
        <View style={styles.buildGrid}>
          <View style={styles.buildItem}>
            <Text style={styles.buildIcon}>⚡</Text>
            <Text style={styles.buildText}>Light-up circuits & LED art</Text>
          </View>
          <View style={styles.buildItem}>
            <Text style={styles.buildIcon}>🤖</Text>
            <Text style={styles.buildText}>Vibrating art bots</Text>
          </View>
          <View style={styles.buildItem}>
            <Text style={styles.buildIcon}>🎮</Text>
            <Text style={styles.buildText}>Voice-controlled games</Text>
          </View>
          <View style={styles.buildItem}>
            <Text style={styles.buildIcon}>📱</Text>
            <Text style={styles.buildText}>Mobile apps on real phones</Text>
          </View>
          <View style={styles.buildItem}>
            <Text style={styles.buildIcon}>🎨</Text>
            <Text style={styles.buildText}>3D-printed designs</Text>
          </View>
          <View style={styles.buildItem}>
            <Text style={styles.buildIcon}>🚦</Text>
            <Text style={styles.buildText}>Arduino traffic lights</Text>
          </View>
          <View style={styles.buildItem}>
            <Text style={styles.buildIcon}>🌐</Text>
            <Text style={styles.buildText}>IoT smart devices</Text>
          </View>
          <View style={styles.buildItem}>
            <Text style={styles.buildIcon}>🎯</Text>
            <Text style={styles.buildText}>Rube Goldberg machines</Text>
          </View>
          <View style={styles.buildItem}>
            <Text style={styles.buildIcon}>📡</Text>
            <Text style={styles.buildText}>WiFi-controlled systems</Text>
          </View>
          <View style={styles.buildItem}>
            <Text style={styles.buildIcon}>⚙️</Text>
            <Text style={styles.buildText}>Catapults & gear systems</Text>
          </View>
          <View style={styles.buildItem}>
            <Text style={styles.buildIcon}>🤖</Text>
            <Text style={styles.buildText}>AI-powered chatbots</Text>
          </View>
          <View style={styles.buildItem}>
            <Text style={styles.buildIcon}>🎤</Text>
            <Text style={styles.buildText}>Voice-coded programs</Text>
          </View>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>20+</Text>
          <Text style={styles.statLabel}>Projects Per Student</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Weeks Duration</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Interactive Sessions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>100%</Text>
          <Text style={styles.statLabel}>Hands-On Learning</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: width > 768 ? 60 : 20,
    paddingTop: 80,
    paddingBottom: 80,
    backgroundColor: '#F7F9FC',
  },
  header: {
    marginBottom: 50,
    alignItems: 'center',
  },
  sectionBadge: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B35',
    backgroundColor: '#FFE8E0',
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
    color: '#4ECDC4',
  },
  sectionSubtitle: {
    fontSize: 18,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 700,
  },
  highlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 25,
    marginBottom: 60,
    justifyContent: 'center',
  },
  highlightCard: {
    width: width > 1024 ? '30%' : width > 768 ? '45%' : '100%',
    minWidth: 280,
    padding: 30,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 3,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 36,
  },
  highlightTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 12,
  },
  highlightDescription: {
    fontSize: 15,
    color: '#7F8C8D',
    lineHeight: 24,
  },
  buildSection: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    borderRadius: 20,
    marginBottom: 50,
    borderWidth: 3,
    borderColor: '#FFD23F',
  },
  buildTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 30,
  },
  buildGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'center',
  },
  buildItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  buildIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  buildText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  statsSection: {
    flexDirection: width > 768 ? 'row' : 'column',
    gap: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: '#4ECDC4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statNumber: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FF6B35',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
    textAlign: 'center',
  },
});
