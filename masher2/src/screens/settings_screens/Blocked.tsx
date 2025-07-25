import { StyleSheet, View } from "react-native";
import React from "react";
import { useAppTheme } from "../../ThemeContext";
import AppText from "../../components/AppText";

export default function Blocked() {
  const { isDark, colors } = useAppTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isDark ? '#343A46' : '#ffffff',
      }}
    >
      {/* <Text style={{fontFamily: 'Dosis_700Bold', fontSize: 20}}>Theme</Text> */}
      <AppText style={{ fontFamily: "Dosis_600SemiBold", fontSize: 20, color: colors.text }}>
        No blocked accounts yet!
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({});
