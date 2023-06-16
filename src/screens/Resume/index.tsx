import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTheme } from 'styled-components';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import HistoryCard from '../../components/HistoryCard';
import { categories } from '../../utils/categories';
import { VictoryPie } from 'victory-native';

import { 
  Container, 
  Header, 
  Title, 
  Content, 
  ChartContainer, 
  MonthSelect,
  MonthSelectButton,
  Month,
  MonthSelectIcon,
  LoadContainer,
} from './styles';

import { RFValue } from 'react-native-responsive-fontsize';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';


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
  percent: string;
 }


const Resume: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

  const theme = useTheme();

  function handleDateChange(action: 'next' | 'prev') {
    if(action === 'next') {
     const newDate = addMonths(selectedDate, 1);
     setSelectedDate(newDate);
    } else {
      const newDate = subMonths(selectedDate, 1);
      setSelectedDate(newDate);
    }
  }

  async function loadData() {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);

    const responseFormatted: TransactionData[] = response ? JSON.parse(response) : [];

    const expensives = responseFormatted
    .filter(expensive => expensive.type === 'negative' && 
      new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
      new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
    );

    const expensivesTotal = responseFormatted
    .reduce((acumullator: number, expensive: TransactionData) => {
      return acumullator + Number(expensive.amount);
    }, 0);

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

        const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`;

        totalByCategory.push({
          name: category.name,
          total: categorySum,
          totalFormatted,
          color: category.color,
          percent,
        })
      }
    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(useCallback(() => {
    loadData();
  }, [selectedDate]));

  return (
    <Container>
     {isLoading ? (
      <LoadContainer>
        <ActivityIndicator
          color={theme.colors.primary}
          size="large"
        />
      </LoadContainer>
     ) : (
      <>
      <Header>
        <Title>
          Resumo por categoria
        </Title>
      </Header>
      <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 24,
            paddingBottom: useBottomTabBarHeight()
          }}
      >

        <MonthSelect>
          <MonthSelectButton onPress={() => handleDateChange('prev')}>
            <MonthSelectIcon name="chevron-left" />
          </MonthSelectButton>
          <Month>{format(selectedDate, "MMMM, yyyy", {locale: ptBR})}</Month>
          <MonthSelectButton onPress={() => handleDateChange('next')}>
            <MonthSelectIcon name="chevron-right" />
          </MonthSelectButton>
        </MonthSelect>

        <ChartContainer>
          <VictoryPie
            data={totalByCategories}
            colorScale={totalByCategories.map(category => category.color)}
            style={{
              labels: {
                fontSize: RFValue(18),
                fontWeight: 'bold',
                fill: theme.colors.shape
              }
            }}
            labelRadius={50}
            x="percent"
            y="total"
            />
        </ChartContainer>
      {totalByCategories.length > 0 && (
        totalByCategories.map(totalByCategory => (
          <HistoryCard key={totalByCategory.name} title={totalByCategory.name} amount={totalByCategory.totalFormatted} color={totalByCategory.color} />
         ))
        )}
      </Content>
      </>
     )}
    </Container>
  )
}

export default Resume;