import React, {useRef, useState } from 'react';
import './styles/App.css';
import "./styles/styles.css";

import { initializeApp } from "firebase/app"
import { getAuth, signOut} from 'firebase/auth';
import {getFirestore} from "firebase/firestore";

import { useAuthState } from 'react-firebase-hooks/auth';



import SignIn from './components/SignIn';
import ChatRoom from './components/ChatRoom';
import SignOut from './components/SignOutNavBar';


const firebaseApp = initializeApp({
  apiKey: "AIzaSyAgee9r3urR8YvAeT5tjXl5UF8N8Ju7LwE",
  authDomain: "chat-firebase-9235e.firebaseapp.com",
  projectId: "chat-firebase-9235e",
  storageBucket: "chat-firebase-9235e.appspot.com",
  messagingSenderId: "760646584713",
  appId: "1:760646584713:web:010ea1bbb2207eed37f958"
})

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);



function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut auth = {auth}/>
      </header>

      <section>
        {user ? <ChatRoom auth = {auth} firestore = {db}/> : <SignIn auth = {auth}/>}
      </section>

    </div>
  );
}

export default App;
