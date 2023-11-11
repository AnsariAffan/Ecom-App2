import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,

} from "react-native";
import { Button, Card, Searchbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CartScreen from "./CartScreen";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts, getProductCount, getProductsCategory } from "./api/mySlice";
import axios from "axios";
import { useToast } from "react-native-toast-notifications";
import { db } from "../firebaseConfig";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { getDataFromFireBase, setDataToFireBase } from "./api/firebaseSlice";


const HomeScreen = ({ navigation }) => {






 const notification = useToast()
  const dispatch = useDispatch();
  const products = useSelector((state) => {
    return state.mySlice.products;
  });
  const category = useSelector((state) => {
    return state.mySlice.category;
  });
  const counts = useSelector((state) => {
    return state.mySlice.counts;
  });
  const userData = useSelector((state) => {
    return state.firebaseslice.userData;
  });

  console.log(userData)

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [productsFound, setProductsFound] = useState(true);
  const [cart, setCart] = useState([]);
  const [count, setCount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getDataFromLocalStorage = async () => {
    const data = await AsyncStorage.getItem("userCart");
    const convertedData = JSON.parse(data);
    setCount(convertedData.length);
  };

  const nevigateToProductDetailPage = (navigation, id) => {
    navigation.navigate("SingleProductDetail", { id: id });
  };

  const getProductData = async () => {
    setFilteredData(products);
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const handleSearch = (query) => {
    const filtered = products.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
    setSearchQuery(query);
    setProductsFound(filtered.length > 0);
  };

  const handleAddToCart = async (item, navigation) => {
    dispatch(getProductCount())
    // dispatch(setDataToFireBase(item))
    console.log(dispatch(getProductCount()))
    let existingCart = await AsyncStorage.getItem("userCart");
    if (!existingCart) {
      existingCart = [];
    } else {
      existingCart = JSON.parse(existingCart);
    }

    const itemIndex = existingCart.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (itemIndex > -1) {
      window.alert("Item is already added to the cart");
    } else {
      existingCart.push(item);
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
    navigation.reset({
      index: 0,
      routes: [{ name: "StackNavigator", params: { data: "Reloaded" } }],
    });
   
    setRefresh(!refresh);
  };




  useEffect(() => {


 
    dispatch(getDataFromFireBase())
    dispatch(getProductCount())
    dispatch(getAllProducts());
    dispatch(getProductsCategory());
    getProductData();
    getDataFromLocalStorage();
  }, [count, refresh]);

  const renderItem = ({ item }) => {
    if (selectedCategory && item.category !== selectedCategory) {
      return null;
    }

   

    return (
      <TouchableOpacity
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        onPress={() => nevigateToProductDetailPage(navigation, item.id)}
      >
    
        <Card style={styles.card}>
          <View style={styles.imageContainer}>
            <Card.Cover
              source={{ uri: item.image }}
              resizeMode="contain"
              style={{ backgroundColor: "transparent" }}
            />
          </View>

          <Card.Content>
            <Text style={styles.cardTitle}>{truncateText(item.title, 20)}</Text>
            <Text style={styles.cardPrice}>Price ${item.price}</Text>
          </Card.Content>

          <Button
            mode="contained"
            onPress={() => {
              handleAddToCart(item, navigation);
            }}
            style={{ margin: 10 }}
          >
            Add to cart
          </Button>
        </Card>
      </TouchableOpacity>
    );
  };

  const showCategory = ({ item }) => {
    return (
      <Button
        mode="contained-tonal"
        onPress={() => {
          setSelectedCategory(category === item ? null : item);
        }}
        style={{ margin: 2, height: 40 }}
      >
        {item}
      </Button>
    );
  };

if(products){ return (
  <View style={styles.container}>
    <Searchbar
      style={{
        width: "90%",
        height: 45,
        margin: 20,
        backgroundColor: "white",
      }}
      placeholder="Search"
      onChangeText={handleSearch}
      value={searchQuery}
    />

    <Text
      style={{
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 0,
        marginBottom: 5,
      }}
    >
      Category
    </Text>

    <ScrollView
      style={{ width: "100%", top: 120, position: "absolute", zIndex: 3 }}
    >
      <FlatList horizontal={true} data={category} renderItem={showCategory} />
    </ScrollView>

 {/* {searchQuery.length>0 && filteredData.length 0? } */}
 {searchQuery.length > 0 && filteredData.length === 0 ? 
  <Text style={styles.noProducts}>Product not found</Text>
 : <FlatList
      style={{ marginTop: 66 }}
      data={filteredData.length>0 ? filteredData : products}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
    />}
    
  </View>
)}

else if(filteredData){
  return (
    <View style={styles.container}>
      <Searchbar
        style={{
          width: "90%",
          height: 45,
          margin: 20,
          backgroundColor: "white",
        }}
        placeholder="Search"
        onChangeText={handleSearch}
        value={searchQuery}
      />
  
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 0,
          marginBottom: 5,
        }}
      >
        Category
      </Text>
  
      <ScrollView
        style={{ width: "100%", top: 120, position: "absolute", zIndex: 3 }}
      >
        <FlatList horizontal={true} data={category} renderItem={showCategory} />
      </ScrollView>
  
   <FlatList
        style={{ marginTop: 66 }}
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
      /> 
     
    </View>
)}


else{
  <Text style={styles.noProducts}>Product not found</Text>
}

 
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  card: {
    margin: 8,
    padding: 5,
    flex: 1,
    backgroundColor: "white",
  },
  imageContainer: {
    backgroundColor: "white",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardPrice: {
    fontSize: 20,
    color: "green",
    textAlign: "center",
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

export default HomeScreen;
