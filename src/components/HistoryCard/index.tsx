import React from 'react';

import { 
  Container, 
  Title,
  Amount,
} from './styles';

interface HistoryCardProps {
  title: string;
  amount: string;
  color: string;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ title, color, amount }) => {
  return (
    <Container color={color}>
      <Title>
        {title}
      </Title>
      <Amount>{amount}</Amount>
    </Container>
  )
}

export default HistoryCard;