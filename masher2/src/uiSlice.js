import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isTabBarVisible: true, // Initial state for tab bar visibility
  },
  reducers: {
    showTabBar: (state) => {
      state.isTabBarVisible = true; // Set the tab bar visibility to true
    },
    hideTabBar: (state) => {
      state.isTabBarVisible = false; // Set the tab bar visibility to false
    },
  },
});
// Export the actions to be used in your components
export const { showTabBar, hideTabBar } = uiSlice.actions;

// Selector to get the user data from the state
export const selectIsTabBarVisible = (state) => state.ui.isTabBarVisible;

export default uiSlice.reducer;
