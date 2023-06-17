import React, { useState } from 'react';

import AppleSvg from '../../assets/apple-icon.svg';
import GoogleSvg from '../../assets/google-icon.svg';
import LogoSvg from '../../assets/logo.svg';

import { 
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper,
 } from './styles';
import { RFValue } from 'react-native-responsive-fontsize';
import SignInSocialButton from '../../components/SignInSocialButton';
import { ActivityIndicator, Alert, Platform } from 'react-native';
import { useAuth } from '../../hooks/auth';
import { useTheme } from 'styled-components';

const SignIn: React.FC = () => {
  const [isLoading, setIsloading] = useState<boolean>(false);

  const { signInWithGoogle, signInWithApple } = useAuth();
  const theme = useTheme();

  async function handleSignInWithGoogle () {
    try {
      setIsloading(true);
      return await signInWithGoogle();
    } catch (error) {
      Alert.alert("Ocorreu um erro ao tentar logar, tente novamente!");
      console.log({error});
      setIsloading(false);
    }
  }

  async function handleSignInWithApple () {
    try {
      setIsloading(true);
      return await signInWithApple();
    } catch (error) {
      Alert.alert("Ocorreu um erro ao tentar logar, tente novamente!");
      console.log({error});
      setIsloading(false);
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg 
            width={RFValue(120)}
            height={RFValue(68)}
          />
          <Title>
            Controle suas {'\n'} finanças de forma {'\n'} muito simples
          </Title>
        </TitleWrapper>
        <SignInTitle>
          Faça seu login com {'\n'} uma das contas abaixo:
        </SignInTitle>
      </Header>
      <Footer>
        <FooterWrapper>
          <SignInSocialButton onPress={handleSignInWithGoogle} title='Entrar com Google' svg={GoogleSvg} />
         {Platform.OS === 'ios' && (
           <SignInSocialButton onPress={handleSignInWithApple} title='Entrar com Apple' svg={AppleSvg} />
         )}
        </FooterWrapper>

        {isLoading && (
          <ActivityIndicator 
            color={theme.colors.shape}  
            style={{
              marginTop: 18
            }}
          />
        )}
      </Footer>
    </Container>
  )
}

export default SignIn;