import { configureStore } from "@reduxjs/toolkit";
import loggedReducer from "./loggedSlice";
import userDataReducer from "./userDataSlice";
import uiReducer from "./uiSlice";
import messageScreenStatesReducer from "./messageScreenStatesSlice";
import chatScreenStatesReducer from "./chatScreenStatesSlice";
import onlineUsersListStatesReducer from "./onlineUsersListStatesSlice";
import selectedUsersListStatesReducer from "./selectedUsersListSlice";
import groupStatesReducer from "./groupStatesSlice";

export const store = configureStore({
  reducer: {
    logged: loggedReducer,
    userData: userDataReducer,
    ui: uiReducer,
    messageScreenStates: messageScreenStatesReducer,
    chatScreenStates: chatScreenStatesReducer,
    onlineUsersListStates: onlineUsersListStatesReducer,
    selectedUsersListStates: selectedUsersListStatesReducer,
    groupStates: groupStatesReducer
  },
});
