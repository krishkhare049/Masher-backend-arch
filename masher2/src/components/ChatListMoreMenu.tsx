import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import PressableIcon from "./PressableIcon";
// import { Menu } from "react-native-paper";
import TabBarIcon from "./TabBarIcon";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFilterBy,
  selectMoreIconMenuVisible,
  setFilterBy,
  setMoreIconMenuVisible,
  setUnreadConversationsCount,
} from "../chatScreenStatesSlice";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../MainComponent";
// import withObservables from "@nozbe/with-observables";
import { withObservables } from '@nozbe/watermelondb/react'
import { conversationsCollection } from "../../index.native";
import { Q } from "@nozbe/watermelondb";

import { debounceTime, map, distinctUntilChanged } from "rxjs/operators";
import { from } from "rxjs";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import { useAppTheme } from "../ThemeContext";
import AppText from "./AppText";

// const enhance = withObservables([], () => {
//   const directCount$ = from(
//     conversationsCollection
//       .query(Q.where("is_group", false), Q.where("unread_messages_count", Q.gt(0)))
//       .fetchCount()
//   ).pipe(
//     map((count) => count),
//     distinctUntilChanged() // Ensures it only emits when the count changes
//   );

//   const groupCount$ = from(
//     conversationsCollection
//       .query(Q.where("is_group", true), Q.where("unread_messages_count", Q.gt(0)))
//       .fetchCount()
//   ).pipe(
//     map((count) => count),
//     distinctUntilChanged()
//   );

//   const unreadCount$ = from(
//     conversationsCollection.query(Q.where("unread_messages_count", Q.gt(0))).fetchCount()
//   ).pipe(
//     map((count) => count),
//     distinctUntilChanged()
//   );

//   return { directCount$, groupCount$, unreadCount$ };
// });

// Function to fetch and count unread conversations
const fetchCountQuery = (isGroup: boolean) => {
  return conversationsCollection
    .query(
      Q.where("is_group", isGroup),
      Q.where("unread_messages_count", Q.gt(0))
    )
    .fetchCount();
};

// Optimized Observable for handling unread counts
const enhance = withObservables([], () => {
  // Direct conversations count
  const directCount$ = from(fetchCountQuery(false)).pipe(
    debounceTime(200), // Avoid frequent updates, adjust debounce time as needed
    map((count) => count),
    distinctUntilChanged() // Only emit when count changes
  );

  // Group conversations count
  const groupCount$ = from(fetchCountQuery(true)).pipe(
    debounceTime(200), // Avoid frequent updates, adjust debounce time as needed
    map((count) => count),
    distinctUntilChanged() // Only emit when count changes
  );

  // Unread conversations count (combined direct and group)
  const unreadCount$ = from(
    conversationsCollection
      .query(Q.where("unread_messages_count", Q.gt(0)))
      // .query()
      .fetchCount()
  ).pipe(
    debounceTime(200), // Avoid frequent updates
    map((count) => count),
    distinctUntilChanged() // Only emit when count changes
  );

  return { directCount$, groupCount$, unreadCount$ };
});

// Component to use the enhanced data

const EnhancedChatListMoreMenu = enhance(ChatListMoreMenu);

