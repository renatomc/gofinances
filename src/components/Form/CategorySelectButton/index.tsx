import React from 'react';

import { Container, Icon, Title } from './styles';

type Props = {
  title: string;
  onPress: () => void;
};

const CategorySelectButton: React.FC<Props> = ({ title, onPress }) => {
  return (
    <Container onPress={onPress} >
      <Title>
        {title}
      </Title>
      <Icon name="chevron-down"/>
    </Container>
  );
}

export default CategorySelectButton;