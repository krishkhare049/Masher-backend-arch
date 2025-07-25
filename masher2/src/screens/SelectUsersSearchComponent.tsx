import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Checkbox, TextInput } from "react-native-paper";
import TabBarIcon from "../components/TabBarIcon";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import addPathToProfileImages from "../utilities/addPathToProfileImages";
import { axiosInstance } from "../utilities/axiosInstance";
import { maxLengthNameWithSuffix } from "../utilities/maxLengthNameWithSuffix";
import SearchScreenElementsLoader from "../loaders/SearchScreenElementsLoader";
import NoSearchesFound from "../components/NoSearchesFound";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import AddParticipants from "../components/AddParticipants";
import {
  selectSelectedUsersList,
  setUsers,
  toggleUser,
} from "../selectedUsersListSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootStackParamList } from "../MainComponent";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import fetchConversationGroupData from "../utilities/fetchGroupParticipantsData";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../ThemeContext";

type searchResultsProps = {
  _id: string;
  full_name: string;
  profile_image_filename: { filename: string; updated_at: string };
  // user_email: string;
};

type SelectUsersSearchComponentProps = NativeStackScreenProps<
  RootStackParamList,
  "SelectUsersSearchComponent"
>;

export default function SelectUsersSearchComponent({
  route,
}: SelectUsersSearchComponentProps) {
  const { conversationId, info } = route.params ?? {};

  const { colors, isDark } = useAppTheme();

  const navigation =
    useNavigation<
      NativeStackNavigationProp<
        RootStackParamList,
        "SelectUsersSearchComponent"
      >
    >();

  const dispatch = useDispatch();

  const selectedUsersList = useSelector(selectSelectedUsersList);

  useEffect(() => {
    console.log(selectedUsersList);
  }, [selectedUsersList]);

  const [searchQuery, setSearchQuery] = useState("");

  // const [searchResults, setSearchResults] = useState(data);
  const [searchResults, setSearchResults] = useState<searchResultsProps[]>([]);
  const [loadingSearchElements, setLoadingSearchElements] = useState(false);

  const handleAddGroupParticipants = async () => {
    try {
          const participantIds = selectedUsersList.map((user: { _id: any; }) => user._id);

      const response = await axiosInstance.post(
        "/api/conversations/addParticipantsToGroup", // update this path if yours is different
        {
participantIds: participantIds,
          conversationId: conversationId,
        },
        {
          withCredentials: true, // if you're using cookies or sessions
        }
      );

      console.log("✅ Participants added:", response.data);
      // return response.data;

      if (response.data.message === "participants_added_successfully") {
        fetchConversationGroupData(conversationId);

        Toast.show({
          type: "success",
          text1: participantIds.lenght > 1 ? "Participants added!": "Participant added!",
          text2: "Added to group successfully! 👤",
          visibilityTime: 2000,
        });
        navigation.goBack();

        dispatch(setUsers([]));
      } else {
        Toast.show({
          type: "error",
          text1: "Participants not added!",
          text2: "Please try again! 👤",
          visibilityTime: 2000,
        });
      }
    } catch (error) {
      console.log("Error:", error);
      Toast.show({
        type: "error",
        text1: "Participants not added!",
        text2: "Please try again! 👤",
        visibilityTime: 2000,
      });
    }
  };

  // Load search history-
  const performSearch = () => {
    const query = searchQuery.trim() || "default";

    console.log(searchQuery);

    setLoadingSearchElements(true);

    if (query === "default") {
      setSearchResults([]);
      return;
    }

    console.log(conversationId);

    let url =
      !conversationId || conversationId === ""
        ? `/api/users/searchUserByName/${query}`
        : `/api/users/searchUserByNameUniqueConvoId/${query}/${conversationId}`;

    console.log("URL: " + url);

    axiosInstance
      .get(url, { withCredentials: true })
      .then((response) => {
        console.log(response.data);
        setSearchResults(response.data);

        setLoadingSearchElements(false);
      })
      .catch((error) => {
        console.log("Error" + error);
        setLoadingSearchElements(false);
      });
  };

  // Input debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      performSearch();
    }, 500); // Delay of 500ms

    return () => {
      clearTimeout(handler); // Clears previous timeout if the user types again
    };
  }, [searchQuery]);

  const checkIfUserAlreadySelected = useCallback(
    (newUserId: string) => {
      console.log("newUserId");

      return selectedUsersList.some(
        // (convId) => convId.conversationId === newConversationId
        (item: any) => item._id === newUserId
      );
    },
    [selectedUsersList]
  );
  // const renderItemChooseParticipant = useCallback(
  const renderItemChooseParticipant = useCallback(
    ({ item }: { item: any }) => {
      console.log(item._id);
      // const renderItem = ({ item }: { item: any })=> {
      return (
        <Pressable
          // onPress={() => {
          //   dispatch(toggleUser(item));
          // }}
          android_ripple={{ color: "whitesmoke" }}
          style={{
            flexDirection: "row",
            margin: 2,
            padding: 5,
            justifyContent: "space-between",
            borderWidth: 1,
            borderRadius: 10,
            borderColor: "whitesmoke",
            backgroundColor: "#FFFFFF",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              // backgroundColor: 'red'
            }}
          >
            {item.profile_image_filename.filename !==
            "default_profile_image" ? (
              <Image
                source={{
                  uri: addPathToProfileImages(
                    item.profile_image_filename.filename
                    // "masherProfileImg-1746075723246-39296779.jpg"
                  ),
                }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  marginLeft: 5,
                }}
                placeholder={require("../../assets/icons/skeletonLoadingPlaceholder.gif")}
                placeholderContentFit="cover"
                contentFit="cover"
              />
            ) : (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 50,
                  height: 50,
                  marginLeft: 5,
                }}
              >
                <TabBarIcon
                  name="defaultProfileIcon"
                  size={50}
                  color="#fdbe00"
                />
              </View>
            )}
            <Text
              style={{
                fontFamily: "Dosis_500Medium",
                fontSize: 18,
                marginLeft: 20,
              }}
            >
              {maxLengthNameWithSuffix(item.full_name, 20, 20)}
              {/* {maxLengthNameWithSuffix("item.full_name", 20, 20)} */}
            </Text>
          </View>
          <BouncyCheckbox
            size={30}
            fillColor="#0077ff"
            isChecked={checkIfUserAlreadySelected(item._id)}
            // unFillColor="#FFFFFF"
            unFillColor="whitesmoke"
            text="Custom Checkbox"
            iconStyle={{ borderColor: "gainsboro" }}
            innerIconStyle={{ borderWidth: 1, borderColor: "#0077ff" }}
            textStyle={{ fontFamily: "JosefinSans-Regular" }}
            // onPress={(isChecked: boolean) => {
            onPress={() => {
              // console.log(isChecked);
              dispatch(toggleUser(item));
            }}
          />
        </Pressable>
      );
    },
    // [selectedMessageIds, isMessMenuVisible]
    [selectedUsersList, checkIfUserAlreadySelected]
  );

  const renderItem = ({ item }: { item: any }) => {
    // console.log("Item: ");
    console.log(item._id);
    return (
      <Pressable
        onPress={() => {
          dispatch(toggleUser(item));
        }}
        style={{ padding: 5 }}
      >
        {item.profile_image_filename.filename !== "default_profile_image" ? (
          <Image
            source={{
              uri: addPathToProfileImages(item.profile_image_filename.filename),
            }}
            style={{ width: 70, height: 70, borderRadius: 80 }}
            placeholder={require("../../assets/icons/skeletonLoadingPlaceholder.gif")}
            placeholderContentFit="cover"
            contentFit="cover"
          />
        ) : (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: 70,
              height: 70,
            }}
          >
            <TabBarIcon name="defaultProfileIcon" size={70} color="#fdbe00" />
          </View>
        )}
        {/* Camera Icon positioned at the bottom right */}
        <View
          style={{
            position: "absolute",
            bottom: 10, // Adjust as needed
            right: 10, // Adjust as needed
            // backgroundColor: "#193088", // Optional: background color for the icon
            backgroundColor: "#FFFFFF", // Optional: background color for the icon
            borderRadius: 20, // Optional: to make it circular
            // padding: 5, // Optional: padding around the icon
          }}
        >
          <TabBarIcon
            name="cancel" // Replace with your camera icon name
            size={20}
            color="#000000"
          />
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#343A46" : "#FFFFFF" }}>
      {/* <StatusBar backgroundColor={"white"} barStyle={"dark-content"} /> */}
      <View
        style={{
          backgroundColor: "whitesmoke",
          // height: 50,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          // margin: 10,
          // borderRadius: 10
        }}
      >
        {selectedUsersList.length !== 0 && (
          <FlashList
            //  onLoad={() => console.log("FlashList Loaded")}
            decelerationRate={0.92}
            estimatedListSize={{ height: 50, width: 50 }}
            // estimatedListSize={estimatedListSize}
            data={selectedUsersList || []}
            renderItem={renderItem}
            // keyExtractor={keyExtractor}
            // estimatedItemSize={50} // set closer to average actual height
            estimatedItemSize={50} // set closer to average actual height
            // extraData={selectedMessageIds}
            // inverted
            removeClippedSubviews
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets
            // showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal
            // contentContainerStyle={styles.contentContainer}
            // onEndReached={handleEndReached}
            onEndReachedThreshold={0.7}
            // ListEmptyComponent={ListEmptyComponent}
            // maintainVisibleContentPosition={{
            //   minIndexForVisible: 1,
            //   autoscrollToTopThreshold: 10,
            // }}
            // getItemType={() => "message"}
            // ref={flashListRef}
            // onViewableItemsChanged={onViewableItemsChanged}
            // viewabilityConfig={{
            //   itemVisiblePercentThreshold: 50,
            // }}
            keyExtractor={(item) => item._id.toString()}
          />
        )}
      </View>

      {info === "add_group_participants" && selectedUsersList.length > 0 && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Pressable
            onPress={handleAddGroupParticipants}
            android_ripple={{ color: "#0000001A" }}
            style={{
              backgroundColor: "#0077ff",
              minWidth: 120,
              borderRadius: 10,
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontFamily: "Dosis_600SemiBold",
              }}
            >
              Add
            </Text>
            <TabBarIcon name="groupAdd" size={25} color="#FFFFFF" />
            <Text
              style={{
                color: "#0077ff",
                fontSize: 14,
                backgroundColor: "#FFFFFF",
                paddingVertical: 2,
                paddingHorizontal: 10,
                borderRadius: 20,
                margin: 5,
                textAlign: "center",
              }}
            >
              {selectedUsersList.length}
            </Text>
          </Pressable>
        </View>
      )}

      <TextInput
        // style={styles.inputBar}
                      style={[styles.inputBar, {backgroundColor: !isDark ? "whitesmoke" : "#444E60"}]}
              keyboardAppearance= {isDark ?"dark": "light"}

        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        cursorColor={!isDark ?"#000000": "#FFFFFF"}
        label={<Text style={[styles.placeholder, {color: isDark ? 'white' : 'gray'}]}>Search users...</Text>}
        underlineStyle={{ display: "none" }}
        outlineStyle={styles.inputOutline}
        mode="outlined"
        right={
          searchQuery !== "" ? (
            <TextInput.Icon
              icon={() => <TabBarIcon name="cross" color= {!isDark ?"#000000": "#FFFFFF"} size={25} />}
              onPress={() => setSearchQuery("")}
            />
          ) : null
        }
        left={
          <TextInput.Icon
            icon={() => <TabBarIcon name="search"color= {!isDark ?"#000000": "#FFFFFF"} size={25} />}
            rippleColor={"transparent"}
          />
        }
      />

      {loadingSearchElements && searchQuery !== "" && (
        <ScrollView automaticallyAdjustKeyboardInsets>
          <SearchScreenElementsLoader />
        </ScrollView>
      )}

      {!loadingSearchElements &&
        searchResults.length === 0 &&
        searchQuery !== "" && (
          <ScrollView automaticallyAdjustKeyboardInsets>
            <NoSearchesFound />
          </ScrollView>
        )}
      {selectedUsersList.length === 0 && searchQuery == "" && (
        <ScrollView automaticallyAdjustKeyboardInsets>
          <AddParticipants />
        </ScrollView>
      )}

      {!loadingSearchElements && searchQuery !== "" && (
        <FlashList
          // data={['33', '4320', 'f33', '43d20', '33e', '43t20', '3sf3', '432s0', '3sf3f', '432ss0', '3sffs3', '432sfs0', 'sf', '432ssf0']}
          data={searchResults}
          renderItem={renderItemChooseParticipant}
          estimatedItemSize={60}
          keyExtractor={(item) => item._id.toString()}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputBar: {
    // paddingHorizontal: 12,
    // paddingVertical: 12,
    borderRadius: 10,
    // backgroundColor: "whitesmoke",
    // borderWidth: 2,
    borderColor: "whitesmoke",
    width: "80%",
    color: "#193088",
    marginHorizontal: "auto",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 20,
    // textAlign: "center",
    fontFamily: "Dosis_400Regular",
  },

  placeholder: {
    color: "gray",
    textAlign: "center",
  },
  inputOutline: {
    borderWidth: 0,
    borderRadius: 10,
    margin: 0,
    padding: 0,
  },
});
