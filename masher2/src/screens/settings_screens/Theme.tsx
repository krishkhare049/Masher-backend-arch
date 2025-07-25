// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// export default function Theme() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
//       {/* <Text style={{fontFamily: 'Dosis_700Bold', fontSize: 20}}>Theme</Text> */}
//       <Text style={{fontFamily: 'Dosis_600SemiBold', fontSize: 20}}>No themes yet!</Text>

//     </View>
//   )
// }

// const styles = StyleSheet.create({})

// ThemeSettings.tsx
import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";
import { Button } from "react-native-paper";
import { useAppTheme } from "../../ThemeContext";
import TabBarIcon from "../../components/TabBarIcon";
import CustomColorPalette from "../../components/CustomColorPalette";

const DEFAULT_COLORS = {
  background: "#fdbe00",
  primary: "#4169E1",
  text: "#000000",
};
import Toast from "react-native-toast-message";

export default function Theme() {
  const { colors, updateColors, isDark, toggleThemeMode } = useAppTheme();
  const [selectedColor, setSelectedColor] = useState(colors.background);

  const handleReset = () => {
        if (isDark) {
      toggleThemeMode(); // 🔁 Force switch to light
    }
    updateColors(DEFAULT_COLORS);
    setSelectedColor(DEFAULT_COLORS.background);
  };

  const isColorTooLight = (hex: string) => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 230;
  };

  const handleApplyTheme = () => {
    if (isColorTooLight(selectedColor)) {
      // Alert.alert(
      //   "Invalid Color",
      //   "This color is too light and may make white text unreadable."
      // );
      Toast.show({
        type: "info",
        text1: "Whoa, Too Bright! 🌞",
        text2: "Try a darker shade!",
        text1Style: { fontSize: 16 },
        text2Style: { fontSize: 13 },
        visibilityTime: 2000,
      });
      return;
    }

    if (isDark) {
      toggleThemeMode(); // 🔁 Force switch to light
    }

    updateColors({ background: selectedColor });
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: !isDark? "#FFFFFF": "#343A46" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          // backgroundColor: "whitesmoke",
          // backgroundColor: isDark ? "gainsboro" : "whitesmoke",
          backgroundColor: colors.background,
          width: 150,
          padding: 5,
          borderRadius: 10,
        }}
      >
        <TabBarIcon name="colorPalette" size={20} color={'#FFFFFF'}/>
        <Text style={{ color: '#FFFFFF'}}>Choose Theme</Text>
      </View>
      <View style={{ height: 300 }}>
        <ColorPicker
          color={selectedColor}
          onColorChangeComplete={(color) => setSelectedColor(color)}
          // onColorChangeComplete={(color) => updateColors({ background: color })}
          thumbSize={30}
          sliderSize={20}
          noSnap={true}
          row={false}
          // swatches={true}
          swatches={false}
          // palette={[
          //   "#fdbe00", // Golden Yellow
          //   "#4169e1", // Royal Blue
          //   "#ff6b6b", // Coral Red
          //   "#007aff", // Azure Blue
          //   "#2ecc71", // Emerald Green
          //   "#9b59b6", // Amethyst Purple
          //   "#f39c12", // Carrot Orange
          //   "#e74c3c", // Pomegranate Red
          //   "#3498db", // Sky Blue
          //   "#1abc9c", // Turquoise
          //   "#6A5BC2", // Slate Blue
          //   "#34495e", // Midnight Blue
          // ]}
        />
      </View>

      <CustomColorPalette
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
      />

      <Button
        disabled={colors.background === selectedColor}
        mode="contained"
        // style={{ marginTop: 20, backgroundColor: colors.background }}
        style={{ marginTop: 20, backgroundColor: selectedColor }}
        // onPress={() => updateColors({ background: selectedColor })}
        // onPress={handleApplyTheme}
        onPress={handleApplyTheme}
      >
        <Text style={{ color: "#FFFFFF" }}>
          {colors.background === selectedColor ? "Applied" : "Apply Theme"}
        </Text>
      </Button>

      <View style={{ marginTop: 20 }}>
        <Button
          onPress={handleReset}
          rippleColor={"#0000001A"}
          style={{ backgroundColor: "whitesmoke" }}
        >
          <Text style={{ color: "#000000" }}>Reset to default Theme</Text>
        </Button>
      </View>
    </View>
  );
}
