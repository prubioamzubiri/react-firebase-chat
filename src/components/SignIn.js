import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword} from 'firebase/auth';


import React from 'react';
import { useState } from 'react';

import LoginForm from './LoginForm';

function SignIn(props) {

    const auth = props.auth;

    const [isShowLogin, setIsShowLogin] = useState(true);
    const [isShowSignup, setIsShowSignup] = useState(true);
  
  
  
    const signInWithGoogle = async () => {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider).then((result) => {
      }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        document.getElementById("errorMessage").innerHTML = "<h2>"+errorCode + " " + errorMessage + "</h2>";
      }
      );
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
      }
      ).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        document.getElementById("errorMessage").innerHTML = "<h2>"+errorCode + " " + errorMessage + "</h2>";
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

  export default SignIn;

