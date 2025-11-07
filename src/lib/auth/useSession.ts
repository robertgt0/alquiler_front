'use client';

import { useEffect, useState } from 'react';
import { getStoredUser, getToken, SESSION_EVENTS, type StoredUser } from './session';

type SessionState = {
  user: StoredUser | null;
  token: string | null;
  ready: boolean;
};

export function useClientSession(): SessionState {
  const [state, setState] = useState<SessionState>(() => ({
    user: null,
    token: null,
    ready: false,
  }));

  useEffect(() => {
    const sync = () => {
      setState({
        user: getStoredUser(),
        token: getToken(),
        ready: true,
      });
    };

    sync();
    window.addEventListener(SESSION_EVENTS.updated, sync);
    window.addEventListener(SESSION_EVENTS.login, sync);
    window.addEventListener(SESSION_EVENTS.logout, sync);

    return () => {
      window.removeEventListener(SESSION_EVENTS.updated, sync);
      window.removeEventListener(SESSION_EVENTS.login, sync);
      window.removeEventListener(SESSION_EVENTS.logout, sync);
    };
  }, []);

  return state;
}
