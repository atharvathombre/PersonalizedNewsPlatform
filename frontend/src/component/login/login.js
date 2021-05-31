import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./login.css";
import { LoaderComponent } from "../loader/loader";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

import LoginContext from "../contexts/islogin";

function LoginComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    login,
    signup,
    resetPassword,
    createUser,
    userExists,
    sendVEmail,
  } = useAuth();
  const history = useHistory();
  const { isLogin, setisLogin } = useContext(LoginContext);

  const handlePasswordmatch = (p, cp) => {
    if (p != cp) {
      setError("Password don't matched");
      setCPassword(cp);
    } else {
      setError("");
      setCPassword(cp);
    }
  };

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password)
        .then((data) => {
          if (data.user.emailVerified == true) {
            localStorage.setItem("se-name", data.user.displayName);
            localStorage.setItem("se-uid", data.user.uid);
            localStorage.setItem("se-email", data.user.email);
            setisLogin({
              login: true,
              uid: data.user.uid,
              name: data.user.displayName,
              email: data.user.email,
              platform_selected: []
            });
            //check if user exists + create new instance
            userExists(data.user.uid, data.user.displayName, data.user.email, [
              1
            ]);
          } else {
            alert("E-Mail is not verifed, kindly check mail.");
            history.push("/");
          }
        })
        .catch((e) => {
          alert(e.message.toString());
          history.push("/");
        });
    } catch {
      setError("Failed to log in");
    }

    setLoading(false);
  }

  async function handleSignUp(e) {
    e.preventDefault();
    if (cpassword !== password) {
      return setError("Password don't matched");
    }
    try {
      setError("");
      setLoading(true);
      await signup(email, password) //auth fun
        .then((data) => {
          data.user.updateProfile({
            displayName: name,
          });
          sendVEmail();
        })
        .catch((e) => {
          history.push("/");
          alert(e);
        });
    } catch {
      setError("Failed to create an account");
    }
    setLoading(false);
  }

  async function handleForgotpass(e) {
    e.preventDefault();
    try {
      setError("");
      await resetPassword(email)
        .then((data) => {
          setMessage("Check your inbox for further instructions");
          console.log(data);
          history.push("/");
        })
        .catch((e) => {
          history.push("/");
          alert(e);
        });
    } catch {
      setError("Failed to reset password");
    }
  }

  const forgotbutton = () => {
    setMessage("");
    var element = document.getElementById("forgot");
    element.classList.toggle("toggle");
  };

  const registerbutton = () => {
    setMessage("");
    var element1 = document.getElementById("register");
    var element2 = document.getElementById("formContainer");
    element1.classList.toggle("toggle");
    element2.classList.toggle("toggle");
  };

  return loading == true ? (
    <>
      <LoaderComponent></LoaderComponent>
    </>
  ) : (
    <>
      <div className="parent-login">
        <div id="formContainer">
          <div className="formRight">
            {/* Forgot password form */}
            <form id="forgot" className="otherForm" onSubmit={handleForgotpass}>
              <header>
                <h1>Forgot Password</h1>
                <p>Seems like your password is missing</p>
              </header>
              <section>
                <label>
                  <p>Email</p>
                  <input
                    type="email"
                    placeholder=" "
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                  <span style={{ color: "#6de151" }}>{message}</span>
                  <div className="border" />
                </label>
                <button type="submit">Send email</button>
              </section>
              <footer>
                <button
                  type="button"
                  className="forgotBtn"
                  onClick={() => {
                    forgotbutton();
                  }}
                >
                  Back
                </button>
              </footer>
            </form>
            {/* Login form */}
            <form id="login" onSubmit={handleLogin}>
              <header>
                <h1>Welcome back</h1>
                <p>Login to continue</p>
              </header>
              <section>
                <label>
                  <p>E-mail</p>
                  <input
                    type="text"
                    placeholder=" "
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                  <div className="border" />
                </label>
                <label>
                  <p>Password</p>
                  <input
                    type="password"
                    placeholder=" "
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                  <div className="border" />
                </label>
                <button type="submit">Login</button>
              </section>
              <footer>
                <button
                  type="button"
                  className="forgotBtn"
                  onClick={() => {
                    forgotbutton();
                  }}
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  className="registerBtn"
                  onClick={() => {
                    registerbutton();
                  }}
                >
                  Need an account?
                </button>
              </footer>
            </form>
            {/* Register form */}
            <form id="register" className="otherForm" onSubmit={handleSignUp}>
              <header>
                <h1>Become a Bro</h1>
                <p>Register to gain full access</p>
              </header>
              <section>
                <label>
                  <p>Name</p>
                  <input
                    type="text"
                    placeholder=" "
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                  <div className="border"></div>
                </label>
                <label>
                  <p>Email</p>
                  <input
                    type="email"
                    placeholder=" "
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                  <div className="border" />
                </label>
                <label>
                  <p>Password</p>
                  <input
                    type="password"
                    placeholder=" "
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                  <div className="border" />
                </label>
                <label>
                  <p>Repeat Password</p>
                  <input
                    type="password"
                    placeholder=" "
                    onChange={(e) => {
                      handlePasswordmatch(password, e.target.value);
                    }}
                    value={cpassword}
                  />
                  <span style={{ color: "red" }}>{error}</span>
                  <div className="border" />
                </label>
                <button type="submit">Register</button>
              </section>
              <footer>
                <button
                  type="button"
                  className="registerBtn"
                  onClick={() => {
                    registerbutton();
                  }}
                >
                  Back
                </button>
              </footer>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export { LoginComponent };
