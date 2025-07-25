import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import TabBarIcon from "./TabBarIcon";
import { Appbar } from "react-native-paper";
import PressableIcon from "./PressableIcon";
import { useAppTheme } from "../ThemeContext";

type deleteConvMenuProps = {
  // onClick: ()=> void;
  onDelete: () => void;
  onBack: () => void;
  selectedCount: number | undefined;
  isPinned: boolean | false;
  //   bgColor: string | undefined;
  //   pressedColor: string | 'black';
  //   customStyle: object | undefined;
};

// export default function DeleteConvMenu({
function DeleteConvMenu({
  onDelete,
  onBack,
  selectedCount,
  isPinned,
}: deleteConvMenuProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        // backgroundColor: "#fdbe00",
        backgroundColor: colors.background,
        // padding: 10,
        padding: 6,
        alignItems: "center",
      }}
    >
      {/* <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? "rgba(255, 255, 255, 0.3)"
              : "transparent",
            borderRadius: 50,
            padding: 5,
            // flexBasis: 20,
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          },
        ]}
        onPress={onBack}
      > */}
      {/* <TabBarIcon name="arrowLeft" size={35} color="white" /> */}
      {/* </Pressable> */}
      <Appbar.BackAction color={"#FFFFFF"} onPress={onBack} />

      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 25,
          marginLeft: 15,
          fontFamily: "Dosis_600SemiBold",
        }}
      >
        {selectedCount}
      </Text>
      <View style={styles.menuItemsBox}>
        {selectedCount === 1 && (
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? // ? "rgba(255, 255, 255, 0.3)"
                    "#0000001A"
                  : "transparent",
                borderRadius: 50,
                padding: 12,
                // flexBasis: 16.66,
                marginHorizontal: 5,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
            // onPress={onDelete}
          >
            <TabBarIcon
              name={isPinned ? "pinOff" : "pin"}
              size={25}
              color="white"
            />
          </Pressable>
        )}

        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? // ? "rgba(255, 255, 255, 0.3)"
                  // "#e8ae00"
                  "#0000001A"
                : "transparent",
              borderRadius: 50,
              padding: 10,
              // flexBasis: 16.66,
              marginHorizontal: 5,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
          onPress={onDelete}
        >
          <TabBarIcon name="delete" size={27} color="white" />
        </Pressable>
      </View>
    </View>
  );
}

export default React.memo(DeleteConvMenu, (prevProps, nextProps) => {
  return (
    prevProps.onDelete === nextProps.onDelete &&
    prevProps.onBack === nextProps.onBack &&
    prevProps.selectedCount === nextProps.selectedCount &&
    prevProps.isPinned === nextProps.isPinned
  );
});

const styles = StyleSheet.create({
  // menu: {
  //   flexDirection: "row",
  //   // backgroundColor: "#fdbe00",
  //   backgroundColor: colors.primary,
  //   // padding: 10,
  //   padding: 6,
  //   alignItems: "center",
  // },
  menuItemsBox: {
    flexDirection: "row",
    justifyContent: "flex-end",
    right: 0,
    position: "absolute",
  },
});
