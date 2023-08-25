import { useState, useEffect } from 'preact/hooks';

let globalState = {
  showAdminBar: false,
  LoginLoading: false,
};
let listeners = [];
let actions = {
  TOGGLE_ADMIN_BAR: (curState) => {
    return { showAdminBar: !curState.showAdminBar };
  },
  TOGGLE_LOGIN_LOADING: (curState) => {
    return { LoginLoading: !curState.LoginLoading };
  }
};

export const useStore = () => {
  const setState = useState(globalState)[1];

  const dispatch = (actionIdentifier, payload) => {
    const newState = actions[actionIdentifier](globalState, payload);
    globalState = { ...globalState, ...newState };

    for (const listener of listeners) {
      listener(globalState);
    }
  };

  useEffect(() => {
    listeners.push(setState);

    return () => {
      listeners = listeners.filter(li => li !== setState);
    };
  }, [setState]);

  return [globalState, dispatch];
};

export const initStore = (userActions, initialState) => {
  if (initialState) {
    globalState = { ...globalState, ...initialState };
  }
  actions = { ...actions, ...userActions };
};