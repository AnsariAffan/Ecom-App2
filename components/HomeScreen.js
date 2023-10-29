import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, TouchableOpacity } from 'react-native';
import { Appbar, Button, Card, Searchbar} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';



const HomeScreen = ({ navigation }) => {

  
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [productsFound, setProductsFound] = useState(true);
 const [cart, setCart] = useState([]);
 const [count, setCount] = useState(0);


 const getDataFromLocalStorage = async () => {
    
  const data = await AsyncStorage.getItem('userCart');
  const convertedData = JSON.parse(data);
  console.log(convertedData.length)
  setCount(convertedData.length);
};

const  nevigateToProductDetailPage=(navigation,id)=>{

  navigation.navigate("SingleProductDetail",{id:id})

 }
  const getProductData = async () => {
    fetch('https://fakestoreapi.com/products')
      .then((res) => res.json())
      .then((e) => {
        setData(e);
        setFilteredData(e);
      });
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

  const handleSearch = (query) => {
    const filtered = data.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
    setSearchQuery(query);
    setProductsFound(filtered.length > 0);
  };
  const handleAddToCart = async (item,navigation) => {
    // Retrieve existing cart data from local storage
    let existingCart = await AsyncStorage.getItem('userCart');

    if (!existingCart) {
      // If no existing cart data, initialize an empty array
      existingCart = [];
    } else {
      // Parse the existing cart data from JSON
      existingCart = JSON.parse(existingCart);
    }

    // Add the selected item to the cart
    existingCart.push(item);

    // Update the cart state
    setCart(existingCart);

    // Store the updated cart data in local storage
    await AsyncStorage.setItem('userCart', JSON.stringify(existingCart));

    console.log('Product added to cart:', existingCart);
    navigation.navigate("CartScreen")
   
  };

  

  useEffect(() => {
    getProductData();
    getDataFromLocalStorage()
  }, []);

const renderItem = ({ item }) => (
  <TouchableOpacity style={{    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
      }} onPress={()=>nevigateToProductDetailPage(navigation,item.id)}>
  <Card style={styles.card} >
    
    <View style={styles.imageContainer}>
      <Card.Cover
        source={{ uri: item.image }}
        resizeMode="contain"
        style={{ backgroundColor: "transparent" }}
      />
    </View>
    
    <Card.Content>
      <Text style={styles.cardTitle}>{truncateText(item.title,20)}</Text>
      <Text style={styles.cardPrice}>Price ${item.price}</Text>
    </Card.Content>
    {/* <Button title="Add to Cart" onPress={ ()=>{handleAddToCart(item,navigation)}}   >Add To Cart</Button> */}
   

    {/* <Button  mode="contained" onPress={ ()=>{handleAddToCart(item,navigation)}} style={{margin:10}}>
   Add To Cart
  </Button> */}

  <Button  mode="contained" onPress={ ()=>{handleAddToCart(item,navigation)}} style={{margin:10}}>
  Buy
  </Button>
 

      {/* <Button title="Go to Cart" onPress={() => navigation.navigate('Cart', { cart })} /> */}
  </Card>
</TouchableOpacity>
);


  return (
    <View style={styles.container}>
      <Appbar   >


        
        <View style={styles.searchContainer}>
        <Searchbar
      
         placeholder="Search"
         onChangeText={handleSearch} // Handle text input changes
         value={searchQuery}
         
         />
           {/* <View style={{backgroundColor:"orange",height:55}}>

           <Appbar.Action icon="magnify" onPress={() => console.log('Search button pressed') }  />

           </View> */}
        
        </View>
        <Text style={{fontSize:20,position:"relative",top:-19,left:38}}>{count}</Text>
        <Appbar.Action icon="cart" size={29} onPress={() =>   navigation.navigate("CartScreen")} style={{}}/>
     

      </Appbar>
      <Text style={{textAlign:"center",color:"blue",fontSize:25,fontWeight:600}}>Welcome </Text>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
      />
 
      {!productsFound && <Text style={styles.noProducts}>Product not found</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
 container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
      

  },
   text: {
    fontSize: 24,
    marginBottom: 20,
  },
  card: {
  

    margin: 8,
    flex: 1,
    backgroundColor:'white'
  },
  imageContainer: {
    backgroundColor: 'white', // Set the background color of the image container to transparent
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardPrice: {
    fontSize: 20,
    color: 'green',
    textAlign:'center'
  },
  searchContainer:{
      width:300,
     
  },
  noProducts: {
    flex:1,
    textAlign: 'center',
    fontSize: 20,
   
    color: 'blue',
    fontWeight:'bold',
  },
});

export default HomeScreen;