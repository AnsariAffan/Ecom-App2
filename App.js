import React from 'react';


import StackNavigator from './components/StackNavigator';


import { Provider } from 'react-redux';
import { ToastProvider } from 'react-native-toast-notifications';
import store from './components/api/store';
import { collection, getDocs } from 'firebase/firestore';
import getCities, { db } from './firebaseConfig';



const App = () => {


  return (
    <Provider store={store}>
       <ToastProvider>
       
        <StackNavigator/>
       
       </ToastProvider>
    </Provider>  
  
  )


 
};

export default App;
