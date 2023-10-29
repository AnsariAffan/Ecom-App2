import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { Appbar, Card } from 'react-native-paper';





const CartScreen = ({ navigation }) => {
  const [productList, setProductList] = useState([]);

  const getDataFromLocalStorage = async () => {
    
    const data = await AsyncStorage.getItem('userCart');
    const convertedData = JSON.parse(data);
  
    setProductList(convertedData);
  y
  };

  useEffect(() => {
    getDataFromLocalStorage();
  }, [navigation]);



  return (
    <View style={styles.container}>
      <Appbar>
        <Appbar.Action
          icon="arrow-left"
          onPress={() =>  navigation.navigate("HomeScreen")}
        />
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>My Cart</Text>
      </Appbar>
      <FlatList
        data={productList}
        renderItem={({ item }) => (

          <Card style={styles.card} onPress={() =>  navigation.navigate("SingleProductDetail",{id:item.id})}>
            <Card.Content>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardPrice}>price ${item.price}</Text>
            </Card.Content>
          </Card>
      
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={1}
      />
       
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:"column",

  },
  card: {
    margin: 8,
    backgroundColor: 'white',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardPrice: {
    fontSize: 20,
    color: 'green',
    textAlign: 'center',
  },
});

export default CartScreen;
