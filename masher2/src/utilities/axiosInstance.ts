import axios from "axios";

let API_URL = process.env.EXPO_PUBLIC_API_URL;

// Create an Axios instance with a base URL
console.log("k:" + API_URL);
export const axiosInstance = axios.create({
  // baseURL: 'http://192.168.194.88:5000', // Replace with your API base URL
  baseURL: API_URL, // Replace with your API base URL
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // console.log('response')
    // console.log(response)
    // Do something with response data
    // if (response.data === 'log_in_to_access_data') {

    //     const dispatch = useDispatch();
    //       // Handle specific response condition
    //       // console.log('Handling specific response:', response.data);

    //       SecureStore.deleteItemAsync("secure_token");

    //       // Remove global authorization header-
    //        // Set the global authorization header
    //        axiosInstance.defaults.headers.common['Authorization'] = undefined;

    //       dispatch(setLoggedOut());

    //   }
      return response; // Always return the response
  },
  (error) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      console.error('Error response:', error.response);
      return Promise.reject(error); // Always reject the error
  }
);
