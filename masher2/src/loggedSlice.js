// import { createSlice } from '@reduxjs/toolkit';

// export const loggedSlice = createSlice({
//   name: 'logged',
//   initialState: {
//     value: null,
//   },
//   reducers: {
//     // increment: (state) => {
//     //   state.value += 1;
//     // },
//     // decrement: (state) => {
//     //   state.value -= 1;
//     // },
//     setLoggedIn: (state)=>{
//         state.value = true
//     },
//     setLoggedOut: (state)=>{
//         state.value = false
//     }
//   },
// });
// // export const { increment, decrement } = loggedSlice.actions;
// export const { setLoggedIn, setLoggedOut } = loggedSlice.actions;

// export const selectLogged = (state) => state.logged.value;

// export default loggedSlice.reducer;

import { createSlice, configureStore } from '@reduxjs/toolkit';

// Create the slice
export const loggedSlice = createSlice({
  name: 'logged',
  initialState: {
    value: null,
  },
  reducers: {
    setLoggedIn: (state) => {
      state.value = true;
    },
    setLoggedOut: (state) => {
      state.value = false;
    },
  },
});

export const { setLoggedIn, setLoggedOut } = loggedSlice.actions;

export const selectLogged = (state) => state.logged.value;

export default loggedSlice.reducer;


// Create a custom middleware to trigger the function when actions are dispatched
// const loginMiddleware = store => next => action => {
//   if (action.type === 'logged/setLoggedIn') {
//     console.log('User logged in, running function...');
//     // myFunction(loggedIn); // Trigger the function on login

//     // My function that needs to be triggered on login/logout

//   }

//   if (action.type === 'logged/setLoggedOut') {
//     console.log('User logged out, running function...');
//     // myFunction(loggedOut); // Trigger the function on logout

//      // My function that needs to be triggered on login/logout
//   }

//   return next(action); // Forward the action to the reducer
// };

// // Setup the Redux store with the middleware
// export const store = configureStore({
//   reducer: {
//     logged: loggedSlice.reducer,
//   },
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loginMiddleware), // Apply the middleware
// });
