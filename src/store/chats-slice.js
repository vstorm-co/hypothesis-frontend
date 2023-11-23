// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";
import { route } from 'preact-router';

const chatsSlice = createSlice({
  name: 'chats',
  initialState: {
    chats: [],
    size: 5,
    info: {
      total: 6,
    },
    organizationChats: [],
    currentChat: {
      name: null,
      uuid: null,
      messages: [],
    },
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
  }
});

export const chatsActions = chatsSlice.actions;

export default chatsSlice;

export const getChatsData = (payload) => {
  return async (dispatch, getState) => {

    let state = getState();
    let url = `${import.meta.env.VITE_API_URL}`;

    if (state.ui.searchFilters.visibility === 'all') {
      url = `${url}/chat/rooms?`
    } else if (state.ui.searchFilters.visibility === 'just_me') {
      url = `${url}/chat/rooms/?visibility=just_me`
    } else if (state.ui.searchFilters.visibility === 'organization') {
      if (state.user.currentUser.organization_uuid) {
        url = `${url}/chat/rooms/?visibility=organization&organization_uuid=${state.user.currentUser.organization_uuid}`
      } else {
        url = `${url}/chat/rooms/?visibility=just_me`
      }
    }

    if (state.ui.searchFilters.searchFor) {
      url = `${url}&name__like=${state.ui.searchFilters.searchFor}`;
    }

    if (state.chats.size) {
      url = `${url}&size=${state.chats.size}`;
    };

    url = `${url}&order_by=visibility,-created_at`;

    let today = new Date();
    let priorDate;

    if (state.ui.searchFilters.timeSpan != 'all') {
      if (state.ui.searchFilters.timeSpan === 'last_week') {
        priorDate = new Date(new Date().setDate(today.getDate() - 7));
        url = `${url}&created_at__gte=${priorDate.getFullYear()}-${priorDate.getMonth() < 9 ? `0${priorDate.getMonth() + 1}` : priorDate.getMonth() + 1}-${priorDate.getDate() < 10 ? `0${priorDate.getDate()}` : priorDate.getDate()}T00:00:00`

      } else if (state.ui.searchFilters.timeSpan === 'last_30_days') {
        priorDate = new Date(new Date().setDate(today.getDate() - 30));
        url = `${url}&created_at__gte=${priorDate.getFullYear()}-${priorDate.getMonth() < 9 ? `0${priorDate.getMonth() + 1}` : priorDate.getMonth() + 1}-${priorDate.getDate() < 10 ? `0${priorDate.getDate()}` : priorDate.getDate()}T00:00:00`

      } else if (state.ui.searchFilters.timeSpan === 'older') {
        priorDate = new Date(new Date().setDate(today.getDate() - 30));
        url = `${url}&created_at__lte=${priorDate.getFullYear()}-${priorDate.getMonth() < 9 ? `0${priorDate.getMonth() + 1}` : priorDate.getMonth() + 1}-${priorDate.getDate() < 10 ? `0${priorDate.getDate()}` : priorDate.getDate()}T00:00:00`

      }
    }



    const sendRequest = async () => {
      const data = await fetch(url, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser'))?.access_token}`,
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
    if (state.chats.currentChat.uuid) {
      // dispatch(selectChat(state.chats.currentChat.uuid));
    }
  }
}

export const createChat = (payload) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const data = await fetch(`${import.meta.env.VITE_API_URL}/chat/room`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser'))?.access_token}`,
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

export const cloneChat = (payload) => {
  return async (dispatch, getState) => {
    let state = getState();

    const sendRequest = async () => {
      const data = await fetch(`${import.meta.env.VITE_API_URL}/chat/clone-room/${payload.roomId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser'))?.access_token}`,
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({ message_id: payload.messageId ? payload.messageId : "" })
      }).then(res => res.json());

      return data;
    };

    const chat = await sendRequest();
    route(`/chats/${chat.chat.uuid}`);
    dispatch(getChatsData(chat.chat.uuid));
  }
}

export const selectChat = (payload) => {
  return async (dispatch, getState) => {
    let state = getState();

    console.log(state);

    if (payload != 0) {
      const sendRequest = async () => {
        const data = await fetch(`${import.meta.env.VITE_API_URL}/chat/room/${payload}`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser'))?.access_token}`,
            'Content-Type': 'application/json',

          },
        })
        if (data.status === 404) {
          route('/404');
        } else {
          return data.json();
        }
      };

      try {
        const chat = await sendRequest();
        dispatch(chatsActions.setCurrentChat(chat));
      } catch (err) {
        console.log(err);
        route('/404');
      }


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
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser'))?.access_token}`,
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