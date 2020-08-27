import * as firebase from 'firebase/app'
import 'firebase/firestore'
import "firebase/auth"

var firebaseConfig = {
    apiKey: "AIzaSyBnLzj7-yEMl5iCn-CONcVCeop8qrhLdmY",
    authDomain: "servicemotor20.firebaseapp.com",
    databaseURL: "https://servicemotor20.firebaseio.com",
    projectId: "servicemotor20",
    storageBucket: "servicemotor20.appspot.com",
    messagingSenderId: "839197343266",
    appId: "1:839197343266:web:cea63e4e6f174461ff147b",
    measurementId: "G-ML614SQCKM"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase