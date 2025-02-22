import React, { Component } from 'react';
import HeaderLoginSignUp from '../Header/headerLoginSignUp';
import Breadcumb from '../Breadcumb/breadcumb';
import Select from "react-select";
import axios from 'axios';
import { Alert } from 'react-bootstrap';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showValidationForm: true,
      focusStates: {
        usernameOrEmail: false,
        password: false,
        email: false,
        confirmPassword:false
      },
      values: {
        usernameOrEmail: "",
        password: "",
        email: "",
        confirmPassword:""
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (field, event) => {
    const value = event.target.value;
    let confirmPasswordMessage = this.state.confirmPasswordMessage;
    let passwordStrengthMessage = this.state.passwordStrengthMessage;
    let isPasswordValid = true;
      // Password strength validation
      if (field === "password") {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(value)) {
            passwordStrengthMessage = 'Password must contain at least 8 characters, including an uppercase letter, a number, and a special character.';
            isPasswordValid = false;
        } else {
            passwordStrengthMessage = ''; // Clear password strength message if valid
        }
    }

    // Check if confirmPassword field is being changed and validate password match
    if (field === "confirmPassword") {
        if (this.state.values.password !== value) {
            confirmPasswordMessage = 'Passwords do not match!';
        } else {
            confirmPasswordMessage = 'Password match'; // Clear message if passwords match
        }
    }
    this.setState(
      (prevState) => ({
      values: { ...prevState.values, [field]: value },
      }),
      () => {
      setTimeout(() => {
        field === "email" ? this.validateEmailForm() : this.validateForm(isPasswordValid);
      }, 1);
      }
    );
    this.setState({confirmPasswordMessage,
      passwordStrengthMessage});
  };
  validateEmailForm = () => {
    const { email, role } = this.state.values;
    const isFormValid = email.trim() !== "" && role;
    this.setState({ isFormValid });
  }

  validateForm = (isPasswordValid) => {

    const { confirmPassword, password } = this.state.values;
    const isFormValid = confirmPassword.trim() !== "" && password.trim() !== "" && password === confirmPassword && isPasswordValid;
    this.setState({ isFormValid });
  };

  handleSubmit() {
    const baseUrl = process.env.REACT_APP_BASEURL;
    const validateUrl = `${baseUrl}/api/Login/ResetPassword`;
    const validateUser = {
      "userid": this.state.userId,
      "password": btoa(this.state.values.password),
    }

    axios.post(validateUrl, validateUser, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        this.setState({
          responseMessage: (
            <span>
              Password Reset Successfully. Go to Login!
            </span>
          ),
          alertVariant: 'success', // Success alert variant

        });
        window.scrollTo(0, 0);
        //this.props.navigate('/Login'); // Use `navigate`
      })
      .catch((error) => {

        window.scrollTo(0, 0);
      });
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
  handleRoleChange = (field, selectedOption) => {
    this.setState((prevState) => ({
      values: { ...prevState.values, [field]: selectedOption.value },
    }), this.validateEmailForm);
  };
  handleValidateUser = () => {
    const baseUrl = process.env.REACT_APP_BASEURL;
    const validateUrl = `${baseUrl}/api/Login/ValidateUser`;
    const validateUser = {
      "email": this.state.values.email,
      "role_id": this.state.values.role,
    };

    axios.post(validateUrl, validateUser, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        this.setState({ showValidationForm: false });
        console.log("respopnse",response.data)
        this.setState({userId:response.data.user_id});
        this.setState({
          responseMessage: (
            <span>
              User Validated Successfully!
            </span>
          ),
          alertVariant: 'success', // Success alert variant

        });
        window.scrollTo(0, 0);
        //this.props.navigate('/Login'); // Use `navigate`
      })
      .catch((error) => {

        window.scrollTo(0, 0);
      });
  }
  render() {
    const roleOptions = [
      { value: 1, label: "Candidate" },
      { value: 2, label: "Employer" },
      { value: 3, label: "Trainer" },
    ];
    const { focusStates, values, isFormValid } = this.state;
    return (
      <><HeaderLoginSignUp /><Breadcumb componentName="Forget Password" ComponentValue="ForgetPassword" />
        <div className="rbt-elements-area bg-color-white">
          {this.state.responseMessage && (
            <Alert variant={this.state.alertVariant} onClose={() => this.setState({ responseMessage: '' })} dismissible>
              {this.state.responseMessage}
            </Alert>
          )}
          <div className="container-fluid p-0">
            <div className="row">
              <div className="log-regs-page">
              <div className="log-regs-bg2"></div>
                <div className="log-regs-frm">
                  <div className="rbt-contact-form contact-form-style-1 max-width-auto">
                    <h3 className="title">Forget Password</h3>
                    {this.state.showValidationForm ? <form className="max-width-auto" onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); // Prevent default form submission
                        if (this.state.isFormValid) {
                          this.handleValidateUser(); // Trigger login when Enter is pressed and the form is valid
                        }
                      }
                    }}>
                      <div className={`form-group ${focusStates.password ? "focused" : ""}`}>
                        <input name="email" type="text" value={values.email}
                          onFocus={() => this.handleFocus("email")}
                          onBlur={() => this.handleBlur("email")} onChange={(e) => this.handleChange("email", e)} required />
                        <label>Email *</label>
                        <span className="focus-border"></span>
                      </div>
                      <div className="form-group">
                        <Select
                          name="role"
                          placeholder="Select Role"
                          options={roleOptions}
                          value={roleOptions.find(option => option.value === values.role)}
                          menuPortalTarget={document.body} // Render the dropdown to the body
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure it has a high z-index
                          }}
                          onChange={(selectedOption) => this.handleRoleChange("role", selectedOption)}
                        />

                        <label>Role *</label>
                        <span className="focus-border"></span>
                      </div>


                      <div className="form-submit-group">
                        <button
                          type="button"
                          className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                          onClick={this.handleValidateUser}
                          disabled={!isFormValid}
                        >
                          <span className="icon-reverse-wrapper">
                            <span className="btn-text">Validate User</span>
                            <span className="btn-icon">
                              <i className="feather-arrow-right"></i>
                            </span>
                            <span className="btn-icon">
                              <i className="feather-arrow-right"></i>
                            </span>
                          </span>
                        </button>
                      </div>
                    </form> :
                      <form className="max-width-auto" onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); // Prevent default form submission
                          if (this.state.isFormValid) {
                            this.handleSubmit(); // Trigger login when Enter is pressed and the form is valid
                          }
                        }
                      }}>
                        <div className={`form-group ${focusStates.password ? "focused" : ""}`}>
                          <input name="password" type="password" value={values.password}
                            onFocus={() => this.handleFocus("password")}
                            onBlur={() => this.handleBlur("password")} onChange={(e) => this.handleChange("password", e)} required />
                          <label> New Password *</label>
                          <span className="focus-border"></span>
                          {this.state.passwordStrengthMessage && (
                                                    <span className="form-text text-danger">{this.state.passwordStrengthMessage}</span>
                                                )}
                        </div>
                        <div className={`form-group ${focusStates.confirmpassword ? "focused" : ""}`}>
                          <input name="confirmPassword" type="password" value={values.confirmpassword}
                            onFocus={() => this.handleFocus("confirmPassword")}
                            onBlur={() => this.handleBlur("confirmPassword")} onChange={(e) => this.handleChange("confirmPassword", e)} required />
                          <label> Confirm Password *</label>
                          <span className="focus-border"></span>
                          {this.state.confirmPasswordMessage && (
                            <span className={`form-text ${!this.state.confirmPasswordMessage.includes("do not match") ? 'text-success' : 'text-danger'}`}>
                              {this.state.confirmPasswordMessage}
                            </span>
                          )}
                        </div>


                        <div className="form-submit-group">
                          <button
                            type="button"
                            className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                            onClick={this.handleSubmit}
                            disabled={!isFormValid}
                          >
                            <span className="icon-reverse-wrapper">
                              <span className="btn-text">Reset Password</span>
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
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div></>
    );
  }
}

export default ForgotPassword;