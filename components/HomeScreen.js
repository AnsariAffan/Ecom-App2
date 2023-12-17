import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useIsFocused } from "@react-navigation/native";
import {
  getAllProducts,
  getProductCount,
  getProductsCategory,
  getSingalProduct,
  postDataToFireStore,
} from "./api/mySlice";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserCartDataFromFireBase, userWishList } from "./api/firebaseSlice";

const windowWidth = Dimensions.get("window").width;

function HomeScreen({ navigation }) {
  const products = useSelector((state) => {
    return state.mySlice.products;
  });
  const loading = useSelector((state) => {
    return state.mySlice.loading;
  });

  const product = useSelector((state) => {
    return state.mySlice.product;
  });
console.log(product)
  const [searchQuery, setSearchQuery] = useState("");
  const [count, setCount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const notification = useToast();
  const dispatch = useDispatch();

  const getProductData = async () => {
    setFilteredData(products);
  };

  const handleCategory = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    if (selectedCategory === "") {
      setFilteredData(products);
    } else {
      getCatagory(selectedCategory);
    }
  }, [selectedCategory]);

  const getCatagory = async (category) => {
    try {
      const response = await fetch(
        `https://fakestoreapi.com/products/category/${category}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setFilteredData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const ShowCategory = () => {
    return (
      <View style={{ display: "flex", flexDirection: "row", marginBottom: 5 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Button
            style={{}}
            icon="camera"
            mode="outlined"
            onPress={() => handleCategory("")}
          >
            All
          </Button>
          <Button
            style={{}}
            icon="camera"
            mode="outlined"
            onPress={() => handleCategory("electronics")}
          >
            electronics
          </Button>
          <Button
            style={{}}
            icon="camera"
            mode="outlined"
            onPress={() => handleCategory("jewelery")}
          >
            jewelry
          </Button>
          <Button
            style={{}}
            icon="camera"
            mode="outlined"
            onPress={() => handleCategory("men's clothing")}
          >
            men's clothing
          </Button>
          <Button
            style={{}}
            icon="camera"
            mode="outlined"
            onPress={() => handleCategory("women's clothing")}
          >
            women's clothing
          </Button>
        </ScrollView>
      </View>
    );
  };

  const handleSearch = async (query) => {
    const filtered = products.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
    setSearchQuery(query);
    setProductsFound(filtered?.length > 0);
  };

  const WishList = (id) => {


    dispatch(userWishList(product));
   
    console.log(product)
   
    // navigation.navigate("WishList", { forceReload: true });
    // setRefresh(refresh);
  };

  useEffect(() => {
    dispatch(getProductCount());
    dispatch(getAllProducts());
    dispatch(getProductsCategory());
    getProductData();
    getDataFromLocalStorage();

  }, [count, refresh, isFocused]);

  const getDataFromLocalStorage = async () => {
    const data = await AsyncStorage.getItem("userCart");
    const convertedData = JSON.parse(data);
    setCount(convertedData?.length);
  };

  const auth = getAuth();
  const [user, setuser] = useState();
  const isFocused = useIsFocused();
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

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("SingleProductDetail", { id: item.id })
      }
    >
      <View style={styles.productCard}>
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          resizeMode="contain"
        />
        <View style={styles.productDetails}>
          <Text style={styles.productTitle}>
            {truncateText(item.title, 20)}
          </Text>
          <Text style={styles.productPrice}>Price: ${item.price}</Text>
          <View style={styles.productIcons}>
            <AntDesign
              name="hearto"
              size={24}
              color="red"
              style={styles.icon}
              onPress={() => {
                WishList(item.id,product);
              }}
            />
            <MaterialIcons
              name="local-offer"
              size={24}
              color="#007BFF"
              style={styles.icon}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user == null ? null : (
        <>
          <Text style={{ fontSize: 20, fontWeight: "700", padding: 5 }}>
            Hello, {user.email}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "500",
              color: "gray",
              marginLeft: 5,
              marginBottom: 5,
            }}
          >
            Let's get you something!
          </Text>
        </>
      )}

      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search Products"
        right={<TextInput.Icon name="card-search" />}
      />
      <View style={{ display: "flex", flexDirection: "row" }}>
        <Text style={{ fontSize: 20, fontWeight: 500, marginBottom: 5 }}>
          Top Categories
        </Text>
        <AntDesign
          name="hearto"
          size={24}
          color="red"
          style={{ paddingLeft: 190 }}
          onPress={() => {
            navigation.navigate("WishList");
          }}
        />
      </View>

      <ShowCategory />

      <View style={{}} />
      {filteredData.length === 0 && searchQuery.length > 0 ? (
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 10,
          }}
        >
          No products found.
        </Text>
      ) : (
        <FlatList
          style={{}}
          data={(filteredData.length > 0 ? filteredData : products).filter(
            (item) => {
              const matchesSearch = item.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
              const matchesCategory =
                selectedCategory === "" ||
                item.category.toLowerCase() === selectedCategory.toLowerCase();
              return matchesSearch && matchesCategory;
            }
          )}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
      <View />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  searchInput: {
    height: 45,
    marginTop: 5,
    marginBottom: 16,
    backgroundColor: "white",
  },
  productCard: {
    flexDirection: "column",
    backgroundColor: "white",
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    width: (windowWidth - 48) / 2,
    marginRight: 16,
    height: "auto",
  },
  productImage: {
    width: "100%",
    aspectRatio: 1,
    resizeMode: "contain",
    borderRadius: 8,
  },
  productDetails: {
    marginTop: 8,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 14,
    color: "#007BFF",
  },
  productIcons: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  icon: {
    marginRight: 8,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
