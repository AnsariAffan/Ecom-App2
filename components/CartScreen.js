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
import { deleteItemFromFireStore, getUserCartDataFromFireBase } from "./api/firebaseSlice";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useIsFocused } from "@react-navigation/native";

const CartScreen = ({ navigation }) => {
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  const notification = useToast();

  const userCarts = useSelector((state) => state.firebaseslice.userCarts);
  const count = useSelector((state) => state.firebaseslice.count);
  const priceCount = useSelector((state) => state.mySlice.priceCount);

  const getDataFromLocalStorage = async () => {
    const data = await AsyncStorage.getItem("userCart");
    const convertedData = JSON.parse(data) || [];
    dispatch(getProductsFromLocalStorages());
    dispatch(getProductCount());
    return convertedData;
  };

  const deleteItems = async (id) => {
 
 console.log(id)

    // const updatedProductList = productList.filter((item) => item.id !== id);

    // await AsyncStorage.setItem("userCart", JSON.stringify(updatedProductList));


    dispatch(deleteItemFromFireStore(id))
    dispatch(getPriceSum());
    dispatch(getProductCount());
    setRefresh(!refresh);

    notification.show("Item deleted successfully", {
      type: "danger",
      placement: "bottom",
      duration: 3000,
      offset: 30,
      animationType: "slide-in",
    });
navigation.navigate("CartScreen")
    
  };

  useEffect(() => {
    getDataFromLocalStorage();
    dispatch(getPriceSum());
  }, [navigation, refresh]);

  const auth = getAuth();
  const [userEmail, setUserEmail] = useState();
  const isFocused = useIsFocused();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (isFocused && user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });

    return () => unsubscribe();
  }, [isFocused]);

  useEffect(() => {
    dispatch(getUserCartDataFromFireBase());
  }, [isFocused, refresh]);

  return (
    <ScrollView>
      <SafeAreaView>
        <View style={styles.container}>
          {count > 0 ? (
            <FlatList
              data={userCarts}
              renderItem={({ item }) => (
                <Card
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate("SingleProductDetail", { id: item.product.id })
                  }
                >
                  <Card.Content>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <Card.Cover
                        source={{ uri: item.product.image }}
                        resizeMode="contain"
                        style={{
                          backgroundColor: "transparent",
                          height: 50,
                          width: 50,
                        }}
                      />
                      <Text style={styles.cardTitle}>{item.product.title}</Text>
                    </View>

                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Text style={styles.cardPrice}>
                        price ${item.product.price}
                      </Text>
                      <TouchableOpacity onPress={() => deleteItems(item.product.id)}>
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
 
              numColumns={1}
            />
          ) : (
            <Text style={styles.noProducts}>Card is empty</Text>
          )}

          <Text style={{ fontSize: 20, textAlign: "right" }}>
            SubTotal: {priceCount}
          </Text>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

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
