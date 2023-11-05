import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { List } from 'react-native-paper';
import { FontAwesome5 } from 'react-native-vector-icons';

const Settings = ({navigation}) => {


  return (
    <View style={styles.container}>

   
    <List.Item 
    onPress={() =>  navigation.navigate("Login")}
    style={{borderWidth:1,borderRadius:6,padding:6,margin:10}}
      title="Login"
      left={() => <FontAwesome5 name="sign-in-alt" color="#000" size={20} />}
    />


  
    <List.Item
     onPress={() =>  navigation.navigate("Ragistration")}
      style={{borderWidth:1,borderRadius:6,padding:6,margin:10}}
      title="Register"
      left={() => <FontAwesome5 name="user-plus" color="#000" size={20} />}
    />
  
    <List.Item
     onPress={() =>  navigation.navigate("AboutPage")}
      style={{borderWidth:1,borderRadius:6,padding:6,margin:10}}
      title="About"
      left={() => <FontAwesome5 name="info" color="#000" size={20} />}
    />


  </View>

  );
};

const styles = StyleSheet.create({

  container: {

    marginTop:50,marginLeft:30,marginRight:30
  }

});

export default Settings;