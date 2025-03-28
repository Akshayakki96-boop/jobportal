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
                this.setState({ fileName: response.data.filePath })
                this.setState({ uploadStatus: 'File uploaded successfully!' });
            } catch (error) {
                console.error('Error uploading file:', error);
                this.setState({ uploadStatus: 'Error uploading file!' });
            }
        }
    };



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
                                        href={`/edit-profile-candidate?user_Id=${this.state.updatedUserData.user_id}`}
                                        className="rbt-btn btn-sm"
                                    >
                                        <i className="feather-edit pl--0"></i> View and Edit Profile
                                    </a>
                                </div>
                            </div>
                        </div>
                        {/* Profile Fields */}
                        {[
                            { label: 'Full Name', key: 'fullname' },
                            { label: 'Email', key: 'email' },
                            { label: 'Mobile', key: 'mobile_no' },
                            { label: 'Company Name', key: "CompanyName" },
                            { label: 'Designation', key: 'designation' },
                            { label: 'Total Experience', key: 'experience' },
                            { label: 'Notice Period', key: 'notice_periods' },
                            { label: 'Current CTC', key: 'CTC' },
                            { label: 'Location', key: 'current_location' },
                        ].map((item, index) => (
                            <div key={index} className="rbt-profile-row row row--15 mt--15">
                                <div className="col-lg-4 col-md-4">
                                    <div className="rbt-profile-content b2">{item.label}</div>
                                </div>
                                <div className="col-lg-8 col-md-8">
                                    <div className="rbt-profile-content b2">
                                        {item.key === "CompanyName" ? this.props?.CompanyName :
                                            item.key === "experience" ? `${updatedUserData[item.key]} years` :
                                                updatedUserData[item.key]}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Employment Section */}
                        <div className="section-title text-start mt-5">
                            <h4 className="rbt-title-style-3 mb-0 pb-0">Employment</h4>
                        </div>
                        {UpdateUserOtherInfo.employment.length > 0 ? (
                            UpdateUserOtherInfo.employment.map((job, index) => (
                                <div key={index} className="rbt-profile-row row row--15 mt--15">
                                    <div className="col-lg-4 col-md-4">
                                        <div className="rbt-profile-content b2">{job.jobtitle}</div>
                                    </div>
                                    <div className="col-lg-8 col-md-8">
                                        <div className="rbt-profile-content b2">
                                            {job.company_name} ({job.joiningdate_year} - {job.leavingdate_year === 0 ? "Present" : job.leavingdate_year})
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rbt-profile-row row row--15 mt--15">
                                <div className="col-12">
                                    <div className="rbt-profile-content b2">NA</div>
                                </div>
                            </div>
                        )}


                        {/* Education Section */}
                        <div className="section-title text-start mt-5">
                            <h4 className="rbt-title-style-3 mb-0 pb-0">Education</h4>
                        </div>
                        {UpdateUserOtherInfo.education.length > 0 ? (
                            UpdateUserOtherInfo.education.map((edu, index) => (
                                <div key={index} className="rbt-profile-row row row--15 mt--15">
                                    <div className="col-lg-4 col-md-4">
                                        <div className="rbt-profile-content b2">{edu.education}</div>
                                    </div>
                                    <div className="col-lg-8 col-md-8">
                                        <div className="rbt-profile-content b2">
                                            {edu.course_duration_from} - {edu.course_duration_to}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rbt-profile-row row row--15 mt--15">
                                <div className="col-12">
                                    <div className="rbt-profile-content b2">NA</div>
                                </div>
                            </div>
                        )}


                        {/* Career Info Section */}
                        <div className="section-title text-start mt-5">
                            <h4 className="rbt-title-style-3 mb-0 pb-0">Career Info</h4>
                        </div>

                        {UpdateUserOtherInfo.carrierinfo.length > 0 ? (
                            UpdateUserOtherInfo.carrierinfo.map((info, index) => (
                                <div key={index} className="rbt-profile-row row row--15 mt--15">
                                    <div className="col-lg-4 col-md-4">
                                        <div className="rbt-profile-content b2">Employment Type</div>
                                    </div>
                                    <div className="col-lg-8 col-md-8">
                                        <div className="rbt-profile-content b2">{info.empType}</div>
                                    </div>
                                    <div className="col-lg-4 col-md-4">
                                        <div className="rbt-profile-content b2">Job Type</div>
                                    </div>
                                    <div className="col-lg-8 col-md-8">
                                        <div className="rbt-profile-content b2">{info.job_type}</div>
                                    </div>
                                    <div className="col-lg-4 col-md-4">
                                        <div className="rbt-profile-content b2">Department</div>
                                    </div>
                                    <div className="col-lg-8 col-md-8">
                                        <div className="rbt-profile-content b2">{info.department}</div>
                                    </div>
                                    <div className="col-lg-4 col-md-4">
                                        <div className="rbt-profile-content b2">Industry Name</div>
                                    </div>
                                    <div className="col-lg-8 col-md-8">
                                        <div className="rbt-profile-content b2">{info.industryname}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rbt-profile-row row row--15 mt--15">
                                <div className="col-12">
                                    <div className="rbt-profile-content b2">NA</div>
                                </div>
                            </div>
                        )}



                        {/* Project Info Section */}
                        <div className="section-title text-start mt-5">
                            <h4 className="rbt-title-style-3 mb-0 pb-0">Project Details</h4>
                        </div>
                        {UpdateUserOtherInfo.projects.length > 0 ? (
                            UpdateUserOtherInfo.projects.map((info, index) => (
                                <div key={index} className="rbt-profile-row row row--15 mt--15">
                                    <div className="col-lg-4 col-md-4">
                                        <div className="rbt-profile-content b2">Project Title</div>
                                    </div>
                                    <div className="col-lg-8 col-md-8">
                                        <div className="rbt-profile-content b2">{info.project_title}</div>
                                    </div>
                                    <div className="col-lg-4 col-md-4">
                                        <div className="rbt-profile-content b2">Key Skills</div>
                                    </div>
                                    <div className="col-lg-8 col-md-8">
                                        <div className="rbt-profile-content b2">{info.keyskills}</div>
                                    </div>
                                    <div className="col-lg-4 col-md-4">
                                        <div className="rbt-profile-content b2">Team Size</div>
                                    </div>
                                    <div className="col-lg-8 col-md-8">
                                        <div className="rbt-profile-content b2">{info.teamsize}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rbt-profile-row row row--15 mt--15">
                                <div className="col-12">
                                    <div className="rbt-profile-content b2">NA</div>
                                </div>
                            </div>
                        )}




                        {/* Key Skills Section */}
                        <div className="section-title text-start mt-5">
                            <h4 className="rbt-title-style-3 mb-0 pb-0">Key Skills</h4>
                        </div>


                        <div className="col-lg-8 col-md-8">
                            <div className="rbt-profile-content b2">
                                {UpdateUserOtherInfo.keyskill.length > 0 ? (
                                    UpdateUserOtherInfo.keyskill.map((skillItem, idx) => (
                                        <span key={idx}>
                                            {skillItem.keyskills}
                                            {idx < UpdateUserOtherInfo.keyskill.length - 1 && ", "}
                                        </span>
                                    ))
                                ) : (
                                    <span>NA</span>
                                )}
                            </div>
                        </div>


                    </div>
                </div>
                {/* End Instructor Profile */}

            </div>



        );
    }
}

export default withNavigation(MyProfile);