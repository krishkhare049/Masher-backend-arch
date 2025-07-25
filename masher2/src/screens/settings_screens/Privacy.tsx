import { StatusBar, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import TabBarIcon from '../../components/TabBarIcon'
import { useAppTheme } from '../../ThemeContext';
import AppText from '../../components/AppText';

export default function Privacy() {
  const { isDark, colors, fontFamily, fontSize } = useAppTheme();
  const [selectedFont, setSelectedFont] = useState(fontFamily || 'Dosis_400Regular');
  const [selectedSize, setSelectedSize] = useState(fontSize || 16);
  return (
    <>
      {/* <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? colors.background : 'royalblue'} /> */}
      <StatusBar barStyle={'light-content'} backgroundColor={isDark ? colors.background : 'royalblue'} />
      <View
        style={{
          backgroundColor: isDark ? '#343A46' : '#FFFFFF',
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: '80%',
            margin: 15,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'flex-start',
          }}
        >
          <TabBarIcon name="infocirlceo" size={20} color={colors.text} />
          <AppText
            style={{
              textAlign: 'center',
              marginHorizontal: 10,
              // fontSize: 
                color: colors.text, 
                // fontFamily: selectedFont, 
                fontSize: selectedSize,
            }}
          >
            All your privacy related actions will appear here
          </AppText>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({})