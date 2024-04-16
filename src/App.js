import React, { useEffect, useRef, useState } from 'react';
import './App.css';

import { initializeApp } from "firebase/app"
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { setDoc, getDocs, getFirestore, collection, deleteDoc, orderBy, limit, doc, serverTimestamp, query, Query, where, getDoc } from "firebase/firestore";

import "./styles.css";
import LoginForm from "./LoginForm";

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


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


  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
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
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
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
    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
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
    <button className="sign-out" onClick={() => signOut(auth)}>Sign Out</button>
  )
}


function ChatRoom() {
  
  const dummy = useRef();

  const messagesRef = collection(db, "messages");
  const q = query(collection(db, "messages"), orderBy("createdAt"), limit(25));
  //const query = query(messagesRef, orderBy("createdAt"), limit(25));
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(q);
      const fetchedMessages = querySnapshot.docs.map((doc) => doc.data());
      setMessages(fetchedMessages);
    };
    fetchData();
  }, []);

/*   useEffect(() => {
    async function fetchData() {
      messages = await getDocs(q);
    }
    fetchData();
  }, []); */


  //const messagesRef = collection(db, 'messages');
  //const q = query(messagesRef, orderBy("createdAt"), limit(25));

  //const [messages] = useCollectionData(q, { idField: 'id' });


  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    const messageId = Math.random().toString(36).substring(2, 10);

    await setDoc(doc(db, "messages", messageId), {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>
    
    <form className='sendMessage' onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>)
}

function deleteMessage(message) {  
  //deleteDoc(doc(db, "messages", message));
  var collectionRef = collection(db,"messages");
  var q = query(collectionRef, where("uid", "==", message.uid), where("text", "==", message.text), where("createdAt", "==", message.createdAt));
  var document = getDocs(q).then(async (querySnapshot) => {
    const firstDoc = querySnapshot.docs[0];
    var docId = firstDoc.id;
    var documentRef = doc(db, "messages", docId)
    await deleteDoc(documentRef);
    // Do something with the first document
  });
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
