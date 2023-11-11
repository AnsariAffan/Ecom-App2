import { Image, ScrollView, View } from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import StarRating from "./Rating";
import { useDispatch, useSelector } from "react-redux";
import { getProductCount, getSingalProduct } from "./api/mySlice";
import Dropdown from "./DropdownItem";
import DropdownItem from "./DropdownItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "react-native-toast-notifications";

const SingleProductDetail = ({ route, navigation }) => {

 

  const notification = useToast()

  const [refresh, setRefresh] = useState(false);
  const { id } = route.params;
  const [cart, setCart] = useState([]);
  const dispatch = useDispatch();
  const product = useSelector((state) => {
    return state.mySlice.product;
  });

  console.log(product);

  const handleAddToCart = async (product, navigation) => {
    dispatch(getProductCount())
  
    console.log(dispatch(getProductCount()))
    let existingCart = await AsyncStorage.getItem("userCart");
    if (!existingCart) {
      existingCart = [];
    } else {
      existingCart = JSON.parse(existingCart);
    }

    const itemIndex = existingCart.findIndex(
      (cartItem) => cartItem.id === product.id
    );

    if (itemIndex > -1) {
      window.alert("Item is already added to the cart");
    } else {
      existingCart.push(product);
      notification.show("Cart added successfully",{
        type: "normal",
        placement: "bottom",
        duration: 2000,
        offset: 30,
        animationType: "slide-in",
      })
    }

    setCart(existingCart);

    await AsyncStorage.setItem("userCart", JSON.stringify(existingCart));
    navigation.navigate("CartScreen");
   
    setRefresh(!refresh);
  };




  useEffect(() => {
    dispatch(getProductCount())
    dispatch(getSingalProduct(id));
  }, [id]);

  return (
    <ScrollView>
    <Card style={{ backgroundColor: "white", height: 1000 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "space-evenly",
          margin: 10,
        }}
      >
        <Image
          source={{ uri: product.image }}
          style={{
            width: 100,
            height: 100,
            padding: 100,
            margin: 50,
            resizeMode: "contain",
            backgroundColor: "transparent",
          }}
        />
        <Text style={{ fontSize: 20, fontWeight: 400, padding: 5 }}>
          {product.title}
        </Text>

        <Text
          style={{
            fontSize: 20,
            fontWeight: 300,
            padding: 10,
            backgroundColor: "lightgray",
            borderRadius: 10,
            width: "100%",
            height: "20",
          }}
        >
          ${product.price}
        </Text>
        <Text style={{ fontSize: 20, fontWeight: 300, paddingTop: 5 }}>
          <Text style={{ fontSize: 20, fontWeight: 400, padding: 5 }}>
            category:
          </Text>{" "}
          {product.category}
        </Text>
        <Text style={{ fontSize: 20, fontWeight: 100, padding: 5 }}>
          Ratings:
          <StarRating rating={product?.rating?.rate} />
        </Text>

        <Text style={{ fontSize: 15, fontWeight: 200, padding: 5 }}>
          {product.description}
        </Text>
      </View>




      <Button
        mode="contained-tonal"
        onPress={() => {
          handleAddToCart(product, navigation);
        }}
        style={{
          margin: 10,
          backgroundColor: "lightgreen",
          marginTop: 100,
          borderRadius: 10,
          height: "20",
        }}
      >
        Add to cart
      </Button>




    </Card>
          </ScrollView>
  );
};

export default SingleProductDetail;
