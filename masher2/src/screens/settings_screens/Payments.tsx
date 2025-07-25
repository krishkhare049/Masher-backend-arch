import { StatusBar, StyleSheet, View } from "react-native";
import React from "react";
import TabBarIcon from "../../components/TabBarIcon";
import { useAppTheme } from '../../ThemeContext';
import AppText from '../../components/AppText';

export default function Payments() {
  const { isDark, colors } = useAppTheme();
  return (
    <>
      {/* <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? colors.background : '#129953'} /> */}
      <StatusBar barStyle={'light-content'} backgroundColor={isDark ? colors.background : '#129953'} />
      <View
        style={{
          backgroundColor: isDark ? '#343A46' : "#FFFFFF",
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
              color: colors.text,
              textAlign: 'center',
              marginHorizontal: 10,
            }}
          >
            All your payment related actions will appear here
          </AppText>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
