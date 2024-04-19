import React from "react";

import { signOut } from "firebase/auth";

function SignOut(props) {

    const auth = props.auth;

    return auth.currentUser && (
      <button className="sign-out" onClick={() => signOut(auth)}>Sign Out</button>
    )
  }

export default SignOut;