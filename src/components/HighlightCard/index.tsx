import React from 'react';

import { 
  Container,
  Header,
  Title,
  Icon,
  Footer,
  Amount,
  LastTransaction,
 } from './styles';

 type Props = {
   title: string,
   amount: string,
   lastTransaction: string,
   type: 'up' | 'down' | 'total',
 }

const HighlightCard: React.FC<Props> = ({ 
  title, 
  amount, 
  lastTransaction, 
  type 
}) => {

  const icon = {
    up: 'arrow-up-circle',
    down: 'arrow-down-circle',
    total: 'dollar-sign',
  }

  return (
    <Container type={type}>
      <Header>
        <Title type={type}>{title}</Title>
        <Icon name={icon[type]} type={type} />
      </Header>
      <Footer>
        <Amount type={type}>{amount}</Amount>
        <LastTransaction type={type}>{lastTransaction}</LastTransaction>
      </Footer>
    </Container>
  )
}

export default HighlightCard;