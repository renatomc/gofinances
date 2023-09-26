import React from 'react';
import { render } from '@testing-library/react-native';

import { Profile } from '../../screens/Profile'; 

describe('Profile', () => {
  it('Check if show correctly user input name placeholder', () => {
    const { getByPlaceholderText } = render(<Profile />);
    const inputName = getByPlaceholderText(/nome/);
    expect(inputName).toBeTruthy();
  });
  
  it('checis if user data has been loaded', () => {
    const { getByTestId } = render(<Profile />);
    const inputName = getByTestId(/input-name/);
    const inputSurName = getByTestId(/input-surname/);
    expect(inputName).toBeTruthy();
    expect(inputSurName).toBeTruthy();
    expect(inputName.props.value).toEqual('Renato');
    expect(inputSurName.props.value).toEqual('Costa');
  });
  
  it('checks title', () => {
    const { getByTestId } = render(<Profile />);
    const title = getByTestId(/text-title/);
    expect(title.children).toContain('Perfil');
  });
});