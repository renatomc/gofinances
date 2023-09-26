import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Register from '.';
import { ThemeProvider } from 'styled-components/native';
import theme from '../../global/styles/theme';
import { AuthProvider } from '../../hooks/auth';

jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    setItem: () => {},
  }
});

const mockedUsedNavigate = jest.fn();

jest.mock('expo-auth-session', () => () => {
  return <div>AuthSession</div>;
});

jest.mock('expo-apple-authentication',  () => () => {
  return <div>AppleAuth</div>;
});

jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    setItem: () => {},
  }
});

jest.mock('@react-navigation/native', () => ({
  ...(jest.requireActual('@react-navigation/native') as any),
  useNavigation: () => mockedUsedNavigate,
}));

const Providers: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}

describe('Register Screen', () => {
  it('should be open category modal when user click on the category button', () => {
    const { getByTestId } = render(
      <Register />,
      {
        wrapper: Providers
      }
    );

    const categoryModal = getByTestId(/modal-category/);
    const buttonCategory = getByTestId(/button-category/);

    fireEvent.press(buttonCategory);

    expect(categoryModal.props.visible).toBeTruthy();
  });
});