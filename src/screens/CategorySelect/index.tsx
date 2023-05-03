import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import Button from '../../components/Form/Button';
import { categories } from '../../utils/categories';

import { 
  Container,
  Header,
  Title,
  Category,
  Icon,
  Separator,
  Name,
  Footer,
 } from './styles';

type CategoryType = {
  key: string;
  name: string;
};

type Props = {
  category: CategoryType;
  setCategory: (category: CategoryType) => void;
  closeSelectCategory: () => void;
};

const CategorySelect: React.FC<Props> = ({
  category,
  setCategory,
  closeSelectCategory,
}) => {
  const  handleCategorySelect = useCallback((category: CategoryType) => {
    setCategory(category);
  }, [setCategory]);

  return (
    <Container>
      <Header>
        <Title>Categoria</Title>
      </Header>
      <FlatList
        data={categories}
        style={{ flex: 1, width: '100%' }}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Category
            onPress={() => handleCategorySelect(item)}
            isActive={category.key === item.key}
          >
            <Icon name={item.icon} />
            <Name>{item.name}</Name>            
          </Category>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />
      <Footer>
        <Button title='Selecionar' onPress={closeSelectCategory} />
      </Footer>
    </Container>
  );
}

export default CategorySelect;