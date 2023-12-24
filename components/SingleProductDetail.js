import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductCount,
  getSingalProduct,
  postUserCartDataToFireStore,
  postUserDataToFireStore,
} from "./api/mySlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "react-native-toast-notifications";
import Paypal from "./Paypal";
import { useIsFocused } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function SingleProductDetail({ route, navigation }) {
  const { id } = route.params;
  const [refresh, setRefresh] = useState(false);
  const [cart, setCart] = useState(true);
  const notification = useToast();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [counter, setcounter] = useState(1);

  const QtyPlus = () => {
    setcounter(counter + 1);
  };
  const QtyMinus = () => {
    if (counter <= 1) {
      setcounter((counter = 1));
    }
    setcounter(counter - 1);
  };

  const product = useSelector((state) => {
    return state.mySlice.product;
  });

  const loading = useSelector((state) => {
    return state.mySlice.loading;
  });

  const auth = getAuth();
  const [user, setuser] = useState();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (isFocused && user) {
        // console.log(user);
        setuser(user);
        return user;
      } else {
        setuser(null);
      }
    });
  }, [isFocused]);

  useEffect(() => {
    dispatch(getProductCount());
    dispatch(getSingalProduct(id));
    dispatch(postUserCartDataToFireStore());
  }, [id, isFocused]);

  useEffect(() => {}, []);

  const handleAddToCart = async (product, navigation) => {
    dispatch(
      postUserCartDataToFireStore({
        product,
        email: user.email,
        Quantity: counter,
      })
    );
    dispatch(getProductCount());
    navigation.navigate("CartScreen", { forceReload: true });
    setRefresh(refresh);

    // console.log(dispatch(getProductCount()))
    // let existingCart = await AsyncStorage.getItem("userCart");
    // if (!existingCart) {
    //   existingCart = [];
    // } else {
    //   existingCart = JSON.parse(existingCart);
    // }

    // const itemIndex = existingCart.findIndex(
    //   (cartItem) => cartItem.id === product.id
    // );

    // if (itemIndex > -1) {
    //   window.alert("Item is already added to the cart");
    // } else {
    //   existingCart.push(product);
    //   notification.show("Cart added successfully",{
    //     type: "normal",
    //     placement: "bottom",
    //     duration: 2000,
    //     offset: 30,
    //     animationType: "slide-in",
    //   })
    // }

    // setCart(existingCart);
  };

  const RenderProductDetails = () => {
    // if (loading) {
    //   return (
    //     <View style={styles.loadingContainer}>
    //       <ActivityIndicator size="large" color="#007BFF" />
    //     </View>
    //   );
    // }

    if (!product) {
      return null;
    }

    return (
      <View style={styles.container}>
        {/* {loading && <View style={styles.loadingContainer}>
     <ActivityIndicator size="large" color="#007BFF" />
   </View>} */}
        <Card elevation={5}>
          <Card.Cover source={{ uri: product.image }} resizeMode="contain" />

          <Card.Content style={styles.cardContent}>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.description}>
              Description: {product.description}
            </Text>

            <View></View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <Text style={styles.price}>
                Price: ${product.price * counter}
              </Text>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    QtyMinus();
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    backgroundColor: "skyblue",
                    width: 30,
                    borderRadius: 5,
                    height:20
                  }}
                >
                  <Text style={{ fontWeight: 700 }}>-</Text>
                </TouchableOpacity>
                <Text style={{ fontWeight: 700, padding: 5 }}>{counter}</Text>
                <TouchableOpacity
                  onPress={() => {
                    QtyPlus();
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    backgroundColor: "skyblue",
                    width: 30,
                    borderRadius: 5,
                    height:20
                  }}
                >
                  <Text style={{ fontWeight: 700 }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Paypal prd={product} productID={id} productQuantity={counter} />
            <Button
              mode="outlined"
              onPress={() => handleAddToCart(product, navigation)}
              style={styles.addToCartButton}
            >
              Add To Cart
            </Button>
          </Card.Actions>
        </Card>
      </View>
    );
  };

  return <ScrollView>{RenderProductDetails()}</ScrollView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: "green",
    marginBottom: 16,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  buyButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#FF9900", // Amazon orange color
  },
  addToCartButton: {
    flex: 1,
    marginLeft: 8,
    borderColor: "#FF9900", // Amazon orange color
    borderWidth: 1,
  },
});

export default SingleProductDetail;
