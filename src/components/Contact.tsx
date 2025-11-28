import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { Text } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function Contact() {
  const [formData, setFormData] = useState({
    schoolName: '',
    contactName: '',
    email: '',
    phone: '',
    students: '',
    message: '',
  });

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
    // TODO: Integrate with backend or email service
    alert('Thank you! We will contact you within 24 hours.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionBadge}>📞 Get in Touch</Text>
        <Text style={styles.sectionTitle}>
          Start Your{' '}
          <Text style={styles.highlight}>STEM Journey</Text>
        </Text>
        <Text style={styles.sectionSubtitle}>
          Fill out the form below and we'll schedule a free demo at your school
        </Text>
      </View>

      <View style={styles.contentWrapper}>
        {/* Form */}
        <View style={styles.formSection}>
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>🏫 School Partnership Form</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>School Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Lagos International School"
                placeholderTextColor="#B0B0B0"
                value={formData.schoolName}
                onChangeText={(text) =>
                  setFormData({ ...formData, schoolName: text })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Person *</Text>
              <TextInput
                style={styles.input}
                placeholder="Principal, Director, or Admin"
                placeholderTextColor="#B0B0B0"
                value={formData.contactName}
                onChangeText={(text) =>
                  setFormData({ ...formData, contactName: text })
                }
              />
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="school@example.com"
                  placeholderTextColor="#B0B0B0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) =>
                    setFormData({ ...formData, email: text })
                  }
                />
              </View>

              <View style={styles.inputGroupHalf}>
                <Text style={styles.label}>Phone *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="080XXXXXXXX"
                  placeholderTextColor="#B0B0B0"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(text) =>
                    setFormData({ ...formData, phone: text })
                  }
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Estimated Number of Students</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 25-30"
                placeholderTextColor="#B0B0B0"
                value={formData.students}
                onChangeText={(text) =>
                  setFormData({ ...formData, students: text })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Message (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us about your school and what you're looking for..."
                placeholderTextColor="#B0B0B0"
                multiline
                numberOfLines={4}
                value={formData.message}
                onChangeText={(text) =>
                  setFormData({ ...formData, message: text })
                }
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Schedule Free Demo</Text>
            </TouchableOpacity>

            <Text style={styles.privacyNote}>
              🔒 Your information is secure. We'll contact you within 24 hours.
            </Text>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Contact Information</Text>

            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>📧</Text>
              <View>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>hello@troniclab.ng</Text>
              </View>
            </View>

            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>📱</Text>
              <View>
                <Text style={styles.contactLabel}>WhatsApp</Text>
                <Text style={styles.contactValue}>+234 XXX XXX XXXX</Text>
              </View>
            </View>

            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>📍</Text>
              <View>
                <Text style={styles.contactLabel}>Location</Text>
                <Text style={styles.contactValue}>Lagos, Nigeria</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.infoSubtitle}>What Happens Next?</Text>

            <View style={styles.nextStepItem}>
              <Text style={styles.nextStepNumber}>1</Text>
              <Text style={styles.nextStepText}>
                We contact you within 24 hours
              </Text>
            </View>

            <View style={styles.nextStepItem}>
              <Text style={styles.nextStepNumber}>2</Text>
              <Text style={styles.nextStepText}>
                Schedule free 30-min demo at your school
              </Text>
            </View>

            <View style={styles.nextStepItem}>
              <Text style={styles.nextStepNumber}>3</Text>
              <Text style={styles.nextStepText}>
                Students build something amazing!
              </Text>
            </View>

            <View style={styles.nextStepItem}>
              <Text style={styles.nextStepNumber}>4</Text>
              <Text style={styles.nextStepText}>
                You decide if we're a good fit
              </Text>
            </View>
          </View>

          {/* Testimonial */}
          <View style={styles.testimonialCard}>
            <Text style={styles.testimonialQuote}>"</Text>
            <Text style={styles.testimonialText}>
              The students were so engaged! Seeing them build working robots on day 1 was incredible. Parents are already asking when the next term starts.
            </Text>
            <View style={styles.testimonialAuthor}>
              <Text style={styles.authorName}>Mrs. Adebayo</Text>
              <Text style={styles.authorTitle}>Principal, Lagos Private School</Text>
            </View>
          </View>
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
    color: '#4ECDC4',
    backgroundColor: '#E8F9F7',
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
  contentWrapper: {
    flexDirection: width > 1024 ? 'row' : 'column',
    gap: 40,
  },
  formSection: {
    flex: 2,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: width > 768 ? 'row' : 'column',
    gap: 15,
  },
  inputGroupHalf: {
    flex: 1,
    marginBottom: width > 768 ? 0 : 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F7F9FC',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#2C3E50',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FF6B35',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  privacyNote: {
    fontSize: 13,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 15,
  },
  infoSection: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 20,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 25,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  contactIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7F8C8D',
    marginBottom: 3,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  divider: {
    height: 2,
    backgroundColor: '#E0E0E0',
    marginVertical: 25,
  },
  infoSubtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 20,
  },
  nextStepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  nextStepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4ECDC4',
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 30,
    marginRight: 12,
  },
  nextStepText: {
    flex: 1,
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
  testimonialCard: {
    backgroundColor: '#E8F9F7',
    padding: 30,
    borderRadius: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#4ECDC4',
  },
  testimonialQuote: {
    fontSize: 60,
    fontWeight: '900',
    color: '#4ECDC4',
    lineHeight: 60,
    marginBottom: -10,
  },
  testimonialText: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 26,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  testimonialAuthor: {
    borderTopWidth: 2,
    borderTopColor: '#4ECDC4',
    paddingTop: 15,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 3,
  },
  authorTitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
});
