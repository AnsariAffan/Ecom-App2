import React, { useEffect } from "react";
import StackNavigator from "./components/StackNavigator";
import { Provider } from "react-redux";
import { ToastProvider } from "react-native-toast-notifications";
import store from "./components/api/store";
import { useState } from "react";
import LandingIcon from "./components/LandingIcon";

const App = () => {
  const [showIcon, setshowIcon] = useState(true);
  const [showScreen, setshowScreen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setshowIcon(false);
      setshowScreen(true);
      // console.log("landing logo...");
    }, 2000);
  }, []);

  return (
    <Provider store={store}>
      <ToastProvider>
        {showIcon && <LandingIcon />}
        {showScreen && <StackNavigator />}
      </ToastProvider>
    </Provider>
  );
};

export default App;
