import { createSlice } from '@reduxjs/toolkit';

export const userDataSlice = createSlice({
  name: 'userData',
  initialState: {
    value: {},
  },
  reducers: {
  // This reducer will set the user data to the provided object
  setUserData: (state, action) => {
    state.value = action.payload; // Set the state value to the payload object
  },
  // You can add more reducers as needed, for example, to clear user data
  clearUserData: (state) => {
    state.value = {}; // Reset the user data to an empty object
  },
},
});
// Export the actions to be used in your components
export const { setUserData, clearUserData } = userDataSlice.actions;

// Selector to get the user data from the state
export const selectUserData = (state) => state.userData.value;

export default userDataSlice.reducer;