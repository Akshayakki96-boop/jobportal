import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import withNavigation from '../withNavigation';
import { setSingleRequest } from '../actions/SingleRequestAction';
import { store } from '../index';
import HeaderLoginSignUp from '../Header/headerLoginSignUp';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focusStates: {
        usernameOrEmail: false,
        password: false,
      },
      values: {
        usernameOrEmail: "",
        password: "",
      },
    };

  }
  componentDidMount() {

  }



  handleFocus = (field) => {
    this.setState((prevState) => ({
      focusStates: { ...prevState.focusStates, [field]: true },
    }));
  };

  handleBlur = (field) => {
    this.setState((prevState) => ({
      focusStates: {
        ...prevState.focusStates,
        [field]: !!prevState.values[field], // Keep focused if there's a value
      },
    }));
  };
  handleChange = (field, event) => {
    const value = event.target.value;
    this.setState(
      (prevState) => ({
        values: { ...prevState.values, [field]: value },
      }),
      this.validateForm // Call validateForm after state update
    );
  };

  handleLogin = () => {
    this.setState({ keepSpinner: true });
    const baseUrl = process.env.REACT_APP_BASEURL;
    const loginUrl = `${baseUrl}/api/Login/login`;
    const loginData = {
      "username": this.state.values.usernameOrEmail,
      "password": btoa(this.state.values.password),
    };

    axios.post(loginUrl, loginData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log('Login Success:', response.data);
        this.setState({ keepSpinner: false });
        localStorage.setItem('authToken', response.data.token);
        if (response.data.role_id == "2") {
          this.props.navigate('/EmployerDashboard'); // Use `navigate`
        }
        else if (response.data.role_id == "3") {
          this.props.navigate('/TrainerDashboard'); // Use `navigate`
        }
        else {
          this.props.navigate('/CandidateDashboard'); // Use `navigate`
        }

      })
      .catch((error) => {
        console.error('Signup Error:', error.response?.data || error.message);
        this.setState({ keepSpinner: false });
        this.setState({
          responseMessage: 'Login failed. invalid username or password.',
          alertVariant: 'danger', // Error alert variant
        });
        window.scrollTo(0, 0);
      });
  };

  validateForm = () => {
    const { usernameOrEmail, password } = this.state.values;
    const isFormValid = usernameOrEmail.trim() !== "" && password.trim() !== "";
    this.setState({ isFormValid });
  };
  render() {
    const { focusStates, values, isFormValid } = this.state;
    return (
      <>
      <div>
        <HeaderLoginSignUp />
        <Breadcumb componentName="Login" ComponentValue="Login" />
      </div>
        <div className="rbt-elements-area bg-color-white">
      
              {/* Render Bootstrap alert if there's a responseMessage */}
              {this.state.responseMessage && (
                <Alert variant={this.state.alertVariant} onClose={() => this.setState({ responseMessage: '' })} dismissible>
                  {this.state.responseMessage}
                </Alert>
              )}
            {this.state.keepSpinner && <div class="custom-loader">
              <div class="loader-spinner"></div>
              <p class="loader-text">Please Wait...</p>
            </div>}
          <div className="container-fluid p-0">
            <div className="row">
              <div className="log-regs-page">
                <div className="log-regs-bg">
                  <h1>
                  Start your journey to success with industry-specific training and global opportunities.
                  </h1>
                </div>
                <div className="log-regs-frm">
                <div className="rbt-contact-form contact-form-style-1 max-width-auto">
                      <h3 className="title">Login</h3>
                      <form className="max-width-auto" onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); // Prevent default form submission
                          if (this.state.isFormValid) {
                            this.handleLogin(); // Trigger login when Enter is pressed and the form is valid
                          }
                        }
                      }}>
                        <div className={`form-group ${focusStates.usernameOrEmail ? "focused" : ""}`}>
                          <input name="usernameOrEmail" type="text" value={values.usernameOrEmail}
                            onFocus={() => this.handleFocus("usernameOrEmail")}
                            onBlur={() => this.handleBlur("usernameOrEmail")}
                            onChange={(e) => this.handleChange("usernameOrEmail", e)} required />
                          <label>Username or email *</label>
                          <span className="focus-border"></span>
                        </div>
                        <div className={`form-group ${focusStates.password ? "focused" : ""}`}>
                          <input name="password" type="password" value={values.password}
                            onFocus={() => this.handleFocus("password")}
                            onBlur={() => this.handleBlur("password")} onChange={(e) => this.handleChange("password", e)} required />
                          <label>Password *</label>
                          <span className="focus-border"></span>
                        </div>

                        <div className="row mb--30">
                          {/* <div className="col-lg-6">
                        <div className="rbt-checkbox">
                          <input type="checkbox" id="rememberme" name="rememberme" />
                          <label htmlFor="rememberme">Remember me</label>
                        </div>
                      </div> */}
                          <div className="col-lg-5">
                            <div className="rbt-lost-password text-end">
                              <a className="rbt-btn-link" href="#">Lost your password?</a>
                            </div>
                          </div>
                          <div className="col-lg-5">
                            <div className="rbt-lost-password text-end">
                              <a className="rbt-btn-link" href="/SignUp">Register</a>
                            </div>
                          </div>
                        </div>

                        <div className="form-submit-group">
                          <button
                            type="button"
                            className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                            onClick={this.handleLogin}
                            disabled={!isFormValid}
                          >
                            <span className="icon-reverse-wrapper">
                              <span className="btn-text">Log In</span>
                              <span className="btn-icon">
                                <i className="feather-arrow-right"></i>
                              </span>
                              <span className="btn-icon">
                                <i className="feather-arrow-right"></i>
                              </span>
                            </span>
                          </button>
                        </div>
                      </form>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </>

    );
  }
}

export default withNavigation(Login);