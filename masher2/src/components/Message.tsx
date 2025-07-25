
import React, { memo, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import TabBarIcon from "./TabBarIcon";
// import formatTime from "../utilities/formatDate";

type MessageProps = {
  item: any;
  selected: boolean;
  onClick: () => void;
  onLongPress: () => void;
  isMessMenuVisible: boolean
};

const Message = memo(
  ({ item, selected, onClick, onLongPress, isMessMenuVisible }: MessageProps) => {
    const isSender = item.isSender;


    // console.log('Inside message: ', isMessMenuVisible)
    // console.log("item: ", item);

    // const containerStyle = useMemo(() => {
    //   const baseStyle = [
    //     styles.baseBubble,
    //     isSender ? styles.sender : styles.receiver,
    //   ];
    //   if (selected) baseStyle.push(styles.selected);
    //   return baseStyle;
    // }, [isSender, selected]);

    const containerStyle = useMemo(() => {
      return [
        styles.baseBubble,
        isSender ? styles.sender : styles.receiver,
        selected && styles.selected,
      ].filter(Boolean);
    }, [isSender, selected]);

    // const timeComponent = useMemo(() => {
    //   return (
    //     <Text style={[styles.time, styles.mediumText]}>
    //       {formatTime(item.createdAt)}
    //     </Text>
    //   );
    // }, [item.createdAt]);

    return (
      // <View style={containerStyle}>
        <Pressable
          android_ripple={null}
          // android_ripple={{color: 'white', borderless: false}}
          onLongPress={onLongPress}
          onPress={onClick}
          // style={styles.container}
          style={[containerStyle, styles.container]}
        >
          <Text style={[styles.text, styles.mediumText]}>{item.content}</Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: isSender ? "flex-end" : "flex-start",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            {isSender && (
              <View style={{ marginRight: 5 }}>
                <TabBarIcon name="check" size={15} color="gray" />
              </View>
            )}
            {/* {timeComponent} */}
            <Text style={[styles.time, styles.mediumText]}>
              {item.formattedDate}</Text>
          </View>
        </Pressable>
      // </View>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.item.messageId === nextProps.item.messageId &&
      prevProps.item.content === nextProps.item.content &&
      // prevProps.item.formattedDate === nextProps.item.formattedDate &&
      prevProps.selected === nextProps.selected &&
      prevProps.isMessMenuVisible === nextProps.isMessMenuVisible
    );
  }
);

export default Message;

const styles = StyleSheet.create({
  baseBubble: {
    borderRadius: 40,
    overflow: "hidden",
    margin: 5,
    marginHorizontal: 5,
  },
  sender: {
    backgroundColor: "#f7d992",
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
  },
  receiver: {
    backgroundColor: "#F7F7F7",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
  },
  selected: {
    backgroundColor: "#ff4a40",
    // alignSelf: "flex-end",
    // borderBottomRightRadius: 0,
    // alignSelf: "flex-start", // or "flex-end" based on your requirement
    // borderBottomLeftRadius: 0, // or borderBottomRightRadius based on your requirement
  },
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    maxWidth: "70%",
    minWidth: 50,
  },
  text: {
    fontSize: 16,
    color: "black",
  },
  time: {
    fontSize: 12,
    color: "#666",
  },
  regularText: { fontFamily: "Dosis_400Regular" },
  mediumText: { fontFamily: "Dosis_500Medium" },
});
