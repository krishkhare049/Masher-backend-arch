import { createSlice } from "@reduxjs/toolkit";

export const chatScreenStatesSlice = createSlice({
  name: "chatScreenStates",
  initialState: {
    filterBy: "", // Initial state for filter by group
    moreIconMenuVisible: false,
    chatScreenPageCount: 0, // Initial state for page count,
    isConvMenuVisible: false, // Initial state for mess menu visibility
    loadingChats: false, // Initial state for loading messages,
    selectedConversationsIds: [], // Initial state for selected conversation IDs
    unreadConversationsCount: 0, // For chat icon badge number
  },
  reducers: {
    setFilterBy: (state, action) => {
      state.filterBy = action.payload; // Set the state value to the payload object
    },
    setMoreIconMenuVisible: (state, action) => {
      state.moreIconMenuVisible = action.payload;
    },
    // Numeric counter reducers
    setChatScreenPageCount: (state, action) => {
      state.messagingScreenPageCount = action.payload; // Set the page count
    },
    setIsConvMenuVisible: (state, action) => {
      state.isConvMenuVisible = action.payload; // Set the state value to the payload object
    },
    setLoadingChats: (state, action) => {
      state.loadingChats = action.payload; // Set the state value to the payload object
    },
    // You can add more reducers as needed, for example, to clear user data
    setSelectedConversationIds: (state, action) => {
      state.selectedConversationsIds = action.payload;
    },
    pushSelectedConversationId: (state, action) => {
      // state.selectedMessageIds = action.payload;
      state.selectedConversationsIds.push(action.payload); // Add the new message ID to the array
    },
    removeSelectedConversationId: (state, action) => {
      // state.selectedMessageIds = action.payload;
      // state.selectedMessageIds.pop(action.payload); // Add the new message ID to the array
      
      const idToRemove = action.payload; // Get the ID to remove from the action payload
      state.selectedConversationsIds = state.selectedConversationsIds.filter(
        (item) => item !== idToRemove
      );
      // state.selectedMessageIds.(action.payload); // Add the new message ID to the array
    },
    setUnreadConversationsCount: (state, action) => {
      // state.selectedMessageIds = action.payload;
      state.unreadConversationsCount = action.payload; // Add the new message ID to the array
    },
  },
});
// Export the actions to be used in your components
export const {
  setFilterBy,
  setMoreIconMenuVisible,
  setChatScreenPageCount,
  setIsConvMenuVisible,
  setLoadingChats,
  setSelectedConversationIds,
  pushSelectedConversationId,
  removeSelectedConversationId,
  setUnreadConversationsCount
} = chatScreenStatesSlice.actions;

// Selector to get the user data from the state
export const selectFilterBy = (state) => state.chatScreenStates.filterBy;
export const selectMoreIconMenuVisible = (state) =>
  state.chatScreenStates.moreIconMenuVisible;
export const selectChatScreenPageCount = (state) =>
  state.chatScreenStates.chatScreenPageCount;
export const selectIsConvMenuVisible = (state) =>
  state.chatScreenStates.isConvMenuVisible;
export const selectLoadingMessages = (state) =>
  state.chatScreenStates.loadingChats;
export const selectSelectedConversationIds = (state) =>
  state.chatScreenStates.selectedConversationsIds;
export const selectUnreadConversationsCount = (state) =>
  state.chatScreenStates.unreadConversationsCount;

export default chatScreenStatesSlice.reducer;
