import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  ImageField,
  EditButton,
  DeleteButton,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  required,
} from 'react-admin';

// Category List Component
export const CategoryList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="description" />
      <ImageField source="image_uri" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

// Category Create Component
export const CategoryCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" validate={required()} />
      <TextInput source="description" multiline rows={3} />
      <TextInput source="image_uri" label="Image URL" />
    </SimpleForm>
  </Create>
);

// Category Edit Component
export const CategoryEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" validate={required()} />
      <TextInput source="description" multiline rows={3} />
      <TextInput source="image_uri" label="Image URL" />
    </SimpleForm>
  </Edit>
); 