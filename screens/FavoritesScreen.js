import React, { useState } from "react";
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

import * as firebase from 'firebase'
import "firebase/firestore"

const FavoritesScreen = ({ navigation, route }) => {
  const { userEmail } = route.params;

  const [mealData, setMealData] = useState(null);
  const [yourLikes, setYourLikes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [measures, setMeasures] = useState([]);
  const [imageSrc, setImageSrc] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(userEmail)
      .onSnapshot((doc) => {
        // console.log("Current data: ", doc.data());
        setYourLikes(doc.data().likes);
      });
    return unsubscribe;
  }, [deleting]);

  const handleShowMeal = (idOfMeal) => {
    axios
      .get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idOfMeal}`)
      .then((res) => {
          console.log(idOfMeal, res)
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

  const handleDeleteMeal = (nameOfMeal, idOfMeal) => {
    db.collection("users")
      .doc(userEmail)
      .update({
        likes: firebase.firestore.FieldValue.arrayRemove({
          mealDatabaseId: idOfMeal,
          mealDatabaseName: nameOfMeal,
        }),
      });
    if (deleting == false) {
      setDeleting(true);
    } else if (deleting == true) {
      setDeleting(false);
    }
  };

  const signingOut = () => {
    auth
      .signOut()
      .then(() => navigation.replace("Login"))
      .catch((error) => alert(error));
  };

  return (
    <ScrollView>
      <Text>Hello {userEmail}</Text>
      <Text>Your Current Favorites</Text>
      <Button title="Sign Out" onPress={signingOut} />
      {yourLikes &&
          yourLikes.map((oneLike, index) => (
            <View key={index}>
                <Text>{oneLike.mealDatabaseName}</Text>
                <Button onPress={() => handleShowMeal(oneLike.mealDatabaseId)} title="Show Meal" />
                <Button onPress={() => handleDeleteMeal(oneLike.mealDatabaseName, oneLike.mealDatabaseId)} title="Delete Meal" />
            </View>
          ))}

{mealData &&
        <>
        <Text>Meal Name: {mealData.data.meals[0].strMeal}</Text>
          <Text>Cuisine: {mealData.data.meals[0].strArea}</Text>
          <Text>Category: {mealData.data.meals[0].strCategory}</Text>
        
            <View style={styles.directionContainer}>
            <View style={styles.ingredientsContainer}>
          <Text>Ingredients</Text>
                
            {ingredients.map((ingredient, index) => {
              if (ingredient) {
                return (
                    
                <Text key={index}>{ingredient}</Text>
                
                )
              }
            })}
            </View>
         

        <View style={styles.measuresContainer}>
          <Text>Measure</Text>
         
            {measures.map((measure, index) => {
             
              if (measure) {
                return (
                    
                <Text key={index}>{measure}</Text>
                
                )
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
        
        </>
        }


    </ScrollView>
  );
};

export default FavoritesScreen;

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
