import { initStore } from './store';

export const configureStore = () => {
  const actions = {
    SET_USER: (curState, payload) => {
      return { user: { ...payload } }
    }
  };
  initStore(actions, {
    user: null,
    users: []
  });
};

