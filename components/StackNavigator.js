import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import HomeScreen from './HomeScreen';
import CartScreen from './CartScreen'; 
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SingleProductDetail from './SingleProductDetail';
import Login from './Login';
import Settings from './Settings';





const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen options={{headerShown:false}} name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="SingleProductDetail" component={SingleProductDetail} />
      <HomeStack.Screen name="Login" component={Login} />

    </HomeStack.Navigator>
  );
}


  

 const StackNavigator = () => {
  return (
    <NavigationContainer>

    <Tab.Navigator >
    <Tab.Screen  options={{headerShown:false ,tabBarLabel: 'Home',
    tabBarIcon: ({ color, size }) => (
      <FontAwesome5 name="home" color={color} size={size} />
    ),}} name="HomeScreen" component={HomeStackScreen} />

    <Tab.Screen options={{headerShown:false,tabBarLabel: 'Settings',
    tabBarIcon: ({ color, size }) => (
      <FontAwesome5 name={"cog"} color={color} size={size} />
    ) }} name="Settings" component={Settings} />

    </Tab.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
