import React from 'react';
import { TextInputProps } from 'react-native';

import { Container } from './styles';

interface Props extends TextInputProps {};

const Input: React.FC<Props> = ({...rest}) => {
  return (
    <Container {...rest} />
  );
}

export default Input;