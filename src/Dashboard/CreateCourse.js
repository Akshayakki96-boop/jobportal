import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import withNavigation from '../withNavigation';
import Header from '../Header/header';
import Select from 'react-select';
import { DatePicker, values } from '@fluentui/react';
import '@fluentui/react/dist/css/fabric.css';
import { Alert } from 'react-bootstrap';
import { Modal, Button } from 'react-bootstrap';
import AdvancedBreadcumb from '../Breadcumb/advancebreadcrumb';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles
import { Quill } from "react-quill";

// Register the link module
const Link = Quill.import('formats/link');
Link.sanitize = function(url) {
    // Add your custom URL validation logic here
    return url;
};
Quill.register(Link, true);


class CreateCourse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }
    componentDidMount() {
        let url = window.location.search;
        var urlParams = new URLSearchParams(url);
        this.userId = urlParams.get('user_Id');
        this.getDashboardUser();
        this.getCourseLevel();
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
                this.setState({ dashBoardData: response.data.data });

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
    }

    getCourseLevel = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Master/GetCourseLevel`;
        const token = localStorage.getItem('authToken');
        var data = {
            "stateId": 0,
            "countryId": 0,
            "cityId": 0,
            "id": 0,
            "freetext": ""
        }
        axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                const courseLevels = response.data?.map(level => ({
                    value: level.id,
                    label: level.value
                }));
                this.setState({ courseLevels });

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
    }


    handleFileChange = async (event) => {
        const file = event.target.files[0]; // Get the selected file
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/FileUpload/uploadlogo`;
        const token = localStorage.getItem('authToken');
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif']; // Allowed MIME types

        if (file && !validImageTypes.includes(file.type)) {
            this.setState({ uploadStatus: 'Please select a valid image file (JPEG, PNG, GIF).' });
            event.target.value = ''; // Reset the file input
        } else {
            this.setState({
                logo: file,
                logoPreview: URL.createObjectURL(file), // Preview the uploaded file
                uploadStatus: null,
                // Clear any previous error
            }, this.validateForm);
            // Proceed with further processing
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

    handleFileResumeChange = async (event) => {
        const file = event.target.files[0]; // Get the selected file
        if (!file) return;

        const fileType = file.type;
        const validFileTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/rtf'
        ]; // Allowed MIME types for resumes

        const validVideoTypes = ['video/mp4', 'video/avi', 'video/mov']; // Allowed video formats

        let resumeType = "other";
        if (validFileTypes.includes(fileType)) {
            resumeType = fileType;
        } else if (validVideoTypes.includes(fileType)) {
            resumeType = "video";
        } else {
            this.setState({ uploadResumeStatus: 'Please select a valid file (PDF, DOC, DOCX, RTF, MP4, AVI, MOV).' });
            event.target.value = ''; // Reset the file input
            return;
        }

        // Create preview URL
        const filePreview = URL.createObjectURL(file);

        // Set state with file details
        this.setState({
            logo: file,
            resumeType,
            resumePreview: filePreview,
            uploadResumeStatus: null, // Clear any previous error
        }, this.validateForm);

        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/FileUpload/UploadCandidateResume`;
        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Upload file to API
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('File uploaded successfully:', response.data);
            this.setState({ resumefileName: response.data.filePath });
            this.setState({ uploadResumeStatus: 'File uploaded successfully!' });
        } catch (error) {
            console.error('Error uploading file:', error);
            this.setState({ uploadResumeStatus: 'Error uploading file!' });
        }
    };


    handleCourseNameChange = (event) => {
        this.setState({ courseName: event.target.value }, this.validateForm);
    };

    handleDurationChange = (event) => {
        this.setState({ duration: event.target.value }, this.validateForm);
    };

    handleCourseLevelChange = (selectedOption) => {
        this.setState({ courseSelected: selectedOption }, this.validateForm);
    };

    handleEnrollmentLimitChange = (event) => {
        this.setState({ enrollmentlimit: event.target.value }, this.validateForm);
    };

    handleDelieveryModeChange = (selectedOption) => {
        this.setState({ delieveryMode: selectedOption }, this.validateForm);
    };
    handleCourseFeeChange = (event) => {
        this.setState({ courseFee: event.target.value }, this.validateForm);
    };
    handleDescriptionChange = (event) => {
        this.setState({ description: event.target.value }, this.validateForm);
    };

    handleCourseSubmit = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Course/PostCourse`;
        const token = localStorage.getItem('authToken');
        var courseData = {
            "courseId": 0,
            "coursetitle": this.state.courseName,
            "description": this.state.description,
            "notes": "string",
            "duration": this.state.duration,
            "course_level": this.state.courseSelected.value,
            "course_image": this.state.fileName,
            "course_fees": this.state.courseFee,
            "is_refundable": this.state.isRefundable,
            "course_materials": this.state.courseMaterial,
            "no_of_lessons": this.state.nooflessons,
            "isactive": false,
            "ipAddress": '192.168.1.1'
        }

        axios.post(url, courseData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                this.setState({
                    courseName: '',
                    description: '',
                    duration: '',
                    courseSelected: null,
                    fileName: '',
                    courseFee: '',
                    isRefundable: false,
                    resumefileName: '',
                    nooflessons: '',
                    logo: null,
                    logoPreview: null,
                    uploadStatus: null,
                    resumePreview: null,
                    uploadResumeStatus: null,
                    courseMaterial:null
                });
                this.setState({
                    responseMessage: (
                        <span>
                            Course Created Successfully
                        </span>
                    ),
                    alertVariant: 'success', // Success alert variant
                });
                window.scrollTo(0, 0);
            })
            .catch((error) => {
                console.error('update failed:', error.response?.data || error.message);

                this.setState({
                    responseMessage: error.response?.data,
                    alertVariant: 'danger', // Error alert variant
                });
                window.scrollTo(0, 0);
            });

    }

    hanldeCheckChange = (e) => {
        this.setState({ isRefundable: e.target.checked });
    }

    handleNoOfLessons = (e) => {
        this.setState({ nooflessons: e.target.value });
    }

    handleCourseMaterial=(e)=>{
        this.setState({ courseMaterial: e });
    }
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
        'link', 'image', 'video','pdf', 'doc'
    ];
    render() {



        return (
            <>
                <Header dashBoardData={this.state.dashBoardData} />
                <AdvancedBreadcumb componentName="Create New" ComponentValue="Create New" redirectURL="/TrainerDashboard" />
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
                            <div className="col-lg-4">
                                <div className="thumbnail">
                                    <img
                                        className="radius-10 w-100"
                                        src="assets/images/tab/tabs-10.jpg"
                                        alt="Corporate Template"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-8">
                                <div className="rbt-contact-form contact-form-style-1 max-width-auto">
                                    <h3 className="title">Create New Course</h3>
                                    <hr className="mb--30" />
                                    <form onSubmit={(e) => e.preventDefault()} className="row row--15">
                                        { /* Candidate Basic Info Section */}


                                        <div className="section-content">
                                            <div className="form-group">
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    accept="image/*"
                                                    id="profile_image"
                                                    onChange={this.handleFileChange}
                                                />
                                                <label htmlFor="profile_image">Course Image</label>
                                                {this.state.logoPreview && (
                                                    <div className="mt-3">
                                                        <img
                                                            src={this.state.logoPreview}
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
                                                {this.state.uploadStatus && <small className="text-danger">{this.state.uploadStatus}</small>}
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="coursename"
                                                    name="coursename"
                                                    value={this.state.courseName}
                                                    onChange={this.handleCourseNameChange}
                                                />
                                                <label htmlFor="coursename">Course Name</label>
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="duration"
                                                    name="duration"
                                                    value={this.state.duration}
                                                    onChange={this.handleDurationChange}
                                                />
                                                <label htmlFor="duration">Duration</label>
                                            </div>
                                            <div className="form-group">
                                                <Select
                                                    value={this.state.courseSelected}
                                                    options={this.state.courseLevels}
                                                    placeholder="Select Course Level"
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    menuPortalTarget={document.body} // Render the dropdown to the body
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure it has a high z-index
                                                    }}
                                                    onChange={(selectedOption) => this.handleCourseLevelChange(selectedOption)} />
                                                <label htmlFor="courselevel">Course Level</label>
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="checkbox"
                                                    checked={this.state.isRefundable}
                                                    className="form-control"
                                                    id="isRefundable"
                                                    onChange={this.hanldeCheckChange}
                                                />
                                                <label htmlFor="isRefundable">Is Refundable</label>
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="nooflessons"
                                                    name="nooflessons"
                                                    value={this.state.nooflessons}
                                                    onChange={this.handleNoOfLessons}
                                                />
                                                <label htmlFor="nooflessons">Total chapter</label>
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="coursefee"
                                                    name="coursefee"
                                                    value={this.state.courseFee}
                                                    onChange={this.handleCourseFeeChange}
                                                />
                                                <label htmlFor="coursefee">Course Fee</label>
                                            </div>
                                            <div className="form-group">
                                                <ReactQuill
                                                    value={this.state.courseMaterial}
                                                    onChange={this.handleCourseMaterial}
                                                    theme="snow"
                                                    modules={this.modules}
                                                    placeholder="Upload a material..."
                                                    formats={this.formats}
                                                />
                                            </div>

                                            {/* <div className="form-group">
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    accept=".doc,.docx,.rtf,.pdf,.mp4,.avi,.mov"
                                                    id="resume"
                                                    onChange={this.handleFileResumeChange}
                                                />
                                                <label htmlFor="resume">Course Material</label>

                                                {this.state.resumePreview && (
                                                    <div className="mt-3">
                                                     
                                                        {this.state.resumeType == "application/pdf" ? (
                                                            <iframe
                                                                src={this.state.resumePreview}
                                                                width="100%"
                                                                height="200px"
                                                                style={{ border: "1px solid #ccc", borderRadius: "8px" }}
                                                            ></iframe>
                                                        ) : this.state.resumeType == "video" ? (
                                                       
                                                            <video
                                                                width="100%"
                                                                height="200px"
                                                                controls
                                                                style={{ borderRadius: "8px", border: "1px solid #ccc" }}
                                                            >
                                                                <source src={this.state.resumePreview} type={this.state.fileMimeType} />
                                                                Your browser does not support the video tag.
                                                            </video>
                                                        ) : (
                       
                                                            <div>
                                                                <p>Preview not available. Download file:</p>
                                                                <a
                                                                    href={this.state.resumePreview}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="btn btn-primary"
                                                                >
                                                                    Download File
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {this.state.uploadResumeStatus && <small className="text-danger">{this.state.uploadResumeStatus}</small>}
                                            </div> */}

                                            <div className="form-group">
                                                <textarea
                                                    className="form-control"
                                                    id="description"
                                                    name="description"
                                                    value={this.state.description}
                                                    onChange={this.handleDescriptionChange}
                                                ></textarea>
                                                <label htmlFor="description">Description</label>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="form-submit-group">
                                                    <button
                                                        type="button"
                                                        className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                                                        onClick={this.handleCourseSubmit}
                                                    >
                                                        <span className="icon-reverse-wrapper">
                                                            <span className="btn-text">Save Information</span>
                                                            <span className="btn-icon">
                                                                <i className="feather-arrow-right" />
                                                            </span>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>



                                        </div>


                                    </form>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
            </>
        );
    }
}

export default withNavigation(CreateCourse);