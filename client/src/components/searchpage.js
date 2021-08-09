import React, { useEffect, useState } from "react";
import axios from "../axios.js";
import { Card, CardBody, CardText, CardHeader, CardTitle } from "reactstrap";
import { NavLink as RouterNavLink } from "react-router-dom";
import "./searchpage.css";
function SearchPage({ searchtext,submitbtn }) {
  const [searchques, setques] = useState([]);
  useEffect(() => {
    async function fetchData() {
      
      const request = await axios.get("/ques/");
      const searchtextarray = searchtext
        .toLowerCase()
        .trim()
        .replace(/\s\s+/g, " ")
        .trim()
        .replace(/(\r\n|\n|\r)/gm, "")
        .split(" ");setques([]);
      for (var i = 0; i < request.data.length; i++) {
        var index = 0;

        console.log(request.data[i].keywordarray);
        for (var l = 0; l < searchtextarray.length; l++) {
          console.log(`index loop with ${request.data[i].keywordarray}`);
          if (request.data[i].keywordarray.includes(searchtextarray[l])) {
            index += 1;
          }
        }

        if (index - searchtextarray.length >= -5 && index !== 0)
          setques((arr) => [...arr, request.data[i]]);
      }
    }
    fetchData();
  }, [searchtext]);
  if (searchques.length != 0 && searchtext.length != 0)
    return searchques.map((searchquess) => (
      <div key={searchquess._id}>
        <Card className="mt-2">
          <CardHeader>Recent Questions</CardHeader>
          <CardBody>
            <CardTitle>
              <strong>Asked by: </strong>
              {searchquess.name}
            </CardTitle>
            <CardText>
              <strong>Question: </strong>
              <NewlineText
                text={searchquess.question_title}
                id={searchquess._id}
              />
            </CardText>
            <RouterNavLink
              to={`/question/${searchquess._id}`}
              className="btn btn-warning"
              exact
            >
              View Question
            </RouterNavLink>
          </CardBody>
        </Card>
        <br />
      </div>
    ));
  else {
    return <div class="no-search">No Search Results</div>;
  }
}
function NewlineText(props) {
  var index = 0;
  const text = props.text;
  return text.split("\n").map((str) => {
    index++;
    return <p key={props.id + "_" + index}>{str}</p>;
  });
}

export default SearchPage;
