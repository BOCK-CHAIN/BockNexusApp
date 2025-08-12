import React from 'react';
import { Admin, Resource } from 'react-admin';
import { dataProvider } from './dataProvider';
import { ProductList, ProductEdit, ProductCreate } from './resources/products';
import { CategoryList, CategoryEdit, CategoryCreate } from './resources/categories';
import { purpleTheme } from './theme';

const App: React.FC = () => (
  <Admin 
    dataProvider={dataProvider} 
    theme={purpleTheme}
    title="BockNexus Admin"
  >
    <Resource 
      name="admin/products" 
      list={ProductList} 
      edit={ProductEdit} 
      create={ProductCreate}
      options={{ label: 'Products' }}
    />
    <Resource 
      name="admin/categories" 
      list={CategoryList} 
      edit={CategoryEdit} 
      create={CategoryCreate}
      options={{ label: 'Categories' }}
    />
  </Admin>
);

export default App; 