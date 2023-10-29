
import React from 'react'
import SingleProductDetail from './SingleProductDetail'
import HomeScreen from './HomeScreen'

const Stack = () => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="SingleProductDetail" component={SingleProductDetail} />
  </Stack.Navigator>
  )
}

export default Stack