import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import withNavigation from '../withNavigation';
import Header from '../Header/header';


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
            companylogo:"",
            logoPreview: "",
            isFormValid: false, // New state variable
            userData:{},
            dashBoardData: {},
        };

    }
    componentDidMount() {
        let url=window.location.search;
        var urlParams= new URLSearchParams(url);
        this.userId= urlParams.get('user_Id');
        this.getDashboardUser();
     
    }
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
                  });
                }
                this.setState({ keepSpinner: false });

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
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
        const { name, value } = event.target;
        this.setState((prevState) => ({
            userData: {
                ...prevState.userData,
                [name]: value,
            },
            
        }));
    };

    handleFileChange = async (event) => {
        const file = event.target.files[0];
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/FileUpload/uploadlogo`;
        const token = localStorage.getItem('authToken');
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (file) {
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
            },this.validateForm);

            // Create FormData and append the file
            const formData = new FormData();
            formData.append('file', file);

            try {
                // Call the API to upload the file
                const response = await axios.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log('File uploaded successfully:', response.data);
                this.setState({ fileName: response.data.filePath })
                this.setState({ uploadStatus: 'File uploaded successfully!' });
            } catch (error) {
                console.error('Error uploading file:', error);
                this.setState({ uploadStatus: 'Error uploading file!' });
            }
        }
    };

    // Save profile changes
    handleSaveProfile = () => {
        console.log('Updated User Data:', this.state.userData);
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
            "ipAddress": "192.168.1.1"
        };

        axios.post(url, userData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                this.setState({ keepSpinner: false });
                this.props.navigate('/EmployerDashboard?message=profilesuccess');
                //this.props.navigate('/Login'); // Use `navigate`
            })
            .catch((error) => {
                console.error('Signup Error:', error.response?.data || error.message);
                this.setState({ keepSpinner: false });
                this.setState({
                    responseMessage: 'Updation failed. Please try again.',
                    alertVariant: 'danger', // Error alert variant
                });
            });
    };
  


 
  
 
 

 
  
 

  
 
    
    render() {
        const { userData, logoPreview, uploadStatus,isFormValid} = this.state;
        const { firstname, lastname, email, CompanyName, designation } = userData;
        return (
            <><Header dashBoardData={this.state.dashBoardData} /><div className="rbt-become-area bg-color-white rbt-section-gap">
                <div className="container">

                    <div className="row pt--60 g-5">
                        <div className="col-lg-4">
                            <div className="thumbnail">
                                <img
                                    className="radius-10 w-100"
                                    src="assets/images/tab/tabs-10.jpg"
                                    alt="Corporate Template" />
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="rbt-contact-form contact-form-style-1 max-width-auto">
                                <h3 className="title">Update Profile</h3>
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
                                                            borderRadius: '8px',
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            {uploadStatus && <small className="text-danger">{uploadStatus}</small>}
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
            </div></>


        );
    }
}

export default withNavigation(EditProfile);