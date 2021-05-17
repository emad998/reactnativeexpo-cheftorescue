import React from "react";
import { useState } from "react";
import { StyleSheet, Text, View, Button, SafeAreaView, TextInput } from "react-native";
import { StatusBar } from 'expo-status-bar';
import {db, auth} from '../firbase'

const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);


    const logging = () => {
        auth.signInWithEmailAndPassword(email, password)
        .then(() => navigation.replace('Welcome'))
        .catch((error) => alert(error))
    }

  return (
      <SafeAreaView>
    <View style={styles.container}>
      <Text>Welcome to Chef to the Rescue</Text>
      <TextInput onChangeText={(text) => setEmail(text)} value={email} style={styles.input} placeholder="Enter your email" />
      <TextInput onChangeText={(text) => setPassword(text)} value={password} style={styles.input} placeholder="Enter your password" secureTextEntry />
      <Button title="Login" onPress={logging}/>
      <Button title="Register" onPress={() => navigation.navigate('Register')}/>
      {/* <StatusBar style="auto" /> */}
    </View>
    
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    // padding: 20
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
});
