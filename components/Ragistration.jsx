import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';


const Ragistration=()=>{


    return (
        <View style={styles.container}>
          <Title style={{textAlign:"center",color:"blue",marginButtom:20,fontWeight:50}}>Login</Title>
          <TextInput
            label="Username"
          />
          <TextInput
            label="Password"
            secureTextEntry
          />
          <Button mode="contained" onPress={console.log("passed")} style={styles.button}>
            Login
          </Button>
        </View>

      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        
      },
      button: {
        marginTop: 16,
      },
    });

export default Ragistration;