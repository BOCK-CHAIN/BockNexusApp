import Navigation from '@navigation/Navigation';
import { store } from '@store/store';
import React from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';

const App = () => {
  return (
    <Provider store={store}>
	<Navigation  />
    </Provider>
  );
};

export default App;