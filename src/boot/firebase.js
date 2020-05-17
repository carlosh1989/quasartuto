import * as firebase from "firebase/app";
import "firebase/firestore";

// Agregar configuración firebase:
var firebaseConfig = {
    apiKey: "AIzaSyDmY-q-o9C8G4QRswVxUl9v6C2Aei_t6Kg",
    authDomain: "todo-win-b2ee3.firebaseapp.com",
    databaseURL: "https://todo-win-b2ee3.firebaseio.com",
    projectId: "todo-win-b2ee3",
    storageBucket: "todo-win-b2ee3.appspot.com",
    messagingSenderId: "183891041619",
    appId: "1:183891041619:web:bebf81e34a48852b1f15a6"
};

let firebaseApp = firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

export { db, firebase };