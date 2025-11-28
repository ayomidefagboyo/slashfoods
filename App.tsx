import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import Hero from './src/components/Hero';
import Programs from './src/components/Programs';
import CurriculumHighlights from './src/components/CurriculumHighlights';
import PartnershipBenefits from './src/components/PartnershipBenefits';
import Contact from './src/components/Contact';
import Footer from './src/components/Footer';

const theme = {
  colors: {
    primary: '#FF6B35', // Vibrant orange
    secondary: '#4ECDC4', // Teal
    accent: '#FFD23F', // Yellow
    purple: '#9B59B6', // Purple
    green: '#2ECC71', // Green
    pink: '#E91E63', // Pink
    background: '#FFFFFF',
    surface: '#F7F9FC',
    text: '#2C3E50',
    textLight: '#7F8C8D',
  },
};

export default function App() {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Hero />
          <Programs />
          <CurriculumHighlights />
          <PartnershipBenefits />
          <Contact />
          <Footer />
        </ScrollView>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
});
