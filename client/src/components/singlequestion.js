import React, { useEffect, useState } from "react";
import axios from "../axios.js";
import {
  Card,
  Container,
  CardBody,
  CardText,
  CardHeader,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Button,
} from "reactstrap";
import LoadingScreen from "./loadingscreen.js";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
import CreateIcon from "@material-ui/icons/Create";
import { deepOrange, deepPurple } from "@material-ui/core/colors";
import { Avatar, Tooltip, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import NotFoundPage from "./notfoundpage.js";
import "./singlequestion.css";
function SingleQuestion() {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
      height: "50px",
      width: "50px",
    },
    purple: {
      color: theme.palette.getContrastText(deepPurple[500]),
      backgroundColor: deepPurple[500],
    },
  }));
  const [path, setPath] = useState(
    window.location.href.split("/")[window.location.href.split("/").length - 1]
  );
  const [singleques, setques] = useState([]);
  const [answers, setanswer] = useState([]);
  const [answerpost, setanswerpost] = useState("");
  const [editanswerpost, seteditanswerpost] = useState("");
  const [editanswerid, seteditanswerid] = useState("");
  const [update, setupdate] = useState(true);
  const [editsoln, seteditsoln] = useState(false);
  const [imagefileURL, setimagefileURL] = useState(null);
  const [imagefile, setimagefile] = useState(null);
  const [loading, setloading] = useState(false);
  const [editimagesrc, seteditimagesrc] = useState(null);
  const [editimage, seteditimage] = useState(null);
  const [is404, set404] = useState(false);
  const [ifimageexist, setifimageexist] = useState(false);
  const addanswer = async (event) => {
    event.preventDefault();
    setloading(true);
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
    formdata.append("answer", answerpost);
    formdata.append("questionID", singleques._id);
    if (imagefile != null) {
      formdata.append("picture", imagefile);
      formdata.append("imageadded", "true");
    } else {
      formdata.append("imageadded", "false");
    }
    const request = await axios
      .post("/ques/answer", formdata)
      .then((response) => {
        setupdate(!update);
        setimagefileURL(null);
        setanswerpost("");
        setimagefile(null);
        document.querySelector("#exampleFile").value = null;
      })
      .catch((e) => console.log(e.message));
    setloading(false);
  };
  const deleteans = async (id) => {
    setloading(true);
    const request = await axios
      .delete(`ques/answer/${singleques._id}/${id}`)
      .then((response) => setupdate(!update))
      .catch((e) => console.log(e.message));
    setloading(false);
  };
  const editans = async (id) => {
    setloading(true);
    var formdata = new FormData();
    if (editimage != null) {
      formdata.append("picture", editimage);
      formdata.append("imageadded", "true");
    } else {
      formdata.append("imageadded", "false");
    }
    formdata.append("answer", editanswerpost);
    const request = await axios
      .put(`ques/answer/${singleques._id}/${id}`, formdata)
      .then((response) => {
        setupdate(!update);
        seteditsoln(false);
        seteditanswerid("");
        seteditanswerpost("");
        seteditimage(null);
      })
      .catch((e) => console.log(e.message));
    setloading(false);
  };
  useEffect(() => {
    async function fetchData() {
      setloading(true);
      const request = await axios
        .get(`/ques/${path}`)
        .catch((err) => set404(true));
      const request_ans = await axios.get(`/ques/answer/${path}`);
      await setques(request.data);
      await setanswer(request_ans.data);
      setloading(false);
    }
    fetchData();
  }, [update]);
  const classes = useStyles();
  return (
    <>
      <NotFoundPage is404={is404} />
      {!is404 ? (
        <>
          {loading ? (
            <LoadingScreen isloading={true} />
          ) : (
            <>
              <Container>
                <h2 className="pt-4 pb-2">Question</h2>
                <Card>
                  <CardHeader tag="h5">
                    <strong>{singleques.question_title}</strong>
                    <div>
                      <small class="text-muted">{singleques.date}</small>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <CardTitle>
                      <strong>Description: </strong>
                    </CardTitle>
                    <CardText>
                      <NewlineText
                        text={singleques.question}
                        id={singleques._id}
                      />
                    </CardText>
                    <img
                      src={singleques.picture}
                      className="image_ques"
                      onClick={() => window.open(singleques.picture, "_blank")}
                    />
                    <CardTitle tag="h5">
                      <strong>Asked By: </strong>
                    </CardTitle>
                    <CardText>
                      <strong>
                        <small className="text-muted">
                          {singleques.name}
                          <br />
                        </small>
                      </strong>
                      <small className="text-muted">
                        {singleques.emailid}
                        <br />
                      </small>

                      <small className="text-muted">
                        {singleques.rollno}
                        <br />
                      </small>
                    </CardText>
                  </CardBody>
                </Card>
                <br />
                {answers.length === 0 ? (
                  <h2>No Solution yet</h2>
                ) : (
                  <h2>Solutions</h2>
                )}
                {answers.map((answer) => (
                  <div key={answer._id}>
                    <Card>
                      <CardHeader
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <div className="avatar-parent">
                          <Avatar
                            className={classes.orange}
                            style={{ marginTop: "auto", marginBottom: "auto" }}
                          >
                            {answer.name[0]}
                          </Avatar>
                          <div style={{ width: "6px" }}></div>
                          <div className="mt-auto mb-auto">
                            <div className="mt-auto mb-auto">{answer.name}</div>
                            {answer.emailid && answer.rollno ? (
                              <>
                                <small className="mt-auto mb-auto text-muted">
                                  {answer.emailid}
                                </small>
                                <div />
                                <small className="mt-auto mb-auto text-muted">
                                  {answer.rollno}
                                </small>
                              </>
                            ) : null}
                          </div>
                        </div>
                        {answer.userId ==
                        JSON.parse(window.localStorage.getItem("user")).id ? (
                          <div>
                            <Tooltip
                              className="mt-auto mb-auto"
                              title="Edit your solution"
                            >
                              <IconButton
                                aria-label="edit"
                                onClick={() => {
                                  seteditsoln(true);
                                  seteditanswerid(answer._id);
                                  seteditimagesrc(answer.picture);
                                  seteditanswerpost(answer.answer);
                                  setifimageexist(answer.picture.length > 0);
                                }}
                              >
                                <CreateIcon
                                  className={classes.icon}
                                  style={{ color: "blue" }}
                                />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              className="mt-auto mb-auto"
                              title="Delete your solution"
                            >
                              <IconButton
                                aria-label="delete"
                                onClick={() => deleteans(answer._id)}
                              >
                                <DeleteTwoToneIcon
                                  className={classes.icon}
                                  style={{ color: "red" }}
                                />
                              </IconButton>
                            </Tooltip>
                          </div>
                        ) : null}
                      </CardHeader>

                      <CardBody>
                        <CardText>
                          <strong>Solution: </strong>
                          <NewlineText text={answer.answer} id={answer._id} />
                        </CardText>

                        <img
                          src={answer.picture}
                          className="image_ans"
                          onClick={() =>
                            window.open(singleques.picture, "_blank")
                          }
                        />
                      </CardBody>
                    </Card>
                    <br />
                  </div>
                ))}
                <br />
                {editsoln ? (
                  <>
                    <h2>Edit your Solution</h2>
                    <Form>
                      <FormGroup>
                        <Input
                          type="textarea"
                          value={editanswerpost}
                          required
                          onChange={(e) => seteditanswerpost(e.target.value)}
                          className="mb-2"
                          style={{ height: 200 }}
                        />
                      </FormGroup>

                      <FormGroup className="editimg">
                        <div className="container-modal mb-3">
                          <img src={editimagesrc} />
                          <div className="topright">
                            <Tooltip title="Delete File">
                              <IconButton
                                aria-label="edit"
                                onClick={(e) => {
                                  seteditimagesrc(null);
                                  seteditimage(null);
                                  setifimageexist(false);
                                  document.querySelector(
                                    "#exampleFile2"
                                  ).value = null;
                                  document.querySelector(
                                    ".editimg"
                                  ).style.display = "none";
                                }}
                              >
                                {ifimageexist ? (
                                  <CancelIcon
                                    className={classes.icon}
                                    style={{ color: "red" }}
                                  />
                                ) : null}
                              </IconButton>
                            </Tooltip>
                          </div>
                        </div>
                      </FormGroup>
                      <FormGroup>
                        <Input
                          type="file"
                          accept="image/*"
                          name="picture"
                          id="exampleFile2"
                          className="mt-2 mb-2"
                          onChange={(e) => {
                            if (e.target.files[0] != null) {
                              seteditimagesrc(
                                URL.createObjectURL(e.target.files[0])
                              );
                              setifimageexist(true);
                              document.querySelector(".editimg").style.display =
                                "block";
                              seteditimage(e.target.files[0]);
                            }
                          }}
                        />
                      </FormGroup>
                      <FormGroup className="mb-1">
                        <Button
                          className="btn btn-success"
                          onClick={() => editans(editanswerid)}
                        >
                          Confirm Changes
                        </Button>
                      </FormGroup>
                      <FormGroup classNAme="mb-3">
                        <Button
                          className="btn btn-danger"
                          onClick={() => {
                            seteditsoln(false);
                            seteditanswerid("");
                            seteditanswerpost("");
                          }}
                        >
                          Cancel
                        </Button>
                      </FormGroup>
                    </Form>
                  </>
                ) : (
                  <>
                    <h2>Add a Solution</h2>
                    <Form>
                      <FormGroup>
                        <Input
                          type="textarea"
                          value={answerpost}
                          required
                          onChange={(e) => setanswerpost(e.target.value)}
                          className="mb-2"
                          style={{ height: 200 }}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Input
                          type="file"
                          accept="image/*"
                          name="picture"
                          id="exampleFile"
                          className="mt-2 mb-2"
                          onChange={(e) => {
                            if (e.target.files[0] != null) {
                              setimagefileURL(
                                URL.createObjectURL(e.target.files[0])
                              );
                              setimagefile(e.target.files[0]);
                            }
                          }}
                        />
                      </FormGroup>
                      {imagefileURL != null ? (
                        <div className="uploadimg-ans">
                          <div className="container-modal mb-3">
                            <img src={imagefileURL} />
                            <div className="topright">
                              <Tooltip title="Delete File">
                                <IconButton
                                  aria-label="edit"
                                  onClick={(e) => {
                                    setimagefileURL(null);
                                    setimagefile(null);
                                    document.querySelector(
                                      "#exampleFile"
                                    ).value = null;
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
                      <FormGroup>
                        <Button className="btn btn-success" onClick={addanswer}>
                          Submit
                        </Button>
                      </FormGroup>
                    </Form>
                  </>
                )}
              </Container>
            </>
          )}
          <br />
          <br />
          <br />
          <br />
        </>
      ) : null}
    </>
  );
}
function NewlineText(props) {
  var index = 0;
  const text = props.text + "";
  return text.split("\n").map((str) => {
    index++;
    return <p key={props.id + "_" + index}>{str}</p>;
  });
}
export default SingleQuestion;
