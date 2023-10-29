import * as React from 'react';
import { Image, View } from 'react-native';
import { List } from 'react-native-paper';
import { FontAwesome5 } from 'react-native-vector-icons';

const Settings = () => {


  return (
    <View style={{}}>
<Image source={require("../assets/userProfile.jpg")} style={{width:30,height:30}}/>
   
    <List.Item
      title="Login"
      left={() => <FontAwesome5 name="sign-in-alt" color="#000" size={20} />}
    />


  
    <List.Item
      title="Register"
      left={() => <FontAwesome5 name="user-plus" color="#000" size={20} />}
    />
  
    <List.Item
      title="About"
      left={() => <FontAwesome5 name="info" color="#000" size={20} />}
    />

<List.Item
      title="About"
      left={() => <FontAwesome5 name="info" color="#000" size={20} />}
    />
  </View>

  );
};

export default Settings;