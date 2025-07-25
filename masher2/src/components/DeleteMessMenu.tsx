import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import TabBarIcon from "./TabBarIcon";
import { Appbar } from "react-native-paper";
import { selectSelectedMessageIds } from "../messageScreenStatesSlice";
import { useSelector } from "react-redux";

type deleteMessMenuProps = {
  // onClick: ()=> void;
  onDelete: () => void;
  onBack: () => void;
  isPinned: boolean;
  selectedCount: number;
  //   pressedColor: string | 'black';
  //   customStyle: object | undefined;
};

// export default function DeleteMessMenu({
function DeleteMessMenu({
  onDelete,
  isPinned,
  onBack,
  selectedCount,
}: deleteMessMenuProps) {

  // const selectedMessageIds = useSelector(selectSelectedMessageIds)

  return (
    <View style={styles.menu}>
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
      >
        <TabBarIcon name="arrowLeft" size={35} color="white" />
      </Pressable> */}
      <Appbar.BackAction
        color={"#FFFFFF"}
        onPress={onBack}
        style={{ marginLeft: 10 }}
      />
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 25,
          marginLeft: 15,
          fontFamily: "Dosis_600SemiBold",
        }}
      >
        {selectedCount}
           {/* {selectedMessageIds.length} */}
      </Text>
      <View style={styles.menuItemsBox}>

      {/* {selectedMessageIds.length === 1 && */}
      {selectedCount === 1 &&
      <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed
          ? "rgba(255, 255, 255, 0.3)"
          : "transparent",
          borderRadius: 50,
          padding: 10,
          // flexBasis: 16.66,
          marginHorizontal: 5,
        },
      ]}
      // onPress={onDelete}
      >
          <TabBarIcon
            name={isPinned ? "pinOff" : "pin"}
            size={24}
            color="white"
            />
        </Pressable>
          }

        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? "rgba(255, 255, 255, 0.3)"
                : "transparent",
              borderRadius: 50,
              padding: 10,
              // flexBasis: 16.66,
              marginHorizontal: 5,
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

export default React.memo(DeleteMessMenu);
// export default React.memo(DeleteMessMenu, (prevProps, nextProps) => {
//   return prevProps.selectedCount === nextProps.selectedCount;
// });

const styles = StyleSheet.create({
  menu: {
    // flexDirection: "row",
    // backgroundColor: "#fdbe00",
    // // backgroundColor: "red",
    // padding: 10,
    // alignItems: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    width: "100%",
    zIndex: 5,
  },
  menuItemsBox: {
    flexDirection: "row",
    justifyContent: "flex-end",
    right: 0,
    position: "absolute",
  },
});
