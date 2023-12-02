import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Modal ,Text} from "react-native";

import WebView from "react-native-webview";
import ppl from "./api/paypalApi";
import {  Button } from "react-native-paper";
import queryString from "query-string";


const Paypal = ({navigation,route}) => {

const [token, setToken] = useState();
const [order, setOrder] = useState();
const [payment, setPayment] = useState();
const [paypalUrl, setPaypalUrl] = useState();

const paymentSucess = async (id) => {
  try {
      const res = ppl.capturePayment(id, token)
      console.log("capturePayment res++++", res)
      alert("Payment sucessfull...!!!")
      clearPaypalState()
  } catch (error) {
      console.log("error raised in payment capture", error)
  }
}


const clearPaypalState = () => {
  setPaypalUrl(null)
  setToken(null)
}

const onUrlChange = (webviewState) => {
  console.log("webviewStatewebviewState", webviewState)
  if (webviewState.url.includes('https://example.com/cancel')) {
    clearPaypalState()
      return;
  }
  if (webviewState.url.includes('https://example.com/return')) {

      const urlValues = queryString.parseUrl(webviewState.url)
      console.log("my urls value", urlValues)
      const { token } = urlValues.query
      if (!!token) {
          paymentSucess(token)
      }

  }
}

const handleAddToCart = async (navigate) => {
    console.log("test button handleAddToCart ");
    const token = await ppl.generateToken();
    setToken(token)
    console.log(token);
    const order = await ppl.createOrder(token);
    setOrder(order)
    console.log(order);
   
    if (!!order?.links) {
      const { id } = order;
      const findUrl = order.links.find((data) => data?.rel == "approve");
      setPaypalUrl(findUrl.href)
      console.log(paypalUrl);
      
      
  }};




  return (
   <View>
      <Button
            mode="contained-tonal"
            onPress={() => {
              handleAddToCart(navigation);
            }}
            style={{
              marginTop: 0,
              backgroundColor: "lightgreen",
              borderRadius: 10,
              height: "20",
            }}
          >
            Purchase Now
          </Button>
   
          <Modal
                        visible={!!paypalUrl}
                    >
                        <TouchableOpacity
                            onPress={clearPaypalState}
                            style={{ margin: 24 }}
                        >
                            <Text >Closed</Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <WebView
                                source={{ uri: paypalUrl }}
                                onNavigationStateChange={onUrlChange}

                            />
                        </View>

                    </Modal>

   </View>
  
      // <Modal visible={true}>

     

      //   <WebView
      //    source={{uri:onUrlChange}} 
      //     onNavigationStateChange={onUrlChange}
      //     />
      // </Modal>
  
  
  );
};

const styles = StyleSheet.create({});

export default Paypal;
