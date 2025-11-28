import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Linking } from 'react-native';
import { Text } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function Footer() {
  const handleSocialLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Brand Section */}
        <View style={styles.brandSection}>
          <Text style={styles.logo}>✨ Tronic Lab</Text>
          <Text style={styles.tagline}>
            Building the next generation of{'\n'}Nigerian tech innovators
          </Text>
          <View style={styles.socialLinks}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLink('https://instagram.com/troniclab')}
            >
              <Text style={styles.socialIcon}>📷</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLink('https://twitter.com/troniclab')}
            >
              <Text style={styles.socialIcon}>🐦</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLink('https://linkedin.com/company/troniclab')}
            >
              <Text style={styles.socialIcon}>💼</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLink('https://wa.me/234XXXXXXXXXX')}
            >
              <Text style={styles.socialIcon}>💬</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Links */}
        <View style={styles.linksSection}>
          <Text style={styles.sectionTitle}>Programs</Text>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Young Makers Lab (Ages 9-12)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Future Engineers Lab (Ages 12-15)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Curriculum Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Pricing & Tiers</Text>
          </TouchableOpacity>
        </View>

        {/* Resources */}
        <View style={styles.linksSection}>
          <Text style={styles.sectionTitle}>For Schools</Text>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Partnership Benefits</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Schedule Demo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>FAQ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Success Stories</Text>
          </TouchableOpacity>
        </View>

        {/* Contact */}
        <View style={styles.linksSection}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactText}>📧 hello@troniclab.ng</Text>
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactText}>📱 +234 XXX XXX XXXX</Text>
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactText}>📍 Lagos, Nigeria</Text>
          </View>
        </View>
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomContent}>
          <Text style={styles.copyright}>
            © 2025 Tronic Lab. All rights reserved.
          </Text>
          <View style={styles.bottomLinks}>
            <TouchableOpacity>
              <Text style={styles.bottomLinkText}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.separator}>•</Text>
            <TouchableOpacity>
              <Text style={styles.bottomLinkText}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={styles.separator}>•</Text>
            <TouchableOpacity>
              <Text style={styles.bottomLinkText}>Cookie Policy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Fun Element */}
      <View style={styles.funElement}>
        <Text style={styles.funText}>
          🚀 Built with ❤️ for Nigerian Students
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2C3E50',
    paddingTop: 60,
  },
  content: {
    paddingHorizontal: width > 768 ? 60 : 20,
    paddingBottom: 40,
    flexDirection: width > 1024 ? 'row' : 'column',
    flexWrap: 'wrap',
    gap: 40,
  },
  brandSection: {
    flex: width > 1024 ? 2 : 1,
    marginBottom: width > 1024 ? 0 : 30,
  },
  logo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FF6B35',
    marginBottom: 15,
  },
  tagline: {
    fontSize: 16,
    color: '#BDC3C7',
    lineHeight: 24,
    marginBottom: 25,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#34495E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  socialIcon: {
    fontSize: 24,
  },
  linksSection: {
    flex: 1,
    marginBottom: width > 1024 ? 0 : 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  link: {
    marginBottom: 12,
  },
  linkText: {
    fontSize: 14,
    color: '#BDC3C7',
    lineHeight: 20,
  },
  contactInfo: {
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#BDC3C7',
    lineHeight: 22,
  },
  bottomBar: {
    backgroundColor: '#1A252F',
    paddingVertical: 25,
    paddingHorizontal: width > 768 ? 60 : 20,
    borderTopWidth: 1,
    borderTopColor: '#34495E',
  },
  bottomContent: {
    flexDirection: width > 768 ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 15,
  },
  copyright: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  bottomLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bottomLinkText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  separator: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  funElement: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 15,
    alignItems: 'center',
  },
  funText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
  },
});
