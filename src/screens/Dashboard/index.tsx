import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import HighlightCard from '../../components/HighlightCard';
import TransactionCard, { TransactionCardProps } from '../../components/TransactionCard';

import { 
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
 } from './styles';

 export interface DataListProps extends TransactionCardProps {
   id: string;
 };
 interface HighlightProps {
   amout: string;
 };
 interface HighLightData {
   entries: HighlightProps;
   expensives: HighlightProps;
   total: HighlightProps;
 }

 const Dashboard: React.FC = () => {
 
  const [data, setData] = useState<DataListProps[]>([] as DataListProps[]);
  const [highlightData, setHighlightData] = useState<HighLightData>({
    entries: {
      amout: 'R$ 0,00',
    },
    expensives: {
      amout: 'R$ 0,00',
    },
    total: {
      amout: 'R$ 0,00',
    },
  });

  let entriesSum = 0;
  let expensiveSum = 0;
  let totalSum = 0;

  const dataKey = '@gofinances:transactions';

  async function loadTransactions() {
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];
    const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {
      if(item.type === 'positive') {
        entriesSum += Number(item.amount);
      }
      if(item.type === 'negative') {
        expensiveSum += Number(item.amount);
      }
      
      const amount = Number(item.amount)
      .toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(item.date));

      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date,
      }
    });

    totalSum = entriesSum - expensiveSum; 

    setHighlightData({
      entries: {
        amout: `${Number(entriesSum)
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })}`,
      },
      expensives: {
        amout: `${Number(expensiveSum)
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })}`,
      },
      total: {
        amout: `${Number(totalSum)
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })}`,
      },
    });

    setData([...transactionsFormatted]);

  }

  useFocusEffect(useCallback(() => {
    loadTransactions();
  },[]));

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/18095062?v=4'}} />
            <User>
              <UserGreeting>Olá, </UserGreeting>
              <UserName>Renato</UserName>
            </User>
          </UserInfo>
          <LogoutButton onPress={() => {}}>
            <Icon name="power" />
          </LogoutButton>
        </UserWrapper>
      </Header>
      <HighlightCards>
        <HighlightCard 
          title='Entradas'
          amount={highlightData.entries.amout}
          lastTransaction='12 de Fevereiro de 2023'
          type='up'
        />
        <HighlightCard
          title='Saídas'
          amount={highlightData.expensives.amout}
          lastTransaction='2 de Fevereiro de 2023'
          type='down'
        />
        <HighlightCard
          title='Total'
          amount={highlightData.total.amout}
          lastTransaction='6 de Fevereiro de 2023'
          type='total'
        />
      </HighlightCards>
      <Transactions>
        <Title>
          Listagem
        </Title>
        <TransactionList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item })=>
            <TransactionCard data={item} />
          }
        />
      </Transactions>
    </Container>
  )
}




export default Dashboard;

// protocolo: 202395284685