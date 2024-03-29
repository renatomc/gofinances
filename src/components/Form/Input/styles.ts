import { RFValue } from 'react-native-responsive-fontsize';
import { css } from 'styled-components';
import styled from 'styled-components/native';

interface ContainerProps {
  active: boolean;
}

export const Container = styled.TextInput<ContainerProps>`
  width: 100%;
  padding: 16px 18px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text_dark};
  font-size: ${RFValue(14)}px;
  background-color: ${({ theme }) => theme.colors.shape};
  border-radius: 5px;
  margin-bottom: 8px;

  ${({ active, theme }) => active && css`
    border-width: 3px;
    border-color: ${theme.colors.attention};
  `}
`;
