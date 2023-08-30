// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";

let user = JSON.parse(localStorage.getItem('ANT_user'));

const userSlice = createSlice({
  name: 'user',
  initialState: user ? user : { access_token: null },
  reducers: {
    setUser(state, action) {
      console.log(action);
      state.access_token = action.payload.access_token;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.picture = action.payload.picture;

      localStorage.setItem('ANT_user', JSON.stringify({ ...state }));
    },
  }
});

export const userActions = userSlice.actions;

export default userSlice;

// export const getChatsData = () => {
//   return async (dispatch) => {
//     const sendRequest = async () => {
//       const data = await fetch('https://api.projectannotation.testapp.ovh/chat/room/', {
//         headers: {
//           Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjk0NTU3OTIxLCJpc19hZG1pbiI6ZmFsc2V9.SOp36tGArSAg7WCyLGweI5CK7B6HaaaU-0FtpoXnHb0`,
//           'Content-Type': 'application/json'
//         },
//       }).then(res => res.json());

//       return data;
//     };

//     const chats = await sendRequest();

//     dispatch(chatsActions.setChats(chats))
//   }
// }