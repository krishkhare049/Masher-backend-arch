import { StyleSheet, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { useAppTheme } from '../../ThemeContext';
import AppText from '../../components/AppText';
import Toast from 'react-native-toast-message';

// Only two font options: Dosis and System
const FONT_OPTIONS = [
  { name: 'Dosis', value: 'Dosis_400Regular' },
  { name: 'System', value: '' },
];

const FONT_SIZES = [
  { label: 'Small', value: 12 },
  { label: 'Medium', value: 16 },
  { label: 'Large', value: 20 },
  { label: 'Extra Large', value: 24 },
];

export default function Fonts() {
  const { colors, isDark, fontFamily, fontSize, updateFontSettings } = useAppTheme();
  const [selectedFont, setSelectedFont] = useState(fontFamily || 'Dosis_400Regular');
  const [selectedSize, setSelectedSize] = useState(fontSize || 16);
  const [previewText] = useState('The quick brown fox jumps over the lazy dog.');

  // console.log(colors.primary);

  return (
    <ScrollView style={{ backgroundColor: isDark ? '#343A46' : '#FFFFFF', flex: 1, padding: 20 }}>
      <AppText style={{ color: colors.text, marginBottom: 20, textAlign: 'center' }}>
        Font Customization
      </AppText>

      {/* Font Options */}
      <AppText style={{ color: colors.text, marginBottom: 10 }}>Available Fonts</AppText>
      {FONT_OPTIONS.map(font => (
        <TouchableOpacity
          key={font.value}
          style={{
            backgroundColor: font.value === selectedFont ? colors.primary : 'transparent',
            borderRadius: 8,
            padding: 15,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: colors.primary,
          }}
          onPress={() => setSelectedFont(font.value)}
        >
          <AppText style={{ color: font.value === selectedFont ? '#fff' : colors.text }}>
            {font.name}
          </AppText>
          <AppText style={{ color: font.value === selectedFont ? '#fff' : colors.text, opacity: 0.8, ...(font.value && font.value !== '' ? { fontFamily: font.value } : {}) }}>
            {previewText}
          </AppText>
        </TouchableOpacity>
      ))}

      {/* Font Size */}
      <AppText style={{ color: colors.text, marginTop: 20, marginBottom: 10 }}>Font Size</AppText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {FONT_SIZES.map(size => (
          <TouchableOpacity
            key={size.value}
            style={{
              backgroundColor: selectedSize === size.value ? colors.primary : 'transparent',
              borderRadius: 8,
              padding: 12,
              borderWidth: 1,
              borderColor: colors.primary,
              minWidth: 80,
              alignItems: 'center',
            }}
            onPress={() => setSelectedSize(size.value)}
          >
            <AppText style={{ color: selectedSize === size.value ? '#fff' : colors.text }}>
              {size.label}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Preview */}
      <AppText style={{ color: colors.text, marginTop: 20, marginBottom: 10 }}>Preview</AppText>
      <View style={{ 
        backgroundColor: isDark ? '#222831' : '#f5f5f5', 
        borderRadius: 8, 
        padding: 15, 
        marginBottom: 20 
      }}>
        <AppText style={{ 
          color: colors.text, 
          ...(selectedFont && selectedFont !== '' ? { fontFamily: selectedFont } : {}),
          fontSize: selectedSize,
          textAlign: 'center'
        }}>
          {previewText}
        </AppText>
      </View>

      {/* Apply Button */}
      <TouchableOpacity
        style={{ 
          backgroundColor: colors.primary, 
          borderRadius: 8, 
          padding: 15, 
          alignItems: 'center',
          marginBottom: 20
        }}
        onPress={() => {
          console.log('🔧 Applying font settings:', { fontFamily: selectedFont, fontSize: selectedSize });
          updateFontSettings({ fontFamily: selectedFont, fontSize: selectedSize });
          // Alert.alert('Success', 'Font settings applied! Please restart the app to see changes.');
          Toast.show({
          type: "success",  // or "error" for error messages
          text1: "Text Settings Applied! 🎉",
          text2: "Font and size updated successfully.",
          position: "bottom", // or "top" for top position    
          visibilityTime: 3000, // Duration in milliseconds
          autoHide: true, // Automatically hide after visibilityTime  
        });
        }}
      >
        <AppText style={{ color: '#fff' }}>Apply</AppText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});