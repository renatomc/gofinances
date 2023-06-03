import React from 'react';

import { Container, Header, Title } from './styles';
import HistoryCard from '../../components/HistoryCard';

const Resume: React.FC = () => {
  return (
    <Container>
      <Header>
        <Title>
          Resumo por categoria
        </Title>
      </Header>
      <HistoryCard title='Teste' amount='R$ 2.99' color='red' />
      <HistoryCard title='Teste 2' amount='R$ 12.99' color='blue' />
      <HistoryCard title='Teste 3' amount='R$ 22.99' color='#f1f' />
    </Container>
  )
}

export default Resume;