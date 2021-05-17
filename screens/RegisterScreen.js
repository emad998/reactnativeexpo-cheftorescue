import React from "react";
import { useState } from "react";
import { StyleSheet, Text, View, Button, SafeAreaView, TextInput } from "react-native";
import {db, auth} from '../firbase'

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const registering = () => {
    auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      db.collection("users").doc(email).set({
        likes: [],
        email: email,
    })
    .then(() => {
      navigation.replace('Welcome')
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
      
    })
  }

  return (
    <SafeAreaView>
    <View>
      <Text>This is Register Screen</Text>
      <TextInput onChangeText={(text) => setEmail(text)} value={email} style={styles.input} placeholder="Enter your email" />
      <TextInput onChangeText={(text) => setPassword(text)} value={password} style={styles.input} placeholder="Enter your password" secureTextEntry />
      <Button title="Register" onPress={registering} />

    </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
      },
});
