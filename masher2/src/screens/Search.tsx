import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  StatusBar,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Appbar, Button, Dialog, Portal, Surface } from "react-native-paper";
import TabBarIcon from "../components/TabBarIcon";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../App";
import { RootStackParamList } from "../MainComponent";
import SearchListElement from "../components/SearchListElement";
import { axiosInstance } from "../utilities/axiosInstance";
import SearchScreenElementsLoader from "../loaders/SearchScreenElementsLoader";
import NoSearchHistoryFound from "../components/NoSearchHistoryFound";
import SearchHistoryElement from "../components/SearchHistoryElement";
import PressableIcon from "../components/PressableIcon";
import { FlashList } from "@shopify/flash-list";
import NoSearchesFound from "../components/NoSearchesFound";
import {
  setCurrentConversationId,
  setCurrentOtherParticipantId,
} from "../messageScreenStatesSlice";
import { useDispatch } from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTheme } from "../ThemeContext";

type SearchProps = NativeStackScreenProps<RootStackParamList, "Search">;

type searchResultsProps = {
  _id: string;
  full_name: string;
  profile_image_filename: { filename: string };
  // user_email: string;
};

type searchHistoryProps = {
  searched_user: {
    _id: string;
    profile_image_filename: { filename: string };
    full_name: string;
  };
  searchQueryId: string;
  searched_at: string;
};

