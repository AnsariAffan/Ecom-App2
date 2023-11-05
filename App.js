import React from 'react';


import StackNavigator from './components/StackNavigator';

import store from './components/api/store';
import { Provider } from 'react-redux';

const App = () => {

  return (
    <Provider store={store}>
    <StackNavigator/>;
    </Provider>  
  
  )

  // return(
  //   <StackNavigator/>
  // )
 
};

export default App;
