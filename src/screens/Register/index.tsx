import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from 'react-native';
import { Control, FieldValues, useForm } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Form/Button';
import CategorySelectButton from '../../components/Form/CategorySelectButton';
import InputForm from '../../components/Form/InputForm';
import TransactionTypeButton from '../../components/Form/TransactionTypeButton';
import CategorySelect from '../CategorySelect';

import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes,
} from './styles';

interface FormData {
  name: string;
  amount: string;
};

const schema = Yup.object().shape({
  name: Yup
  .string()
  .required('Nome é obrigatório'),
  amount: Yup
  .number()
  .typeError('Informe um valor númerico')
  .positive('O valor não pode ser negativo')
  .required('O valor é obrigatorio'),
});

const Register: React.FC = () => {
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const navigation = useNavigation();

  const dataKey = '@gofinances:transactions';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const formControll = control as unknown as Control<FieldValues, any>;

  const handleTransactionsTypeSelect = useCallback((typeSelect: 'positive' | 'negative') => {
    setTransactionType(typeSelect);
  }, [setTransactionType]);

  const handleOpenCategory = useCallback(() => {
    setCategoryModalOpen(true);
  }, []);

  const handleCloseCategory = useCallback(() => {
    setCategoryModalOpen(false);
  }, []);

  const handleRegister = useCallback(async (form:FormData) => {
    if(!transactionType) {
      return Alert.alert("Selecione o tipo da transação");
    }
    if(category.key === 'category') {
      return Alert.alert("Selecione a categoria");
    }

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    };

    console.log({newTransaction});

    try {
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];
      const dataFormatted = [
        ...currentData,
        newTransaction
      ];
      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));
      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria',
      });
      navigation.navigate('Listagem');
    } catch (error) {
      console.log({error});
      Alert.alert("Não foi possível salvar")
    }
  }, [transactionType, category]);

  // useEffect(() => {
  //   async function loadData() {
  //     // const data = await AsyncStorage.getItem(dataKey);
  //     // console.log(JSON.parse(data!));
  //     await AsyncStorage.removeItem(dataKey);
  //   }
  //   loadData();
  // }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>
            Cadastro
          </Title>
        </Header>
        <Form>
          <Fields>
            <InputForm
              name="name"
              control={formControll}
              placeholder='Nome'
              autoCapitalize='sentences'
              autoCorrect={false}
              error={errors.name && errors.name.message}
              />
            <InputForm
              name="amount"
              control={formControll}
              placeholder='Preço'
              keyboardType='numeric'
              error={errors.amount && errors.amount.message}
              />
              <TransactionsTypes>
                <TransactionTypeButton 
                  title='Entrada' 
                  type='up' 
                  onPress={() => handleTransactionsTypeSelect('positive')}
                  isActive={transactionType === 'positive'}
                />
                <TransactionTypeButton 
                  title='Saída' 
                  type='down' 
                  onPress={() => handleTransactionsTypeSelect('negative')}
                  isActive={transactionType === 'negative'}
                />
              </TransactionsTypes>
              <CategorySelectButton title={category.name} onPress={handleOpenCategory} />
            </Fields>
            <Button title='Enviar' onPress={handleSubmit(handleRegister)} />
        </Form>
        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseCategory}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}

export default Register;