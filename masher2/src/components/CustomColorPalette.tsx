import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

const COLORS = [
  "#fdbe00", // Golden Yellow
  "#4169e1", // Royal Blue
  "#ff6b6b", // Coral Red
  "#007aff", // Azure Blue
  "#2ecc71", // Emerald Green
  "#9b59b6", // Amethyst Purple
  "#f39c12", // Carrot Orange
  "#e74c3c", // Pomegranate Red
  "#3498db", // Sky Blue
  "#1abc9c", // Turquoise
  "#6A5BC2", // Slate Blue
  "#34495e", // Midnight Blue
];

type CustomColorPaletteProps = {
  selectedColor: string;
  onSelectColor: (color: string) => void;
};

export default function CustomColorPalette({ selectedColor, onSelectColor }: CustomColorPaletteProps) {
  return (
    <View style={styles.paletteContainer}>
      {COLORS.map((color) => (
        <TouchableOpacity
          key={color}
          onPress={() => onSelectColor(color)}
          style={[
            styles.colorBox,
            {
              backgroundColor: color,
            //   borderWidth: selectedColor === color ? 3 : 1,
            //   borderColor: selectedColor === color ? "#000" : "#ccc",
                            // iOS shadow
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                // Android shadow
                elevation: 5,

            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  paletteContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  colorBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 10,
  },
});
