import React from "react";

const LoginForm = ({ isShowLogin, topText, searchId, submit}) => {

  var usernameId = "username" + searchId;
  var passwordId = "password" + searchId;

  return (
    <div className={`${isShowLogin ? "active" : ""} show`}>
      <div className="login-form">
        <div className="form-box solid">
          <form>
            <h1 className="login-text">{topText}</h1>
            <label>Username</label>
            <br></br>
            <input type="text" id={usernameId} name="username" className="login-box" />
            <br></br>
            <label>Password</label>
            <br></br>
            <input type="password" id={passwordId} name="password" className="login-box" />
            <br></br>
            <input type="button" value={topText} onClick={submit} className="login-btn" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
