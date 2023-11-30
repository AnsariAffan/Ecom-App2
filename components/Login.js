import React, { useState } from "react";
import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  TextInput,
  Button,
  Title,
  ActivityIndicator,
  Text,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  checkLogin,
  getDataFromFireBase,
  getLogginUserDeatils,
  userLogin,
  userSignout,
  userToken,
} from "./api/firebaseSlice";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useIsFocused } from "@react-navigation/native";

const Login = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const loading = useSelector((state) => {
    return state.firebaseslice.loading;
  });


  const isFocused = useIsFocused();
  console.log(isFocused)
  const dispatch = useDispatch();

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };



  const handleSubmit = async (formData) => {

      dispatch(userLogin(formData));
      navigation.navigate("HomeScreens")
      dispatch(userToken())
   
  };



const [user, setuser] = useState();
const auth = getAuth();



  useEffect(() => {
    dispatch(getDataFromFireBase());
  }, []);


  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      if (isFocused && user) {
        console.log(user);
        setuser(user)
        return user;
      } else{
        setuser(null)
      }
    });
  }, [isFocused]);

  return (
    <View style={styles.container}>
  
 {user? <Text>{user.email}</Text> : <Text>No user is logged in</Text>}

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
