import { useIsFocused } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import {View, StyleSheet} from 'react-native';
import { Text } from 'react-native-paper';

const Oders = () => {

    const auth = getAuth();
    const [user, setuser] = useState();
    const isFocused = useIsFocused();
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
      {user?<Text>User oders</Text>:<Text style={{flex:1,justifyContent:"center"}}>Please login</Text>}
        </View>
    );
}

const styles = StyleSheet.create({})

export default Oders;
