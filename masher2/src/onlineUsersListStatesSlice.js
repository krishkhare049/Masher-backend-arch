import { createSlice } from "@reduxjs/toolkit";

export const onlineUsersListStatesSlice = createSlice({
  name: "onlineUsersListStates",
  initialState: {
    onlineUsers: [], // Initial state for selected conversation IDs
  },
  reducers: {
    // You can add more reducers as needed, for example, to clear user data
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    pushOnlineUser: (state, action) => {
      // state.selectedMessageIds = action.payload;
      state.onlineUsers.push(action.payload); // Add the new message ID to the array
    },
    removeOnlineUser: (state, action) => {
      // state.selectedMessageIds = action.payload;
      // state.selectedMessageIds.pop(action.payload); // Add the new message ID to the array
      
      const idToRemove = action.payload; // Get the ID to remove from the action payload
      state.onlineUsers = state.onlineUsers.filter(
        (item) => item._id !== idToRemove
      );
      // state.selectedMessageIds.(action.payload); // Add the new message ID to the array
    },
  },
});
// Export the actions to be used in your components
export const {
  setOnlineUsers,
  pushOnlineUser,
  removeOnlineUser
} = onlineUsersListStatesSlice.actions;

// Selector to get the user data from the state
export const selectOnlineUsersList = (state) =>
  state.onlineUsersListStates.onlineUsers;

export default onlineUsersListStatesSlice.reducer;
