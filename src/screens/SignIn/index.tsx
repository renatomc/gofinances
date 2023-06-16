import React from 'react';

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
import { Alert } from 'react-native';
import { useAuth } from '../../hooks/auth';

const SignIn: React.FC = () => {

  const { signInWithGoogle, signInWithApple } = useAuth();

  async function handleSignInWithGoogle () {
    try {
      await signInWithGoogle();
    } catch (error) {
      Alert.alert("Ocorreu um erro ao tentar logar, tente novamente!");
      console.log({error});
      
    }
  }

  async function handleSignInWithApple () {
    try {
      await signInWithApple();
    } catch (error) {
      Alert.alert("Ocorreu um erro ao tentar logar, tente novamente!");
      console.log({error});
      
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
          <SignInSocialButton onPress={handleSignInWithApple} title='Entrar com Apple' svg={AppleSvg} />
        </FooterWrapper>
      </Footer>
    </Container>
  )
}

export default SignIn;