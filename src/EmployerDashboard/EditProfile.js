import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import withNavigation from '../withNavigation';
import Header from '../Header/header';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles
import { Quill } from "react-quill";
import AdvancedBreadcumb from '../Breadcumb/advancebreadcrumb';

const Link = Quill.import('formats/link');
Link.sanitize = function (url) {
    // Add your custom URL validation logic here
    return url;
};
Quill.register(Link, true);
class EditProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFormValid: false,
            firstname: "",
            lastname: "",
            email: "",
            CompanyName: "",
            designation: "",
            companylogo: "",
            logoPreview: "",
            isFormValid: false, // New state variable
            userData: {},
            dashBoardData: {},
        };

    }
    componentDidMount() {
        this.fetchIP();
        let url = window.location.search;
        var urlParams = new URLSearchParams(url);
        this.userId = urlParams.get('user_Id');
        this.getDashboardUser();

    }

    fetchIP = async () => {
        try {
           let response = await fetch("https://checkip.amazonaws.com");
           let data = await response.text();
            this.setState({ ip: data.trim() });
        } catch (error) {
            this.setState({ ip: "Error fetching IP" });
        }
    };
    getDashboardUser = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Employer/Dashboard`;
        const token = localStorage.getItem('authToken');

        axios.post(url, "", {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('dashboard data', response.data);
                this.getUserProfile(this.userId);
                this.setState({ dashBoardData: response.data.data });

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
    }

    getUserProfile = (userId) => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Employer/GetProfile`;
        const token = localStorage.getItem('authToken');
        const userData = {
            "Id": userId,
        };
        axios.post(url, userData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('user data', response.data);
                this.setState({ userData: response.data.data })
                const { companylogo } = response.data.data;
                if (companylogo) {
                    this.setState({
                        logoPreview: `${process.env.REACT_APP_BASEURL}/Uploads/${companylogo}`,
                        fileName: companylogo,
                    });
                }
                this.setState({ keepSpinner: false });

            })
            .catch((error) => {
                //localStorage.removeItem('authToken');
                //this.props.navigate('/Login'); // Use `navigate`
            });
    }
    validateForm = () => {
        const { firstname, lastname, email, CompanyName, designation, logoPreview } = this.state;

        // Check if all required fields are filled
        const isFormValid =
            firstname.trim() !== "" &&
            lastname.trim() !== "" &&
            email.trim() !== "" &&
            CompanyName.trim() !== "" &&
            designation.trim() !== "" &&
            logoPreview !== null;

        this.setState({ isFormValid });
    };

    handleInputChange = (event) => {
        if (event.target) {
            const { name, value } = event.target;
            this.setState((prevState) => ({
                userData: {
                    ...prevState.userData,
                    [name]: value,
                },
            }));
        } else {
            // Handle Quill editor value
            this.setState((prevState) => ({
                userData: {
                    ...prevState.userData,
                    company_description: event, // `event` contains the Quill editor value
                },
            }));
        }

    };

    handleFileChange = async (event) => {
        const file = event.target.files[0];
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/FileUpload/uploadlogo`;
        const token = localStorage.getItem('authToken');
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (file) {
            const image = new Image();
            image.src = URL.createObjectURL(file);

            image.onload = () => {
                if (image.width !== 150 || image.height !== 150) {
                    this.setState({ uploadStatus: 'Image dimensions must be 150x150 pixels!' });
                    return;
                }

                if (!validImageTypes.includes(file.type)) {
                    // Set an error message if the file type is not valid
                    this.setState({ uploadStatus: 'Invalid file type! Please upload an image file.' });
                    return;
                }

                this.setState({
                    logo: file,
                    logoPreview: URL.createObjectURL(file), // Preview the uploaded file
                    uploadStatus: null,
                    // Clear any previous error
                }, this.validateForm);

                // Create FormData and append the file
                const formData = new FormData();
                formData.append('file', file);

                // Call the API to upload the file
                axios.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    console.log('File uploaded successfully:', response.data);
                    this.setState({ fileName: response.data.filePath });
                    this.setState({ uploadStatus: 'File uploaded successfully!' });
                })
                .catch((error) => {
                    console.error('Error uploading file:', error);
                    this.setState({ uploadStatus: 'Error uploading file!' });
                });
            };
        }
    };

    // Save profile changes
    handleSaveProfile = () => {
        // Add logic to save updated data (e.g., API call)
        this.setState({ showModal: false });
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Employer/UpdateProfile`;
        const token = localStorage.getItem('authToken');
        const userData = {
            "firstName": this.state.userData.firstname,
            "lastName": this.state.userData.lastname,
            "email": this.state.userData.email,
            "companyLogo": this.state.fileName,
            "companyName": this.state.userData.CompanyName,
            "role_id": this.state.userData.role_id,
            "Id": this.state.userData.user_id,
            "designation": this.state.userData.designation,
            "description": this.state.userData.company_description,
            "ipAddress": this.state.ip
        };

        axios.post(url, userData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                this.setState({ keepSpinner: false });
                // this.props.navigate('/EmployerDashboard?message=profilesuccess');
                //this.props.navigate('/Login'); // Use `navigate`
                this.setState({
                    responseMessage: "Profile updated successfully!",
                    alertVariant: 'success', // Success alert variant

                });
                window.scrollTo(0, 0); // Scroll to the top of the page
            })
            .catch((error) => {
                console.error('Signup Error:', error.response?.data || error.message);
                this.setState({ keepSpinner: false });
                this.setState({
                    responseMessage: error.response?.data.message,
                    alertVariant: 'danger', // Error alert variant

                });
                window.scrollTo(0, 0); // Scroll to the top of the page
            });
    };


    handleDescriptionChange = (description) => {
        this.setState({ description });
    };

    modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean'],
            ['pdf', 'doc'] // Custom buttons for PDF and DOC
        ],
    };

    formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video', 'pdf', 'doc'
    ];


    render() {

        const { userData, logoPreview, uploadStatus, isFormValid } = this.state;
        const { firstname, lastname, email, CompanyName, designation, company_description } = userData;
        return (
            <>
            <Header dashBoardData={this.state.dashBoardData} />
            <AdvancedBreadcumb componentName="Edit Profile" ComponentValue="Employer" redirectURL="/EmployerDashboard" />
            <div className="rbt-become-area bg-color-white rbt-section-gap">
                <div className="container">
                <div className="container mt-5">
                    {this.state.responseMessage && (
                    <Alert variant={this.state.alertVariant} onClose={() => this.setState({ responseMessage: '' })} dismissible>
                        {this.state.responseMessage}
                    </Alert>
                    )}
                </div>
                <div className="row pt--60 g-5">
                    <div className="col-lg-12">
                    <div className="rbt-contact-form contact-form-style-1 max-width-auto">
                        <h3 className="title">Complete Your Profile</h3>
                        <hr className="mb--30" />
                        <form onSubmit={(e) => e.preventDefault()} className="row row--15">
                        <div className="col-lg-12">

                            <div className="form-group">
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                id="companyLogo"
                                onChange={this.handleFileChange}
                            />
                        <p style={{ textAlign: "left" }}>Note: Please upload a Employer logo with dimensions of 150x150 pixels.</p>
                            <span className="focus-border" />
                            {logoPreview && (
                                <div className="mt-3">
                                <img
                                    src={logoPreview}
                                    alt="Logo Preview"
                                    style={{
                                    width: '100px',
                                    height: '100px',
                                    objectFit: 'cover',
                                    borderRadius: '50px',
                                    }}
                                />
                                </div>
                            )}
                            {uploadStatus && <small className={uploadStatus === "File uploaded successfully!" ? "text-success" : "text-danger"}>{uploadStatus}</small>}
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="form-group">
                            <input
                                type="text"
                                name="firstname"
                                className="form-control"
                                value={firstname}
                                onChange={this.handleInputChange}
                                id="firstname"
                            />
                            <label htmlFor="firstname">First Name</label>
                            <span className="focus-border" />
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="form-group">
                            <input
                                type="text"
                                name="lastname"
                                className="form-control"
                                value={lastname}
                                onChange={this.handleInputChange}
                                id="lastname"
                            />
                            <label htmlFor="lastname">Last Name</label>
                            <span className="focus-border" />
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={email}
                                readOnly
                                id="email"
                                onChange={this.handleInputChange}
                            />
                            <label htmlFor="email">Email</label>
                            <span className="focus-border" />
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="form-group">
                            <input
                                type="text"
                                name="CompanyName"
                                className="form-control"
                                value={CompanyName}
                                readOnly
                                id="CompanyName"
                            />
                            <label htmlFor="CompanyName">Company Name</label>
                            <span className="focus-border" />
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="form-group">
                            <input
                                type="text"
                                name="designation"
                                className="form-control"
                                value={designation}
                                onChange={this.handleInputChange}
                                id="designation"
                            />
                            <label htmlFor="designation">Designation</label>
                            <span className="focus-border" />
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="form-group" style={{ paddingBottom: "50px" }}>
                            <label>Company Description</label>
                            <ReactQuill
                                value={company_description}
                                onChange={this.handleInputChange}
                                theme="snow"
                                modules={this.modules}
                                placeholder="About the company (max 2000 characters)"
                                formats={this.formats}
                                style={{ height: "200px" }}
                            />
                            </div>
                        </div>
                       

                        <div className="col-lg-12">
                            <div className="form-submit-group">
                            <button
                                type="button"
                                className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                                onClick={this.handleSaveProfile}
                            >
                                <span className="icon-reverse-wrapper">
                                <span className="btn-text">Update Profile</span>
                                <span className="btn-icon">
                                    <i className="feather-arrow-right" />
                                </span>
                                <span className="btn-icon">
                                    <i className="feather-arrow-right" />
                                </span>
                                </span>
                            </button>
                            </div>
                        </div>
                        </form>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </>
        );
    }
}

export default withNavigation(EditProfile);