export default function Search({ navigation }: SearchProps) {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
      const { colors, isDark } = useAppTheme();
  

  // const [searchResults, setSearchResults] = useState(data);
  const [searchResults, setSearchResults] = useState<searchResultsProps[]>([]);
  const [loadingSearchElements, setLoadingSearchElements] = useState(false);

  const [searchHistory, setSearchHistory] = useState<searchHistoryProps[]>([]);
  const [loadingSearchHistory, setLoadingSearchHistory] = useState(true);

  const [showSearchRemoveDialog, setShowSearchRemoveDialog] = useState(false);
  const [deleteSearchQueryId, setDeleteSearchQueryId] = useState("");
  const [deleteSearchQueryText, setDeleteSearchQueryText] = useState("");

  // useEffect(() => {
  //   // console.log("Search query changed: " + searchQuery);
  //   performSearch();
  // }, [searchQuery]);

  // Input debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      performSearch();
    }, 500); // Delay of 500ms

    return () => {
      clearTimeout(handler); // Clears previous timeout if the user types again
    };
  }, [searchQuery]);

  // const skip = useRef(0);
  // Load search history-
  const performSearch = () => {
    const query = searchQuery.trim() || "default";

    // console.log(searchQuery);

    setLoadingSearchElements(true);

    if (query === "default") {
      setSearchResults([]);
      return;
    }
    axiosInstance
      .get("/api/users/searchUserByName/" + query, { withCredentials: true })
      .then((response) => {
        // console.log(response.data);
        setSearchResults(response.data);

        setLoadingSearchElements(false);
      })
      .catch((error) => {
        console.log("Error" + error);
        setLoadingSearchElements(false);
      });
  };

  // Store only 15 searches max

  // const skip = useRef(0);
  const loadSearchHistory = () => {
    console.log("Loading search history");
    axiosInstance
      .get("/api/users/getUserSearchHistory", {
        withCredentials: true,
      })
      .then((response) => {
        // console.log(response.data);
        // console.log(response.data);
        setSearchHistory(response.data);

        setLoadingSearchHistory(false);
      })
      .catch((error) => {
        console.log("Error" + error);
        setLoadingSearchHistory(false);
      });
  };

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const addUserSearchHistory = async (userId: string) => {
    try {
      const value = await AsyncStorage.getItem("pauseSearchHistory");
      if (value === null || value === "false") {
        console.log("pauseSearchHistory value: " + value);
        // value previously stored
        axiosInstance
          .post(
            "/api/users/addUserSearchHistory",
            { searched_userId: userId },
            { withCredentials: true }
          )
          .then((response) => {
            console.log("Search history added: " + response.data);
            loadSearchHistory();
          })
          .catch((error) => {
            console.log("Error" + error);
          });
      }
    } catch (e) {
      console.log("Error in addUserSearchHistory: " + e);
    }
  };

  const hideRemoveSearchDialog = () => setShowSearchRemoveDialog(false);

  

  const deleteSearchHistoryItem = () => {
    console.log("Deleting search history");

    axiosInstance
      .post(
        "/api/users/deleteSearchElement",
        { searchQueryId: deleteSearchQueryId },
        { withCredentials: true }
      )
      .then((response) => {
        console.log("Search history deleted: " + response.data);
        // loadSearchHistory();

        // Exclude the following search history element-
        setDeleteSearchQueryText("");
        setDeleteSearchQueryId("");
        setSearchHistory(
          searchHistory.filter(
            (item) => item.searchQueryId !== deleteSearchQueryId
          )
        );
      })
      .catch((error) => {
        console.log("Error" + error);
      });
  };


  const renderSearchHistoryItem = useCallback(
    ({ item }: { item: any }) => {
      // const renderItem = ({ item }: { item: any })=> {
      return (
        <SearchHistoryElement
          name={item.searched_user.full_name}
          profileImageUrl={item.searched_user.profile_image_filename.filename}
          searchQueryId={item.searchQueryId}
          searchedAt={item.searched_at}
          onClick={() => {
            // navigation.push("MessagingScreen", {

            // Add this is search query-
            addUserSearchHistory(item.searched_user._id);

            dispatch(
              setCurrentConversationId(
                "find_through_page_using_otherParticipant"
              )
            );
            dispatch(setCurrentOtherParticipantId(item.searched_user._id));

            navigation.navigate("MessagingScreen", {
              conversationId: "find_through_page_using_otherParticipant",
              otherParticipantId: item.searched_user._id,
              otherParticipantName: item.searched_user.full_name,
              isGroup: item.searched_user.isGroup || false,
              imageUrl: item.searched_user.profile_image_filename.filename,
            });
          }}
          onLongPress={() => {
            // console.log('Long press')
            // console.log(item.searchQueryId);
            setShowSearchRemoveDialog(true);
            setDeleteSearchQueryText(item.searched_user.full_name);
            setDeleteSearchQueryId(item.searchQueryId);
          }}
        />
      );
    },
    // [selectedMessageIds, isMessMenuVisible]
    []
  );
  const renderSearchListItem = useCallback(
    ({ item }: { item: any }) => {
      // const renderItem = ({ item }: { item: any })=> {
      console.log(item);
      return (
        <SearchListElement
          name={item.full_name}
          profileImageUrl={item.profile_image_filename.filename}
          onClick={() => {
            // navigation.push("MessagingScreen", {

            // Add this is search query-
            addUserSearchHistory(item._id);
            dispatch(
              setCurrentConversationId(
                "find_through_page_using_otherParticipant"
              )
            );
            dispatch(setCurrentOtherParticipantId(item._id));

            navigation.navigate("MessagingScreen", {
              conversationId: "find_through_page_using_otherParticipant",
              otherParticipantId: item._id,
              otherParticipantName: item.full_name,
              isGroup: item.isGroup || false,
              imageUrl: item.profile_image_filename.filename,
            });
          }}
        />
      );
    },
    // [selectedMessageIds, isMessMenuVisible]
    []
  );

  return (
    // <View style={{ backgroundColor: "#fdbe00", flex: 1 }}>
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      {/* <StatusBar backgroundColor={"white"} barStyle={"dark-content"} /> */}
      {/* <Surface
        elevation={1}
        style={{
          // flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          paddingVertical: 5,
          backgroundColor: "white",
          zIndex: 2,
          borderTopStartRadius: 40,
          borderTopEndRadius: 40,
          marginTop: 10,
          paddingTop: 20
        }}
      > */}
      <View
        style={{
          // iOS shadow
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          // Android shadow
          elevation: 5,

          // flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          paddingVertical: 5,
          // backgroundColor: "white",
    backgroundColor: !isDark ?"white": '#343A46',

          zIndex: 2,
          borderTopStartRadius: 40,
          borderTopEndRadius: 40,
          marginTop: 10,
          paddingTop: 20,
        }}
      >
        {/* <Appbar.BackAction
          color={"#193088"}
          onPress={() => navigation.goBack()}
          style={{marginLeft: -5}}
        /> */}

        <TabBarIcon name="search" color={!isDark?"#193088": 'whitesmoke' }size={24} />

        <TextInput
          style={[styles.inputBar, {backgroundColor: !isDark?"whitesmoke": '#536076', color: colors.text}]}
          placeholder="Search friends, people..."
          placeholderTextColor={!isDark?"gray": 'gainsboro'}
          value={searchQuery}
          // onChangeText={setSearchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          cursorColor={!isDark?"#193088": 'whitesmoke'}
        />

        {searchQuery !== "" ? (
          <PressableIcon
            iconName="cross"
            // iconColor="#000000"
            iconColor={!isDark?"#000000": 'whitesmoke' }
            rippleColor=""
            iconSize={25}
            customStyle={{
              padding: 5,
              borderRadius: 50,
              // backgroundColor: "whitesmoke",
              backgroundColor: !isDark?"whitesmoke": '#536076',

            }}
            onClick={() => setSearchQuery("")}
            disabled={false}
          />
        ) : (
          <PressableIcon
            iconName="mic"
            // iconColor="#193088"
            iconColor={!isDark?"#193088": 'whitesmoke' }

            rippleColor=""
            iconSize={25}
            customStyle={{
              padding: 5,
              borderRadius: 50,
              // backgroundColor: "whitesmoke",
              backgroundColor: !isDark?"whitesmoke": '#536076',
              
            }}
            onClick={() => setSearchQuery("")}
            disabled={false}
          />
        )}
      </View>

      <View style={{  flex: 1,
    backgroundColor: !isDark ?"white": '#343A46',
    zIndex: 1,}}>
        {/* For loading searches */}
        {loadingSearchElements && searchQuery !== "" && (
          <ScrollView automaticallyAdjustKeyboardInsets>
            <SearchScreenElementsLoader />
          </ScrollView>
        )}

        {/* For loading search history */}
        {loadingSearchHistory && !loadingSearchElements && (
          <ScrollView automaticallyAdjustKeyboardInsets>
            <SearchScreenElementsLoader />
          </ScrollView>
        )}

        {!loadingSearchHistory &&
          searchHistory.length === 0 &&
          searchQuery === "" && (
            <ScrollView automaticallyAdjustKeyboardInsets>
              <NoSearchHistoryFound />
            </ScrollView>
          )}

        {!loadingSearchElements &&
          searchResults.length === 0 &&
          searchQuery !== "" && (
            <ScrollView automaticallyAdjustKeyboardInsets>
              <NoSearchesFound />
            </ScrollView>
          )}

        {searchQuery === "" ? (
          <FlashList
            // automaticallyAdjustKeyboardInsets
            // initialNumToRender={20}
            keyboardShouldPersistTaps="handled"
            estimatedItemSize={30}
            data={searchHistory}
            renderItem={renderSearchHistoryItem}
            keyExtractor={(item) => item.searchQueryId.toString()}
          />
        ) : (
          !loadingSearchElements && (
            <FlashList
              keyboardShouldPersistTaps="handled"
              // automaticallyAdjustKeyboardInsets
              // initialNumToRender={20}
              estimatedItemSize={30}
              data={searchResults}
              renderItem={renderSearchListItem}
              keyExtractor={(item) => item._id.toString()}
            />
          )
        )}
      </View>

      <Portal>
        <Dialog
          visible={showSearchRemoveDialog}
          onDismiss={hideRemoveSearchDialog}
          style={{ backgroundColor: "white", borderRadius: 20 }}
        >
          <Dialog.Title
            style={{
              fontFamily: "Dosis_700Bold",
              textAlign: "center",
            }}
          >
            Remove
          </Dialog.Title>
          <Dialog.Content>
            <Text
              style={{
                fontFamily: "Dosis_400Regular",
                textAlign: "center",
                fontSize: 17,
              }}
            >
              {deleteSearchQueryText} from search history
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              style={{ backgroundColor: "white", borderRadius: 10 }}
              onPress={hideRemoveSearchDialog}
            >
              <Text style={{ color: "#000000", fontFamily: "Dosis_700Bold" }}>
                Cancel
              </Text>
            </Button>
            <Button
              style={{ backgroundColor: "#007bff", borderRadius: 10 }}
              onPress={() => {
                deleteSearchHistoryItem();
                hideRemoveSearchDialog();
              }}
            >
              <Text style={{ fontFamily: "Dosis_700Bold", color: "#FFFFFF" }}>
                Remove
              </Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  inputBar: {
    // backgroundColor: "white",
    // borderBottomWidth: 1,
    borderRadius: 10,
    padding: 10,
    borderColor: "gainsboro",
    width: "65%",
    color: "#193088",
    fontSize: 18,
    marginBottom: 5,
    fontFamily: "Dosis_500Medium",
  },
});
