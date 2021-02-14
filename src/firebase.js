// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseApp= firebase.initializeApp({
    apiKey: "AIzaSyC2nbwA47WHebVfS0Gwts6ALyqoqaVCqtM",
    authDomain: "instagram-clone-react-48d55.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-48d55.firebaseio.com",
    projectId: "instagram-clone-react-48d55",
    storageBucket: "instagram-clone-react-48d55.appspot.com",
    messagingSenderId: "675669774991",
    appId: "1:675669774991:web:4673a00c410d7caf2c16fa",
    measurementId: "G-ERX4JVQ0PC"
});

const db=firebaseApp.firestore();
const auth=firebase.auth();
const storage=firebase.storage();

export{db, auth, storage};

//   export default db;