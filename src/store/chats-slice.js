// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";

const chatsSlice = createSlice({
  name: 'chats',
  initialState: {
    chats: [
      {
        id: 0,
        name: 'How to Log In?',
        selected: false,
      },
    ]
  },
  reducers: {
    editChat(state, action) {
      const chatIndex = state.chats.findIndex(c => c.id === action.payload.chatId);
      state.chats[chatIndex] = {
        ...state.chats[chatIndex],
        title: action.payload.newTitle,
      }
    },
    setChats(state, action) {
      state.chats = action.payload;
    }
  }
});

export const chatsActions = chatsSlice.actions;

export default chatsSlice;

export const getChatsData = () => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const data = await fetch('https://api.projectannotation.testapp.ovh/chat/room/', {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjk0NTU3OTIxLCJpc19hZG1pbiI6ZmFsc2V9.SOp36tGArSAg7WCyLGweI5CK7B6HaaaU-0FtpoXnHb0`,
          'Content-Type': 'application/json'
        },
      }).then(res => res.json());

      return data;
    };

    const chats = await sendRequest();

    dispatch(chatsActions.setChats(chats))
  }
}