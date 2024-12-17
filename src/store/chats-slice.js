// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";
import { route } from 'preact-router';
import { uiActions } from "./ui-slice";

import callApi from "../api";
import { getFiles } from "./files-slice";
import { userActions } from "./user-slice";

const chatsSlice = createSlice({
  name: 'chats',
  initialState: {
    chats: [],
    size: 100,
    info: {
      total: 6,
    },
    organizationChats: [],
    currentChat: {
      name: null,
      uuid: null,
      messages: [],
    },
    usersActive: [],
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
      state.info.total = action.payload.total;
    },
    setSize(state, action) {
      state.size = action.payload
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
    addUserActive(state, action) {
      if (!state.usersActive.find(u => (u.user_email === action.payload.user_email && u.room_id === action.payload.room_id))) {
        state.usersActive.push(action.payload);
      }
    },
    removeUserActive(state, action) {
      let index = state.usersActive.indexOf(state.usersActive.find(u => u.user_email === action.payload.user_email));
      if (index != -1) {
        state.usersActive.splice(index, 1);
      }
    }
  }
});

export const chatsActions = chatsSlice.actions;

export default chatsSlice;

export const getChatsData = (payload) => {
  return async (dispatch, getState) => {
    let state = getState();
    let url = ``;

    if (state.ui.searchFilters.visibility === 'all') {
      url = `${url}/chat/rooms?`
    } else if (state.ui.searchFilters.visibility === 'just_me') {
      url = `${url}/chat/rooms?visibility=just_me`
    } else if (state.ui.searchFilters.visibility === 'organization') {
      if (state.user.currentUser.organization_uuid) {
        url = `${url}/chat/rooms?visibility=organization&organization_uuid=${state.user.currentUser.organization_uuid}`
      } else {
        url = `${url}/chat/rooms?visibility=just_me`
      }
    }

    if (state.ui.searchFilters.searchFor) {
      url = `${url}&name__ilike=${state.ui.searchFilters.searchFor}`;
    }

    if (state.chats.size) {
      url = `${url}&size=${state.chats.size}`;
    };

    if (state.ui.searchFilters.sortBy) {
      url = `${url}&order_by=${state.ui.searchFilters.sortBy}`;
    } else {
      url = `${url}&order_by=visibility`;
    }


    try {
      const chats = await callApi(url);

      dispatch(chatsActions.setChats(chats));
      dispatch(getFiles());

      if (payload) {
        dispatch(selectChat(payload));
      }

      dispatch(uiActions.toggleChatsLoading(false))
    } catch (err) {
      console.log(err);
    }
  }
}

export const createChat = (payload) => {
  return async (dispatch) => {
    try {
      const chat = await callApi('/chat/room', {
        method: 'POST',
        body: JSON.stringify({ name: payload })
      });
      route(`/chats/${chat.uuid}`);
      dispatch(getChatsData(chat.uuid));
    } catch (err) {
      console.log(err);
    }

  }
}

export const cloneChat = (payload) => {
  return async (dispatch) => {
    try {
      const chat = await callApi(`/chat/clone-room/${payload.roomId}`, {
        method: 'POST',
        body: JSON.stringify({ message_id: payload.messageId ? payload.messageId : "" })
      });
      route(`/chats/${chat.chat.uuid}`);
      dispatch(getChatsData(chat.chat.uuid));
    } catch (err) {
      console.log(err);
    }
  }
}

export const selectChat = (payload) => {
  return async (dispatch, getState) => {
    let state = getState();
    try {
      const chat = await callApi(`/chat/room/${payload}?user_join=true`);
      console.log(state.user.currentUser);
      if (state.user.currentUser.access_token === null) {
        await dispatch(userActions.setGuestMode(true))
      }
      dispatch(chatsActions.setCurrentChat(chat));
    } catch (err) {
      console.log(err);
      route('/404');
    }
  }
}

export const updateChat = (payload) => {
  return async (dispatch) => {
    try {
      const chat = await callApi(`/chat/room/${payload.uuid}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      dispatch(getChatsData(payload.uuid));
    } catch (err) {
      console.log(err);
    }
  }
}

export const deleteChat = (payload) => {
  return async (dispatch) => {
    try {
      const response = await callApi(`/chat/room/${payload.chatId}`, {
        method: 'DELETE'
      });
      dispatch(getChatsData());
      dispatch(chatsActions.setCurrentChat({
        name: null,
        uuid: null,
        messages: [],
      }))
    } catch (err) {
      console.log(err);
    }
  }
}