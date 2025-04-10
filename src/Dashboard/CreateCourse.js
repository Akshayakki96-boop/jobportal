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
Link.sanitize = function (url) {
    // Add your custom URL validation logic here
    return url;
};
Quill.register(Link, true);


class CreateCourse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ip: "Fetching...",
            currencyCode: { value: "INR", label: "INR" },
        };

    }

    componentDidMount() {
        this.fetchIP();
        let url = window.location.search;
        var urlParams = new URLSearchParams(url);
        this.userId = urlParams.get('user_Id');
        this.getDashboardUser();
        this.getCourseLevel();
        this.getcurrencyCode();
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
    getcurrencyCode = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Master/GetCurrency`;
        const token = localStorage.getItem('authToken');
        var req = {
            "stateId": 0,
            "countryId": 0,
            "cityId": 0,
            "id": 0,
            "freetext": ""
        }
        axios.post(url, req, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                const currencyCodes = response.data?.map(currency => ({
                    value: currency.value,
                    label: currency.value
                }));
                this.setState({ currencyCodes });


            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
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
        const image = new Image();
        image.src = URL.createObjectURL(file);
        image.onload = async () => {
            if (image.width !== 150 || image.height !== 150) {
                this.setState({ uploadStatus: 'Image dimensions must be 150x150 pixels!' });
                return;
            }

            if (!file) return; // No file selected
            if (file && !validImageTypes.includes(file.type)) {
                this.setState({ uploadStatus: 'Please select a valid image file (JPEG, PNG, GIF).' });
                event.target.value = ''; // Reset the file input
            }
            else {
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
        const courseFee = event.target.value;
        if (/^\d*$/.test(courseFee)) {
            this.setState({ courseFee }, this.validateForm);
            this.setState({ showValisMessage: '' });
        }
        else {
            this.setState({ showValisMessage: true, courseFee });
        }

    };
    handleDescriptionChange = (event) => {
        this.setState({ description: event }, this.validateForm);
    };

    handleCourseSave = () => {

        // if (!this.state.isRefundable) {
        //     this.setState({ showRefundablePopup: true });
        // }
        // else {
        this.createSaveCourse("No");
        //}
    }


    handleCourseSubmit = () => {
        // if (!this.state.isRefundable) {
        //     this.setState({ showRefundablePopup: true });
        // }
        // else {
        this.createCourse("No");
        //}


    }

    createSaveCourse = (type) => {

        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Course/PostCourse`;
        const token = localStorage.getItem('authToken');
        const selectedDate = this.state.startDate; // Assuming this is a Date object
        const date = selectedDate ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000) : null;
        const isoString = date ? date.toISOString() : null;
        var courseData = {
            "courseId": 0,
            "coursetitle": this.state.courseName,
            "description": this.state.description,
            "notes": "string",
            "duration": this.state.duration ? this.state.duration : 0,
            "course_level": this.state.courseSelected ? this.state.courseSelected.value : 0,
            "course_image": this.state.fileName,
            "course_fees": this.state.courseFee ? this.state.courseFee : 0,
            "is_refundable": type == "Yes" ? true : false,
            "course_materials": this.state.courseMaterial,
            "no_of_lessons": this.state.nooflessons ? this.state.nooflessons : 0,
            "isactive": false,
            "ipAddress": this.state.ip,
            "currency": this.state.currencyCode.value,
            "startdate": isoString
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
                    courseMaterial: null
                });
                //this.ActivateCourse(response.data.data);
                this.setState({
                    responseMessage: (
                        <span>
                            Course Saved Successfully
                        </span>
                    ),
                    alertVariant: 'success', // Success alert variant
                });
                window.scrollTo(0, 0);
            })
            .catch((error) => {
                console.error('update failed:', error.response?.data || error.message);

                this.setState({
                    responseMessage: error.response?.data.message,
                    alertVariant: 'danger', // Error alert variant
                });
                window.scrollTo(0, 0);
            });
    }

    createCourse = (type) => {

        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Course/PostCourse`;
        const token = localStorage.getItem('authToken');
        const selectedDate = this.state.startDate; // Assuming this is a Date object
        const date = selectedDate ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000) : null;
        const isoString = date ? date.toISOString() : null;
        var courseData = {
            "courseId": 0,
            "coursetitle": this.state.courseName,
            "description": this.state.description,
            "notes": "string",
            "duration": this.state.duration ? this.state.duration : 0,
            "course_level": this.state.courseSelected ? this.state.courseSelected.value : 0,
            "course_image": this.state.fileName,
            "course_fees": this.state.courseFee ? this.state.courseFee : 0,
            "is_refundable": type == "Yes" ? true : false,
            "course_materials": this.state.courseMaterial,
            "no_of_lessons": this.state.nooflessons ? this.state.nooflessons : 0,
            "isactive": false,
            "ipAddress": this.state.ip,
            "currency": this.state.currencyCode ? this.state.currencyCode.value : "",
            "startdate": isoString
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
                    courseMaterial: null
                });
                this.ActivateCourse(response.data.data);
                // this.setState({
                //     responseMessage: (
                //         <span>
                //             Course Created Successfully
                //         </span>
                //     ),
                //     alertVariant: 'success', // Success alert variant
                // });
                // window.scrollTo(0, 0);
            })
            .catch((error) => {
                console.error('update failed:', error.response?.data || error.message);

                this.setState({
                    responseMessage: error.response?.data.message,
                    alertVariant: 'danger', // Error alert variant
                });
                window.scrollTo(0, 0);
            });
    }

    ActivateCourse = (course) => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Course/ToggleCourse`;
        const token = localStorage.getItem('authToken');
        var request =
        {
            "courseId": course,
            "isactive": true,

        }


        axios.post(url, request, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                // this.getAllCourse(0, this.state.pageSize);
                this.setState({
                    responseMessage: (
                        <span>
                            Course saved and activated successfully
                        </span>
                    ),
                    alertVariant: 'success', // Success alert variant
                });
                window.scrollTo(0, 0);


            })
            .catch((error) => {
                this.setState({
                    responseMessage: "Something went wrong !",
                    alertVariant: 'danger', // Error alert variant
                });
                window.scrollTo(0, 0);
            });
    }

    hanldeCheckChange = (e) => {
        this.setState({ isRefundable: e.target.checked });
    }

    handleNoOfLessons = (e) => {
        const nooflessons = e.target.value;
        if (/^\d*$/.test(nooflessons)) {
            this.setState({ nooflessons }, this.validateForm);
            this.setState({ showValidMessage: '' });
        }
        else {
            this.setState({ showValidMessage: true, nooflessons });
        }
    }

    // handleCourseMaterial = (e) => {
    //     this.setState({ courseMaterial: e });
    // }
    handleCurrencyCodeChange = (selectedOption) => {
        this.setState({ currencyCode: selectedOption });
    };
    handleDateChange = (date) => {
        this.setState({ startDate: date });
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



        return (
            <>
                <Header dashBoardData={this.state.dashBoardData} />
                <AdvancedBreadcumb componentName="Create New" ComponentValue="Create New" redirectURL="/TrainerDashboard" />
                <div className="rbt-become-area bg-color-white rbt-section-gap">
                    <div className="container">
                        {this.state.responseMessage && (<div className="container mt-5">

                            <Alert variant={this.state.alertVariant} onClose={() => this.setState({ responseMessage: '' })} dismissible>
                                {this.state.responseMessage}
                            </Alert>

                        </div>)}
                        <div className="row g-5">

                            <div className="col-lg-12">
                                <div className="rbt-contact-form contact-form-style-1 max-width-auto">
                                    <h3 className="title">Create New Course</h3>
                                    <hr className="mb--30" />
                                    <form onSubmit={(e) => e.preventDefault()} className="row row--15">
                                        { /* Candidate Basic Info Section */}
                                        <div className="section-content">
                                            <p style={{ textAlign: "left" }}>Note: Please upload a Course logo with dimensions of 150x150 pixels.</p>
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
                                                {this.state.uploadStatus && <small className={this.state.uploadStatus == "File uploaded successfully!" ? "text-success" : "text-danger"}>{this.state.uploadStatus}</small>}
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
                                            <div className="form-group" style={{ position: "relative" }}>
                                                <label
                                                    htmlFor="dob"
                                                    style={{
                                                        position: "absolute",
                                                        top: "-12px",
                                                        left: "10px",
                                                        background: "white",
                                                        padding: "0 4px",
                                                        fontSize: "12px",
                                                        color: "#6c757d",
                                                    }}
                                                >
                                                    Start Date
                                                </label>
                                                <DatePicker
                                                    id="startDate"
                                                    placeholder="Select a date..."
                                                    ariaLabel="Select a date"
                                                    value={this.state.startDate}
                                                    onSelectDate={this.handleDateChange}
                                                    styles={{
                                                        root: {
                                                            width: "100%",
                                                        },
                                                        textField: {
                                                            width: "100%",
                                                        },
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="duration"
                                                    name="duration"
                                                    value={this.state.duration}
                                                    onChange={this.handleDurationChange}
                                                />
                                                <label htmlFor="duration">Duration (no of days)</label>
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
                                                    type="text"
                                                    className="form-control"
                                                    id="nooflessons"
                                                    name="nooflessons"
                                                    value={this.state.nooflessons}
                                                    onChange={this.handleNoOfLessons}
                                                />
                                                <label htmlFor="nooflessons">No. of lessons / classes </label>
                                                {this.state.showValidMessage && <small className="text-danger">Enter numeric digits</small>}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="coursefee" className="mobile-label">Course Fee*</label>
                                                <div className="mobile-input d-flex align-items-center">
                                                    <Select
                                                        className="country-code-select"
                                                        options={this.state.currencyCodes}
                                                        value={this.state.currencyCode}
                                                        onChange={this.handleCurrencyCodeChange}
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                            container: (base) => ({
                                                                ...base,
                                                                flex: '0 0 100px', // Adjust the width as needed
                                                            }),
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        className="mobile-number-input flex-grow-1"
                                                        id="coursefee"
                                                        name="coursefee"
                                                        value={this.state.courseFee}
                                                        onChange={this.handleCourseFeeChange}
                                                    />


                                                </div>
                                                {this.state.showValisMessage && <small className="text-danger">Enter numeric digits</small>}
                                            </div>
                                            <div className="form-group" style={{ paddingBottom: "50px" }}>
                                                <ReactQuill
                                                    value={this.state.courseMaterial}
                                                    onChange={this.handleCourseMaterial}
                                                    theme="snow"
                                                    modules={this.modules}
                                                    placeholder="Upload a study material ...(video url link)"
                                                    formats={this.formats}
                                                    style={{ height: "200px" }}
                                                />
                                            </div>

                                            <div className="form-group" style={{ paddingBottom: "50px" }}>
                                                <ReactQuill
                                                    value={this.state.description}
                                                    onChange={this.handleDescriptionChange}
                                                    theme="snow"
                                                    modules={this.modules}
                                                    placeholder="Course Description"
                                                    formats={this.formats}
                                                    style={{ height: "200px" }}
                                                />
                                            </div>
                                            {/* {this.state.description && this.state.description.length > 2000 && (
                                                <span style={{ color: "red" }}>
                                                    Description cannot exceed 2000 characters.
                                                </span>
                                            )} */}

                                            {/* <div className="form-group-check" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <input
                                                    type="checkbox"
                                                    checked={this.state.isRefundable}
                                                    id="isRefundable"
                                                    name="isRefundable"
                                                    onChange={this.hanldeCheckChange}
                                                    style={{ width: "16px", height: "16px", cursor: "pointer" }}
                                                />
                                                <label htmlFor="isRefundable" style={{ cursor: "pointer", marginBottom: "0px" }}>
                                                    Course qualifies for 50% refund
                                                </label>
                                            </div> */}


                                            <div className="col-lg-12">
                                                <div className="form-submit-group d-flex gap-3">
                                                    <button
                                                        type="button"
                                                        className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                                                        onClick={this.handleCourseSave}
                                                    >
                                                        <span className="icon-reverse-wrapper">
                                                            <span className="btn-text">Save</span>
                                                            <span className="btn-icon">
                                                                <i className="feather-arrow-right" />
                                                            </span>
                                                        </span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                                                        onClick={this.handleCourseSubmit}
                                                    >
                                                        <span className="icon-reverse-wrapper">
                                                            <span className="btn-text">Save and Activate</span>
                                                            <span className="btn-icon">
                                                                <i className="feather-arrow-right" />
                                                            </span>
                                                        </span>
                                                    </button>

                                                </div>
                                            </div>



                                        </div>


                                    </form>
                                    {this.state.showRefundablePopup && (
                                        <Modal show={true} onHide={() => { this.setState({ showRefundablePopup: false }); this.createCourse("No"); }} className="custom-modal">
                                            <Modal.Header closeButton>
                                                <Modal.Title>Refund Confirmation</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>Is this course qualify for 50% refund?</Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={() => {
                                                    this.setState({ showRefundablePopup: false });
                                                    this.createCourse("No");
                                                }}>
                                                    Cancel
                                                </Button>
                                                <Button variant="primary" onClick={() => {
                                                    this.setState({ showRefundablePopup: false });
                                                    this.createCourse("Yes");
                                                }}>
                                                    Confirm
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>

                                    )}



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