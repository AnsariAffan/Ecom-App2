import React, { useEffect } from "react";

import StackNavigator from "./components/StackNavigator";

import { Provider } from "react-redux";
import { ToastProvider } from "react-native-toast-notifications";
import store from "./components/api/store";
import { collection, getDocs } from "firebase/firestore";
import getCities, { db } from "./firebaseConfig";
import { Dimensions, Image, View } from "react-native";
import { useState } from "react";

const App = () => {
  const [showIcon, setshowIcon] = useState(true);
  const [showScreen, setshowScreen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setshowIcon(false)
      setshowScreen(true)
     console.log("landing logo...")
    }, 2000);

     }, []);

  const { width, height } = Dimensions.get("window");
  return (
    <Provider store={store}>
      <ToastProvider>
       
        {showIcon && (
          <View
            style={{
              height: height,
              width: width,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Image
                style={{ height: 200, width: 200 }}
                source={require("./assets/landingIcon.png")}
              />
            </View>
          </View>
        )}
        {showScreen && <StackNavigator/> }
      </ToastProvider>
    </Provider>
  );
};

export default App;
