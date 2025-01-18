import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import withNavigation from '../withNavigation';

class MyProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            updatedUserData: { ...this.props.userData },
            responseMessage: '',
            alertVariant: '',
            logo: null, // Holds the uploaded file
            logoPreview: null, // Holds the preview URL for the uploaded logo
        };

    }
    componentDidMount() {

    }

    // Open modal
    handleEditProfile = () => {
        this.setState({ showModal: true });
    };

    // Close modal
    handleCloseModal = () => {
        this.setState({ showModal: false });
    };

    // Handle form input changes
    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState((prevState) => ({
            updatedUserData: {
                ...prevState.updatedUserData,
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
            uploadStatus: null, // Clear any previous error
          });
    
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
            this.setState({fileName:response.data.fileName})
            this.setState({ uploadStatus: 'File uploaded successfully!' });
          } catch (error) {
            console.error('Error uploading file:', error);
            this.setState({ uploadStatus: 'Error uploading file!' });
          }
        }
      };

    // Save profile changes
    handleSaveProfile = () => {
        console.log('Updated User Data:', this.state.updatedUserData);
        // Add logic to save updated data (e.g., API call)
        this.setState({ showModal: false });
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Employer/UpdateProfile`;
        const token = localStorage.getItem('authToken');
        const userData = {
            "firstName": this.state.updatedUserData.firstname,
            "lastName": this.state.updatedUserData.lastname,
            "email": this.state.updatedUserData.email,
            "companyLogo": this.state.fileName,
            "companyName": this.state.updatedUserData.CompanyName,
            "role_id": this.state.updatedUserData.role_id,
            "Id": this.state.updatedUserData.user_id,
            "designation":this.state.updatedUserData.designation,
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
                this.setState({
                    responseMessage: (
                        <span>
                            Profile Updated Successfully
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
                    responseMessage: 'Updation failed. Please try again.',
                    alertVariant: 'danger', // Error alert variant
                });
            });
    };

    render() {
        const { showModal, updatedUserData,logoPreview,uploadStatus} = this.state;
        const { firstname, lastname, email, CompanyName, designation } = updatedUserData;
        return (
            <div className="col-lg-9">
                {/* Start Instructor Profile  */}
                <div className="container mt-5">
                    {/* Render Bootstrap alert if there's a responseMessage */}
                    {this.state.responseMessage && (
                        <Alert variant={this.state.alertVariant} onClose={() => this.setState({ responseMessage: '' })} dismissible>
                            {this.state.responseMessage}
                        </Alert>
                    )}
                </div>
                <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
                    <div className="content">
                        <div className="row align-items-end mb--60">
                            <div className="col-lg-6 col-md-6">
                                <div className="section-title text-start">
                                    <h4 className="rbt-title-style-3 mb-0 pb-0">My Profile</h4>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="expend-button text-start text-md-end">
                                    <button className="rbt-btn btn-sm" onClick={this.handleEditProfile}>
                                        <i className="feather-edit pl--0"></i> Edit Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Profile Fields */}
                        {['firstname', 'lastname', 'email', 'CompanyName', 'designation'].map((field, index) => (
                            <div key={index} className="rbt-profile-row row row--15 mt--15">
                                <div className="col-lg-4 col-md-4">
                                    <div className="rbt-profile-content b2">{field}</div>
                                </div>
                                <div className="col-lg-8 col-md-8">
                                    <div className="rbt-profile-content b2">{updatedUserData[field]}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* End Instructor Profile */}
                {/* Modal for Editing Profile */}
                {showModal && (
                 <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                 <div className="modal-dialog">
                   <div className="modal-content">
                     <div className="modal-header">
                       <h5 className="modal-title">Edit Profile</h5>
                       <button type="button" className="close" onClick={this.handleCloseModal}>
                         &times;
                       </button>
                     </div>
                     <div className="modal-body">
                       <form>
                         <div className="form-group floating-label">
                           <input
                             type="file"
                             className="form-control"
                             accept="image/*"
                             id="companyLogo"
                             onChange={this.handleFileChange}
                           />
                           <label htmlFor="companyLogo">Company Logo</label>
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
                         <div className="form-group floating-label">
                           <input
                             type="text"
                             name="firstname"
                             className="form-control"
                             value={firstname}
                             onChange={this.handleInputChange}
                             id="firstname"
                           />
                           <label htmlFor="firstname">First Name</label>
                         </div>
                         <div className="form-group floating-label">
                           <input
                             type="text"
                             name="lastname"
                             className="form-control"
                             value={lastname}
                             onChange={this.handleInputChange}
                             id="lastname"
                           />
                           <label htmlFor="lastname">Last Name</label>
                         </div>
                         <div className="form-group floating-label">
                           <input
                             type="email"
                             name="email"
                             className="form-control"
                             value={email}
                             readOnly
                             id="email"
                           />
                           <label htmlFor="email">Email</label>
                         </div>
                         <div className="form-group floating-label">
                           <input
                             type="text"
                             name="CompanyName"
                             className="form-control"
                             value={CompanyName}
                             readOnly
                             id="CompanyName"
                           />
                           <label htmlFor="CompanyName">Company Name</label>
                         </div>
                         <div className="form-group floating-label">
                           <input
                             type="text"
                             name="designation"
                             className="form-control"
                             value={designation}
                             onChange={this.handleInputChange}
                             id="designation"
                           />
                           <label htmlFor="designation">Designation</label>
                         </div>
                       </form>
                     </div>
                     <div className="modal-footer">
                       <button className="btn btn-secondary" onClick={this.handleCloseModal}>
                         Cancel
                       </button>
                       <button className="btn btn-primary" onClick={this.handleSaveProfile}>
                         Save Changes
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
               
                )}
            </div>



        );
    }
}

export default withNavigation(MyProfile);