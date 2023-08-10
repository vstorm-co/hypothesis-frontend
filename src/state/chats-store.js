import { initStore } from './store';

export const configureStore = () => {
  const actions = {
    SELECT_CHAT: (curState, chatId) => {
      const chatIndex = curState.chats.findIndex(c => c.id === chatId);
      const updatedChats = curState.chats.map(c => {
        return { ...c, selected: false };
      })
      updatedChats[chatIndex] = {
        ...curState.chats[chatIndex],
        selected: true,
      }

      return { chats: updatedChats }
    },
    EDIT_TITLE: (curState, payload) => {
      const chatIndex = curState.chats.findIndex(c => c.id === payload.chatId);
      const updatedChats = [...curState.chats];
      updatedChats[chatIndex] = {
        ...curState.chats[chatIndex],
        title: payload.newTitle,
      }

      return { chats: updatedChats };
    }
  };
  initStore(actions, {
    chats: [
      {
        id: 0,
        title: 'Hamlet explanation',
        selected: true,
      },
      {
        id: 1,
        title: 'Business ideas',
        selected: false,
      },
      {
        id: 2,
        title: 'Brown v. Board significance',
        selected: false,
      },
      {
        id: 3,
        title: 'Data science journey',
        selected: false,
      },
    ]
  });
};

