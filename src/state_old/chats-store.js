import { initStore } from './store';

export const configureStore = () => {
  const actions = {
    SET_CHATS: (curState, payload) => {
      return new Promise((resolve, reject) => {
        fetch('https://api.projectannotation.testapp.ovh/chat/room/', {
          headers: {
            Authorization: `Bearer ${curState.user.token}`,
            'Content-Type': 'application/json'
          },
        }).then(res => res.json()).then(data => {
          let updatedChats = data.map(c => {
            return { ...c, selected: false };
          })
          resolve({ chats: updatedChats })
        });
      })
    },
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
    },
    CREATE_CHAT: async (curState, chatName) => {
      let data = {
        "name": chatName
      }

      let chat = await fetch(`https://api.projectannotation.testapp.ovh/chat/room/`, {
        headers: {
          Authorization: `Bearer ${curState.user.token}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
      }).then(res => res.json()).catch(err => console.log(err));
    }
  };
  initStore(actions, {
    chats: [
      {
        id: 0,
        title: 'How to Log In?',
        selected: false,
      },
    ]
    // chats: [
    //   {
    //     id: 0,
    //     title: 'Hamlet explanation',
    //     selected: false,
    //   },
    //   {
    //     id: 1,
    //     title: 'Business ideas',
    //     selected: false,
    //   },
    //   {
    //     id: 2,
    //     title: 'Brown v. Board significance',
    //     selected: false,
    //   },
    //   {
    //     id: 3,
    //     title: 'Data science journey',
    //     selected: false,
    //   },
    // ]
  });
};

