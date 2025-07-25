import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { memo } from "react";
import TabBarIcon from "./TabBarIcon";
import formatTime from "../utilities/formatDate";

const Message2 = memo(
  ({
    isSender,
    content,
    createdAt,
    selected,
    onClick,
    onLongPress,
  }: // customStyle,
  {
    isSender: boolean;
    selected: boolean;
    content: string;
    createdAt: string;
    onClick: () => void;
    onLongPress: () => void;
    // customStyle: object | undefined;
  }) => {
    return (
      <TouchableOpacity
        onPress={onClick}
        onLongPress={onLongPress}
        activeOpacity={0.7}
        style={[{
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 15,
          backgroundColor: !selected ? (isSender ? "#f7d992" : "#F7F7F7") : '#ff4a40',
          alignSelf: isSender ? "flex-end" : "flex-start",
          margin: 5,
          maxWidth: "70%",
          minWidth: 45,
        }, isSender ? styles.sender: styles.receiver]}
      >
        <Text>{content}</Text>
        {/* <Text>{item.messageId}</Text> */}
        <Text>{isSender}</Text>
        <Text>{formatTime(createdAt)}</Text>

        {!isSender && (
          <View
            style={{
              marginRight: 5,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <TabBarIcon name="check" size={15} color="gray" />
          </View>
        )}
      </TouchableOpacity>
    );
  }
);

export default Message2;

const styles = StyleSheet.create({
    sender:{
        borderRadius: 100
    },
    receiver:{
        borderRadius: 100
    }
});
