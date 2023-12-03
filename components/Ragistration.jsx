import { Password } from "@mui/icons-material";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { getDataFromFireBase, setDataToFireBase, userRagistration } from "./api/firebaseSlice";
import { useEffect } from "react";

const Ragistration = ({navigation}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    timestamp: null,
  });

  const userData = useSelector((state) => {
    return state.firebaseslice.userData;
  });
  const loading= useSelector((state)=>{return state.firebaseslice.loading})
  const dispatch = useDispatch();

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    console.log("test")
    dispatch(userRagistration(formData))
  };

  useEffect(() => {
    dispatch(getDataFromFireBase());
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
        Ragistration
      </Title>

      <TextInput
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => handleInputChange("name", text)}
      />
      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleInputChange("email", text)}
      />
      <TextInput
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => handleInputChange("password", text)}
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={()=>handleSubmit(formData)}
        style={styles.button}
        disabled={loading}
        loading={loading}
      >
       Ragistration
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

export default Ragistration;
