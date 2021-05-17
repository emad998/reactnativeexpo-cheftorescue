import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  TextInput,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import { db, auth } from "../firbase";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";


import * as firebase from 'firebase'
import "firebase/firestore"

const WelcomeScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState(null)
  const [mealData, setMealData] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [measures, setMeasures] = useState([]);
  const [imageSrc, setImageSrc] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState(null);
  const [adding, setAdding] = useState(false)
  const [addedText, setAddedText] = useState(false)

  const signingOut = () => {
    auth
      .signOut()
      .then(() => navigation.replace("Login"))
      .catch((error) => alert(error));
  };

  useEffect(() => {
      auth.onAuthStateChanged(function(user) {
          if (user) {
            setUserEmail(user.email)
          } else {
            navigation.replace('Login')
          }
        });
  }, [])

  const grabbingMeal = () => {
    axios
      .get("https://www.themealdb.com/api/json/v1/1/random.php")
      .then((res) => {
        setMealData(res);
        let property = "";
        let ingredientsArray = [];
        let measuresArray = [];
        for (property in res.data.meals[0]) {
          for (let i = 0; i <= 20; i++) {
            if (property == "strIngredient" + i) {
              ingredientsArray.push(res.data.meals[0][property]);
            }
          }
        }
        for (property in res.data.meals[0]) {
          for (let i = 0; i <= 20; i++) {
            if (property == "strMeasure" + i) {
              measuresArray.push(res.data.meals[0][property]);
            }
          }
        }

        setIngredients(ingredientsArray);
        setMeasures(measuresArray);
        setImageSrc(res.data.meals[0].strMealThumb);
        setYoutubeLink(res.data.meals[0].strYoutube);
        
      });
  };

  const addingToFavorites = ( nameOfMeal, idOfMeal) => {
    db.collection('users').doc(userEmail).update({
        likes : firebase.firestore.FieldValue.arrayUnion({mealDatabaseName: nameOfMeal, mealDatabaseId: idOfMeal})
    }). then(() => {
        if(adding == false) {
            setAdding(true)
          } else if (adding == true) {
            setAdding(false)
          }
        setAddedText(true)
    })
    
    
  }

  return (
    <ScrollView>
      <Text>Welcome {userEmail}</Text>
      <Button title="Go To your Favorites" onPress={() => navigation.navigate('Favorites', {userEmail: userEmail})} />

      <Button title="Generate A Meal" onPress={grabbingMeal} />
      <Text>
        This is the welcome screen where we initially render the meal data
      </Text>
      <Button title="Sign Out" onPress={signingOut} />

      <View style={styles.directionContainer}>
        <View style={styles.ingredientsContainer}>
          {ingredients.map((ingredient, index) => {
            if (ingredient) {
              return <Text key={index}>{ingredient}</Text>;
            }
          })}
        </View>

        <View style={styles.measuresContainer}>
          {measures.map((measure, index) => {
            if (measure && measure != " ") {
              return <Text key={index}>{measure}</Text>;
            }
          })}
        </View>
      </View>
      <Image
        style={styles.tinyLogo}
        source={{
          uri: `${imageSrc}`,
        }}
      />

      {youtubeLink && (
        <Text
          style={{ color: "blue", textAlign: "center" }}
          onPress={() => Linking.openURL(`${youtubeLink}`)}
        >
          YouTube Link
        </Text>
      )}

        {mealData && (
            <Button  title="Add to favorites" onPress={() => addingToFavorites(mealData.data.meals[0].strMeal , mealData.data.meals[0].idMeal)} />
        )}

        {addedText && (
            <View>
                <Text>item added</Text>
            </View>
        )}
    </ScrollView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  directionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  ingredientsContainer: {
    backgroundColor: "green",
    width: 150,
  },
  measuresContainer: {
    backgroundColor: "cyan",
    width: 150,
  },
  tinyLogo: {
    width: 250,
    height: 250,
    marginLeft: 70,
    marginTop: 30,
  },
});
