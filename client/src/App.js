import React, { Component } from "react";
import LoadingScreen from "./components/loadingscreen";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  NavLink as RouterNavLink,
  Switch,
} from "react-router-dom";
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  InputGroupAddon,
  Input,
  FormGroup,
} from "reactstrap";
import SearchIcon from "@material-ui/icons/Search";
import { UserAgentApplication } from "msal";
import QuestionCards from "./components/questionlist";
import { config } from "./Config";
import { normalizeError, getUserProfile } from "./utils/MSUtils";
import "@fortawesome/fontawesome-free/css/all.css";
import MyVerticallyCenteredModal from "./components/ques_post_model";
import SearchPage from "./components/searchpage";
import SingleQuestion from "./components/singlequestion";
import ProfileHeader from "./components/profileheader";
import WelcomePage from "./components/welcomepage";
import NotFoundPage from "./components/notfoundpage";
class App extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      isloading: false,
      error: null,
      modalShow: false,
      isAuthenticated: localStorage.getItem("user") !== null,
      user: JSON.parse(window.localStorage.getItem("user")),
      searchtext: "",
      _uniqueid: "",
      searchsubmit:false
    };
    this.userAgentApplication = new UserAgentApplication({
      auth: {
        clientId: config.clientId,
        redirectUri: config.redirectUri,
      },
      cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: true,
      },
    });
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
  async login() {
    try {
      await this.userAgentApplication.loginPopup({
        scopes: config.scopes,
        prompt: "select_account",
      });
      this.setState({
        isloading: true,
      });
      const user = await getUserProfile(
        this.userAgentApplication,
        config.scopes
      );
      await window.localStorage.setItem("user", JSON.stringify(user));
      this.setState({
        isAuthenticated: true,
        user: {
          displayName: user.displayName,
          userPrincipalName: user.mail || user.userPrincipalName,
          id: user.id,
        },
        error: null,
        isloading: false,
      });
    } catch (err) {
      this.setState({
        isAuthenticated: false,
        user: {},
        error: normalizeError(err),
        isloading: false,
      });
    }
  }
  async logout() {
    await this.userAgentApplication.logout();
    localStorage.removeItem("user");
  }
  render() {
    if (this.state.error) {
      alert(this.state.error.message);
      this.setState({ error: null });
    }
    return (
      <>
        {!this.state.isloading ? (
          <Router>
            {this.state.isAuthenticated ? (
              <>
                <Navbar color="dark" dark expand="md" className="p-3">
                  <Container>
                    <NavbarBrand href="/">IITG Stack Overflow</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                      <Nav className="mr-auto" navbar>
                        <NavItem>
                          <RouterNavLink to="/" className="nav-link" exact>
                            Home
                          </RouterNavLink>
                        </NavItem>
                        <NavItem>
                          <RouterNavLink
                            to="/myquestions"
                            className="nav-link"
                            exact
                          >
                            MyQuestions
                          </RouterNavLink>
                        </NavItem>
                        <NavItem>
                          <RouterNavLink
                            to="/search"
                            className="nav-link"
                            exact
                          >
                            SearchPage
                          </RouterNavLink>
                        </NavItem>
                      </Nav>
                      <Nav>
                        <FormGroup style={{ width: 300 }}>
                          <InputGroup>
                            <Input
                              placeholder="Search a question"
                              size="md"
                              type="text"
                              value={this.state.searchtext}
                              className="search-field"
                              onChange={(e) =>
                                this.setState({ searchtext: e.target.value })
                              }
                            />
                            <InputGroupAddon addonType="append">
                              <RouterNavLink
                                to="/search"
                                className="btn btn-warning"
                                exact
                              >
                                <SearchIcon />
                              </RouterNavLink>
                            </InputGroupAddon>
                          </InputGroup>
                        </FormGroup>
                      </Nav>
                      <div className="input-width-1" />
                      <Nav navbar>
                        <UncontrolledDropdown>
                          <DropdownToggle nav caret>
                            <i
                              className="far fa-user-circle fa-lg rounded-circle align-self-center mr-2"
                              style={{ width: "32px" }}
                            ></i>
                          </DropdownToggle>
                          <DropdownMenu right>
                            <h5 className="dropdown-item-text mb-0">
                              {this.state.user.displayName}
                            </h5>
                            <p className="dropdown-item-text text-muted mb-0">
                              {this.state.user.userPrincipalName}
                            </p>
                            <DropdownItem divider />
                            <DropdownItem onClick={() => this.logout()}>
                              Sign Out
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </Nav>
                    </Collapse>
                  </Container>
                </Navbar>
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() => (
                      <>
                        <ProfileHeader name={this.state.user.displayName} />
                        <Container>
                          <Route
                            exact
                            path="/"
                            render={() => (
                              <>
                                <MyVerticallyCenteredModal
                                  show={this.state.modalShow}
                                  onHide={() =>
                                    this.setState({ modalShow: false })
                                  }
                                />
                                <QuestionCards
                                  askques={() =>
                                    this.setState({ modalShow: true })
                                  }
                                  className="mt-5"
                                />
                              </>
                            )}
                          />
                        </Container>
                      </>
                    )}
                  />
                  <Route
                    exact
                    path="/search"
                    render={() => (
                      <Container>
                        <SearchPage searchtext={this.state.searchtext} submitbtn={this.state.searchsubmit}/>
                      </Container>
                    )}
                  />
                  <Route
                    exact
                    path="/question/:id"
                    render={() => (
                      <Container>
                        <SingleQuestion />
                      </Container>
                    )}
                  />
                  <Route
                    exact
                    path="/myquestions"
                    render={() => (
                      <Container>
                        <MyVerticallyCenteredModal
                          show={this.state.modalShow}
                          onHide={() => this.setState({ modalShow: false })}
                        />
                        <QuestionCards
                          askques={() => this.setState({ modalShow: true })}
                          editques={(id, title, quest, url) => {
                            this.setState({
                              editquestiontitle: title,
                              editquestion: quest,
                              editquestionimgurl: url,

                              editquid: id,
                            });
                            this.setState({ modalShowedit: true });
                          }}
                          myquestions={true}
                        />
                      </Container>
                    )}
                  />
                  <Route path="*">
                    <NotFoundPage is404={true} />
                  </Route>
                </Switch>
              </>
            ) : (
              <Switch>
                <Route path="/" exact>
                  <WelcomePage onClick={() => this.login()} />
                </Route>
                <Route path="*">
                  <NotFoundPage is404={true} />
                </Route>
              </Switch>
            )}
          </Router>
        ) : null}
        <LoadingScreen isloading={this.state.isloading} />
      </>
    );
  }
}

export default App;
