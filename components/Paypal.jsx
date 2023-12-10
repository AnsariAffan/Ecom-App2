import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Modal, Text } from "react-native";

import WebView from "react-native-webview";
import paypalApi from "./api/paypalApi";
import { Button } from "react-native-paper";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import { getSingalProduct } from "./api/mySlice";

const Paypal = ({ productID }) => {
  const product = useSelector((state) => {
    return state.mySlice.product;
  });
  const dispatch = useDispatch();

  let orderDetail = {
    intent: "CAPTURE",
    purchase_units: [
      {
        items: [
          {
            name: "T-Shirt",
            description: "Green XL",
            quantity: "1",
            unit_amount: {
              currency_code: "USD",
              value: product.price,
            },
          },
        ],
        amount: {
          currency_code: "USD",
          value: product.price,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: product.price,
            },
          },
        },
      },
    ],
    application_context: {
      return_url: "https://example.com/return",
      cancel_url: "https://example.com/cancel",
    },
  };

  const [cardInfo, setCardInfo] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [paypalUrl, setPaypalUrl] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const onPressPaypal = async () => {
    dispatch(getSingalProduct(productID));
    setLoading(true);
    try {
      const token = await paypalApi.generateToken();
      const res = await paypalApi.createOrder(token, orderDetail);
      setAccessToken(token);
      // console.log("res++++++", res)
      setLoading(false);
      if (!!res?.links) {
        const findUrl = res.links.find((data) => data?.rel == "approve");
        setPaypalUrl(findUrl.href);
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  const onUrlChange = (webviewState) => {
    // console.log("webviewStatewebviewState", webviewState)
    if (webviewState.url.includes("https://example.com/cancel")) {
      clearPaypalState();
      return;
    }
    if (webviewState.url.includes("https://example.com/return")) {
      const urlValues = queryString.parseUrl(webviewState.url);
      // console.log("my urls value", urlValues)
      const { token } = urlValues.query;
      if (!!token) {
        paymentSucess(token);
      }
    }
  };

  const paymentSucess = async (id) => {
    try {
      const res = paypalApi.capturePayment(id, accessToken);
      // console.log("capturePayment res++++", res)
      alert("Payment sucessfull...!!!");
      clearPaypalState();
    } catch (error) {
      console.log("error raised in payment capture", error);
    }
  };

  const clearPaypalState = () => {
    setPaypalUrl(null);
    setAccessToken(null);
  };

  return (
    <View>
      <Button
        mode="contained-tonal"
        onPress={() => {
          onPressPaypal();
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

      <Modal visible={!!paypalUrl}>
        <TouchableOpacity onPress={clearPaypalState} style={{ margin: 24 }}>
          <Text>Closed</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <WebView
            source={{ uri: paypalUrl }}
            onNavigationStateChange={onUrlChange}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Paypal;
