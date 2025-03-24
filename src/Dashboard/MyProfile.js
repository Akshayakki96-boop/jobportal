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
            updatedUserData: { ...this.props.userData.basic_info },
            UpdateUserOtherInfo: { ...this.props.userData },
            responseMessage: '',
            alertVariant: '',
            logo: null, // Holds the uploaded file
            logoPreview: null, // Holds the preview URL for the uploaded logo
        };

    }
    componentDidMount() {

    }









    render() {
        const { showModal, updatedUserData, logoPreview, uploadStatus, UpdateUserOtherInfo } = this.state;
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
                                        <i className="feather-edit pl--0"></i> View and Edit Profile
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
                        {/* Employment Section */}
                        <div className="section-title text-start mt-5">
                            <h4 className="rbt-title-style-3 mb-0 pb-0">Employment</h4>
                        </div>
                        {UpdateUserOtherInfo.employment.map((job, index) => (
                            <div key={index} className="rbt-profile-row row row--15 mt--15">
                                <div className="col-lg-4 col-md-4">
                                    <div className="rbt-profile-content b2">{job.Role_Title}</div>
                                </div>
                                <div className="col-lg-8 col-md-8">
                                    <div className="rbt-profile-content b2">
                                        {job.Institution_Company} ({job.year_from} - {job.year_to})
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Education Section */}
                        <div className="section-title text-start mt-5">
                            <h4 className="rbt-title-style-3 mb-0 pb-0">Education</h4>
                        </div>
                        {UpdateUserOtherInfo.education.map((edu, index) => (
                            <div key={index} className="rbt-profile-row row row--15 mt--15">
                                <div className="col-lg-4 col-md-4">
                                    <div className="rbt-profile-content b2">{edu.education_title}</div>
                                </div>
                                <div className="col-lg-8 col-md-8">
                                    <div className="rbt-profile-content b2">
                                        {edu.university_board} ({edu.passing_year})
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Career Info Section */}
                        <div className="section-title text-start mt-5">
                            <h4 className="rbt-title-style-3 mb-0 pb-0">Career Info</h4>
                        </div>
                        {UpdateUserOtherInfo.carrierinfo.map((info, index) => (
                            <div key={index} className="rbt-profile-row row row--15 mt--15">
                                <div className="col-lg-4 col-md-4">
                                    <div className="rbt-profile-content b2">Trainer Type</div>
                                </div>
                                <div className="col-lg-8 col-md-8">
                                    <div className="rbt-profile-content b2">{info.trainer_type_id}</div>
                                </div>
                                <div className="col-lg-4 col-md-4">
                                    <div className="rbt-profile-content b2">Experience</div>
                                </div>
                                <div className="col-lg-8 col-md-8">
                                    <div className="rbt-profile-content b2">{info.experience} years</div>
                                </div>
                                <div className="col-lg-4 col-md-4">
                                    <div className="rbt-profile-content b2">Training Mode</div>
                                </div>
                                <div className="col-lg-8 col-md-8">
                                    <div className="rbt-profile-content b2">{info.training_mode}</div>
                                </div>
                            </div>
                        ))}



                        {/* Key Skills Section */}
                        <div className="section-title text-start mt-5">
                            <h4 className="rbt-title-style-3 mb-0 pb-0">Key Skills</h4>
                        </div>
                   
               
                                <div className="col-lg-8 col-md-8">
                                    <div className="rbt-profile-content b2">
                                        {UpdateUserOtherInfo.keyskills.map((skillItem, idx) => (
                                            <span key={idx}>
                                                {skillItem.keyskills}
                                                {idx < UpdateUserOtherInfo.keyskills.length - 1 && ", "}
                                            </span>
                                        ))}
                                    </div>
                                
                            </div>
                        


                    </div>
                </div>


            </div>



        );
    }
}

export default withNavigation(MyProfile);