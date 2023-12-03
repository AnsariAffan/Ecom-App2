import React from 'react';
import {View, StyleSheet, Dimensions, Image} from 'react-native';

const LandingIcon = () => {
    const { width, height } = Dimensions.get("window");
    return (
        <View
        style={{
          height: height,
          width: width,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Image
            style={{ height: 200, width: 200 }}
            source={require("../assets/landingIcon.png")}
          />
        </View>
      </View>
    );
}

const styles = StyleSheet.create({})

export default LandingIcon;
