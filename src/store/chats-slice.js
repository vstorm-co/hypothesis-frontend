// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";

const chatsSlice = createSlice({
  name: 'chats',
  initialState: {
    chats: [
      {
        uuid: 0,
        name: 'How to Log In?',
        selected: false,
      },
    ],
    messages: [],
  },
  reducers: {
    editChat(state, action) {
      const chatIndex = state.chats.findIndex(c => c.uuid === action.payload.chatId);
      state.chats[chatIndex] = {
        ...state.chats[chatIndex],
        name: action.payload.name,
      }
    },
    setChats(state, action) {
      state.chats = action.payload;
    },
    setChatSelected(state, action) {
      state.chats.map(c => c.selected = false);
      const chatIndex = state.chats.findIndex(c => c.uuid === action.payload.chatId);
      state.chats[chatIndex].selected = true;
    },
    setMessages(state, action) {
      state.messages = action.payload;
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    concatDataToMsg(state, action) {
      state.messages[state.messages.length - 1].content += action.payload.data;
    }
  }
});

export const chatsActions = chatsSlice.actions;

export default chatsSlice;

export const getChatsData = (payload) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const data = await fetch(`${import.meta.env.VITE_API_URL}/chat/room/`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_user')).access_token}`,
          'Content-Type': 'application/json'
        },
      }).then(res => res.json());

      return data;
    };

    const chats = await sendRequest();

    dispatch(chatsActions.setChats(chats))

    if (payload) {
      dispatch(selectChat(payload));
    }
  }
}

export const createChat = (payload) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const data = await fetch(`${import.meta.env.VITE_API_URL}/chat/room/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_user')).access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: payload })
      }).then(res => res.json());

      return data;
    };

    const chat = await sendRequest();

    dispatch(getChatsData());
  }
}

export const selectChat = (payload) => {
  return async (dispatch) => {
    dispatch(chatsActions.setChatSelected({ chatId: payload }))
    const sendRequest = async () => {
      const data = await fetch(`${import.meta.env.VITE_API_URL}/chat/messages/?room_id=${payload}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_user')).access_token}`,
          'Content-Type': 'application/json'
        },
      }).then(res => res.json());

      return data;
    };

    const messages = await sendRequest();

    dispatch(chatsActions.setMessages(messages));
  }
}

export const updateChat = (payload) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const data = await fetch(`${import.meta.env.VITE_API_URL}/chat/room/${payload.chatId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_user')).access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: payload.name })
      }).then(res => res.json());

      return data;
    };

    const chat = await sendRequest();
    dispatch(chatsActions.editChat({ chatId: payload.chatId, name: payload.name }));
  }
}