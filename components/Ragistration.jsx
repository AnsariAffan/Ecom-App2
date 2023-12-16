import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { TextInput, Button, Title, Text, ActivityIndicator } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { getDataFromFireBase, userRagistration } from "./api/firebaseSlice";
import { useEffect } from "react";
import { postUserDataToFireStore } from "./api/mySlice";

const Ragistration = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    timestamp: null,
  });

  const loading = useSelector((state) => {
    return state.firebaseslice.loading;
  });
  const dispatch = useDispatch();

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    // console.log("test")
    dispatch(postUserDataToFireStore(formData))
    dispatch(userRagistration(formData));
  };

  useEffect(() => {
    dispatch(getDataFromFireBase());
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (


    <View style={styles.container}>
      <View
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          height: 300,
        }}
      >
        <Image
          source={require("../assets/logo2.png")}
          style={{ width: 200, height: 250, marginTop: 50 }}
        />
      </View>
      <Text
        style={{
          textAlign: "center",
          marginTop: 20,
          marginBottom: 20,
          fontSize: 30,
          color: "orange",
        }}
      >
        Registration
      </Text>
      <TextInput
        style={styles.Inputs}
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => handleInputChange("name", text)}
      />
      <TextInput
        style={styles.Inputs}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleInputChange("email", text)}
      />
      <TextInput
        style={styles.Inputs}
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => handleInputChange("password", text)}
        secureTextEntry
      />

      <Button
        mode="contained"
        onPress={() => handleSubmit(formData)}
        style={styles.button}
        disabled={loading}
        loading={loading}
      >
        Sign Up
      </Button>
      
      <Text
        style={{ marginTop: 20, marginLeft: 20 }}
        onPress={() => {
          navigation.navigate("Login");
        }}
      >
        Already have an account? Login
      </Text>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     justifyContent: "center",
//   },
//   button: {
//     marginTop: 16,
//   },
// });

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 50,
    backgroundColor: "white",
  },
  Inputs: {
    margin: 10,
  },
});

export default Ragistration;
