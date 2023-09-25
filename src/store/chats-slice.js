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
    organizationChats: [],
    currentChat: {
      name: null,
      uuid: null,
      messages: [],
    }
  },
  reducers: {
    editChat(state, action) {
      state.currentChat = { ...state.currentChat, ...action.payload };
      const chatIndex = state.chats.findIndex(c => c.uuid === action.payload.uuid);
      state.chats[chatIndex] = {
        ...state.chats[chatIndex],
        ...action.payload
      }
    },
    setChats(state, action) {
      state.chats = action.payload;
    },
    setOrganizationChats(state, action) {
      state.organizationChats = action.payload;
    },
    setChatSelected(state, action) {
      state.chats.map(c => c.selected = false);
      const chatIndex = state.chats.findIndex(c => c.uuid === action.payload.chatId);
      state.chats[chatIndex].selected = true;
    },
    setCurrentChat(state, action) {
      if (action.payload.uuid === 0) {
        state.currentChat = { ...state.chats[0] };
      } else {
        state.currentChat = action.payload;
      }
    },
    addMessage(state, action) {
      state.currentChat.messages.push(action.payload);
    },
    concatDataToMsg(state, action) {
      state.currentChat.messages[state.currentChat.messages.length - 1].content += action.payload.data;
    }
  }
});

export const chatsActions = chatsSlice.actions;

export default chatsSlice;

export const getChatsData = (payload) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const data = await fetch(`${import.meta.env.VITE_API_URL}/chat/rooms/`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser')).access_token}`,
          'Content-Type': 'application/json'
        },
      }).then(res => res.json());

      return data;
    };

    const chats = await sendRequest();

    if (chats.length === 0) {
      chats.push({
        name: 'Your First Chat',
        uuid: 0,
        messages: [
          {
            created_by: "bot",
            content: `Welcome, start your first chat with me by entering a prompt below.`
          }
        ]
      })
    };

    dispatch(chatsActions.setChats(chats))

    if (payload) {
      dispatch(selectChat(payload));
    }
  }
}

export const getOrganizationChatsData = (payload) => {
    return async (dispatch) => {
        const sendRequest = async () => {
        const data = await fetch(`${import.meta.env.VITE_API_URL}/chat/organization-rooms/${payload}`, {
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser')).access_token}`,
              'Content-Type': 'application/json'
              },
          }).then(res => res.json());

          return data;
        };

        const chats = await sendRequest();
        dispatch(chatsActions.setOrganizationChats(chats));
    }
}

export const createChat = (payload) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const data = await fetch(`${import.meta.env.VITE_API_URL}/chat/room/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser')).access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: payload })
      }).then(res => res.json());

      return data;
    };

    const chat = await sendRequest();
    dispatch(getChatsData(chat.uuid));
  }
}

export const selectChat = (payload) => {
  return async (dispatch) => {
    if (payload != 0) {
      const sendRequest = async () => {
        const data = await fetch(`${import.meta.env.VITE_API_URL}/chat/room/${payload}`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser')).access_token}`,
            'Content-Type': 'application/json'
          },
        }).then(res => res.json());

        return data;
      };

      const chat = await sendRequest();

      dispatch(chatsActions.setCurrentChat(chat));
    } else {
      {
        dispatch(chatsActions.setCurrentChat({ uuid: 0 }));
      }
    }
  }
}

export const updateChat = (payload) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const data = await fetch(`${import.meta.env.VITE_API_URL}/chat/room/${payload.uuid}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser')).access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }).then(res => res.json());

      return data;
    };

    const chat = await sendRequest();
    dispatch(chatsActions.editChat(payload));
  }
}

export const deleteChat = (payload) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const data = await fetch(`${import.meta.env.VITE_API_URL}/chat/room/${payload.chatId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser')).access_token}`,
          'Content-Type': 'application/json'
        },
      }).then(res => res.json());

      return data;
    };

    const response = await sendRequest();
    dispatch(getChatsData());
    dispatch(chatsActions.setCurrentChat({}))
  }
}