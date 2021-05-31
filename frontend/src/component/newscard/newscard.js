import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Link, useHistory } from "react-router-dom";
import { LoaderComponent } from "../loader/loader";
import { PlatformselectComponent } from "../platformselect/platformselect";

import "./newscard.css";

function NewscardComponent() {
  const history = useHistory();
  const [initialData, setInitialData] = useState([
    { imageURL: "", body: "", headline: "", source: "", date:"0 0" },
  ]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    var uid = localStorage.getItem("se-uid");
    fetch("https://se-lab-backend-ptfwc.run-ap-south1.goorm.io/newsapi", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(uid),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setInitialData(data.news);
        //setInitialData(userid);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setCount(count + 1);
  }, [initialData]);

  const logoutButoon = () => {
    localStorage.removeItem("se-name");
    localStorage.removeItem("se-email");
    localStorage.removeItem("se-platform_selected");
    localStorage.removeItem("se-uid");
    window.location.reload();
  };

  const hitplatform = () => {
    history.push("/platform_select");
  };

  if (
    localStorage.getItem("se-name") == undefined ||
    localStorage.getItem("se-uid") == undefined ||
    localStorage.getItem("se-email") == undefined
  ) {
    history.push("/");
  }
  return count < 2 ? (
    <LoaderComponent></LoaderComponent>
  ) : (
    <>
      <div className="parent-newscard">
        <div style={{width:"100%"}}>
          <h3 style={{ padding: "20px" }}>
            Hi, {localStorage.getItem("se-name")}
          </h3>
          <button
            style={{
              padding: "10px 24px",
              backgroundColor: "grey",
              color: "white",
            }}
            onClick={() => {
              logoutButoon();
            }}
          >
            Logout
          </button>
          <button
            style={{
              padding: "10px 24px",
              backgroundColor: "grey",
              color: "white",
            }}
            onClick={() => {
              hitplatform();
            }}
          >
            Select Platform
          </button>
        </div>
        <br></br>
        {initialData.map((x) => (
          <figure className="snip1216" key={Math.random()}>
            <div className="image">
              <img src={x.imageURL} alt="sample69" />
            </div>
            <figcaption>
              <div className="date">
                <span className="day">{x.date.split(" ")[0]}</span>
                <span className="month">{x.date.split(" ")[1]}</span>
              </div>
              <h3>{x.headline}</h3>
              <p className="para">{x.body}</p>
            </figcaption>
            <footer>
              <div className="views">
                <i className="ion-eye" />
                {x.source}
              </div>
            </footer>
            <a href="#" />
          </figure>
        ))}
      </div>
    </>
  );
}

export { NewscardComponent };
