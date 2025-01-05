import React from 'react';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import Breadcumb from '../Breadcumb/breadcumb';
import withNavigation from '../withNavigation';

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focusStates: {
                email: false,
                username: false,
                password: false,
                confirmPassword: false,
                company: false,
            },
            values: {
                email: "",
                username: "",
                password: "",
                confirmPassword: "",
                company: "",
            },
            responseMessage: '',
            alertVariant: '',
        };

    }
    componentDidMount() {
        window.addEventListener('scroll', function () {
            var header = document.querySelector('.rbt-header-wrapper');
            if (window.scrollY > 50) { // Change 50 to whatever scroll position you want
                header.classList.add('header-sticky');
            } else {
                header.classList.remove('header-sticky');
            }
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

        // Validate the form and password match
        const updatedValues = { ...this.state.values, [field]: value };
        const isFormValid = updatedValues.company && updatedValues.email && updatedValues.username &&
            updatedValues.password && updatedValues.confirmPassword &&
            updatedValues.password === updatedValues.confirmPassword &&
            isPasswordValid;

        this.setState({
            values: updatedValues,
            confirmPasswordMessage,
            passwordStrengthMessage,
            isFormValid, // Update form validation state
        });
    };




    handleSignup = () => {
        this.setState({ keepSpinner: true });
        const baseUrl = process.env.REACT_APP_BASEURL;
        const signupUrl = `${baseUrl}/api/signup`;
        const signupData = {
            "username": this.state.values.username,
            "password": btoa(this.state.values.password),
            "email": this.state.values.email,
            "confirmPassword":btoa(this.state.values.confirmPassword),
            "companyName": this.state.values.company,
        };

        axios.post(signupUrl, signupData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                console.log('Signup Success:', response.data);
                this.setState({ keepSpinner: false });
                this.setState({
                    responseMessage: (
                        <span>
                            Signup successful! <a href="/Login" style={{ color: 'blue', textDecoration: 'underline' }}>Go to Login</a>
                        </span>
                    ),
                    alertVariant: 'success', // Success alert variant
                });
                //this.props.navigate('/Login'); // Use `navigate`
            })
            .catch((error) => {
                console.error('Signup Error:', error.response?.data || error.message);
                this.setState({ keepSpinner: false });
                this.setState({
                    responseMessage: 'Signup failed. Please try again.',
                    alertVariant: 'danger', // Error alert variant
                });
            });
    };

    handleNavigation = (path) => {
        this.props.navigate(path); // Use `navigate`
    };

    render() {
        const { focusStates, values } = this.state;
        return (
            <><div>
                <Breadcumb componentName="SignUp" ComponentValue="SignUp" />
            </div><div className="rbt-elements-area bg-color-white rbt-section-gap">
                    <div className="container">
                        <div className="container mt-5">
                            {/* Render Bootstrap alert if there's a responseMessage */}
                            {this.state.responseMessage && (
                                <Alert variant={this.state.alertVariant} onClose={() => this.setState({ responseMessage: '' })} dismissible>
                                    {this.state.responseMessage}
                                </Alert>
                            )}
                        </div>
                        {this.state.keepSpinner && <div class="custom-loader">
                            <div class="loader-spinner"></div>
                            <p class="loader-text">Please Wait...</p>
                        </div>}
                        <div className="row gy-5 row--30">
                            <div className="col-lg-6 mx-auto">
                                <div className="rbt-contact-form contact-form-style-1 max-width-auto">
                                    <h3 className="title">Sign Up</h3>
                                    {/* Add an onSubmit handler to prevent default form submission */}
                                    <form
                                        className="max-width-auto"
                                        onSubmit={(e) => e.preventDefault()} // Prevent form submission
                                    >
                                        <div className={`form-group ${focusStates.company ? "focused" : ""}`}>
                                            <input
                                                name="company"
                                                type="text"
                                                value={values.company}
                                                onFocus={() => this.handleFocus("company")}
                                                onBlur={() => this.handleBlur("company")}
                                                onChange={(e) => this.handleChange("company", e)} />
                                            <label>Company *</label>
                                            <span className="focus-border"></span>
                                        </div>
                                        {/* Email Field */}
                                        <div className={`form-group ${focusStates.email ? "focused" : ""}`}>
                                            <input
                                                name="email"
                                                type="email"
                                                value={values.email}
                                                onFocus={() => this.handleFocus("email")}
                                                onBlur={() => this.handleBlur("email")}
                                                onChange={(e) => this.handleChange("email", e)} />
                                            <label>Email address *</label>
                                            <span className="focus-border"></span>
                                        </div>

                                        {/* Username Field */}
                                        <div className={`form-group ${focusStates.username ? "focused" : ""}`}>
                                            <input
                                                name="username"
                                                type="text"
                                                value={values.username}
                                                onFocus={() => this.handleFocus("username")}
                                                onBlur={() => this.handleBlur("username")}
                                                onChange={(e) => this.handleChange("username", e)} />
                                            <label>Username *</label>
                                            <span className="focus-border"></span>
                                        </div>

                                        {/* Password Field */}
                                        <div className={`form-group ${focusStates.password ? "focused" : ""}`}>
                                            <input
                                                name="password"
                                                type="password"
                                                value={values.password}
                                                onFocus={() => this.handleFocus("password")}
                                                onBlur={() => this.handleBlur("password")}
                                                onChange={(e) => this.handleChange("password", e)} />
                                            <label>Password *</label>
                                            <span className="focus-border"></span>
                                            {this.state.passwordStrengthMessage && (
                                                <span className="form-text text-danger">{this.state.passwordStrengthMessage}</span>
                                            )}
                                        </div>

                                        {/* Confirm Password Field */}
                                        <div className={`form-group ${focusStates.confirmPassword ? "focused" : ""}`}>
                                            <input
                                                name="confirmPassword"
                                                type="password"
                                                value={values.confirmPassword}
                                                onFocus={() => this.handleFocus("confirmPassword")}
                                                onBlur={() => this.handleBlur("confirmPassword")}
                                                onChange={(e) => this.handleChange("confirmPassword", e)} />
                                            <label>Confirm Password *</label>
                                            <span className="focus-border"></span>
                                            {this.state.confirmPasswordMessage && (
                                                <span className={`form-text ${!this.state.confirmPasswordMessage.includes("do not match") ? 'text-success' : 'text-danger'}`}>
                                                    {this.state.confirmPasswordMessage}
                                                </span>
                                            )}
                                        </div>

                                        {/* Submit Button */}
                                        <div className="form-submit-group">
                                            <button
                                                type="button" // Prevents triggering form submission
                                                onClick={this.handleSignup}
                                                disabled={!this.state.isFormValid} // Disable button if form is not valid
                                                className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                                            >
                                                <span className="icon-reverse-wrapper">
                                                    <span className="btn-text">Register</span>
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
                </div></>


        );
    }
}

export default withNavigation(SignUp);