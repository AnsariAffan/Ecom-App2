


import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { getProductCount, getSingalProduct } from "./api/mySlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from 'react-native-toast-notifications';
import Paypal from './Paypal';

function SingleProductDetail({ route, navigation }) {
  const { id } = route.params;
  const [refresh, setRefresh] = useState(false);
  const [cart , setCart] =useState(true)
  const notification = useToast()
  const dispatch = useDispatch();
  const product = useSelector((state) => {
    return state.mySlice.product;
  });

  const loading = useSelector((state) => {
    return state.mySlice.loading;
  });

  useEffect(() => {
        dispatch(getProductCount())
        dispatch(getSingalProduct(id));
      }, [id]);

      const handleAddToCart = async (product, navigation) => {
            dispatch(getProductCount())
          
            // console.log(dispatch(getProductCount()))
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
            await navigation.reset({
              index: 0,
              routes: [{ name: "CartScreen", params: { data: "Reloaded" } }],
            });
           
            setRefresh(!refresh);
          };


  const renderProductDetails = () => {
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
          <Card.Cover
            source={{ uri: product.image }}
            resizeMode="contain"
          />
          
          <Card.Content style={styles.cardContent}>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.description}>Description: {product.description}</Text>
            <Text style={styles.price}>Price: ${product.price}</Text>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>          
           <Paypal  productID={id}/>
           <Button mode="outlined" onPress={()=>handleAddToCart(product, navigation)} style={styles.addToCartButton}>Add To Cart</Button>
          </Card.Actions>
        </Card>
           
      </View>
    );
  };

  return (
    <ScrollView>
      {renderProductDetails()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: 'green',
    marginBottom: 16,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  buyButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#FF9900', // Amazon orange color
  },
  addToCartButton: {
    flex: 1,
    marginLeft: 8,
    borderColor: '#FF9900', // Amazon orange color
    borderWidth: 1,
  },
});

export default SingleProductDetail;