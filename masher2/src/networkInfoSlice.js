import { createSlice } from '@reduxjs/toolkit';

export const networkInfoSlice = createSlice({
  name: 'networkInfo',
  initialState: {
    value: null,
  },
  reducers: {
  // This reducer will set the user data to the provided object
  setNetworkInfo: (state, action) => {
    state.value = action.payload; // Set the state value to the payload object
  },
  // You can add more reducers as needed
},
});
// Export the actions to be used in your components
export const { setNetworkInfo } = networkInfoSlice.actions;

// Selector to get the user data from the state
export const selectNetworkInfo = (state) => state.networkInfo.value;

export default networkInfoSlice.reducer;