import * as React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Button, List } from "react-native-paper";
import { FontAwesome5 } from "react-native-vector-icons";
import { userSignout } from "./api/firebaseSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";

import Paypal from "./Paypal";


const Settings = ({ navigation }) => {

  const dispatch = useDispatch();

  const handleSignout = async () => {
    dispatch(userSignout());
    console.log("handleSignout");
    navigation.navigate("HomeScreens", { reload: true });
  };

  const loading = useSelector((state) => {
    return state.firebaseslice.loading;
  });

  const isFocused = useIsFocused();
  console.log(isFocused);

  const auth = getAuth();
  const [user, setuser] = useState();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (isFocused && user) {
        console.log(user);
        setuser(user);
        return user;
      } else {
        setuser(null);
      }
    });
  }, [isFocused]);

  return (
    <View style={styles.container}>

      <List.Item
        onPress={() => navigation.navigate("AboutPage")}
        style={{ borderWidth: 1, borderRadius: 6, padding: 6, margin: 10 }}
        title="About"
        left={() => <FontAwesome5 name="info" color="#000" size={20} />}
      />

      {user == null ? (
        <>
         
          <List.Item
            onPress={() => navigation.navigate("Login")}
            style={{ borderWidth: 1, borderRadius: 6, padding: 6, margin: 10 }}
            title="Login"
            left={() => (
              <FontAwesome5 name="sign-in-alt" color="#000" size={20} />
            )}
          />
          <List.Item
            onPress={() => navigation.navigate("Ragistration")}
            style={{ borderWidth: 1, borderRadius: 6, padding: 6, margin: 10 }}
            title="Register"
            left={() => (
              <FontAwesome5 name="user-plus" color="#000" size={20} />
            )}
          />
        </>
      ) : (
        <Button
        mode="contained"
        onPress={() => handleSignout()}
        style={styles.button}
        disabled={loading}
        loading={loading}
      >
        Sign out
      </Button>
      )}
{/* 

<Paypal/> */}



     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    marginLeft: 30,
    marginRight: 30,
  },
});

export default Settings;
