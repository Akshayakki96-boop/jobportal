import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import withNavigation from '../withNavigation';
import Header from '../Header/header';
import Select from 'react-select';
import { DatePicker } from '@fluentui/react';
import '@fluentui/react/dist/css/fabric.css';
import { Alert} from 'react-bootstrap';
import AdvancedBreadcumb from '../Breadcumb/advancebreadcrumb';


class EditProfileCandidate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile_no: "",
            profile_summary: "",
            company_name: "",
            jobtitle: "",
            jobprofile: "",
            notice_period_id: "",
            noticePeriods: [], // for dropdown data
            coursename: "",
            specializations: "",
            keyskills_id: "",
            department_id: "",
            role_id: "",
            experience: "",
            currentsalary: "",
            expectedsalary: "",
            employments: [
                {
                    company_name: "",
                    jobtitle: "",
                    jobprofile: "",
                    workedToMonth: "",
                    workedToYear: "",
                },
            ],
            projects: [
                {
                    projectname: "",
                    client: "",
                    projectDetails: "",
                    workedToMonth: "",
                    workedToYear: "",
                },
            ],
            preferredShift: [], // Example: [{ value: "Day", label: "Day" }]
            preferredWorkLocation: [], // Example: [{ value: "Remote", label: "Remote" }]
            employmentType: [],
            logoPreview: "",
            isBasicInfoExpanded: true, // Default expanded
            isEmploymentDetailsExpanded: false, // Default collapsed
            isProjectDetailsExpanded: false, // Default collapsed
            showEducation: false,
            showKeySkills: false,
            showCareerProfile: false,
            selectedDate: null,
            resume_summary: "",
            cityOptions: [],
            resumePreview: "",
            responseMessage: '',
            alertVariant: '',
        };

    }
    componentDidMount() {
        let url = window.location.search;
        var urlParams = new URLSearchParams(url);
        this.userId = urlParams.get('user_Id');
        this.getDashboardUser();
        this.bindCity();
        this.getNoticePeriod();
        this.getIndustry();
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
        const url = `${baseUrl}/api/Candidate/GetBasicProfile`;
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
                const { profile_image,resumefile } = response.data.data;
                this.setState({ fullname: response.data.data.fullname, email: response.data.data.email, 
                    mobile_no: response.data.data.mobile_no, profile_summary: response.data.data.profile_summary, 
                    experience: response.data.data.experience, currentsalary: response.data.data.CTC, expectedsalary: response.data.data.ExpectedCTC, 
                    resume_summary: response.data.data.resume_headline, 
                    selectedCity: response.data.data.current_location?{value:response.data.data.city_id,label:response.data.data.current_location}:null, 
                     selectedDate: response.data.data.DOB == "1900-01-01T00:00:00" ? new Date() : new Date(response.data.data.DOB), userId: response.data.data.user_id,languague_name:response.data.data.language_name,role_id:response.data.data.designation,noticePeriodSelected:response.data.data.notice_period ? { value: response.data.data.notice_period, label: response.data.data.notice_periods } : null });

                var prefer_location = response.data.data.prefer_location;
                var prefer_location_Id = response.data.data.preferred_location_id;
                if (prefer_location && prefer_location_Id) {
                    const preferredWorkLocation = prefer_location.split(',').map((location, index) => ({
                        value: prefer_location_Id.split(',')[index],
                        label: location,
                    }));
                    this.setState({ preferredWorkLocation });
                }
                if (profile_image) {
                    this.setState({
                        logoPreview: `${process.env.REACT_APP_BASEURL}/Uploads/${profile_image}`,
                        fileName: profile_image,
                    });
                }
                if (resumefile) {
                    this.setState({
                        resumePreview: `${process.env.REACT_APP_BASEURL}/Uploads/${resumefile}`,
                        resumefileName: resumefile,
                    });

                }

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
    }

    getNoticePeriod = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Master/GetNoticePeriods`;
        const token = localStorage.getItem('authToken');
        axios.post(url, {}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                const noticePeriod = response.data.map((item) => ({
                    value: item.id,
                    label: item.value,
                }));
                this.setState({ noticePeriods: noticePeriod });
            })
            .catch((error) => {
                //localStorage.removeItem('authToken');
                //this.props.navigate('/Login'); // Use `navigate`
            });
    }

    getIndustry = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Master/GetIndustry`;
        const token = localStorage.getItem('authToken');
        axios.post(url, {}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                const industry = response.data.map((item) => ({
                    value: item.id,
                    label: item.value,
                }));
                this.setState({ industry: industry });
            })
            .catch((error) => {
                //localStorage.removeItem('authToken');
                //this.props.navigate('/Login'); // Use `navigate`
            });
    };

    bindCity = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Master/GetCity`;
        const token = localStorage.getItem('authToken');
        var text = {
            "freetext": "",
            "cityId": 0,
            "stateId": 0,
        }
        axios.post(url, text, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                const options = response.data.map((item) => ({
                    value: item.id,
                    label: item.value,
                }));
                this.setState({ cityOptions: options });

                this.setState({ keepSpinner: false });

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
    }

    handleCityChange = (selectedOption) => {
        //this.handleInputChange('selectedCity', selectedOption);
        this.setState({ selectedCity: selectedOption });
    }
    addEmployment = () => {
        this.setState((prevState) => ({
            employments: [
                ...prevState.employments,
                {
                    company_name: "",
                    jobtitle: "",
                    jobprofile: "",
                    selectedNoticePeriod: null,
                },
            ],
        }));
    };
    removeEmployment = (index) => {
        const updatedEmployments = this.state.employments.filter(
            (_, i) => i !== index
        );
        this.setState({ employments: updatedEmployments });
    };
    addProject = () => {
        this.setState((prevState) => ({
            projects: [
                ...prevState.projects,
                {
                    projectname: "",
                    client: "",
                    projectDetails: "",
                },
            ],
        }));
    };
    removeProjects = (index) => {
        const updatedProjects = this.state.projects.filter(
            (_, i) => i !== index
        );
        this.setState({ projects: updatedProjects });
    };


    handleSubmit = (event) => {
        event.preventDefault();
        console.log("Submitted Employment Details:", this.state.employments);
    };
    handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const updatedEmployments = [...this.state.employments];
        updatedEmployments[index][name] = value;
        this.setState({ employments: updatedEmployments });
    };
    handleProjectChange = (index, event) => {
        const { name, value } = event.target;
        const updatedProjects = [...this.state.projects];
        updatedProjects[index][name] = value;
        this.setState({ projects: updatedProjects });
    };

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
        const fileType = file.type;
        const validFileTypes = ['application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/rtf']; // Allowed MIME types for resumes

        if (file && !validFileTypes.includes(file.type)) {
            this.setState({ uploadResumeStatus: 'Please select a valid file (PDF, DOC, DOCX, or RTF).' });
            event.target.value = ''; // Reset the file input
        } else {
            this.setState({
                logo: file,
                resumeType: fileType.includes("pdf") ? "pdf" : "other",
                resumePreview: URL.createObjectURL(file), // Preview the uploaded file
                uploadResumeStatus: null,
                // Clear any previous error
            }, this.validateForm);
            const baseUrl = process.env.REACT_APP_BASEURL;
            const url = `${baseUrl}/api/FileUpload/uploadlogo`;
            const token = localStorage.getItem('authToken');
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
                this.setState({ resumefileName: response.data.filePath })
                this.setState({ uploadResumeStatus: 'Resume uploaded successfully!' });
            } catch (error) {
                console.error('Error uploading file:', error);
                this.setState({ uploadResumeStatus: 'Error uploading file!' });
            }
        }
    };

    toggleSection = (section) => {
        this.setState((prevState) => ({
            [section]: !prevState[section], // Toggle the visibility of the section
        }));
    };

    handleDateChange = (date) => {
        this.setState({ selectedDate: date });
        console.log("Selected Date: ", date);
    };
    handleCandidateInformation = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Candidate/UpdateBasicProfile`;
        const token = localStorage.getItem('authToken');
        var candidateData = {
            "id": this.state.userId,
            "designation": this.state.role_id,
            "profile_image": this.state.fileName,
            "resumefile": this.state.resumefileName?this.state.resumefileName:null,
            "fullname": this.state.fullname,
            "mobileno": this.state.mobile_no,
            "ipaddress": "192.168.1.1",
            "resumeheadline": this.state.resume_summary,
            "profilesummary": this.state.profile_summary,
            "expereince": this.state.experience,
            "ctc": this.state.currentsalary,
            "ex_ctc": this.state.expectedsalary,
            "current_cities": this.state.selectedCity.value,
            "preferred_location": this.state.preferredWorkLocation.map((item) => item.value).join(','),
            "notice_period_id": this.state.noticePeriodSelected.value,
            "languague_name": this.state.languague_name,
            "dob": this.state.selectedDate ? `${this.state.selectedDate.getFullYear()}-${String(this.state.selectedDate.getMonth() + 1).padStart(2, '0')}-${String(this.state.selectedDate.getDate()).padStart(2, '0')}` : null
        }

        axios.post(url, candidateData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                this.setState({
                    responseMessage: (
                        <span>
                            Profile Updated Successfully
                        </span>
                    ),
                    alertVariant: 'success', // Success alert variant
                });
            })
            .catch((error) => {
                console.error('update failed:', error.response?.data || error.message);

                this.setState({
                    responseMessage: error.response?.data,
                    alertVariant: 'danger', // Error alert variant
                });
            });
            
    }

    handleFullNameChange = (event) => {
        this.setState({ fullname: event.target.value });
    };
    handleEmailChange = (event) => {
        this.setState({ email: event.target.value });
    };
    handleMobileChange = (event) => {
        this.setState({ mobile_no: event.target.value });
    };
    handleDesignationChange = (event) => {
        this.setState({ role_id: event.target.value });
    };
    handleResumeChange = (event) => {
        this.setState({ resume_summary: event.target.value });
    };
    handleProfileChange = (event) => {
        this.setState({ profile_summary: event.target.value });
    };
    handleExperienceChange = (event) => {
        this.setState({ experience: event.target.value });
    };
    handleExpectedSalaryChange = (event) => {
        this.setState({ expectedsalary: event.target.value });
    };
    handleCurrentSalaryChange = (event) => {
        this.setState({ currentsalary: event.target.value });
    };
    handleLanguageChange = (event) => {
        this.setState({ languague_name: event.target.value });
    };

    render() {
        const { fullname, email, mobile_no, profile_summary, experience, currentsalary, expectedsalary, logoPreview, isBasicInfoExpanded, isEmploymentDetailsExpanded, isProjectDetailsExpanded, showEducation, showKeySkills, preferredWorkLocation, selectedDate, resume_summary, noticePeriods, employments, projects, preferredShift, specializations, keyskillsSelected, department_id, noticePeriodSelected, role_id, uploadStatus, languague_name, resumePreview } = this.state;
        return (
            <>
            <Header dashBoardData={this.state.dashBoardData} />
            <AdvancedBreadcumb componentName="Edit Profile" ComponentValue="Candidate" redirectURL="/CandidateDashboard" />
            <div className="rbt-become-area bg-color-white rbt-section-gap">   
                <div className="container">
                <div className="container mt-5">
                            {/* Render Bootstrap alert if there's a responseMessage */}
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
                                    alt="Corporate Template" />
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="rbt-contact-form contact-form-style-1 max-width-auto">
                                <h3 className="title">Update Profile</h3>
                                <hr className="mb--30" />
                                <form onSubmit={(e) => e.preventDefault()} className="row row--15">
                                    {/* Candidate Basic Info Section */}
                                    <h3 className="section-header"
                                        onClick={() => this.toggleSection('isBasicInfoExpanded')}
                                        style={{ cursor: 'pointer' }}>Candidate Basic Information
                                        <span style={{ marginLeft: '10px' }}>
                                            {isBasicInfoExpanded ? '[-]' : '[+]'}
                                        </span></h3>
                                    {isBasicInfoExpanded && (<div className="section-content">
                                        <div className="form-group">
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                id="profile_image"
                                                onChange={this.handleFileChange}
                                            />
                                            <label htmlFor="profile_image">Profile Image</label>
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
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="fullname"
                                                name="fullname"
                                                value={fullname}
                                                onChange={this.handleFullNameChange}
                                            />
                                            <label htmlFor="fullname">Full Name</label>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="email"
                                                name="email"
                                                value={email}
                                                onChange={this.handleEmailChange}
                                            />
                                            <label htmlFor="email">Email</label>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="mobile_no"
                                                name="mobile_no"
                                                value={mobile_no}
                                                onChange={this.handleMobileChange}
                                            />
                                            <label htmlFor="mobile_no">Mobile Number</label>
                                        </div>
                                        <div className="form-group" style={{ position: "relative" }}>
                                            <label
                                                htmlFor="dob"
                                                style={{
                                                    position: "absolute",
                                                    top: "-12px", // Adjust the position to align properly
                                                    left: "10px", // Align the label horizontally
                                                    background: "white", // Ensure the label background is white
                                                    padding: "0 4px", // Add padding to match other inputs
                                                    fontSize: "12px", // Match the label font size
                                                    color: "#6c757d", // Add a subtle label color
                                                }}
                                            >
                                                Date of Birth
                                            </label>
                                            <DatePicker
                                                id="dob"
                                                placeholder="Select a date..."
                                                ariaLabel="Select a date"
                                                value={selectedDate}
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
                                            <Select
                                                value={this.state.selectedCity}
                                                options={this.state.cityOptions}
                                                placeholder="Select Location"
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body} // Render the dropdown to the body
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure it has a high z-index
                                                }}
                                                onChange={(selectedOption) => this.handleCityChange(selectedOption)} />
                                            <label htmlFor="location">Location</label>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="preferredworklocation">Preferred Work Location</label>
                                            <Select
                                                id="preferredworklocation"
                                                name="preferredworklocation"
                                                value={preferredWorkLocation}
                                                options={[
                                                    ...this.state.cityOptions,
                                                    { value: 8, label: "Remote" },
                                                    { value: 9, label: "On-Site" },
                                                    { value: 10, label: "Hybrid" },
                                                    // Spread dynamic options here
                                                ]}
                                                onChange={(selectedOptions) =>
                                                    this.setState({ preferredWorkLocation: selectedOptions })
                                                }
                                                isMulti
                                                placeholder="Type or select work location..."
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body} // Render the dropdown to the body
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure it has a high z-index
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <Select
                                                options={noticePeriods}
                                                value={noticePeriodSelected}
                                                placeholder="Select Notice Period"
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body} // Render the dropdown to the body
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure it has a high z-index
                                                }}
                                                onChange={(selectedOptions) =>
                                                    this.setState({ noticePeriodSelected: selectedOptions })
                                                } />
                                            <label htmlFor="notice_period_id">Notice Period</label>
                                        </div>
                                        <div className="form-group">
                                            <textarea
                                                className="form-control"
                                                id="profile_summary"
                                                name="profile_summary"
                                                value={profile_summary}
                                                onChange={this.handleProfileChange}
                                            ></textarea>
                                            <label htmlFor="profile_summary">Profile Summary</label>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept=".doc,.docx,.rtf,.pdf"
                                                id="resume"
                                                onChange={this.handleFileResumeChange}
                                            />
                                            <label htmlFor="resume">Update Resume</label>
                                            {this.state.resumePreview && (
                                                <div className="mt-3">
                                                    {this.state.resumeType === "pdf" ? (
                                                        // Show PDF in an iframe (works in most browsers)
                                                        <iframe
                                                            src={this.state.resumePreview}
                                                            width="100%"
                                                            height="200px"
                                                            style={{ border: "1px solid #ccc", borderRadius: "8px" }}
                                                        ></iframe>
                                                    ) : (
                                                        // Show download link for non-PDF files
                                                        <div>
                                                            <p>Preview not available. Download file:</p>
                                                            <a
                                                                href={this.state.resumePreview}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="btn btn-primary"
                                                            >
                                                                Download Resume
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {this.state.uploadResumeStatus && <small className="text-danger">{this.state.uploadResumeStatus}</small>}
                                        </div>

                                        <div className="form-group">
                                            <textarea
                                                className="form-control"
                                                id="resume_summary"
                                                name="resume_summary"
                                                value={resume_summary}
                                                onChange={this.handleResumeChange}
                                            ></textarea>
                                            <label htmlFor="resume_summary">Resume Headline</label>
                                        </div>
                                        {/* <div className="form-group">
                                            <Select
                                                id="Industry"
                                                name="Industry"
                                                value={this.state.industrySelected}
                                                options={this.state.industry}
                                                onChange={(selectedOptions) =>
                                                    this.setState({ industrySelected: selectedOptions })
                                                }
                                                isMulti
                                                placeholder="Type or select industry type..."
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body} // Render the dropdown to the body
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure it has a high z-index
                                                }}
                                            />
                                            <label htmlFor="department_id">Department</label>
                                        </div> */}
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="role_id"
                                                name="role_id"
                                                value={role_id}
                                                onChange={this.handleDesignationChange}
                                            />
                                            <label htmlFor="role_id">Role</label>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="experience"
                                                name="experience"
                                                value={experience}
                                                onChange={this.handleExperienceChange}
                                            />
                                            <label htmlFor="experience">Total Experience</label>
                                        </div>
                                    
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="currentsalary"
                                                name="currentsalary"
                                                value={currentsalary}
                                                onChange={this.handleCurrentSalaryChange}
                                            />
                                            <label htmlFor="currentsalary">Current Salary</label>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="expectedsalary"
                                                name="expectedsalary"
                                                value={expectedsalary}
                                                onChange={this.handleExpectedSalaryChange}
                                            />
                                            <label htmlFor="expectedsalary">Expected Salary</label>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="language"
                                                name="language"
                                                value={languague_name}
                                                onChange={this.handleLanguageChange}
                                            />
                                            <label htmlFor="language">Language</label>
                                        </div>
                                        {/* <div className="form-group">
                                            <Select
                                                id="employmenttype"
                                                name="employmenttype"
                                                value={""}
                                                options={[]}
                                                onChange={(selectedOptions) =>
                                                    this.setState({ employmenttype: selectedOptions })
                                                }
                                                isMulti
                                                placeholder="Type or select employment type..."
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                            />
                                            <label htmlFor="employmenttype">Employment Type</label>
                                        </div> */}

                                        <div className="col-lg-12">
                                            <div className="form-submit-group">
                                                <button
                                                    type="button"
                                                    className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                                                    onClick={this.handleCandidateInformation}
                                                >
                                                    <span className="icon-reverse-wrapper">
                                                        <span className="btn-text">Update Information</span>
                                                        <span className="btn-icon">
                                                            <i className="feather-arrow-right" />
                                                        </span>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    )}


                                    {/* Candidate Employment Section */}
                                    <h3 className="section-header"
                                        onClick={() => this.toggleSection('isEmploymentDetailsExpanded')}
                                        style={{ cursor: 'pointer' }}>Employment Details
                                        <span style={{ marginLeft: '10px' }}>
                                            {isEmploymentDetailsExpanded ? '[-]' : '[+]'}
                                        </span></h3>
                                    {isEmploymentDetailsExpanded && (
                                        <div className="section-content">
                                            {employments?.map((employment, index) => (
                                                <div key={index} className="employment-entry mb-4 border p-3 rounded">
                                                    <h5>Employment {index + 1}</h5>
                                                    <div className="form-group">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id={`company_name_${index}`}
                                                            name="company_name"
                                                            value={employment.company_name}
                                                            onChange={(e) => this.handleInputChange(index, e)}
                                                        />
                                                        <label htmlFor={`company_name_${index}`}>Company Name</label>
                                                    </div>
                                                    <div className="form-group">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id={`jobtitle_${index}`}
                                                            name="jobtitle"
                                                            value={employment.jobtitle}
                                                            onChange={(e) => this.handleInputChange(index, e)}
                                                        />
                                                        <label htmlFor={`jobtitle_${index}`}>Job Title</label>
                                                    </div>
                                                    {/* Worked From */}
                                                    <div className="form-group">
                                                        <label>Worked From:</label>
                                                        <div className="d-flex gap-3">
                                                            <select
                                                                className="form-control"
                                                                id={`workedFromMonth_${index}`}
                                                                name="workedFromMonth"
                                                                value={employment.workedFromMonth}
                                                                onChange={(e) => this.handleProjectChange(index, e)}
                                                            >
                                                                <option value="">Select Month</option>
                                                                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
                                                                    <option key={month} value={month}>
                                                                        {month}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <select
                                                                className="form-control"
                                                                id={`workedFromYear_${index}`}
                                                                name="workedFromYear"
                                                                value={employment.workedFromYear}
                                                                onChange={(e) => this.handleProjectChange(index, e)}
                                                            >
                                                                <option value="">Select Year</option>
                                                                {Array.from({ length: new Date().getFullYear() - 1970 + 1 }, (_, i) => 1970 + i).map((year) => (
                                                                    <option key={year} value={year}>
                                                                        {year}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    {/* Worked To */}
                                                    <div className="form-group">
                                                        <label>Worked To:</label>
                                                        <div className="d-flex gap-3">
                                                            <select
                                                                className="form-control"
                                                                id={`workedToMonth_${index}`}
                                                                name="workedToMonth"
                                                                value={employment.workedToMonth}
                                                                onChange={(e) => this.handleProjectChange(index, e)}
                                                            >
                                                                <option value="">Select Month</option>
                                                                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
                                                                    <option key={month} value={month}>
                                                                        {month}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <select
                                                                className="form-control"
                                                                id={`workedToYear_${index}`}
                                                                name="workedToYear"
                                                                value={employment.workedToYear}
                                                                onChange={(e) => this.handleProjectChange(index, e)}
                                                            >
                                                                <option value="">Select Year</option>
                                                                {Array.from({ length: new Date().getFullYear() - 1970 + 1 }, (_, i) => 1970 + i).map((year) => (
                                                                    <option key={year} value={year}>
                                                                        {year}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <textarea
                                                            className="form-control"
                                                            id={`jobprofile_${index}`}
                                                            name="jobprofile"
                                                            value={employment.jobprofile}
                                                            onChange={(e) => this.handleInputChange(index, e)}
                                                        ></textarea>
                                                        <label htmlFor={`jobprofile_${index}`}>Job Details</label>
                                                    </div>
                                                    <div className="button-group mt-3">
                                                        {employments.length > 1 && (
                                                            <div
                                                                className="icon-circle remove-icon"
                                                                onClick={() => this.removeEmployment(index)}
                                                            >
                                                                -
                                                            </div>
                                                        )}
                                                        {index === employments.length - 1 && (
                                                            <div
                                                                className="icon-circle add-icon"
                                                                onClick={this.addEmployment}
                                                            >
                                                                +
                                                            </div>
                                                        )}
                                                    </div>

                                                </div>
                                            ))}

                                        </div>
                                    )}
                                    {/* Candidate pROJECT Section */}
                                    <h3 className="section-header"
                                        onClick={() => this.toggleSection('isProjectDetailsExpanded')}
                                        style={{ cursor: 'pointer' }}>Project Details
                                        <span style={{ marginLeft: '10px' }}>
                                            {isProjectDetailsExpanded ? '[-]' : '[+]'}
                                        </span></h3>
                                    {isProjectDetailsExpanded && (
                                        <div className="section-content">
                                            {projects?.map((project, index) => (
                                                <div key={index} className="employment-entry mb-4 border p-3 rounded">
                                                    <h5>Project {index + 1}</h5>
                                                    <div className="form-group">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id={`projectname_${index}`}
                                                            name="projectname"
                                                            value={project.projectname}
                                                            onChange={(e) => this.handleProjectChange(index, e)}
                                                        />
                                                        <label htmlFor={`projectname_${index}`}>Project Name</label>
                                                    </div>
                                                    <div className="form-group">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id={`client_${index}`}
                                                            name="client"
                                                            value={project.client}
                                                            onChange={(e) => this.handleProjectChange(index, e)}
                                                        />
                                                        <label htmlFor={`client_${index}`}>Client</label>
                                                    </div>
                                                    <div className="form-group">
                                                        <textarea
                                                            className="form-control"
                                                            id={`projectdetails_${index}`}
                                                            name="projectdetails"
                                                            value={project.projectDetails}
                                                            onChange={(e) => this.handleProjectChange(index, e)}
                                                        ></textarea>
                                                        <label htmlFor={`projectdetails_${index}`}>Project Details</label>
                                                    </div>

                                                    {/* Worked From */}
                                                    <div className="form-group">
                                                        <label>Worked From:</label>
                                                        <div className="d-flex gap-3">
                                                            <select
                                                                className="form-control"
                                                                id={`workedFromMonth_${index}`}
                                                                name="workedFromMonth"
                                                                value={project.workedFromMonth}
                                                                onChange={(e) => this.handleProjectChange(index, e)}
                                                            >
                                                                <option value="">Select Month</option>
                                                                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
                                                                    <option key={month} value={month}>
                                                                        {month}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <select
                                                                className="form-control"
                                                                id={`workedFromYear_${index}`}
                                                                name="workedFromYear"
                                                                value={project.workedFromYear}
                                                                onChange={(e) => this.handleProjectChange(index, e)}
                                                            >
                                                                <option value="">Select Year</option>
                                                                {Array.from({ length: new Date().getFullYear() - 1970 + 1 }, (_, i) => 1970 + i).map((year) => (
                                                                    <option key={year} value={year}>
                                                                        {year}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    {/* Worked To */}
                                                    <div className="form-group">
                                                        <label>Worked To:</label>
                                                        <div className="d-flex gap-3">
                                                            <select
                                                                className="form-control"
                                                                id={`workedToMonth_${index}`}
                                                                name="workedToMonth"
                                                                value={project.workedToMonth}
                                                                onChange={(e) => this.handleProjectChange(index, e)}
                                                            >
                                                                <option value="">Select Month</option>
                                                                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
                                                                    <option key={month} value={month}>
                                                                        {month}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <select
                                                                className="form-control"
                                                                id={`workedToYear_${index}`}
                                                                name="workedToYear"
                                                                value={project.workedToYear}
                                                                onChange={(e) => this.handleProjectChange(index, e)}
                                                            >
                                                                <option value="">Select Year</option>
                                                                {Array.from({ length: new Date().getFullYear() - 1970 + 1 }, (_, i) => 1970 + i).map((year) => (
                                                                    <option key={year} value={year}>
                                                                        {year}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="button-group mt-3">
                                                        {projects.length > 1 && (
                                                            <div
                                                                className="icon-circle remove-icon"
                                                                onClick={() => this.removeProjects(index)}
                                                            >
                                                                -
                                                            </div>
                                                        )}
                                                        {index === projects.length - 1 && (
                                                            <div
                                                                className="icon-circle add-icon"
                                                                onClick={this.addProject}
                                                            >
                                                                +
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}


                                    <h3 className="section-header" onClick={() => this.toggleSection("showEducation")} style={{ cursor: "pointer" }}>
                                        Education Details <span style={{ marginLeft: '10px' }}>{showEducation ? '[-]' : '[+]'}</span>
                                    </h3>
                                    {showEducation && (
                                        <div className="section-content">
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="coursename"
                                                    name="coursename"
                                                    value={''}
                                                    onChange={this.handleInputChange}
                                                />
                                                <label htmlFor="coursename">Course Name</label>
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="specializations"
                                                    name="specializations"
                                                    value={specializations}
                                                    onChange={this.handleInputChange}
                                                />
                                                <label htmlFor="specializations">Specializations</label>
                                            </div>
                                        </div>
                                    )}

                                    {/* Candidate Key Skills Section */}
                                    <h3 className="section-header" onClick={() => this.toggleSection("showKeySkills")} style={{ cursor: "pointer" }}>
                                        Key Skills <span style={{ marginLeft: '10px' }}>{showKeySkills ? '[-]' : '[+]'}</span>
                                    </h3>
                                    {showKeySkills && (
                                        <div className="section-content">
                                            <div className="form-group">
                                                <Select
                                                    id="keyskills_id"
                                                    name="keyskills_id"
                                                    value={keyskillsSelected}
                                                    options={[]}
                                                    onChange={(selectedOptions) =>
                                                        this.setState({ keyskillsSelected: selectedOptions })
                                                    }
                                                    isMulti
                                                    placeholder="Type or select skills..."
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                />
                                                <label htmlFor="keyskills_id">Key Skills</label>
                                            </div>
                                        </div>
                                    )}



                                    {/* Submit Button */}

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div></>
        )
    }
}

export default withNavigation(EditProfileCandidate);