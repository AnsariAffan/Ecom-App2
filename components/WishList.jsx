import { useIsFocused } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import {View, StyleSheet} from 'react-native';
import { Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { userWishList } from './api/firebaseSlice';

const WishList = () => {
    const auth = getAuth();
    const [user, setuser] = useState();
    const isFocused = useIsFocused();
const dispatch = useDispatch()

    const myWishList = useSelector((state) => {
        return state.firebaseslice.myWishList;
      });
console.log(myWishList)

useEffect(() => {
    dispatch(userWishList())
}, []);

    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (isFocused && user) {
          // console.log(user);
          setuser(user);
          return user;
        } else {
          setuser(null);
        }
      });
    }, [isFocused]);

    return (
        <View>
      {user?<Text>User WishList</Text>:<Text style={{flex:1,justifyContent:"center"}}>Please login</Text>}
        </View>
    );
}

const styles = StyleSheet.create({})

export default WishList;
