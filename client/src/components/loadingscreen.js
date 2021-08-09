import React, { Component } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import "./loadingScreen.css";
import { css } from "@emotion/react";
function LoadingScreen({ isloading }) {
  const override = css`
    display: block;
    text-align: center;
    border-color: #0275d8;
  `;
  return (
    <>
      {isloading ? (
        <>
        <br/>
          <BeatLoader
            color={"red"}
            loading={isloading}
            css={override}
            size={50}
          />
          <br/>
          <h4 className="center">Loading</h4>
        </>
      ) : null}
    </>
  );
}

export default LoadingScreen;
