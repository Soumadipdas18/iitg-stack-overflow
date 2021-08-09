import React, { useEffect, useState } from "react";
import axios from "../axios.js";
import { Card, CardBody, CardText, CardHeader, CardFooter } from "reactstrap";
import CreateIcon from "@material-ui/icons/Create";
import { Avatar, Tooltip, IconButton } from "@material-ui/core";
import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink as RouterNavLink } from "react-router-dom";
import { red } from "@material-ui/core/colors";
import LoadingScreen from "./loadingscreen.js";
import EditQuesModal from "./ques_update_modal.js";
import "./questionlist.css";
function QuestionCards({ myquestions, askques}) {
  const [pageupdate, setpageupdate] = useState(true);
  const [isloading, setloading] = useState(false);
  const [modalShowedit, setmodalshowedit] = useState([]);
  const [ques, setques] = useState([]);
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    purple: {
      marginTop: "auto",
      marginBottom: "auto",
      height: "50px",
      width: "50px",
      color: theme.palette.getContrastText(red[500]),
      backgroundColor: red[500],
    },
  }));
  const classes = useStyles();
  useEffect(() => {
    if (!myquestions) {
      async function fetchData() {
        setloading(true);
        const request = await axios.get("/ques/");
        await setques(request.data);
        console.log(request.data);
        setloading(false);
        setmodalshowedit(
          Array.from({ length: request.data.length }, (_, index) => false)
        );
      }
      fetchData();
    } else {
      async function fetchData() {
        setloading(true);
        const request = await axios.get(
          `/ques/my/${JSON.parse(window.localStorage.getItem("user")).id}`
        );
        await setques(request.data);
        console.log(request.data);
        setloading(false);
        setmodalshowedit(
          Array.from({ length: request.data.length }, (_, index) => false)
        );
      }
      fetchData();
    }
  }, [pageupdate]);
  const deleteques = async (id) => {
    setloading(true);
    setloading(false);
    const request = await axios.delete(`/ques/${id}`);
    
    setpageupdate(!pageupdate);
    
  };
  return (
    <div>
      <br />
      <br />
      <div className="head pb-2">
        <h2>{myquestions ? "My" : "Recent"} Questions</h2>
        <button className="ask_to_ques" onClick={() => askques()}>
          Ask a Question
        </button>
      </div>

      {isloading ? (
        <LoadingScreen isloading={isloading} />
      ) : (
        ques.map((quess, index) => (
          <>
            <EditQuesModal
              imageURL={quess.picture}
              show={modalShowedit[index]}
              hide={() =>
                setmodalshowedit(
                  Array.from({ length: ques.length }, (_, _index) => false)
                )
              }
              ques_title={quess.question_title}
              questiondesc={quess.question}
              quid={quess._id}
              pageupdate={()=>setpageupdate(!pageupdate)}
            />
            <div key={quess._id}>
              <Card>
                <CardHeader className="card-header">
                  <div className="avatar-parent">
                    <Avatar className={classes.purple}>{quess.name[0]}</Avatar>
                    <div style={{ width: "6px" }}></div>
                    <div className="mt-auto mb-auto">
                      <div className="mt-auto mb-auto">{quess.name}</div>
                      {quess.emailid && quess.rollno ? (
                        <>
                          <small className="mt-auto mb-auto text-muted">
                            {quess.emailid}
                          </small>
                          <div />
                          <small className="mt-auto mb-auto text-muted">
                            {quess.rollno}
                          </small>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div>
                    <small class="text-muted">{quess.date}</small>
                    {quess.userId ==
                    JSON.parse(window.localStorage.getItem("user")).id &&myquestions ? (
                      <div class="button-bar">
                        <Tooltip
                          className="mt-auto mb-auto"
                          title="Edit your question"
                        >
                          <IconButton
                            aria-label="edit"
                            onClick={() =>
                              setmodalshowedit(
                                Array.from(
                                  { length: ques.length },
                                  (_, _index) =>
                                    _index == index ? true : false
                                )
                              )
                            }
                          >
                            <CreateIcon
                              className={classes.icon}
                              style={{ color: "blue" }}
                            />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          className="mt-auto mb-auto"
                          title="Delete your question"
                        >
                          <IconButton
                            aria-label="delete"
                            onClick={() => {
                              deleteques(quess._id);
                            }}
                          >
                            <DeleteTwoToneIcon
                              className={classes.icon}
                              style={{ color: "red" }}
                            />
                          </IconButton>
                        </Tooltip>
                      </div>
                    ) : null}
                  </div>
                </CardHeader>
                <CardBody>
                  <CardText>
                    <strong>Question: </strong>
                    <NewlineText text={quess.question_title} id={quess._id} />
                  </CardText>
                </CardBody>
                <CardFooter>
                  <RouterNavLink
                    to={`/question/${quess._id}`}
                    className="link_to_ques"
                    exact
                  >
                    <div className="view">Answers &nbsp; </div>
                  </RouterNavLink>
                </CardFooter>
              </Card>
              <br />
            </div>
          </>
        ))
      )}
    </div>
  );
}
function NewlineText(props) {
  var index = 0;
  const text = props.text;
  return text.split("\n").map((str) => {
    index++;
    return <p key={props.id + "_" + index}>{str}</p>;
  });
}
export default QuestionCards;
