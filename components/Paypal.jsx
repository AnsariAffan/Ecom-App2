import React from "react";
import { View, StyleSheet, TouchableOpacity, Modal, Button ,Text} from "react-native";

import WebView from "react-native-webview";
import ppl from "./api/paypalApi";
import { Appbar } from "react-native-paper";

const Paypal = ({navigation,route}) => {


 const {uri,onUrlChange} = route.params

  // const backToHomeScreen =(navigation)=>{

  //   navigation.navigate("HomeScreens");
  //   // navigation.reset({
  //   //   index: 0,
  //   //   routes: [
  //   //     { name: "HomeScreens", params: { data: "Reloaded" } },
  //   //   ],
  //   // });

  // }

  return (
   
    
      <Modal visible={true}>

      {/* <Appbar>
            <Appbar.Action
              icon="arrow-left"
              onPress={()=>backToHomeScreen(navigation)}
            />
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>My Cart</Text>
          </Appbar> */}

        <WebView
         source={{uri:uri}} 
          onNavigationStateChange={onUrlChange}
          />
      </Modal>
  
  
  );
};

const styles = StyleSheet.create({});

export default Paypal;
