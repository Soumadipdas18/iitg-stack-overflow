import React from "react";
import "./profileheader.css";
import { Container } from "reactstrap";
function ProfileHeader({ name }) {
  return (
    <div>
      <div className="bg-text">
        <Container className="bg-text-cont">
          <h1 className="title">IITG Stack Overflow</h1>
          <h1>Welcome {name}</h1>
          <p className="lead">
            This app is built using MERN Stack.
            <br /> You can ask your tech related queries and someone will answer
            them.
            <br />
            Use the navigation bar at the top of the page to get started.
          </p>
        </Container>
      </div>

      <img
        src="https://res.cloudinary.com/dmcbeyvr4/image/upload/v1628275669/iitgstackoverflow/iitgback_ita5se.jpg"
        className="bg-image"
      ></img>
    </div>
  );
}

export default ProfileHeader;
