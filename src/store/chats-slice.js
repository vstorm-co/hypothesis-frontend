// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";
import { route } from 'preact-router';

const chatsSlice = createSlice({
  name: 'chats',
  initialState: {
    chats: [],
    organizationChats: [],
    currentChat: {
      name: null,
      uuid: null,
      messages: [],
    },
    searchFilters: {
      visibility: 'all',
      searchFor: '',
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
      state.chats = action.payload.items;
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
      state.currentChat = action.payload;
    },
    addMessage(state, action) {
      state.currentChat.messages.push(action.payload);
    },
    concatDataToMsg(state, action) {
      state.currentChat.messages[state.currentChat.messages.length - 1].content += action.payload.data;
    },
    setFiltersVisibility(state, action) {
      state.searchFilters.visibility = action.payload.visibility;
    },
    setFiltersSearch(state, action) {
      state.searchFilters.searchFor = action.payload.searchFor;
    }
  }
});

export const chatsActions = chatsSlice.actions;

export default chatsSlice;

export const getChatsData = (payload) => {
  return async (dispatch, getState) => {

    let state = getState();
    let url = `${import.meta.env.VITE_API_URL}`;

    if (state.chats.searchFilters.visibility === 'all') {
      if (state.user.currentUser.organization_uuid) {
        url = `${url}/chat/rooms/?organization_uuid=${state.user.currentUser.organization_uuid}`
      } else {
        url = `${url}/chat/rooms/?visibility=just_me`
      }
    } else if (state.chats.searchFilters.visibility === 'just_me') {
      url = `${url}/chat/rooms/?visibility=just_me`
    } else if (state.chats.searchFilters.visibility === 'organization') {
      if (state.user.currentUser.organization_uuid) {
        url = `${url}/chat/rooms/?visibility=organization&organization_uuid=${state.user.currentUser.organization_uuid}`
      } else {
        url = `${url}/chat/rooms/?visibility=just_me`
      }
    }

    if (state.chats.searchFilters.searchFor) {
      url = `${url}&name__like=${state.chats.searchFilters.searchFor}`;
    }


    const sendRequest = async () => {
      const data = await fetch(url, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser')).access_token}`,
          'Content-Type': 'application/json',
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

export const getOrganizationChatsData = (payload) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const data = await fetch(`${import.meta.env.VITE_API_URL}/chat/organization-rooms/${payload}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser')).access_token}`,
          'Content-Type': 'application/json',

        },
      }).then(res => res.json());

      console.log(data);
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
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({ name: payload })
      }).then(res => res.json());

      return data;
    };

    const chat = await sendRequest();
    route(`/chats/${chat.uuid}`);
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
            'Content-Type': 'application/json',

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
    let user = JSON.parse(localStorage.getItem('ANT_currentUser'));
    const sendRequest = async () => {
      const data = await fetch(`${import.meta.env.VITE_API_URL}/chat/room/${payload.uuid}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          'Content-Type': 'application/json',

        },
        body: JSON.stringify(payload)
      }).then(res => res.json());

      return data;
    };

    const chat = await sendRequest();
    dispatch(getChatsData(payload.uuid));
  }
}

export const deleteChat = (payload) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const data = await fetch(`${import.meta.env.VITE_API_URL}/chat/room/${payload.chatId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser')).access_token}`,
          'Content-Type': 'application/json',

        },
      }).then(res => res.json());

      return data;
    };

    const response = await sendRequest();
    dispatch(getChatsData());
    dispatch(chatsActions.setCurrentChat({}))
  }
}