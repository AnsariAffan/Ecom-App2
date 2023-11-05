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
} from "react-native";
import { Appbar, Button, Card } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { getPriceCount, getPriceSum, getProductCount, getProductsFromLocalStorages } from "./api/mySlice";
import { AlertNotificationRoot, Dialog } from "react-native-alert-notification";
import { Toast, useToast } from "react-native-toast-notifications";

const CartScreen = ({ navigation }) => {
  const [productList, setProductList] = useState([]);
  const [priceSum, setpriceSum] = useState();
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  const notification = useToast()
  const count= useSelector((state)=>{return state.mySlice.count})
  const priceCount = useSelector((state) => {
    return state.mySlice.priceCount;
  });
  
  console.log(priceCount)
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
    dispatch(getPriceSum())
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

    notification.show("Item deleted successfully",{
      type: "danger",
      placement: "bottom",
      duration: 3000,
      offset: 30,
      animationType: "slide-in",
    })
    console.log("nhi mila bhai");
  };





  useEffect(() => {
    // getSumOfPrice()
    dispatch(getPriceSum())
   dispatch(getProductsFromLocalStorages())
    getDataFromLocalStorage();
    dispatch(getProductCount())
  }, [navigation, refresh,priceSum]);

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

      {count>0 ?
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
      />:  <Text style={styles.noProducts}>Card is empty</Text>
      }
   
        <Text style={{fontSize:20,textAlign:"right",paddingRight:10}}>SubTota: {priceCount} </Text>
   
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
  noProducts: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    color: "blue",
    fontWeight: "bold",
    marginTop:100
  },
});

export default CartScreen;
