import React from 'react';
import { View, ScrollView, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import ThemedText from './ThemedText';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height: screenHeight } = Dimensions.get('screen');

export const IndexSidebar = ({ headings, onJump, onClose, isOpen }) => {
  const insets = useSafeAreaInsets();
  const { colors, theme } = useTheme(); // Move hooks to the top!

  if (!isOpen) return null;

  return (
    <Modal
      animationType="slide"
      statusBarTranslucent={true}
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>        
        {/* Right side (The Menu) */}
        <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
          {/* header padding uses insets.top to avoid status bar overlap */}
          <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
            <ThemedText style={styles.title}>תוכן עניינים</ThemedText>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.text, opacity: 0.2 }]} />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {headings.map((item, index) => {
              const isFirst = index === 0; // Define isFirst here inside the map
              
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.itemWrapper, 
                    { 
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
                  <ThemedText style={[
                    styles.itemText,
                    isFirst && {
                      fontSize: 24,
                      fontFamily: 'GuttmanKeren', 
                      opacity: 0.7,
                    }
                  ]}>
                    {item.text}
                  </ThemedText>
                  <Ionicons name="chevron-back" size={16} color={colors.highlight} />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        {/* Left side (clickable area to close) */}
        <TouchableOpacity style={styles.flex1} onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, 
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 2000,
  },
  flex1: { flex: 1 },
  menuContainer: {
    width: width * 0.75,
    paddingHorizontal: 20,
    elevation: 10,
    height: screenHeight + 100, // Fixed bottom leak
  },
  header: {
    flexDirection: 'row-reverse',
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
    height: 1,
    width: '100%',
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  itemWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemText: {
    fontFamily: 'EzraSILSR',
    fontSize: 20,
    flex: 1,
    textAlign: 'right',
  },
});