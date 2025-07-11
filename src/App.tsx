// import Navigation from '@navigation/Navigation';
// import { store } from '@store/store';
// import React from 'react';
// import { View, Text } from 'react-native';
// import { Provider } from 'react-redux';

// const App = () => {
//   return (
//     <Provider store={store}>
// 	<Navigation  />
//     </Provider>
//   );
// };

// export default App;


import React from 'react';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Navigation from '@navigation/Navigation';
import { store } from '@store/store';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <Navigation />
        <Toast />
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
