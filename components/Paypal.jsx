import React from "react";
import { View, StyleSheet, TouchableOpacity, Modal, Button ,Text} from "react-native";

import WebView from "react-native-webview";
import ppl from "./api/paypalApi";
import { Appbar } from "react-native-paper";

const Paypal = () => {
  const onPressPaypal = async () => {
    ppl.generateToken();
  };

  return (
    <View >

  
      <Modal visible={true} >
              
        <View style={{ flex: 1 }}>
    
        <Text onPress={() => onPressPaypal()}>
        On press paypal
      </Text>
          <WebView source={{ uri: "https://www.google.com" }} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Paypal;
