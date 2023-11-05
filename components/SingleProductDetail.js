import { Image, View } from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import StarRating from "./Rating";
import { useDispatch, useSelector } from "react-redux";
import { getSingalProduct } from "./api/mySlice";

const SingleProductDetail = ({ route, navigation }) => {
  const { id } = route.params;

  const dispatch = useDispatch();
  const product = useSelector((state) => {
    return state.mySlice.product;
  });

  console.log(product);

  useEffect(() => {
    dispatch(getSingalProduct(id));
  }, [id]);

  return (
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
          handleAddToCart(item, navigation);
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
  );
};

export default SingleProductDetail;
