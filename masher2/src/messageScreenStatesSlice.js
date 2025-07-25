import { createSlice } from "@reduxjs/toolkit";

export const messageScreenStatesSlice = createSlice({
  name: "messageScreenStates",
  initialState: {
    currentConversationId: "", // Initial state for current conversation ID
    currentOtherParticipantId: "", // Initial state for current other participant ID
    isMessMenuVisible: false, // Initial state for mess menu visibility
    messagingScreenPageCount: 0, // Initial state for page count
    loadingMessages: false, // Initial state for loading messages,
    selectedMessageIds: [], // Initial state for selected message IDs
    currentStickyHeaderDate: "", // Initial state for current sticky header date
  },
  reducers: {
    // This reducer will set the user data to the provided object
    setCurrentConversationId: (state, action) => {
      state.currentConversationId = action.payload; // Set the state value to the payload object
    },
    setCurrentOtherParticipantId: (state, action) => {
      state.currentOtherParticipantId = action.payload; // Set the state value to the payload object
    },

    setIsMessMenuVisible: (state, action) => {
      state.isMessMenuVisible = action.payload; // Set the state value to the payload object
    },
    // You can add more reducers as needed, for example, to clear user data
    setSelectedMessageIds: (state, action) => {
      state.selectedMessageIds = action.payload;
    },
    pushSelectedMessageId: (state, action) => {
      // state.selectedMessageIds = action.payload;
      state.selectedMessageIds.push(action.payload); // Add the new message ID to the array
    },
    removeSelectedMessageId: (state, action) => {
      // state.selectedMessageIds = action.payload;
      // state.selectedMessageIds.pop(action.payload); // Add the new message ID to the array

      const idToRemove = action.payload.messageId; // Get the ID to remove from the action payload
  state.selectedMessageIds = state.selectedMessageIds.filter(item => item.messageId !== idToRemove);
      // state.selectedMessageIds.(action.payload); // Add the new message ID to the array
    },

    // Numeric counter reducers
    setMessagingScreenPageCount: (state, action) => {
      state.messagingScreenPageCount = action.payload; // Set the page count
    },
    setLoadingMessages: (state, action) => {
      state.loadingMessages = action.payload; // Set the page count
    },
    
    setCurrentStickyHeaderDate: (state, action) => {
      state.currentStickyHeaderDate = action.payload; // Set the page count
    },
  },
});
// Export the actions to be used in your components
export const {
  setIsMessMenuVisible,
  setSelectedMessageIds,
  pushSelectedMessageId,
  removeSelectedMessageId,
  setMessagingScreenPageCount,
  setLoadingMessages,
  setCurrentConversationId,
  setCurrentOtherParticipantId,
  setCurrentStickyHeaderDate
} = messageScreenStatesSlice.actions;

// Selector to get the user data from the state
export const selectIsMessMenuVisible = (state) => state.messageScreenStates.isMessMenuVisible;

export const selectSelectedMessageIds = (state) => state.messageScreenStates.selectedMessageIds;

export const selectMessagingScreenPageCount = (state) => state.messageScreenStates.messagingScreenPageCount;
export const selectLoadingMessages = (state) => state.messageScreenStates.loadingMessages;

export const selectCurrentConversationId = (state) => state.messageScreenStates.currentConversationId;
export const selectCurrentOtherParticipantId = (state) => state.messageScreenStates.currentOtherParticipantId;

export const selectCurrentStickyHeaderDate = (state) => state.messageScreenStates.currentStickyHeaderDate;

export default messageScreenStatesSlice.reducer;
