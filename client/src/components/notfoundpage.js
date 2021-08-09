import React, { Component } from "react";
import BeatLoader from "react-spinners/MoonLoader";
import "./loadingScreen.css";
import { css } from "@emotion/react";
import "./notfoundpage.css";
function NotFoundPage({ is404 }) {
  return (
    <>
      {is404 ? (
        <div id="notfound">
          <div class="notfound">
            <div class="notfound-404">
              <h1>Oops!</h1>
            </div>
            <h2>404 - Page not found</h2>
            <p>
              The page you are looking for might have been removed had its name
              changed or is temporarily unavailable.
            </p>
            <a href="/">Go To Homepage</a>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default NotFoundPage;
