import React from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';

const AboutPage = () => {
    const { width, height } = Dimensions.get("window");
    return (
        <View style={{display:"flex",justifyContent:"center",height:height}}>
            <Text style={{textAlign:"center"}}>Application Version: 1.0.0</Text>
            <Text style={{textAlign:"center"}}>Developer Name: Anaf </Text>
            <Text style={{textAlign:"center"}}>Contact: anaf04@gmail.com</Text>
        </View>
    );
}

const styles = StyleSheet.create({})

export default AboutPage;
