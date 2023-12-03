import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import SingleProductDetail from "./SingleProductDetail";
import Login from "./Login";
import Settings from "./Settings";
import Ragistration from "./Ragistration";
import AboutPage from "./AboutPage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CartScreen from "./CartScreen";
import HomeScreen from "./HomeScreen";
import { useDispatch, useSelector } from "react-redux";
import { getProductCount } from "./api/mySlice";
import Paypal from "./Paypal";

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="HomeScreens"
        component={HomeScreen}
      />
      <HomeStack.Screen
        name="SingleProductDetail"
        component={SingleProductDetail}
      />
      <HomeStack.Screen name="Login" component={Login} />
      <HomeStack.Screen name="Ragistration" component={Ragistration} />
      <HomeStack.Screen name="AboutPage" component={AboutPage} />
      <HomeStack.Screen  name="Paypal" component={Paypal} />
      {/* <HomeStack.Screen
        // options={{ headerShown: true  }}
        name="CartScreen"
        component={CartScreen}
        
      /> */}
    </HomeStack.Navigator>
  );
}

const StackNavigator = () => {
  const dispatch = useDispatch();
  const count = useSelector((state) => {
    return state.mySlice.count;
  });
  // console.log(count);

  useEffect(() => {
    dispatch(getProductCount());
  }, [count]);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          activeTintColor: "blue", // Change this to your desired active tab color
          inactiveTintColor: "gray", // Change this to your desired inactive tab color
        }}
        tabBarStyle={{
          backgroundColor: "green", // Change this to your desired background color
        }}
      >
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="home" color={color} size={size} />
            ),
          }}
          name="HomeScreen"
          component={HomeStackScreen}
        />

        <Tab.Screen
          options={{
            headerShown: true,
            
            tabBarLabel: "Cart",
            tabBarBadge: count, // Update the tabBarBadge
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name={"shopping-cart"} color={color} size={size} />
            ),
          }}
          name="CartScreen"
          component={CartScreen}
        />

        <Tab.Screen
          options={{
            headerShown: false,
            tabBarLabel: "Settings",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name={"cog"} color={color} size={size} />
            ),
          }}
          name="Settings"
          component={Settings}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
