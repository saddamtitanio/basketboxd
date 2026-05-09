'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

export type UserType = {
  username: string;
  name: string;
  email: string;
  password: string;
  bio?: string;
  image?: string;
};

type AuthContextType = {
  user: UserType | null;
  register: (data: UserType) => string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (data: UserType) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

    const [user, setUser] = useState<UserType | null>(() => {
        if (typeof window !== 'undefined') {
            const storedUser =
            localStorage.getItem('currentUser');
            return storedUser
            ? JSON.parse(storedUser)
            : null;
  }

  return null;
});
  const register = (data: UserType) => {
    const users = JSON.parse(
      localStorage.getItem('users') || '[]'
    );

    const usernameExists = users.find(
      (u: UserType) => u.username === data.username
    );

    if (usernameExists) {
      return 'Username already exists';
    }

    users.push(data);

    localStorage.setItem(
      'users',
      JSON.stringify(users)
    );

    localStorage.setItem(
      'currentUser',
      JSON.stringify(data)
    );

    setUser(data);

    return null;
  };

  const login = (
    email: string,
    password: string
  ) => {
    const users = JSON.parse(
      localStorage.getItem('users') || '[]'
    );

    const foundUser = users.find(
      (u: UserType) =>
        u.email === email &&
        u.password === password
    );

    if (!foundUser) {
      return false;
    }

    localStorage.setItem(
      'currentUser',
      JSON.stringify(foundUser)
    );

    setUser(foundUser);

    return true;
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  const updateProfile = (data: UserType) => {
    const users = JSON.parse(
      localStorage.getItem('users') || '[]'
    );

    const updatedUsers = users.map(
      (u: UserType) =>
        u.username === data.username
          ? data
          : u
    );

    localStorage.setItem(
      'users',
      JSON.stringify(updatedUsers)
    );

    localStorage.setItem(
      'currentUser',
      JSON.stringify(data)
    );

    setUser(data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
}