import React from 'react';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import Breadcumb from '../Breadcumb/breadcumb';
import withNavigation from '../withNavigation';
import Select from "react-select";
import HeaderLoginSignUp from '../Header/headerLoginSignUp';
import { connect } from 'react-redux';

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
                mobile: false,
                fullname: false,
            },
            values: {
                email: "",
                username: "",
                password: "",
                confirmPassword: "",
                company: "",
                mobile: "",
                fullname: "",
                countryCode: "+1", // Default to US country code,  // Default to USA
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
        let url = window.location.search;
        var urlParams = new URLSearchParams(url);
        var reqType = urlParams.get('role_id');
        this.role_id = reqType;
        if (this.props?.singleRequestData && this.props?.singleRequestData.SignUpType == "Candidate") {
            this.setState((prevState) => ({
                values: { ...prevState.values, role: 1 },
            }));
        }
        else if (this.props?.singleRequestData && this.props?.singleRequestData.SignUpType == "Employer") {
            this.setState((prevState) => ({
                values: { ...prevState.values, role: 2 },
            }));
        }
        else {
            this.setState((prevState) => ({
                values: { ...prevState.values, role: 3 },
            }));
        }
        this.getPhoneCode();

    }


    getPhoneCode = () => {
        debugger;
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Master/GetCountryPhoneCode`;
        const token = localStorage.getItem('authToken');
        var req={
            "stateId": 0,
            "countryId": 0,
            "cityId": 0,
            "id": 0,
            "freetext": ""
          }
        axios.post(url, req, {
            headers: {
                'Content-Type': 'application/json',
                //Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                const countryCodes = response.data?.map(phone => ({
                    value: phone.value,
                    label: phone.value
                }));
                this.setState({ countryCodes });


            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
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
        const { countryCode } = this.state.values;
        const countryPhoneLengths = {
            "+1": 10,
            "+91": 10,
            "+44": 10,
            "+61": 9,
            "+49": 11,
        };

        let mobileNumberMessage = "";

        if (field === "mobile") {
            const expectedLength = countryPhoneLengths[countryCode] || 10; // Default to 10 if countryCode not in map
            if (value.length !== expectedLength) {
                mobileNumberMessage = `Mobile number must be ${expectedLength} digits for country code ${countryCode}.`;
            }
        }
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
        const isFormValid = (
            (updatedValues.company || updatedValues.fullname) &&
            updatedValues.email &&
            updatedValues.username &&
            updatedValues.password &&
            updatedValues.confirmPassword &&
            updatedValues.password === updatedValues.confirmPassword &&
            isPasswordValid &&
            !mobileNumberMessage
        );

        this.setState({
            values: updatedValues,
            confirmPasswordMessage,
            passwordStrengthMessage,
            mobileNumberMessage, // Update mobile validation message
            isFormValid, // Update form validation state
        });
    };
    handleRoleChange = (field, selectedOption) => {
        this.setState((prevState) => ({
            values: { ...prevState.values, [field]: selectedOption.value },
        }));
    };



    handleSignup = () => {
        this.setState({ keepSpinner: true });
        const baseUrl = process.env.REACT_APP_BASEURL;
        const signupUrl = `${baseUrl}/api/Signup/Signup`;
        const signupData = {
            "username": this.state.values.username,
            "password": btoa(this.state.values.password),
            "email": this.state.values.email,
            "confirmPassword": btoa(this.state.values.confirmPassword),
            "companyName": this.state.values.company ? this.state.values.company : this.state.values.fullname,
            "mobileno": this.state.values.mobile,
            "countrycode": this.state.values.countryCode,
            "role_id": this.state.values.role,
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
                            Signup successful! Please check your email to activate your account.
                        </span>
                    ),
                    alertVariant: 'success', // Success alert variant

                });
                window.scrollTo(0, 0);
                //this.props.navigate('/Login'); // Use `navigate`
            })
            .catch((error) => {
                console.error('Signup Error:', error.response?.data || error.message);
                this.setState({ keepSpinner: false });
                this.setState({
                    responseMessage: 'Signup failed. Please try again.',
                    alertVariant: 'danger', // Error alert variant
                });
                window.scrollTo(0, 0);
            });
    };

    handleNavigation = (path) => {
        this.props.navigate(path); // Use `navigate`
    };
    handleCountryCodeChange = (field, value) => {
        this.setState((prevState) => ({
            values: { ...prevState.values, [field]: value },
            mobileNumberMessage: "",
        }));
    };

    handleLogin = () => {
        this.props.navigate('/Login'); // Use `navigate`
    };


    render() {
        const { focusStates, values,countryCodes } = this.state;
        const roleOptions = [
            { value: 1, label: "Candidate" },
            { value: 2, label: "Employer" },
            { value: 3, label: "Trainer" },
        ];
        // const countryCodes = [
        //     { value: "+1", label: "🇺🇸 +1", length: 10 },  // USA: 10 digits
        //     { value: "+91", label: "🇮🇳 +91", length: 10 }, // India: 10 digits
        //     { value: "+44", label: "🇬🇧 +44", length: 11 }, // UK: 11 digits
        //     { value: "+61", label: "🇦🇺 +61", length: 9 }   // Australia: 9 digits
        // ];
        return (
            <>
                <div>
                    <HeaderLoginSignUp />
                    <Breadcumb componentName="SignUp" ComponentValue="SignUp" />
                </div>
                <div className="rbt-elements-area bg-color-white" style={{ paddingBottom: '100px', marginBottom: '100px' }}>
                    {/* Render Bootstrap alert if there's a responseMessage */}
                    {this.state.responseMessage && (
                        <Alert variant={this.state.alertVariant} onClose={() => this.setState({ responseMessage: '' })} dismissible>
                            {this.state.responseMessage}
                        </Alert>
                    )}
                    {this.state.keepSpinner && <div className="custom-loader">
                        <div className="loader-spinner"></div>
                        <p className="loader-text">Please Wait...</p>
                    </div>}
                    <div className="container-fluid p-0" style={{ marginBottom: '200px' }}>
                        <div className="row">
                            <div className="log-regs-page">
                                <div className="log-regs-bg1">
                                    <h1>
                                        Ready to Transform Your Career or Business?
                                        Join Zobskill and experience the future of training and recruitment.
                                    </h1>
                                </div>
                                <div className="log-regs-frm">
                                    <div className="rbt-contact-form contact-form-style-1 max-width-auto">
                                        <h3 className="title">SignUp</h3>
                                        <form
                                            className="max-width-auto"
                                            onSubmit={(e) => e.preventDefault()} // Prevent form submission
                                        >

                                            {/* Role Type Dropdown */}
                                            <div className="form-group">
                                                <label>Role</label>
                                                <Select
                                                    name="role"
                                                    placeholder="Select Role"
                                                    isDisabled={true}
                                                    options={roleOptions}
                                                    value={roleOptions.find(option => option.value === values.role)}
                                                    menuPortalTarget={document.body} // Render the dropdown to the body
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure it has a high z-index
                                                    }}
                                                    onChange={(selectedOption) => this.handleRoleChange("role", selectedOption)}
                                                />
                                            </div>
                                            {values.role == 2 ? (
                                                // Show Company Name if role is Employer (2)
                                                <div className={`form-group ${focusStates.company ? "focused" : ""}`}>
                                                    <input
                                                        name="company"
                                                        type="text"
                                                        value={values.company}
                                                        onFocus={() => this.handleFocus("company")}
                                                        onBlur={() => this.handleBlur("company")}
                                                        onChange={(e) => this.handleChange("company", e)}
                                                    />
                                                    <label>Company Name *</label>
                                                    <span className="focus-border"></span>
                                                </div>
                                            ) : (
                                                // Show Full Name for Candidate (1) and Trainer (3)
                                                <div className={`form-group ${focusStates.fullname ? "focused" : ""}`}>
                                                    <input
                                                        name="fullname"
                                                        type="text"
                                                        value={values.fullname}
                                                        onFocus={() => this.handleFocus("fullname")}
                                                        onBlur={() => this.handleBlur("fullname")}
                                                        onChange={(e) => this.handleChange("fullname", e)}
                                                    />
                                                    <label>Full Name *</label>
                                                    <span className="focus-border"></span>
                                                </div>
                                            )}
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
                                            {/* Mobile Number Field */}
                                            <div className="form-group">
                                                <label className="mobile-label">Mobile Number *</label>
                                                <div className="mobile-input">
                                                    <Select
                                                        className="country-code-select"
                                                        options={countryCodes}
                                                        value={countryCodes?.find(option => option.value === values.countryCode)}
                                                        onChange={(selectedOption) => this.handleCountryCodeChange("countryCode", selectedOption.value)}
                                                    />
                                                    <input
                                                        className="mobile-number-input"
                                                        name="mobile"
                                                        type="tel"
                                                        value={values.mobile}
                                                        onChange={(e) => this.handleChange("mobile", e)}
                                                    />
                                                </div>
                                                {/* Validation Message */}
                                                {this.state.mobileNumberMessage && (
                                                    <span className="form-text text-danger">{this.state.mobileNumberMessage}</span>
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
                                            <div style={{ marginTop: '10px' }}></div>
                                            <div className="row mb--30">
                                                <div className="col-lg-6">
                                                    <div style={{ textAlign: 'left' }} className="rbt-lost-password">
                                                        <a onClick={this.handleLogin} className="rbt-btn-link" href="#">Login</a>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div style={{ textAlign: 'left', marginLeft: '-18px', whiteSpace: 'nowrap' }} className="rbt-lost-password">
                                                        <a className="rbt-btn-link" target='_blank' href="/privacypolicy">Privacy Policy</a>
                                                        <a className="rbt-btn-link" target='_blank' href={`/termsconditions?type=${this.props?.singleRequestData?.SignUpType}`} style={{ marginLeft: '10px' }}>Terms of Service</a>
                                                    </div>
                                                </div>

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
const mapStateToProps = (state) => ({
    singleRequestData: state.SingleRequestReducer.singleRequestData,
});



export default connect(mapStateToProps)(withNavigation(SignUp));
