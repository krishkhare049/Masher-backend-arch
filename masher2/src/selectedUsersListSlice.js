import { createSlice } from "@reduxjs/toolkit";

export const selectedUsersListSlice = createSlice({
  name: "selectedUsersListStates",
  initialState: {
    users: [], // Initial state for selected conversation IDs
  },
  reducers: {
    // You can add more reducers as needed, for example, to clear user data
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    // pushUser: (state, action) => {
    toggleUser: (state, action) => {
      // state.selectedMessageIds = action.payload;
      let checkifAlreadyExist = state.users.some(
        // (convId) => convId.conversationId === newConversationId
        (item) => item._id === action.payload._id
      );

      if(!checkifAlreadyExist){

        state.users.push(action.payload); // Add the new message ID to the array
      }
      else{
        state.users = state.users.filter(
          (item) => item._id !== action.payload._id
        );
      }
    },
    removeUser: (state, action) => {
      // state.selectedMessageIds = action.payload;
      // state.selectedMessageIds.pop(action.payload); // Add the new message ID to the array
      
      const idToRemove = action.payload; // Get the ID to remove from the action payload
      state.users = state.users.filter(
        (item) => item._id !== idToRemove
      );
      // state.selectedMessageIds.(action.payload); // Add the new message ID to the array
    },
  },
});
// Export the actions to be used in your components
export const {
  setUsers,
  // pushUser,
  toggleUser,
  removeUser
} = selectedUsersListSlice.actions;

// Selector to get the user data from the state
export const selectSelectedUsersList = (state) =>
  state.selectedUsersListStates.users;

export default selectedUsersListSlice.reducer;
