import { ReactNode, createContext, useContext, useState } from 'react';
const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;
import * as AuthSession from 'expo-auth-session';


interface AuthProviderProps {
  children: ReactNode
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  };
  type: string;
}

interface AuthContentData {
  user: User;
  signInWithGoogle: () => Promise<void>
};

const AuthContext = createContext({} as AuthContentData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);

  async function signInWithGoogle() {
    try {
      const RESPONSE_TYPE = 'token';
      const ESCOPE = encodeURI('profile email');

      const paramsUrl = `client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${ESCOPE}`
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${paramsUrl}`;

      const { type, params } = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse;

      if(type === 'success') {
        const respose = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
        const userInfo = await respose.json();

        setUser({
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.given_name,
          photo: userInfo.picture
        })
      }

      
    } catch (error) {
      throw new Error(error as string);
    }
  }


  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };