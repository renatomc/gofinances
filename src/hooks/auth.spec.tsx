import { renderHook, act } from '@testing-library/react-hooks';
import { AuthProvider, useAuth } from './auth';

jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    setItem: () => {},
  }
});
jest.mock('expo-apple-authentication', () => () => {
  return <div>AppleAuthentication</div>;
});

jest.mock('expo-auth-session', () => {
  return {
    startAsync: () => {
      return {
        type: 'success',
        params: {
          access_token: 'google_token'
        }
      }
    }
  };
});

describe('Auth Hook', () => {
  it('should be able to sign in with Google account existed', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({
        id: `userInfo.id`,
        email: `userInfo.email`,
        photo: `userInfo.picture`,
        locale: `userInfo.locale`,
        verified_email: `userInfo.verified_email`,
      })
    })) as jest.Mock;
    
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

   await act(() => result.current.signInWithGoogle());

    expect(result.current.user).toBeTruthy();
  });
});