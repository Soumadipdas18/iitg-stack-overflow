import React, { useState } from "react";
import {
  Modal,
  makeStyles,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import axios from "../axios.js";
import { Button, Input } from "reactstrap";
import CancelIcon from "@material-ui/icons/Cancel";
import LoadingScreen from "./loadingscreen.js";
import "./ques_post_modal.css";
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
function MyVerticallyCenteredModal(props) {
  const [modalStyle] = React.useState(getModalStyle);
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: "absolute",
      width: "75%",
      maxHeight: "100%",
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      overflow: "scroll",
      padding: theme.spacing(2, 4, 3),
    },
  }));
  const classes = useStyles();
  const [question, setquestion] = useState("");
  const [question_title, setquestion_title] = useState("");
  const [imagefileURL, setimagefileURL] = useState(null);
  const [imagefile, setimagefile] = useState(null);
  const [loading, setloading] = useState(false);
  const postquestion = async (event) => {
    event.preventDefault();
    setloading(true);
    var keywordarray = question_title
      .toLowerCase()
      .trim()
      .replace(/\s\s+/g, " ")
      .trim()
      .replace(/(\r\n|\n|\r)/gm, "")
      .split(" ");
    keywordarray = await arrayRemove(keywordarray, "");
    var formdata = new FormData();
    formdata.append(
      "name",
      JSON.parse(window.localStorage.getItem("user")).displayName
    );
    formdata.append(
      "userId",
      JSON.parse(window.localStorage.getItem("user")).id
    );
    formdata.append(
      "rollno",
      JSON.parse(window.localStorage.getItem("user")).surname || null
    );
    formdata.append(
      "emailid",
      JSON.parse(window.localStorage.getItem("user")).mail ||
        JSON.parse(window.localStorage.getItem("user")).userPrincipalName
    );
    formdata.append("question", question);
    formdata.append("question_title", question_title);
    if (imagefile != null) {
      formdata.append("picture", imagefile);
      formdata.append("imageadded", "true");
    } else {
      formdata.append("imageadded", "false");
    }
    formdata.append("keywordarray", keywordarray);
    const request = await axios
      .post("/ques/", formdata)
      .then((response) => {
        window.location.reload();
      })
      .catch((e) => console.log(e.message));
  };
  
  return (
    <Modal open={props.show} onClose={props.onHide}>
      <center>
        <div style={modalStyle} className={classes.paper}>
          {!loading ? (
            <>
              <div className="modal-header">
                <h4>ASK A QUESTION</h4>
                <IconButton
                  aria-label="edit"
                  onClick={(e) => {
                    props.onHide();
                  }}
                >
                  <CancelIcon
                    className={classes.icon}
                    style={{ color: "red" }}
                  />
                </IconButton>
              </div>
              <form
                className="form__question"
                onSubmit={postquestion}
                encType="multipart/form-data"
              >
                <Input
                  aria-label="minimum height"
                  type="text"
                  maxLength="177"
                  placeholder="Title of question in 177 characters"
                  value={question_title}
                  className="mb-2"
                  required
                  onChange={(e) => setquestion_title(e.target.value)}
                />

                <Input
                  aria-label="minimum height"
                  type="textarea"
                  style={{ height: 200 }}
                  placeholder="Describe your question"
                  value={question}
                  required
                  onChange={(e) => setquestion(e.target.value)}
                />

                <Input
                  type="file"
                  accept="image/*"
                  name="picture"
                  id="exampleFile"
                  className="mt-2 mb-2"
                  onChange={(e) => {
                    if (e.target.files[0] != null) {
                      setimagefileURL(URL.createObjectURL(e.target.files[0]));
                      setimagefile(e.target.files[0]);
                    }
                  }}
                />

                {imagefileURL != null ? (
                  <div className="uploadimg">
                    <div className="container-modal mb-3">
                      <img src={imagefileURL} />
                      <div className="topright">
                        <Tooltip title="Delete File">
                          <IconButton
                            aria-label="edit"
                            onClick={(e) => {
                              setimagefileURL(null);
                              console.log(imagefile);
                              setimagefile(null);
                              document.querySelector("#exampleFile").value =
                                null;
                            }}
                          >
                            <CancelIcon
                              className={classes.icon}
                              style={{ color: "red" }}
                            />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                ) : null}
                <Button type="submit" color="warning">
                  Post Question
                </Button>
              </form>
            </>
          ) : (
            <LoadingScreen isloading={true} />
          )}
        </div>
      </center>
    </Modal>
  );
}

function arrayRemove(arr, value) {
  return arr.filter(function (ele) {
    return ele != value;
  });
}

export default MyVerticallyCenteredModal;
