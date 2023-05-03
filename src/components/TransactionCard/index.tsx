import React from 'react';

import { categories } from '../../utils/categories';

import { 
  Container,
  Title,
  Amount,
  Footer,
  Category,
  Icon,
  CategoryName,
  Date,
 } from './styles';

 type Category = {
   name: string;
   icon: string;
 };

 export interface TransactionCardProps {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
 };

 type Props = {
   data: TransactionCardProps;
 }

const TransactionCard: React.FC<Props> = ({
  data
}) => {
  const [category] = categories.filter(item => 
      item.key === data.category,
    );
  return (
    <Container>
      <Title>
        {data.name}
      </Title>
      <Amount type={data.type}>
        { data.type === 'negative' && '- '}
        {data.amount}
      </Amount>
      <Footer>
        <Category>
          <Icon name={category.icon} />
          <CategoryName>
            {category.name}
          </CategoryName>
        </Category>
        <Date>
          {data.date}
        </Date>
      </Footer>
    </Container>
  )
}

export default TransactionCard;