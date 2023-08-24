import { initStore } from './store';

export const configureStore = () => {
  const actions = {
    SET_USER: (curState, payload) => {
    }
  };
  initStore(actions, {
    user: null,
    users: [
      {
        id: 0,
        name: 'Hamlet explanation',
      },
      {
        id: 1,
        name: 'Business ideas',
      },
      {
        id: 2,
        name: 'Brown v',
      },
      {
        id: 3,
        name: 'Data science',
      },
    ]
  });
};

