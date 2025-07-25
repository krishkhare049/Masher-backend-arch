import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TabBarIcon from "./TabBarIcon";
import { Badge } from "react-native-paper";
import { useSelector } from "react-redux";
import { selectUnreadConversationsCount } from "../chatScreenStatesSlice";
import { useAppTheme } from "../ThemeContext";

export default function ChatsIconComponent({ focused }: { focused: boolean }) {

  const unreadConversationsCount = useSelector(selectUnreadConversationsCount)
      const { colors, isDark } = useAppTheme();
  
  return (
    <View>
      {unreadConversationsCount !== 0 &&
      <Badge size={15} style={{position: 'absolute', zIndex: 2, fontSize: 9, left: 15, fontFamily: 'Dosis_500Medium', backgroundColor: '#ECEEF2', color: '#000000'}} ellipsizeMode={'tail'}>{unreadConversationsCount}</Badge>
      }
      <TabBarIcon
        name={focused ? "chats" : "chatsOutline"}
        // color={focused ? "#fdbe00" : "gainsboro"}
        color={focused ? (!isDark ?colors.background: '#B1B9C8') : "#B1B9C8"}
        size={30}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
