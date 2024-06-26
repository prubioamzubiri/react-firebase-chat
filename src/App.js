import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
//import 'firebase/analytics';

import "./styles.css";
import LoginForm from "./LoginForm";

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


firebase.initializeApp({
  apiKey: "AIzaSyAgee9r3urR8YvAeT5tjXl5UF8N8Ju7LwE",
  authDomain: "chat-firebase-9235e.firebaseapp.com",
  projectId: "chat-firebase-9235e",
  storageBucket: "chat-firebase-9235e.appspot.com",
  messagingSenderId: "760646584713",
  appId: "1:760646584713:web:010ea1bbb2207eed37f958"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
//const analytics = firebase.analytics();

function App() {

  const [user] = useAuthState(auth);
  

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}



function SignIn() {

  const [isShowLogin, setIsShowLogin] = useState(true);
  const [isShowSignup, setIsShowSignup] = useState(true);


  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  const logInPop = () => {
    if(!isShowSignup){
      setIsShowSignup((isShowSignup) => !isShowSignup);
    }
      setIsShowLogin((isShowLogin) => !isShowLogin);
  }

  const SignUpPop = () => {
    if(!isShowLogin){
      setIsShowLogin((isShowLogin) => !isShowLogin);
    }
    setIsShowSignup((isShowSignup) => !isShowSignup);   
  }

  const signInWithEmail = () => {
    const email = document.getElementById("usernamesignin").value;
    const password = document.getElementById("passwordsignin").value;
    auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      document.getElementById("errorMessage").innerHTML = "<h2>"+errorCode + " " + errorMessage + "</h2>";
    });

    setIsShowLogin((isShowLogin) => !isShowLogin);
  }

  const signUpWithEmail = () => {
    const email = document.getElementById("usernamesignup").value;
    const password = document.getElementById("passwordsignup").value;
    auth.createUserWithEmailAndPassword(email, password).then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
    }
    ).catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      document.getElementById("errorMessage").innerHTML = "<h2>"+errorCode + " " + errorMessage + "</h2>";
      // ..
    });
    setIsShowSignup((isShowSignup) => !isShowSignup);
  }

  return (
    <>
      <h1 style={{ color: 'orange' }}>Chat</h1>
      <div id='errorMessage'></div>
      <button className="sign-in" onClick={logInPop}>Sign in with Email</button>
      <br></br>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <br></br>
      <a style={{ color: 'white' }} onClick={SignUpPop} >Registarse</a>
        <div className="LoginPopUp">
          <LoginForm isShowLogin={isShowLogin} submit={signInWithEmail} searchId="signin" topText="Sign In" />
          <LoginForm isShowLogin={isShowSignup} submit={signUpWithEmail} searchId="signup" topText="Sign Up" />
        </div>
  
        
      </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>
    
    <form class='sendMessage' onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>)
}

function deleteMessage(message) {
  const messageRef = firestore.collection('messages').doc(message.id);
  messageRef.delete();
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img alt="Profile" src={photoURL || 'https://cdn4.iconfinder.com/data/icons/flat-pro-business-set-1/32/people-customer-unknown-512.png'} />
      <p>{text}</p>
      {uid === auth.currentUser.uid && (
        <button id="delete_message" onClick={() => deleteMessage(props.message)}>
          <span role="img" aria-label="delete">🗑️</span>
        </button>
      )}
    </div>
  )
}


export default App;
