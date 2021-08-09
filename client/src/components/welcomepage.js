import React from "react";
import "./loadingScreen.css";
import "./welcomepage.css";
function WelcomePage({ onClick }) {
  return (
    <>
      <div className="page-manual">
        <div className="card-manual">
          <div className="container-manual">
            <div className="menu-manual">
              <img
                className="iitgicon-manual"
                src="https://res.cloudinary.com/dmcbeyvr4/image/upload/v1628275671/iitgstackoverflow/iitgicon_njgwqm.png"
                alt=""
              />
            </div>
            <br />
            <div className="content-manual">
              <div className="text-manual">
                <h1>
                  IITG <br />
                  Stack Overflow
                </h1>
                <p>
                  Welcome to IITG Stack Overflow <br />
                  This application is built using MERN Stack where usrs can post
                  their queries related to tech and other stuff
                </p>
                <button onClick={() => onClick()}>Let's go !</button>
              </div>
            </div>
          </div>
          <br />
          <div className="photo-manual"></div>
        </div>
      </div>
    </>
  );
}

export default WelcomePage;
