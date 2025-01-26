import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import withNavigation from '../withNavigation';
import Header from '../Header/header';
import Select from 'react-select';
import { DatePicker, DayOfWeek, defaultDatePickerStrings } from "@fluentui/react";

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
        };

    }
    componentDidMount() {
        let url = window.location.search;
        var urlParams = new URLSearchParams(url);
        this.userId = urlParams.get('user_Id');
        this.getDashboardUser();
        this.bindCity();
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
        this.handleInputChange('selectedCity', selectedOption);
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

    handleFileChange = (event) => {
        const file = event.target.files[0]; // Get the selected file
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif']; // Allowed MIME types

        if (file && !validImageTypes.includes(file.type)) {
            this.setState({ fileError: 'Please select a valid image file (JPEG, PNG, GIF).' });
            event.target.value = ''; // Reset the file input
        } else {
            this.setState({
                logo: file,
                logoPreview: URL.createObjectURL(file), // Preview the uploaded file
                fileError: ''
                // Clear any previous error
            }, this.validateForm);
            // Proceed with further processing
            console.log('Selected file:', file);
        }
    };

    handleFileResumeChange = (event) => {
        const file = event.target.files[0]; // Get the selected file
        const validFileTypes = ['application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/rtf']; // Allowed MIME types for resumes

        if (file && !validFileTypes.includes(file.type)) {
            this.setState({ resumeError: 'Please select a valid file (PDF, DOC, DOCX, or RTF).' });
            event.target.value = ''; // Reset the file input
        } else {
            this.setState({ resumeError: '' });
            // Proceed with further processing
            console.log('Selected file:', file);
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

    render() {
        const { firstname, lastname, mobile_no, profile_summary, coursename, specializations, keyskills_id, department_id, role_id, employments, experience, projects, currentsalary, expectedsalary, logoPreview, isBasicInfoExpanded, isEmploymentDetailsExpanded, isProjectDetailsExpanded, showEducation, showKeySkills, showCareerProfile, preferredShift, preferredWorkLocation, selectedDate } = this.state;
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
                                            {this.state.fileError && <p className="error-text">{this.state.fileError}</p>}
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="firstname"
                                                name="firstname"
                                                value={firstname}
                                                onChange={this.handleInputChange}
                                            />
                                            <label htmlFor="firstname">First Name</label>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="lastname"
                                                name="lastname"
                                                value={lastname}
                                                onChange={this.handleInputChange}
                                            />
                                            <label htmlFor="lastname">Last Name</label>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="mobile_no"
                                                name="mobile_no"
                                                value={mobile_no}
                                                onChange={this.handleInputChange}
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
                                                firstDayOfWeek={DayOfWeek.Monday}
                                                strings={defaultDatePickerStrings}
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
                                            <Select
                                                options={[]}
                                                value={this.state.selectedNoticePeriod}
                                                placeholder="Select Notice Period"
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body} // Render the dropdown to the body
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure it has a high z-index
                                                }}
                                                onChange={(selectedOption) => this.handleRoles(selectedOption)} />
                                            <label htmlFor="notice_period_id">Notice Period</label>
                                        </div>
                                        <div className="form-group">
                                            <textarea
                                                className="form-control"
                                                id="profile_summary"
                                                name="profile_summary"
                                                value={profile_summary}
                                                onChange={this.handleInputChange}
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
                                            {this.state.resumeError && <p className="error-text">{this.state.resumeError}</p>}
                                        </div>

                                        <div className="form-group">
                                            <textarea
                                                className="form-control"
                                                id="profile_summary"
                                                name="profile_summary"
                                                value={profile_summary}
                                                onChange={this.handleInputChange}
                                            ></textarea>
                                            <label htmlFor="resume_summary">Resume Headline</label>
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
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="currentsalary"
                                                    name="currentsalary"
                                                    value={currentsalary}
                                                    onChange={this.handleInputChange}
                                                />
                                                <label htmlFor="currentsalary">Current Salary</label>
                                            </div>
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
                                                    value={coursename}
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
                                                    value={keyskills_id}
                                                    options={[]}
                                                    onChange={(selectedOptions) =>
                                                        this.setState({ keyskills_id: selectedOptions })
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

                                    {/* Candidate Career Profile Section */}
                                    <h3 className="section-header" onClick={() => this.toggleSection("showCareerProfile")} style={{ cursor: "pointer" }}>
                                        Career Profile<span style={{ marginLeft: '10px' }}>{showCareerProfile ? '[-]' : '[+]'}</span>
                                    </h3>
                                    {showCareerProfile && (
                                        <div className="section-content">
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="department_id"
                                                    name="department_id"
                                                    value={department_id}
                                                    onChange={this.handleInputChange}
                                                />
                                                <label htmlFor="department_id">Department</label>
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="role_id"
                                                    name="role_id"
                                                    value={role_id}
                                                    onChange={this.handleInputChange}
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
                                                    onChange={this.handleInputChange}
                                                />
                                                <label htmlFor="experience">Total Experience</label>
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="expectedsalary"
                                                    name="expectedsalary"
                                                    value={expectedsalary}
                                                    onChange={this.handleInputChange}
                                                />
                                                <label htmlFor="expectedsalary">Expected Salary</label>
                                            </div>
                                            <div className="form-group">
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
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="preferredshift">Preferred Shift</label>
                                                <Select
                                                    id="preferredshift"
                                                    name="preferredshift"
                                                    value={preferredShift}
                                                    options={[
                                                        { value: "Day", label: "Day" },
                                                        { value: "Night", label: "Night" },
                                                    ]}
                                                    onChange={(selectedOptions) =>
                                                        this.setState({ preferredShift: selectedOptions })
                                                    }
                                                    isMulti
                                                    placeholder="Type or select shift..."
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="preferredworklocation">Preferred Work Location</label>
                                                <Select
                                                    id="preferredworklocation"
                                                    name="preferredworklocation"
                                                    value={preferredWorkLocation}
                                                    options={[
                                                        { value: "Remote", label: "Remote" },
                                                        { value: "On-Site", label: "On-Site" },
                                                        { value: "Hybrid", label: "Hybrid" },
                                                    ]}
                                                    onChange={(selectedOptions) =>
                                                        this.setState({ preferredWorkLocation: selectedOptions })
                                                    }
                                                    isMulti
                                                    placeholder="Type or select work location..."
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                />
                                            </div>
                                        </div>
                                    )}


                                    {/* Submit Button */}
                                    <div className="col-lg-12">
                                        <div className="form-submit-group">
                                            <button
                                                type="button"
                                                className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                                                onClick={this.handleSaveProfile}
                                            >
                                                <span className="icon-reverse-wrapper">
                                                    <span className="btn-text">Save Profile</span>
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
        )
    }
}

export default withNavigation(EditProfileCandidate);