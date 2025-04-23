import { useState, useEffect, useCallback } from 'react';

import type { App } from 'shared/eden';
import { treaty } from '@elysiajs/eden';
import Cookies from 'js-cookie';
import { getBaseUrl } from 'shared';
import type { User } from 'shared';
const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const UUID_COOKIE = 'uuid';

export function createBackend() {
  const [user, setUser] = useState<Omit<
    User,
    'webSocketConnectionId' | 'isActive' | 'updatedAt'
  > | null>(null);
  const [loading, setLoading] = useState(true);

  const getApi = useCallback(() => {
    const headers = new Headers();
    const accessToken = Cookies.get(ACCESS_TOKEN_COOKIE);
    if (accessToken) {
      headers.append('authorization', accessToken);
    }

    return treaty<App>(getBaseUrl(), {
      headers,
      onResponse: async (response: Response) => {
        if (response.status === 401) {
          await refreshAccessToken();
        }
      },
    });
  }, []);

  const loadUser = useCallback(async () => {
    try {
      const api = getApi();
      const response = await api.dashboard.user.get();

      if (!response.error) {
        setUser(response.data);
      } else if (response.error?.status === 401) {
        await refreshAccessToken();
      }
    } catch (error) {
      console.error('Failed to load user', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [getApi]);

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE);
    const uuid = Cookies.get(UUID_COOKIE);

    if (!refreshToken || !uuid) {
      await logout();
      return;
    }

    try {
      const api = getApi();
      const response = await api.auth.refresh.post({
        a: refreshToken,
        b: uuid,
      });

      if (response.data) {
        Cookies.set(ACCESS_TOKEN_COOKIE, response.data, {
          secure: true,
          sameSite: 'strict',
          expires: 30,
        });
        await loadUser();
      } else {
        await logout();
      }
    } catch (error) {
      console.error('Failed to refresh token', error);
      await logout();
    }
  }, [getApi, loadUser]);

  const logout = useCallback(async () => {
    const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE);
    if (refreshToken) {
      try {
        const api = getApi();
        await api.auth.logout.post(refreshToken);
      } catch (error) {
        console.error('Logout failed', error);
      }
    }

    Cookies.remove(ACCESS_TOKEN_COOKIE);
    Cookies.remove(REFRESH_TOKEN_COOKIE);
    Cookies.remove(UUID_COOKIE);
    setUser(null);
  }, [getApi]);

  const setTokens = useCallback(
    (refreshToken: string, uuid: string) => {
      Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
        secure: true,
        sameSite: 'strict',
        expires: 30,
      });
      Cookies.set(UUID_COOKIE, uuid, {
        secure: true,
        isSecure: 'strict',
        expires: 30,
      });
      refreshAccessToken();
    },
    [refreshAccessToken],
  );

  useEffect(() => {
    const accessToken = Cookies.get(ACCESS_TOKEN_COOKIE);
    const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE);
    const uuid = Cookies.get(UUID_COOKIE);

    if (accessToken && refreshToken && uuid) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [loadUser]);

  return { user, loading, logout, setTokens, api: getApi() };
}
