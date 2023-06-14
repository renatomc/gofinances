import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Container, Header, Title, Content } from './styles';
import HistoryCard from '../../components/HistoryCard';
import { categories } from '../../utils/categories';

export interface TransactionData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
 };

 export interface CategoryData  {
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
 }


const Resume: React.FC = () => {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

  async function loadData() {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);

    const responseFormatted: TransactionData[] = response ? JSON.parse(response) : [];

    const expensives = responseFormatted.filter(expensive => expensive.type === 'negative');

    let totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum: number = 0;

      expensives.forEach(expensive => {
        if(expensive.category === category.key) {
          categorySum += Number(expensive.amount); 
        }
      });

      if(categorySum > 0) {
        const totalFormatted = categorySum
        .toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });

        totalByCategory.push({
          name: category.name,
          total: categorySum,
          totalFormatted,
          color: category.color
        })
      }
    });

    setTotalByCategories(totalByCategory);
  }

  useEffect(() => {
    loadData();
  }, [])

  return (
    <Container>
      <Header>
        <Title>
          Resumo por categoria
        </Title>
      </Header>
      <Content>
      {totalByCategories.length > 0 && (
        totalByCategories.map(totalByCategory => (
          <HistoryCard key={totalByCategory.name} title={totalByCategory.name} amount={totalByCategory.totalFormatted} color={totalByCategory.color} />
         ))
        )}
      </Content>
    </Container>
  )
}

export default Resume;