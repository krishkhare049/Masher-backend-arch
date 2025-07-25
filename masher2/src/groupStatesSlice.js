import { createSlice } from "@reduxjs/toolkit";

export const groupStatesSlice = createSlice({
  name: "groupStates",
  initialState: {
    groupConversationData: {},
    groupParticipantsData: [], // Initial state for participants data
  },
  reducers: {
    setGroupConversationData: (state, action) => {
      state.groupConversationData = action.payload;
    },
    setGroupParticipantsData: (state, action) => {
      state.groupParticipantsData = action.payload;
    },
  },
});
// Export the actions to be used in your components
export const { setGroupConversationData, setGroupParticipantsData } =
  groupStatesSlice.actions;

// Selector to get the user data from the state
export const selectGroupConversationData = (state) =>
  state.groupStates.groupConversationData;
export const selectGroupParticipantsData = (state) =>
  state.groupStates.groupParticipantsData;
// export const selectUnreadConversationsCount = (state) =>
//   state.chatScreenStates.unreadConversationsCount;

export default groupStatesSlice.reducer;
