import React from 'react';
import { View, ScrollView, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import ThemedText from './ThemedText';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export const IndexSidebar = ({ headings, onJump, onClose, isOpen }) => {
  const { colors, theme } = useTheme();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.flex1} onPress={onClose} />
        
        <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
            <ThemedText style={styles.title}>תוכן עניינים</ThemedText>
          </View>

          {/* Fixed Divider: Dynamic background color */}
          <View style={[styles.divider, { backgroundColor: colors.text, opacity: 0.2 }]} />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {headings.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.itemWrapper, 
                  { 
                    // Fixed Border: Dynamic color based on theme
                    borderBottomColor: theme === 'dark' 
                      ? 'rgba(255, 255, 255, 0.12)' 
                      : 'rgba(0, 0, 0, 0.08)' 
                  }
                ]}
                onPress={() => {
                  onJump(item.id);
                  onClose();
                }}
              >
                <ThemedText style={styles.itemText}>
                  {item.text}
                </ThemedText>
                <Ionicons name="chevron-back" size={16} color={colors.highlight} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  flex1: { flex: 1 },
  menuContainer: {
    width: width * 0.75,
    height: '100%',
    paddingTop: 50,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontFamily: 'GuttmanKeren',
    fontSize: 24,
    textAlign: 'right',
  },
  closeButton: {
    padding: 5,
  },
  divider: {
    height: 1, // Thinned for elegance
    width: '100%',
    alignSelf: 'flex-end',
    marginBottom: 20,
    borderRadius: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  itemWrapper: {
    flexDirection: 'row-reverse', // Ensure Hebrew text is right, icon is left
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth, // Use hairlineWidth for crisp borders
  },
  itemText: {
    fontFamily: 'EzraSILSR',
    fontSize: 20,
    flex: 1,
  },
});