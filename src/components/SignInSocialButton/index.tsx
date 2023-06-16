import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';
import { SvgProps } from 'react-native-svg';

import { 
  Button,
  ImageContainer,
  Text,
} from './styles';

interface SignInSocialButtonProps extends RectButtonProps {
  title: string;
  svg: React.FC<SvgProps>
}

const SignInSocialButton: React.FC<SignInSocialButtonProps> = ({
  title,
  svg: Svg,
  ...rest
}) => {
  return (
    <Button {...rest} >
      <ImageContainer>
        <Svg />
      </ImageContainer>
      <Text>
        {title}
      </Text>
    </Button>
  )
}

export default SignInSocialButton;