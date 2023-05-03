import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';
import { 
  Container,
  Icon,
  Title,
} from './styles';

interface Props extends RectButtonProps {
  title: string;
  type: 'up' | 'down';
  isActive: boolean;
}

const TransactionTypeButton: React.FC<Props> = ({ 
  title, 
  type, 
  isActive, 
 ...rest
}) => {
  const icons = {
    up: 'arrow-up-circle',
    down: 'arrow-down-circle',
  };
  return (
    <Container isActive={isActive} type={type} {...rest}>
      <Icon name={icons[type]} type={type} />
      <Title>
        {title}
      </Title>
    </Container>
  );
}

export default TransactionTypeButton;