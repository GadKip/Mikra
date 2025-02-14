import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import ThemedText from './ThemedText';

const CustomButton = ({title, handlePress, containerStyles, textStyles, isLoading}) => {
  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary rounded-xl min-h-12 min-w-40 justify-center items-center
      ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
      style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
    > 
      <ThemedText 
      className={`text-primary text-2xl ${textStyles}`}
      dir="rtl">
        {title}
      </ThemedText>
    </TouchableOpacity>
  )
}

export default CustomButton