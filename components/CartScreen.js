import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
} from "react-native";
import { Appbar, Button, Card } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  getPriceCount,
  getPriceSum,
  getProductCount,
  getProductsFromLocalStorages,
} from "./api/mySlice";
import { AlertNotificationRoot, Dialog } from "react-native-alert-notification";
import { Toast, useToast } from "react-native-toast-notifications";
import { SafeAreaView } from "react-native-safe-area-context";
import Paypal from "./Paypal";
import ppl from "./api/paypalApi";

const CartScreen = ({ navigation }) => {
  const [productList, setProductList] = useState([]);
  const [priceSum, setpriceSum] = useState();
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  const notification = useToast();
  const count = useSelector((state) => {
    return state.mySlice.count;
  });
  const priceCount = useSelector((state) => {
    return state.mySlice.priceCount;
  });

  console.log(priceCount);
  // const getSumOfPrice=()=>{

  //   // create a variable for the sum and initialize it
  //   let sum = 0;

  //   // iterate over each item in the array
  //   for (let i = 0; i < userData.length; i++ ) {
  //     sum += userData[i].price;
  //   }

  //   console.log(sum) // 15

  // }

  const getDataFromLocalStorage = async () => {
    const data = await AsyncStorage.getItem("userCart");
    const convertedData = JSON.parse(data);
    setProductList(convertedData);
  };

  const deleteItems = async (id) => {
    // showNotificationDailogBox()
    dispatch(getPriceSum());
    dispatch(getProductCount());

    console.log("me ander agaya bhai");
    const index = productList.findIndex((item) => item.id === id);
    console.log(index);

    if (index > -1) {
      productList.splice(index, 1); // Remove the item at 'index'
      console.log(productList);
      await AsyncStorage.setItem("userCart", JSON.stringify(productList));
      console.log("mil gaya bhai");

      setRefresh(!refresh);
    }

    notification.show("Item deleted successfully", {
      type: "danger",
      placement: "bottom",
      duration: 3000,
      offset: 30,
      animationType: "slide-in",
    });
    console.log("nhi mila bhai");
  };

  //  const truncateText = (text, maxLength) => {
  //   if (text?.length > maxLength) {
  //     return text.slice(0, maxLength) + "...";
  //   }
  //   return text;
  // };

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
    console.log(token);
    const order = await ppl.createOrder(token);

    console.log(order);
   
    if (!!order?.links) {
      const { id } = order;
      const findUrl = order.links.find((data) => data?.rel == "approve");
      console.log(findUrl.href);
      const payment = await ppl.capturePayment(id, token);
      console.log(payment);
      navigate.navigate("Paypal",{uri:findUrl.href,onUrlChange});
    }
  };




  useEffect(() => {
    // getSumOfPrice()
    dispatch(getPriceSum());
    dispatch(getProductsFromLocalStorages());
    getDataFromLocalStorage();
    dispatch(getProductCount());
  }, [navigation, refresh, priceSum]);

  return (
    <ScrollView>
      <SafeAreaView>
        <View style={styles.container}>
          <Appbar>
            <Appbar.Action
              icon="arrow-left"
              onPress={() => {
                navigation.navigate("HomeScreens");
                navigation.reset({
                  index: 0,
                  routes: [
                    { name: "HomeScreens", params: { data: "Reloaded" } },
                  ],
                });
              }}
            />
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>My Cart</Text>
          </Appbar>

          {count > 0 ? (
            <FlatList
              data={productList}
              renderItem={({ item }) => (
                <Card
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate("SingleProductDetail", { id: item.id })
                  }
                >
                  <Card.Content>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <Card.Cover
                        source={{ uri: item.image }}
                        resizeMode="contain"
                        style={{
                          backgroundColor: "transparent",
                          height: 50,
                          width: 50,
                        }}
                      />
                      <Text style={styles.cardTitle}>{item.title}</Text>
                    </View>

                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Text style={styles.cardPrice}>price ${item.price}</Text>
                      <TouchableOpacity onPress={() => deleteItems(item.id)}>
                        <Card.Cover
                          source={require("../assets/DeleteButtonIcon.png")}
                          resizeMode="contain"
                          style={{
                            backgroundColor: "transparent",
                            height: 35,
                            width: 35,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </Card.Content>
                </Card>
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={1}
            />
          ) : (
            <Text style={styles.noProducts}>Card is empty</Text>
          )}

          <Text style={{ fontSize: 20, textAlign: "right" }}>
            SubTota: {priceCount}{" "}
          </Text>

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
          {/* <Paypal/> */}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const { width, height } = Dimensions.get("window");
console.log(height);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  card: {
    margin: 8,
    backgroundColor: "white",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardPrice: {
    fontSize: 20,
    color: "green",
    textAlign: "left",
    paddingRight: 20,
  },
  noProducts: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    color: "blue",
    fontWeight: "bold",
    marginTop: 100,
  },
});

export default CartScreen;
