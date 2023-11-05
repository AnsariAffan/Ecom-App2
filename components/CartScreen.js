import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Appbar, Button, Card } from "react-native-paper";
import { useDispatch } from "react-redux";
import { getProductCount } from "./api/mySlice";

const CartScreen = ({ navigation }) => {
  const [productList, setProductList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();

  const getDataFromLocalStorage = async () => {
    const data = await AsyncStorage.getItem("userCart");
    const convertedData = JSON.parse(data);
    setProductList(convertedData);
  };

  const deleteItems = async (id) => {
    dispatch(getProductCount())
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
    console.log("nhi mila bhai");
  };

  useEffect(() => {
    getDataFromLocalStorage();
    dispatch(getProductCount())
  }, [navigation, refresh]);

  return (
    <View style={styles.container}>
      <Appbar>
        <Appbar.Action
          icon="arrow-left"
          onPress={() => {
            navigation.navigate("HomeScreen");
            navigation.reset({
              index: 0,
              routes: [{ name: "HomeScreen", params: { data: "Reloaded" } }],
            });
          }}
        />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>My Cart</Text>
      </Appbar>
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
   
        <Text style={{fontSize:20,textAlign:"right",paddingRight:10}}>SubTota: 100</Text>
   
      <Button
      
          mode="contained-tonal"
          onPress={() => {
            handleAddToCart(item, navigation);
          }}
          style={{ margin: 10,backgroundColor:"lightgreen",borderRadius:10,height:"20"  }}
        >
         Purchase Now
        </Button>
    </View>
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
});

export default CartScreen;
