import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { Link, useHistory } from "react-router-dom";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function userExists(uid, name, email, arr) {
    db.ref()
      .child("users")
      .child(uid)
      .get()
      .then(function (snapshot) {
        if (snapshot.exists()) {
          localStorage.setItem(
            "se-platform_selected",
            snapshot.val().platform_selected
          );
          history.push("/news");
        } else {
          db.ref("users/" + uid).set({
            uid: uid,
            name: name,
            email: email,
            platform_selected: arr,
          });
          localStorage.setItem(
            "se-platform_selected",
            arr
          );
          history.push("/platform_select");
        }
      });
  }

  function changePlatform(uid, parr) {
    db.ref()
      .child("users")
      .child(uid)
      .update({ platform_selected: parr })
      .then(() => {
        localStorage.setItem("se-platform_selected", parr);
        history.push("/news");
      })
      .catch((e) => {
        alert(e);
      });
  }

  function sendVEmail() {
    var user = auth.currentUser;
    user
      .sendEmailVerification()
      .then(function () {
        return true;
      })
      .catch(function (error) {
        return false;
      });
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    sendVEmail,
    login,
    signup,
    userExists,
    changePlatform,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
