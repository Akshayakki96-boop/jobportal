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









    render() {
        const { showModal, updatedUserData, logoPreview, uploadStatus } = this.state;
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

                                    <a
                                        href={`/edit-profile-trainer?user_Id=${this.state.updatedUserData.user_id}`}
                                        className="rbt-btn btn-sm"
                                    >
                                        <i className="feather-edit pl--0"></i> Edit Profile
                                    </a>



                                </div>
                            </div>
                        </div>
                        {[
                            { label: 'Full Name', key: 'fullname' },
                            { label: 'Mobile No', key: 'mobile_no' },
                            { label: 'Email', key: 'email' },
                            { label: 'Date of Birth', key: 'dob' },
                            { label: 'Gender', key: 'gender' },
                            { label: 'Linked In', key: 'linkedin_profile_url' },
                        ].map((item, index) => (
                            <div key={index} className="rbt-profile-row row row--15 mt--15">
                                <div className="col-lg-4 col-md-4">
                                    <div className="rbt-profile-content b2">{item.label}</div>
                                </div>
                                <div className="col-lg-8 col-md-8">
                                    <div className="rbt-profile-content b2">
                                        {item.key === 'dob' ? new Date(updatedUserData[item.key]).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        }).replace(/ /g, '') : updatedUserData[item.key]}
                                    </div>
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