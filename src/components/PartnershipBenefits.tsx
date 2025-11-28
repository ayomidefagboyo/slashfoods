import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function PartnershipBenefits() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionBadge}>🤝 For Schools</Text>
        <Text style={styles.sectionTitle}>
          Partner with{' '}
          <Text style={styles.highlight}>Tronic Lab</Text>
        </Text>
        <Text style={styles.sectionSubtitle}>
          Become a STEM leader in Nigeria with zero preparation required from your staff
        </Text>
      </View>

      {/* Main Benefits Grid */}
      <View style={styles.benefitsGrid}>
        <View style={[styles.benefitCard, styles.benefitCardPrimary]}>
          <Text style={styles.benefitIcon}>✅</Text>
          <Text style={styles.benefitTitle}>Zero Prep Required</Text>
          <Text style={styles.benefitDescription}>
            We bring ALL equipment, materials, and expert instructors. Your teachers can relax!
          </Text>
        </View>

        <View style={[styles.benefitCard, styles.benefitCardSecondary]}>
          <Text style={styles.benefitIcon}>📚</Text>
          <Text style={styles.benefitTitle}>Curriculum-Aligned</Text>
          <Text style={styles.benefitDescription}>
            Aligned with Nigeria's 2025 STEM curriculum requirements. We handle compliance.
          </Text>
        </View>

        <View style={[styles.benefitCard, styles.benefitCardTertiary]}>
          <Text style={styles.benefitIcon}>💰</Text>
          <Text style={styles.benefitTitle}>Revenue Sharing</Text>
          <Text style={styles.benefitDescription}>
            Earn 15-25% revenue share. With 25 students, schools can earn ₦130k-₦750k per term!
          </Text>
        </View>

        <View style={[styles.benefitCard, styles.benefitCardAccent]}>
          <Text style={styles.benefitIcon}>🏆</Text>
          <Text style={styles.benefitTitle}>STEM Leader Status</Text>
          <Text style={styles.benefitDescription}>
            Boost your school's reputation as a technology and innovation leader in Nigeria.
          </Text>
        </View>

        <View style={[styles.benefitCard, styles.benefitCardSuccess]}>
          <Text style={styles.benefitIcon}>📸</Text>
          <Text style={styles.benefitTitle}>Marketing Content</Text>
          <Text style={styles.benefitDescription}>
            Weekly WhatsApp updates with photos and videos. Perfect for your social media!
          </Text>
        </View>

        <View style={[styles.benefitCard, styles.benefitCardInfo]}>
          <Text style={styles.benefitIcon}>🎓</Text>
          <Text style={styles.benefitTitle}>Showcase Events</Text>
          <Text style={styles.benefitDescription}>
            Parents attend final Maker Showcase to see their children's projects. Huge PR win!
          </Text>
        </View>
      </View>

      {/* How It Works */}
      <View style={styles.howItWorksSection}>
        <Text style={styles.howItWorksTitle}>How Partnership Works</Text>

        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Schedule Demo</Text>
              <Text style={styles.stepDescription}>
                We demo a live session for your students. See their excitement firsthand!
              </Text>
            </View>
          </View>

          <View style={styles.stepArrow}>
            <Text style={styles.arrow}>↓</Text>
          </View>

          <View style={styles.step}>
            <View style={[styles.stepNumber, styles.stepNumber2]}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Sign Agreement</Text>
              <Text style={styles.stepDescription}>
                Simple partnership agreement. Choose your tier and set schedule (2x/week, 1 hour).
              </Text>
            </View>
          </View>

          <View style={styles.stepArrow}>
            <Text style={styles.arrow}>↓</Text>
          </View>

          <View style={styles.step}>
            <View style={[styles.stepNumber, styles.stepNumber3]}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>We Handle Everything</Text>
              <Text style={styles.stepDescription}>
                Parent enrollment, equipment delivery, expert instruction, weekly updates, final showcase.
              </Text>
            </View>
          </View>

          <View style={styles.stepArrow}>
            <Text style={styles.arrow}>↓</Text>
          </View>

          <View style={styles.step}>
            <View style={[styles.stepNumber, styles.stepNumber4]}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>You Earn & Grow</Text>
              <Text style={styles.stepDescription}>
                Collect revenue share, enjoy enhanced reputation, renew next term!
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Pricing Tiers */}
      <View style={styles.pricingSection}>
        <Text style={styles.pricingTitle}>Partnership Tiers</Text>
        <Text style={styles.pricingSubtitle}>
          Choose the tier that matches your school's demographic
        </Text>

        <View style={styles.pricingGrid}>
          <View style={styles.pricingCard}>
            <Text style={styles.tierBadge}>🌟</Text>
            <Text style={styles.tierName}>High-End Private</Text>
            <Text style={styles.tierPrice}>₦90k-₦120k</Text>
            <Text style={styles.tierPeriod}>per student (12 weeks)</Text>
            <View style={styles.tierDivider} />
            <Text style={styles.tierIncluded}>✓ All materials + AI API</Text>
            <Text style={styles.tierIncluded}>✓ App publishing for top projects</Text>
            <Text style={styles.tierIncluded}>✓ Tablets provided</Text>
            <Text style={styles.tierRevenue}>School earns: ₦22.5k-₦30k/student</Text>
          </View>

          <View style={[styles.pricingCard, styles.pricingCardPopular]}>
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
            </View>
            <Text style={styles.tierBadge}>💎</Text>
            <Text style={styles.tierName}>Mid-Range Private</Text>
            <Text style={styles.tierPrice}>₦60k-₦80k</Text>
            <Text style={styles.tierPeriod}>per student (12 weeks)</Text>
            <View style={styles.tierDivider} />
            <Text style={styles.tierIncluded}>✓ All materials + Shared AI</Text>
            <Text style={styles.tierIncluded}>✓ BYOD (phone/tablet)</Text>
            <Text style={styles.tierIncluded}>✓ Professional certificates</Text>
            <Text style={styles.tierRevenue}>School earns: ₦12k-₦16k/student</Text>
          </View>

          <View style={styles.pricingCard}>
            <Text style={styles.tierBadge}>🎯</Text>
            <Text style={styles.tierName}>Budget Private</Text>
            <Text style={styles.tierPrice}>₦35k-₦50k</Text>
            <Text style={styles.tierPeriod}>per student (12 weeks)</Text>
            <View style={styles.tierDivider} />
            <Text style={styles.tierIncluded}>✓ Core materials</Text>
            <Text style={styles.tierIncluded}>✓ Free AI tier (limited)</Text>
            <Text style={styles.tierIncluded}>✓ BYOD required</Text>
            <Text style={styles.tierRevenue}>School earns: ₦5.25k-₦7.5k/student</Text>
          </View>
        </View>

        <View style={styles.exampleBox}>
          <Text style={styles.exampleTitle}>💡 Example: Mid-Tier School with 25 Students</Text>
          <Text style={styles.exampleText}>
            Total revenue: ₦1.5M{'\n'}
            School's share (20%): <Text style={styles.exampleHighlight}>₦300,000</Text>{'\n'}
            Tronic Lab: ₦1.2M (covers all costs + profit)
          </Text>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to Transform Your School?</Text>
        <Text style={styles.ctaDescription}>
          Schedule a free demo session and see your students' eyes light up!
        </Text>
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Schedule Free Demo</Text>
        </TouchableOpacity>
        <Text style={styles.ctaFootnote}>
          No commitment required • Quick 30-minute demo
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
    color: '#2ECC71',
    backgroundColor: '#E8F8F0',
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
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 60,
    justifyContent: 'center',
  },
  benefitCard: {
    width: width > 1024 ? '30%' : width > 768 ? '45%' : '100%',
    minWidth: 280,
    padding: 25,
    borderRadius: 15,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 3,
  },
  benefitCardPrimary: {
    backgroundColor: '#FFE8E0',
    borderColor: '#FF6B35',
  },
  benefitCardSecondary: {
    backgroundColor: '#E8F9F7',
    borderColor: '#4ECDC4',
  },
  benefitCardTertiary: {
    backgroundColor: '#FFF9E6',
    borderColor: '#FFD23F',
  },
  benefitCardAccent: {
    backgroundColor: '#F3E5F5',
    borderColor: '#9B59B6',
  },
  benefitCardSuccess: {
    backgroundColor: '#E8F8F0',
    borderColor: '#2ECC71',
  },
  benefitCardInfo: {
    backgroundColor: '#FCE4EC',
    borderColor: '#E91E63',
  },
  benefitIcon: {
    fontSize: 40,
    marginBottom: 15,
  },
  benefitTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 10,
  },
  benefitDescription: {
    fontSize: 15,
    color: '#7F8C8D',
    lineHeight: 22,
  },
  howItWorksSection: {
    backgroundColor: '#F7F9FC',
    padding: 40,
    borderRadius: 20,
    marginBottom: 60,
  },
  howItWorksTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 40,
  },
  stepsContainer: {
    alignItems: 'center',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 15,
    width: '100%',
    maxWidth: 600,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  stepNumber: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  stepNumber2: {
    backgroundColor: '#4ECDC4',
  },
  stepNumber3: {
    backgroundColor: '#9B59B6',
  },
  stepNumber4: {
    backgroundColor: '#2ECC71',
  },
  stepNumberText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  stepArrow: {
    paddingVertical: 15,
  },
  arrow: {
    fontSize: 32,
    color: '#4ECDC4',
  },
  pricingSection: {
    marginBottom: 60,
  },
  pricingTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  pricingSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 40,
  },
  pricingGrid: {
    flexDirection: width > 1024 ? 'row' : 'column',
    gap: 25,
    marginBottom: 40,
  },
  pricingCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 3,
    position: 'relative',
  },
  pricingCardPopular: {
    borderColor: '#4ECDC4',
    borderWidth: 3,
    backgroundColor: '#E8F9F7',
  },
  popularBadge: {
    position: 'absolute',
    top: -15,
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  popularBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  tierBadge: {
    fontSize: 48,
    marginBottom: 15,
  },
  tierName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center',
  },
  tierPrice: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FF6B35',
    marginBottom: 5,
  },
  tierPeriod: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 20,
  },
  tierDivider: {
    width: '100%',
    height: 2,
    backgroundColor: '#E0E0E0',
    marginBottom: 20,
  },
  tierIncluded: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  tierRevenue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2ECC71',
    marginTop: 15,
    textAlign: 'center',
  },
  exampleBox: {
    backgroundColor: '#E8F9F7',
    padding: 25,
    borderRadius: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#4ECDC4',
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 10,
  },
  exampleText: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 26,
  },
  exampleHighlight: {
    fontWeight: '800',
    color: '#2ECC71',
    fontSize: 18,
  },
  ctaSection: {
    backgroundColor: 'linear-gradient(135deg, #FF6B35 0%, #E91E63 100%)',
    backgroundColor: '#FF6B35',
    padding: 50,
    borderRadius: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  ctaDescription: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.95,
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 15,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF6B35',
  },
  ctaFootnote: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});
