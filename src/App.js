import React, {useRef, useState } from 'react';
import './styles/App.css';
import "./styles/styles.css";

import { initializeApp } from "firebase/app"
import { getAuth, signOut} from 'firebase/auth';
import { setDoc, getDocs, getFirestore, collection, deleteDoc, orderBy, limit, doc, serverTimestamp, query, where} from "firebase/firestore";

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


import SignIn from './components/SignIn';


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
        {user ? <ChatRoom /> : <SignIn auth = {auth}/>}
      </section>

    </div>
  );
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => signOut(auth)}>Sign Out</button>
  )
}






function ChatRoom() {
  
  const dummy = useRef();


  const [messages, loadingMessages, error, snapshot] = useCollectionData(query(
    collection(db, "messages"),
    orderBy("createdAt"),
    limit(50)
));



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

function deleteMessage(props) {  
  var message = props.message;
  //deleteDoc(doc(db, "messages", message));
  var collectionRef = collection(db,"messages");
  var q = query(collectionRef, where("uid", "==", message.uid), where("text", "==", message.text), where("createdAt", "==", message.createdAt));
  var document = getDocs(q).then(async (querySnapshot) => {
    const firstDoc = querySnapshot.docs[0];
    var docId = firstDoc.id;
    var documentRef = doc(db, "messages", docId)
    await deleteDoc(documentRef);

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
        <button id="delete_message" onClick={() => deleteMessage(props)}>
          <span role="img" aria-label="delete">🗑️</span>
        </button>
      )}
    </div>
  )
}


export default App;
