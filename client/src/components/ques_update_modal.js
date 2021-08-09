import React, { useState,useEffect} from "react";
import { Modal, makeStyles, IconButton, Tooltip } from "@material-ui/core";
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
function EditQuesModal({
  imageURL,
  show,
  hide,
  ques_title,
  questiondesc,
  quid,
  pageupdate
}) {
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
  const [question, setquestion] = useState(questiondesc);
  const [question_title, setquestion_title] = useState(ques_title);
  const [imagefileURL, setimagefileURL] = useState(imageURL);
  const [imagefile, setimagefile] = useState(null);
  const [loading, setloading] = useState(false);
  const postquestion = async (event) => {
    event.preventDefault();
    setloading(true);
    var formdata = new FormData();
    formdata.append("question_title", question_title);
    formdata.append("question", question);
    if (imagefile != null) {
      formdata.append("picture", imagefile);
      formdata.append("imageadded", "true");
    } else {
      formdata.append("imageadded", "false");
    }
    const request = await axios
      .put(`/ques/${quid}`, formdata)
      .then((response) => {
        setloading(false);
        hide();
        pageupdate();
      })
      .catch((e) => console.log(e.message));
  };
  return (
    <Modal open={show} onClose={hide}>
      <center>
        <div style={modalStyle} className={classes.paper}>
          {!loading ? (
            <>
              <div className="modal-header">
                <h4>EDIT YOUR QUESTION</h4>
                <IconButton
                  aria-label="edit"
                  onClick={(e) => {
                    hide();
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
                            {imageURL.length > 0 ? (
                              <CancelIcon
                                className={classes.icon}
                                style={{ color: "red" }}
                              />
                            ) : null}
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

export default EditQuesModal;
