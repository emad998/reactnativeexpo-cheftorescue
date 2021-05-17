import * as firebase from 'firebase'
import "firebase/firestore"
import "firebase/auth"


const firebaseConfig = {
    apiKey: "AIzaSyB8UPhx9ogpUewO07a14d-dHqLVprcBLqg",
    authDomain: "signal-clone-c9810.firebaseapp.com",
    projectId: "signal-clone-c9810",
    storageBucket: "signal-clone-c9810.appspot.com",
    messagingSenderId: "449243531119",
    appId: "1:449243531119:web:8b4308538709f099284a9a"
  };


let app;

if(firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);

}   else {
    app = firebase.app()
}

const db = app.firestore()
const auth = firebase.auth()

export {db, auth}