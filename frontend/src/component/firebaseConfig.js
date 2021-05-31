import firebase from "firebase/app"
import "firebase/auth"
import 'firebase/database';

const app = firebase.initializeApp({
  apiKey: "AIzaSyAQLreUMdqOmuYwa6lBAetxM8HMGxH0kmE",
  authDomain: "selab-26f04.firebaseapp.com",
  databaseURL: "https://selab-26f04-default-rtdb.firebaseio.com/",
  projectId: "selab-26f04",
  storageBucket: "selab-26f04.appspot.com",
  messagingSenderId: "265607055416",
  appId: "1:265607055416:web:d5abb112ec8e826d4ebecd",
  measurementId: "G-FPB64ZH0XG"
})

export const auth = app.auth()
export const db = app.database()
export default app
