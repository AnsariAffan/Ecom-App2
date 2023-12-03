import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { Card } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  getPriceSum,
  getProductCount,
  getProductsFromLocalStorages,
} from "./api/mySlice";
import { useToast } from "react-native-toast-notifications";
import { SafeAreaView } from "react-native-safe-area-context";
import Paypal from "./Paypal";

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

  const getDataFromLocalStorage = async () => {
    const data = await AsyncStorage.getItem("userCart");
    const convertedData = JSON.parse(data);
    setProductList(convertedData);
  };

  const deleteItems = async (id) => {
    // showNotificationDailogBox()
    dispatch(getPriceSum());
    dispatch(getProductCount());

    const index = productList.findIndex((item) => item.id === id);
    // console.log(index);

    if (index > -1) {
      productList.splice(index, 1); // Remove the item at 'index'
      console.log(productList);
      await AsyncStorage.setItem("userCart", JSON.stringify(productList));
      setRefresh(!refresh);
    }

    notification.show("Item deleted successfully", {
      type: "danger",
      placement: "bottom",
      duration: 3000,
      offset: 30,
      animationType: "slide-in",
    });
  };

  useEffect(() => {
    dispatch(getPriceSum());
    dispatch(getProductsFromLocalStorages());
    getDataFromLocalStorage();
    dispatch(getProductCount());
  }, [navigation, refresh, priceSum, priceCount]);

  return (
    <ScrollView>
      <SafeAreaView>
        <View style={styles.container}>
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

          <Paypal />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const { width, height } = Dimensions.get("window");
// console.log(height);

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
