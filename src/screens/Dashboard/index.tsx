import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components'
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
  LoadContainer,
 } from './styles';

 export interface DataListProps extends TransactionCardProps {
   id: string;
 };
 interface HighlightProps {
   amout: string;
   lastTransaction: string;
 };
 interface HighLightData {
   entries: HighlightProps;
   expensives: HighlightProps;
   total: HighlightProps;
 }

 const Dashboard: React.FC = () => {
  const [isLoading, setIsloading] = useState(true); 
  const [data, setData] = useState<DataListProps[]>([] as DataListProps[]);
  const [highlightData, setHighlightData] = useState<HighLightData>({
    entries: {
      amout: 'R$ 0,00',
      lastTransaction: '',
    },
    expensives: {
      amout: 'R$ 0,00',
      lastTransaction: '',
    },
    total: {
      amout: 'R$ 0,00',
      lastTransaction: ''
    },
  });

  const theme = useTheme();

  let entriesSum = 0;
  let expensiveSum = 0;
  let totalSum = 0;

  const dataKey = '@gofinances:transactions';

  function getLastTransactionDate(collection: DataListProps[], type: 'positive' | 'negative') {
    const dateCompare = collection
    .filter(dt => dt.type === type);

    if(dateCompare.length === 0) return '';

    const lastTransaction = new Date(
      Math.max.apply(Math, dateCompare
        .map(dt => new Date(dt.date).getTime()))
    );

   return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long'})}`
  }

  async function loadTransactions() {
    entriesSum = 0;
    expensiveSum = 0;
    totalSum = 0;
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

    setData(transactionsFormatted); 
    
    totalSum = entriesSum - expensiveSum; 

    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
    const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');
    const totalInterval = lastTransactionExpensives ? `01 à ${lastTransactionExpensives}` : '';

    setHighlightData({
      entries: {
        amout: `${Number(entriesSum)
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })}`,
          lastTransaction: lastTransactionEntries ? `Última entrada dia ${lastTransactionEntries}` : '',
      },
      expensives: {
        amout: `${Number(expensiveSum)
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })}`,
          lastTransaction: lastTransactionExpensives ? `Última saída dia ${lastTransactionExpensives}` : '',
      },
      total: {
        amout: `${Number(totalSum)
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })}`,
          lastTransaction: totalInterval,
      },
    });
   
    setIsloading(false);
  }

  useFocusEffect(useCallback(() => {
    loadTransactions();
  },[]));

  return (
    <Container>
      {
        isLoading ? (
          <LoadContainer>
            <ActivityIndicator 
              color={theme.colors.primary}
              size='large'
            />
          </LoadContainer>
        ) : (
          <>
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
                  lastTransaction={highlightData.entries.lastTransaction}
                  type='up'
                />
                <HighlightCard
                  title='Saídas'
                  amount={highlightData.expensives.amout}
                  lastTransaction={highlightData.expensives.lastTransaction}
                  type='down'
                />
                <HighlightCard
                  title='Total'
                  amount={highlightData.total.amout}
                  lastTransaction={highlightData.total.lastTransaction}
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
          </>
        )
      }
    </Container>
  )
}




export default Dashboard;

// protocolo: 202395284685