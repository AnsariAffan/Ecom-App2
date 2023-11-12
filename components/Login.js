import React, { useState } from "react";
import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { checkLogin, getDataFromFireBase } from "./api/firebaseSlice";

const Login = () => {
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const dispatch = useDispatch();

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (formData) => {
    dispatch(checkLogin(formData));
  };

  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <Title
        style={{
          textAlign: "center",
          color: "blue",
          marginButtom: 20,
          fontWeight: 50,
        }}
      >
        Login
      </Title>
      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleInputChange("email", text)}
      />
      <TextInput
        placeholder="Password"
       secureTextEntry
        value={formData.password}
        onChangeText={(text) => handleInputChange("password", text)}

      />
      <Button
        mode="contained"
        onPress={() => handleSubmit(formData)}
        style={styles.button}
      >
        Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  button: {
    marginTop: 16,
  },
});

export default Login;
