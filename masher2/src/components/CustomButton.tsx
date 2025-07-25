import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

// export default function CustomButton({
function CustomButton({
  name,
  bgColor,
  pressedColor,
  borRadius,
  onClick,
  customStyle,
  disabled,
}: {
  name: string;
  bgColor: string;
  borRadius: number;
  pressedColor: string;
  onClick: () => void | undefined;
  customStyle: object;
  disabled: boolean | undefined;
}) {
  return (
    <View style={{ borderRadius: borRadius, overflow: "hidden", margin: 10 }}>
      <Pressable
        style={{
          borderColor: "white",
          borderWidth: 2,
          width: 100,
          padding: 5,
          borderRadius: 10,
          // borderRadius: borRadius,
          ...customStyle,
          // backgroundColor: bgColor,
          backgroundColor: disabled ? "#5a69a6" : bgColor,
          overflow: "hidden",
        }}
        android_ripple={{ color: pressedColor, borderless: false }}
        // style={({ pressed }) => [
        //   {
        //     borderColor: "white",
        //     borderWidth: 2,
        //     width: 100,
        //     padding: 5,
        //     borderRadius: 10,
        //     ...customStyle,
        //     backgroundColor: pressed ? pressedColor : bgColor,
        //   },
        // ]}
        onPress={onClick}
        disabled={disabled}
      >
        <Text
          style={{
            fontSize: 20,
            textAlign: "center",
            color: 'white',
            fontWeight: "600",
            fontFamily: "Dosis_600SemiBold",
          }}
        >
          {name}
        </Text>
      </Pressable>
    </View>
  );
}

export default React.memo(CustomButton, (prevProps, nextProps) => {
  return prevProps.customStyle === nextProps.customStyle &&
   prevProps.onClick === nextProps.onClick &&
    prevProps.disabled === nextProps.disabled
});

const styles = StyleSheet.create({});
