


import React, { useState } from "react";
import { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import {
  TextInput,
  Button,
  Title,
  Text,
  ActivityIndicator,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  getDataFromFireBase,
  userLogin,
  userRagistrationIntoRealTimeStorage,
  userToken,
} from "./api/firebaseSlice";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useIsFocused } from "@react-navigation/native";


export default function Login({ navigation }) {
  const goToRegistration = () => {
    navigation.navigate("Registration");
  };
  const isFocused = useIsFocused();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const loading = useSelector((state) => {
    return state.firebaseslice.loading;
  });

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (formData) => {
    // dispatch(userRagistrationIntoRealTimeStorage(formData))
    dispatch(userLogin(formData));
    navigation.navigate("HomeScreens");
    dispatch(userToken());
  };

  const [user, setuser] = useState();
  const auth = getAuth();



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
          style={{ width: 200, height: 300, marginTop: 50 }}
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
        Login
      </Text>

      <TextInput
        style={styles.Inputs}
        label="Email"
        value={formData.email}
        onChangeText={(text) => handleInputChange("email", text)}
      />
      <TextInput
        style={styles.Inputs}
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => handleInputChange("password", text)}
      />

      <Button
        mode="contained"
        onPress={() => handleSubmit(formData)}
        style={styles.button}
        disabled={loading}
        loading={loading}
      >
        Login
      </Button>
      <Text
        style={{ marginLeft: 20, marginTop: 20 }}
      onPress={()=>{navigation.navigate("Ragistration")}}
      >
        Don't have an account? Registration
      </Text>
    </View>
  );
}

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
