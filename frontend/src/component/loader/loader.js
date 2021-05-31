import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./loader.css";

function LoaderComponent() {
  return (
    <>
      <div className="parent-loader">
        <div className="loader">
          <div className="inner one"></div>
          <div className="inner two"></div>
          <div className="inner three"></div>
        </div>
      </div>
    </>
  );
}

export { LoaderComponent };
