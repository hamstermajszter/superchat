import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCytXzG-R1TvG9Q1fKvACk7dJZ0keCoacg",
  authDomain: "superchat-cdc12.firebaseapp.com",
  databaseURL: "https://superchat-cdc12.firebaseio.com",
  projectId: "superchat-cdc12",
  storageBucket: "superchat-cdc12.appspot.com",
  messagingSenderId: "364248332122",
  appId: "1:364248332122:web:55adbe3c683b99be6fa563"

})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  return (
    <div className="App">
      <header className="App-header">
hello
      </header>
    </div>
  );
}

export default App;
