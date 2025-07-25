import {Pressable, View } from "react-native";
import React from "react";
import TabBarIcon from "./TabBarIcon";

type PressableIconProps = {
  iconName: string;
  iconSize: number;
  iconColor: string;
  rippleColor: string | undefined;
  disabled: boolean | undefined;

  onClick: () => void;
  //   bgColor: string | undefined;
  //   pressedColor: string | 'black';
    customStyle: object | undefined;
};

// export default function PressableIcon({
function PressableIcon({
  iconName,
  iconSize,
  iconColor,
  rippleColor,
  onClick,
  customStyle,
  disabled
}: //   bgColor,
//   pressedColor,
PressableIconProps) {
  return (
    <View style={{overflow: 'hidden', borderRadius: 100}}>

    <Pressable
    android_ripple={{color: rippleColor || '#0000001A'}}
      onPress={onClick}
      disabled={disabled}
      style={({ pressed }) => [
        {
          // borderWidth: 2,
          // width: 100,
          // padding: 5,
          // borderRadius: 10,
            ...customStyle,
          justifyContent: "center",
          // backgroundColor: pressed ? "rgba(255, 255, 255, 0.3)" : "transparent",
          // padding: 5,
        //   borderColor: pressed ? "whitesmoke" : "whitesmoke",
          // borderRadius: 100,
          //   borderWidth: 1,
          // transform: pressed ? [{scale: 0.98}]: []
        },
      ]}
      onLongPress={() => {
        console.log("Long press");
      }}
    >
      <TabBarIcon name={iconName} size={iconSize} color={iconColor} />
    </Pressable>
    </View>
  );
}

export default React.memo(PressableIcon, (prevProps, nextProps) => {
  return prevProps.customStyle === nextProps.customStyle &&
  prevProps.iconName === nextProps.iconName &&
  prevProps.disabled === nextProps.disabled
});