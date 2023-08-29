import { initStore } from './store';

export const configureUsersStore = () => {
  const actions = {
    SET_USER: (curState, payload) => {
      return { user: { ...payload } }
    }
  };
  initStore(actions, {
    user: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjk0NTU3OTIxLCJpc19hZG1pbiI6ZmFsc2V9.SOp36tGArSAg7WCyLGweI5CK7B6HaaaU-0FtpoXnHb0'
    },
  });
};

