import { useIsFocused } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Card, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { getUserWishList, userWishList } from "./api/firebaseSlice";

const WishList = ({ navigation }) => {
  const auth = getAuth();
  const [user, setuser] = useState();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const myWishList = useSelector((state) => {
    return state.firebaseslice.myWishList;
  });
  console.log(myWishList);

  useEffect(() => {
    dispatch(getUserWishList());
  }, [isFocused]);

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
    <ScrollView>
      <View>
        {user ? (
          <FlatList
            data={myWishList}
            renderItem={({ item }) => (
              <Card
                style={styles.card}
                onPress={() =>
                  navigation.navigate("SingleProductDetail", { id: item.id })
                }
              >
                <Card.Content>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Card.Cover
                      source={{ uri: item.image }}
                      resizeMode="contain"
                      style={{
                        backgroundColor: "transparent",
                        height: 50,
                        width: 50,
                      }}
                    />
                    <Text style={styles.cardTitle}>{item.title}</Text>
                  </View>

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Text style={styles.cardPrice}>price ${item.price}</Text>
                    <TouchableOpacity onPress={() => deleteItems(item.id)}>
                      <Card.Cover
                        source={require("../assets/DeleteButtonIcon.png")}
                        resizeMode="contain"
                        style={{
                          backgroundColor: "transparent",
                          height: 35,
                          width: 35,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </Card.Content>
              </Card>
            )}
            numColumns={1}
          />
        ) : (
          <Text style={{ flex: 1, justifyContent: "center" }}>
            Please login
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  card: {
    margin: 8,
    backgroundColor: "white",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardPrice: {
    fontSize: 20,
    color: "green",
    textAlign: "left",
    paddingRight: 20,
  },
  noProducts: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    color: "blue",
    fontWeight: "bold",
    marginTop: 100,
  },
});

export default WishList;
