import React from 'react';


import StackNavigator from './components/StackNavigator';

import store from './components/api/store';
import { Provider } from 'react-redux';
import { ToastProvider } from 'react-native-toast-notifications';



const App = () => {
//tested
  return (
    <Provider store={store}>
       <ToastProvider>
       
        <StackNavigator/>
       
       </ToastProvider>
    </Provider>  
  
  )


 
};

export default App;
