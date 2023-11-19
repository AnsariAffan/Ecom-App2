import React, { useState } from "react";
import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  TextInput,
  Button,
  Title,
  ActivityIndicator,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { checkLogin, getDataFromFireBase, getLogginUserDeatils } from "./api/firebaseSlice";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Login = ({navigation}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  

  const loading = useSelector((state) => {
    return state.firebaseslice.loading;
  });

  const userData = useSelector((state) => {
    return state.firebaseslice.userData;
  });
  const token = useSelector((state) => {
    return state.firebaseslice.token;
  });
  
console.log(token)

  const dispatch = useDispatch();

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };
  console.log("testing...............");
  const handleSubmit = async (formData) => {
     dispatch(checkLogin(formData));
    //  dispatch(getLogginUserDeatils(userData,token))
     navigation.navigate("HomeScreens")
  };

  const auth = getAuth();

useEffect(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {

      console.log(user)
    } 
  });
}, [auth]);


  useEffect(() => {
    dispatch(getDataFromFireBase());
    dispatch(checkLogin(formData));
 
  }, []);

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
        disabled={loading}
        loading={loading}
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
