import React from 'react';
import { TouchableOpacity } from 'react-native';
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
        style={[{ fontSize: 24 }, textStyles]}
        dir="rtl">
        {title}
      </ThemedText>
    </TouchableOpacity>
  )
}

export default CustomButton