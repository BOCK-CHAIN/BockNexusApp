import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ImageField,
  EditButton,
  DeleteButton,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  required,
  minValue,
} from 'react-admin';

// Product List Component
export const ProductList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="description" />
      <NumberField source="price" />
      <TextField source="brand" />
      <TextField source="color" />
      <ImageField source="image_uri" />
      <NumberField source="rating" />
      <TextField source="category.name" label="Category" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

// Product Create Component
export const ProductCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" validate={required()} />
      <TextInput source="description" multiline rows={3} />
      <NumberInput source="price" validate={[required(), minValue(0)]} />
      <TextInput source="brand" />
      <TextInput source="color" />
      <TextInput source="image_uri" label="Image URL" />
      <NumberInput source="rating" validate={minValue(0)} />
      <NumberInput source="categoryId" label="Category ID" validate={required()} />
    </SimpleForm>
  </Create>
);

// Product Edit Component
export const ProductEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" validate={required()} />
      <TextInput source="description" multiline rows={3} />
      <NumberInput source="price" validate={[required(), minValue(0)]} />
      <TextInput source="brand" />
      <TextInput source="color" />
      <TextInput source="image_uri" label="Image URL" />
      <NumberInput source="rating" validate={minValue(0)} />
      <NumberInput source="categoryId" label="Category ID" validate={required()} />
    </SimpleForm>
  </Edit>
); 