// export default function ChatListMoreMenu() {
function ChatListMoreMenu({
  directCount$,
  groupCount$,
  unreadCount$,
}: {
  directCount$: any;
  groupCount$: any;
  unreadCount$: any;
}) {
  const dispatch = useDispatch();
  const {colors, isDark} = useAppTheme()

  useEffect(() => {
    dispatch(setUnreadConversationsCount(unreadCount$));
  }, [unreadCount$]);

  const filterBy = useSelector(selectFilterBy);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Chats">>();
  // const [moreIconMenuVisible, setMoreIconMenuVisible] = useState(false);
  const moreIconMenuVisible = useSelector(selectMoreIconMenuVisible);

  const filterByHeader = () => {
    if (filterBy === "directConv") {
      return "Direct messages";
    } else if (filterBy === "group") {
      return "Groups";
    } else if (filterBy === "unread") {
      return "Unreads";
    } else {
      return "All conversations";
    }
  };

  return (
    <>
      <View
        style={{
          padding: 10,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          marginTop: 5,
        }}
      >
        {/* <PressableIcon
          iconName="search"
          iconColor="#000000"
          iconSize={25}
          customStyle={{ padding: 7 }}
          onClick={() => {}}
          disabled={false}
          rippleColor="whitesmoke"
        /> */}

        {/* <Pressable
      style={{
        // backgroundColor: "whitesmoke",
        backgroundColor: "#F4F185",
        borderRadius: 20,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        }}
        android_ripple={{ color: "gainsboro" }}
        > */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.conversationFilterPressableView}>
            <Pressable
              style={[
                {
                  // backgroundColor: "whitesmoke",
                  backgroundColor: 
                  // filterBy === "" ? "#F4F185" : "whitesmoke",
                    filterBy === "" ? "#F4F185" : (!isDark ? "whitesmoke": "#B1B9C8"),

                },
                styles.conversationFilterPressable,
              ]}
              android_ripple={{
                color: filterBy === "" ? "#e3e064" : "gainsboro",
              }}
              onPress={() => {
                if (filterBy === "") {
                  // dispatch(setFilterBy(""));
                } else {
                  dispatch(setFilterBy(""));
                }
              }}
            >
              <AppText style={styles.conversationFilterText}>
                All conversations
              </AppText>
            </Pressable>
          </View>
          <View style={styles.conversationFilterPressableView}>
            <Pressable
              style={[
                {
                  // backgroundColor: "whitesmoke",
                  backgroundColor:
                    // filterBy === "directConv" ? "#F4F185" : "whitesmoke",
                    filterBy === "directConv" ? "#F4F185" : (!isDark ? "whitesmoke": "#B1B9C8"),

                },
                styles.conversationFilterPressable,
              ]}
              android_ripple={{
                color: filterBy === "directConv" ? "#e3e064" : "gainsboro",
              }}
              onPress={() => {
                if (filterBy === "directConv") {
                  dispatch(setFilterBy(""));
                } else {
                  dispatch(setFilterBy("directConv"));
                }
              }}
            >
              <AppText style={styles.conversationFilterText}>Direct messages</AppText>
              {directCount$ !== 0 && (
                <AppText
                  style={[
                    {
                      backgroundColor:
                        filterBy === "directConv" ? "#FFFFFF" : "#000000",
                      color: filterBy === "directConv" ? "#000000" : "#FFFFFF",
                      fontFamily: "Dosis_600SemiBold",
                      marginLeft: 5,
                      paddingHorizontal: 5,
                      borderRadius: 30,
                    },
                  ]}
                >
                  {/* 5 */}
                  {directCount$}
                </AppText>
              )}
            </Pressable>
          </View>
          <View style={styles.conversationFilterPressableView}>
            <Pressable
              style={[
                {
                  backgroundColor:
                    // filterBy === "group" ? "#F4F185" : "whitesmoke",
                    filterBy === "group" ? "#F4F185" : (!isDark ? "whitesmoke": "#B1B9C8"),

                },
                styles.conversationFilterPressable,
              ]}
              android_ripple={{
                color: filterBy === "group" ? "#e3e064" : "gainsboro",
              }}
              onPress={() => {
                if (filterBy === "group") {
                  dispatch(setFilterBy(""));
                } else {
                  dispatch(setFilterBy("group"));
                }
              }}
            >
              <AppText style={styles.conversationFilterText}>Groups</AppText>
              {groupCount$ !== 0 && (
                <AppText
                  style={[
                    {
                      backgroundColor:
                        filterBy === "group" ? "#FFFFFF" : "#000000",
                      color: filterBy === "group" ? "#000000" : "#FFFFFF",
                      fontFamily: "Dosis_600SemiBold",
                      marginLeft: 5,
                      paddingHorizontal: 5,
                      borderRadius: 30,
                    },
                  ]}
                >
                  {/* 5 */}
                  {groupCount$}
                </AppText>
              )}
            </Pressable>
          </View>
          <View style={styles.conversationFilterPressableView}>
            <Pressable
              style={[
                {
                  backgroundColor:
                    filterBy === "unread" ? "#F4F185" : (!isDark ? "whitesmoke": "#B1B9C8"),
                },
                styles.conversationFilterPressable,
              ]}
              android_ripple={{
                color: filterBy === "unread" ? "#e3e064" : "gainsboro",
              }}
              onPress={() => {
                if (filterBy === "unread") {
                  dispatch(setFilterBy(""));
                } else {
                  dispatch(setFilterBy("unread"));
                }
              }}
            >
              <AppText style={styles.conversationFilterText}>Unreads</AppText>
              {unreadCount$ !== 0 && (
                <AppText
                  style={[
                    {
                      backgroundColor:
                        filterBy === "unread" ? "#FFFFFF" : "#000000",
                      color: filterBy === "unread" ? "#000000" : "#FFFFFF",
                      fontFamily: "Dosis_600SemiBold",
                      marginLeft: 5,
                      paddingHorizontal: 5,
                      borderRadius: 30,
                    },
                  ]}
                >
                  {/* 5 */}
                  {unreadCount$}
                </AppText>
              )}
            </Pressable>
          </View>
        </ScrollView>
        {/* <Menu
          opened={moreIconMenuVisible}
          onBackdropPress={() => {
            dispatch(setMoreIconMenuVisible(false))
          }}
          style={{ borderRadius: 30, overflow: "hidden" }}
        >
          <MenuTrigger
            onPress={() => {
              dispatch(setMoreIconMenuVisible(true))
            }}
            style={{ padding: 5 }}
          >
            <TouchableNativeFeedback
              background={TouchableNativeFeedback.Ripple("#FF5722", true)} // Custom ripple color
              useForeground={true} // Ensure ripple effect appears inside the view
            >
              <TabBarIcon name="moreHorizontal" size={25} color="#000000" />
            </TouchableNativeFeedback>
          </MenuTrigger>
          <MenuOptions optionsContainerStyle={{ borderRadius: 10, padding: 5 }}>
            <MenuOption
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: 10,
                borderRadius: 100,
              }}
              onSelect={() => {
                navigation.navigate("CreateGroup");
                dispatch(setMoreIconMenuVisible(false));
              }}
            >
              <TabBarIcon name="defaultGroupIcon" size={20} color="#000000" />
              <AppText style={{ fontFamily: "Dosis_500Medium", marginLeft: 10 }}>
                Create Group
              </AppText>
            </MenuOption>
            <MenuOption
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: 10,
              }}
              onSelect={() => dispatch(setMoreIconMenuVisible(false))}
            >
              <TabBarIcon name="cancel" size={20} color="#000000" />
              <AppText style={{ fontFamily: "Dosis_500Medium", marginLeft: 10 }}>
                Close
              </AppText>
            </MenuOption>
          </MenuOptions>
        </Menu> */}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          marginHorizontal: 15,
          marginVertical: 10,
        }}
      >
        {/* <TabBarIcon name="messageCircle" size={20} color="#000000" /> */}
        <TabBarIcon name="messageCircle" size={20} color={colors.text} />
        <AppText
          style={{
            fontFamily: "Dosis_600SemiBold",
            color: colors.text,
            marginLeft: 7
          }}
        >
          {filterByHeader()}
          {/* All conversations */}
        </AppText>
      </View>
    </>
  );
}

// export default React.memo(ChatListMoreMenu);
export default React.memo(EnhancedChatListMoreMenu);

const styles = StyleSheet.create({
  conversationFilterPressableView: {
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 3,
  },
  conversationFilterPressable: {
    borderRadius: 20,
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  conversationFilterText: {
    fontFamily: "Dosis_600SemiBold",
    color: "#000000",
  },
});
