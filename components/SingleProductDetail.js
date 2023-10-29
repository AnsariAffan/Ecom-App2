import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Card } from "react-native-paper";
import { ScrollView } from "react-native-web";

const SingleProductDetail = ({ route, navigation }) => {
  const { id } = route.params;

  const [data, setData] = useState([]); // Add a state variable to hold the data




  const getProductDetails = async (id) => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((e) => {
        console.log(e);
        setData([e]); // Store the product details in an array
      });
  };

  useEffect(() => {
    getProductDetails(id);

  }, [id]);

  const renderData = ({ item }) => (


    <Card style={{backgroundColor:"white",height:1000}}>
    
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' ,marginLeft:10}}>
    <Image source={{ uri: item.image }} style={{ width: 100, height: 100,padding:100 ,margin:50,resizeMode:"contain",backgroundColor: "transparent"}} />
    <Text style={{fontSize:20,fontWeight:400}}>{item.title}</Text>
    <Text style={{fontSize:20,fontWeight:300,}}><Text style={{fontSize:20,fontWeight:400}}>category:</Text> {item.category}</Text>
    <Text style={{fontSize:20,fontWeight:300}}><Text style={{fontSize:20,fontWeight:400}}>description:</Text>{item.description}</Text>
    <Text style={{fontSize:20,fontWeight:300}}><Text style={{fontSize:20,fontWeight:400}}>price:</Text>{item.price}</Text>
    <Text style={{fontSize:20,fontWeight:300}}><Text style={{fontSize:20,fontWeight:400}}>rating:</Text>{item.rating.rate}</Text> 
  </View>
  
    </Card>

  
  );

  return (
    <View>
  
      <FlatList
        data={data} // Pass the data array to the FlatList
        renderItem={renderData}
        keyExtractor={(item) => item.id.toString()} // Add a key extractor
      />
    </View>
  );
};

export default SingleProductDetail;
