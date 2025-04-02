import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import Select from 'react-select';
import withNavigation from '../withNavigation';
import { setSingleRequest } from '../actions/SingleRequestAction';
import { store } from '../index';
import Header from '../Header/header';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles
import AdvancedBreadcumb from '../Breadcumb/advancebreadcrumb';

class CreateJob extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFormValid: false,
            dashBoardData: {},
        };

    }
    componentDidMount() {
        this.fetchIP();
        this.getDashboardUser();
        this.getJobPostingData()
        this.bindCity();

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
                this.setState({ dashBoardData: response.data.data });

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
    }
    validateForm = () => {
        const {
            title,
            selectedRole,
            fromExperience,
            toExperience,
            description,
            selectedPackage,
            openings,
            selectedCity,
            selectedEmpType,
            selectedMode,
            selectedKeySkills,
            selectedEducation,
            selectedIndustry,
            selectedDepartment,
        } = this.state;

        // Check if all fields have values
        const isFormValid =
            title &&
            selectedRole &&
            fromExperience &&
            toExperience &&
            description &&
            selectedPackage &&
            openings &&
            selectedCity &&
            selectedEmpType &&
            selectedMode &&
            selectedKeySkills &&
            selectedEducation &&
            selectedIndustry &&
            selectedDepartment;

        this.setState({ isFormValid });
    };
    handleInputChange = (field, value) => {
        this.setState({ [field]: value }, this.validateForm);
    };
    getJobPostingData = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Master/GetJobPostingMasterData`;
        const token = localStorage.getItem('authToken');
        var text = {
            "freetext": ""
        }
        axios.post(url, text, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('jobpostingdata', response.data);
                const transformToReactSelectOptions = (array) =>
                    array.map((item) => ({
                        label: item.value,
                        value: item.id,
                    }));

                // Map all fields
                const reactSelectOptions = {
                    departments: transformToReactSelectOptions(response.data.departments),
                    keyskill: transformToReactSelectOptions(response.data.keyskill),
                    countries: transformToReactSelectOptions(response.data.countries),
                    education: transformToReactSelectOptions(response.data.education),
                    experience: transformToReactSelectOptions(response.data.experience),
                    empType: transformToReactSelectOptions(response.data.empType),
                    industries: transformToReactSelectOptions(response.data.industries),
                    jobMode: transformToReactSelectOptions(response.data.jobMode),
                    package: transformToReactSelectOptions(response.data.package),
                    roles: transformToReactSelectOptions(response.data.roles),
                };
                this.setState({ reactSelectOptions });
                // Example usage in React-Select
                console.log(reactSelectOptions);


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
    handleTitle = (e) => {
        this.handleInputChange('title', e.target.value);
        this.setState({ title: e.target.value })
    };
    handleRoles = (selectedOption) => {
        this.handleInputChange('selectedRole', selectedOption);
        this.setState({ selectedRole: selectedOption })
    };

    handleExperience = (selectedOption) => {
        this.handleInputChange('selectedExperience', selectedOption);
        this.setState({ selectedExperience: selectedOption })
    };
    handleJobDescription = (e) => {
        this.handleInputChange('description', e);
        this.setState({ description: e })
    };
    handlePostSaveJob = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Job/PostJob`;
        const token = localStorage.getItem('authToken');
        var request = {
            "jobId": 0,
            "title": this.state.title,
            "description": this.state.description,
            "experienceFrom": this.state.fromExperience,
            "experienceTo": this.state.toExperience,
            "job_mode": this.state.selectedMode ? this.state.selectedMode.value : 0,
            "packageId":this.state.selectedPackage? this.state.selectedPackage.value:0,
            "packageNotdisclosed": this.state.isPackageDisclosed,
            "roleId":this.state.selectedRole? this.state.selectedRole.value:0,
            "emptypeId": this.state.selectedEmpType ? this.state.selectedEmpType.value : 0,
            "deptId": this.state.selectedDepartment ? this.state.selectedDepartment.value : 0,
            "industryId": this.state.selectedIndustry ? this.state.selectedIndustry.value : 0,
            "keyskillIds": this.state.selectedKeySkills ? this.state.selectedKeySkills.map((item) => item.value).join(',') : "",
            "educationId": this.state.selectedEducation ? this.state.selectedEducation.map((item) => item.value).join(',') : "",
            "noOfOpening": this.state.openings,
            "isactive": false,
            "ipAddress": this.state.ip,
            "cityIds": this.state.selectedCity ? this.state.selectedCity.map((item) => item.value).join(',') : ""
        }
        axios.post(url, request, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('jobpostingdata', response.data);
                this.setState({
                    responseMessage: (
                        <span>
                            Job Saved Successfully!
                        </span>
                    ),
                    alertVariant: 'success', // Success alert variant
                });
                window.scrollTo(0, 0);
                this.setState({ keepSpinner: false });

            })
            .catch((error) => {
                //console.error('Signup Error:', error.response?.data || error.message);
                this.setState({ keepSpinner: false });
                this.setState({
                    responseMessage: error.response?.data.message,
                    alertVariant: 'danger', // Error alert variant
                });
                window.scrollTo(0, 0);
            });
    }


    handlePostJob = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Job/PostJob`;
        const token = localStorage.getItem('authToken');
        var request = {
            "jobId": 0,
            "title": this.state.title,
            "description": this.state.description,
            "experienceFrom": this.state.fromExperience,
            "experienceTo": this.state.toExperience,
            "job_mode": this.state.selectedMode ? this.state.selectedMode.value : 0,
            "packageId":this.state.selectedPackage? this.state.selectedPackage.value:0,
            "packageNotdisclosed": this.state.isPackageDisclosed,
            "roleId":this.state.selectedRole? this.state.selectedRole.value:0,
            "emptypeId": this.state.selectedEmpType ? this.state.selectedEmpType.value : 0,
            "deptId": this.state.selectedDepartment ? this.state.selectedDepartment.value : 0,
            "industryId": this.state.selectedIndustry ? this.state.selectedIndustry.value : 0,
            "keyskillIds": this.state.selectedKeySkills ? this.state.selectedKeySkills.map((item) => item.value).join(',') : "",
            "educationId": this.state.selectedEducation ? this.state.selectedEducation.map((item) => item.value).join(',') : "",
            "noOfOpening": this.state.openings,
            "isactive": false,
            "ipAddress": this.state.ip,
            "cityIds": this.state.selectedCity ? this.state.selectedCity.map((item) => item.value).join(',') : ""
        }
        axios.post(url, request, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('jobpostingdatasubmit', response.data);
                this.handlePublish(response.data.data);
                this.setState({ keepSpinner: false });
                

            })
            .catch((error) => {

                //console.error('Signup Error:', error.response?.data || error.message);
                this.setState({ keepSpinner: false });
                this.setState({
                    responseMessage: error.response?.data.message,
                    alertVariant: 'danger', // Error alert variant
                });
                window.scrollTo(0, 0);
            });
    }

    handlePublish = (jobid) => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Job/ToggleJob`;
        const token = localStorage.getItem('authToken');
        const toggleData = {
            "jobId": jobid,
            "isactive": true,
        }
        axios.post(url, toggleData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                // this.setState({ isPublished: !this.state.isPublished });
                this.setState({
                    responseMessage: (
                        <span>
                            Job Saved and Published Successfully!
                        </span>
                    ),
                    alertVariant: 'success', // Success alert variant
                });
                window.scrollTo(0, 0);

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
    }
    handlePackage = (selectedOption) => {
        this.handleInputChange('selectedPackage', selectedOption);
        this.setState({ selectedPackage: selectedOption })
    }
    handleOpenings = (e) => {
        this.handleInputChange('openings', e.target.value);
        this.setState({ openings: e.target.value })
    };
    handleJobType = (selectedOption) => {
        this.handleInputChange('selectedEmpType', selectedOption);
        this.setState({ selectedEmpType: selectedOption })
    }
    handleJobMode = (selectedOption) => {
        this.handleInputChange('selectedMode', selectedOption);
        this.setState({ selectedMode: selectedOption })
    }
    handleKeySkills = (selectedOption) => {
        this.handleInputChange('selectedKeySkills', selectedOption);
        this.setState({ selectedKeySkills: selectedOption })
    }
    handleEducation = (selectedOption) => {
        this.handleInputChange('selectedEducation', selectedOption);
        this.setState({ selectedEducation: selectedOption })
    }
    handleIndustry = (selectedOption) => {
        this.handleInputChange('selectedIndustry', selectedOption);
        this.setState({ selectedIndustry: selectedOption })
    }
    handleDepartment = (selectedOption) => {
        this.handleInputChange('selectedDepartment', selectedOption);
        this.setState({ selectedDepartment: selectedOption })
    }

    handleFromExperienceChange = (e) => {
        this.handleInputChange('fromExperience', e.target.value);
        this.setState({ fromExperience: e.target.value })
    };

    handleToExperienceChange = (e) => {
        this.handleInputChange('toExperience', e.target.value);
        this.setState({ toExperience: e.target.value })
    };

    hanldeCheckChange = (e) => {
        this.setState({ isPackageDisclosed: e.target.checked });
    };

    modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
    ];

    render() {
        const { reactSelectOptions } = this.state;


        return (
            <><Header dashBoardData={this.state.dashBoardData} /><div className="rbt-become-area bg-color-white rbt-section-gap">
                <AdvancedBreadcumb componentName="Create new" ComponentValue="Create New" redirectURL="/EmployerDashboard" />
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
                                    <h3 className="title">Create New Job</h3>
                                    <hr className="mb--30" />
                                    <form onSubmit={(e) => e.preventDefault()} className="row row--15">
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <input name="title" type="text" value={this.state.title} onChange={(e) => this.handleTitle(e)} />
                                                <label>Title*</label>
                                                <span className="focus-border" />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                            <label>Role*</label>
                                                <Select
                                                    options={reactSelectOptions?.roles}
                                                    value={this.state.selectedRole}
                                                    placeholder="Select Role"
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    menuPortalTarget={document.body} // Render the dropdown to the body
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure it has a high z-index
                                                    }}
                                                    onChange={(selectedOption) => this.handleRoles(selectedOption)} />
                                                <span className="focus-border" />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                        <div className="form-group">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="experience"
                                                name="experience"
                                                value={this.state.fromExperience}
                                                onChange={this.handleFromExperienceChange}
                                            />
                                            <label htmlFor="experience">From Experience(in years)</label>
                                        </div>

                                    </div>

                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="toexperience"
                                                name="toexperience"
                                                value={this.state.toExperience}
                                                onChange={this.handleToExperienceChange}
                                            />
                                            <label htmlFor="toexperience">To Experience(in years)</label>
                                        </div>

                                    </div>

                                        <div className="col-lg-12">
                                            <div className="form-group">
                                            <label>Salary (in LPA)*</label>
                                                <Select
                                                    options={reactSelectOptions?.package}
                                                    value={this.state.selectedPackage}
                                                    placeholder="Select Salary"
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    menuPortalTarget={document.body} // Render the dropdown to the body
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure it has a high z-index
                                                    }}
                                                    onChange={(selectedOption) => this.handlePackage(selectedOption)} />
                                                <span className="focus-border" />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <input name="openings" type="text" value={this.state.openings} onChange={(e) => this.handleOpenings(e)} />
                                                <label>Openings*</label>

                                                <span className="focus-border" />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <label>City*</label>
                                                <Select
                                                    isMulti
                                                    value={this.state.selectedCity}
                                                    options={this.state.cityOptions}
                                                    placeholder="Select City"
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    menuPortalTarget={document.body} // Render the dropdown to the body
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure it has a high z-index
                                                    }}
                                                    onChange={(selectedOption) => this.handleCityChange(selectedOption)} />
                                                <span className="focus-border" />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <label>JobType*</label>
                                                <Select
                                                    options={reactSelectOptions?.empType}
                                                    value={this.state.selectedEmpType}
                                                    placeholder="Select Type"
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    menuPortalTarget={document.body} // Render the dropdown to the body
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure it has a high z-index
                                                    }}
                                                    onChange={(selectedOption) => this.handleJobType(selectedOption)} />
                                                <span className="focus-border" />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <label>Mode*</label>
                                                <Select
                                                    options={reactSelectOptions?.jobMode}
                                                    value={this.state.selectedMode}
                                                    placeholder="Select Mode"
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    menuPortalTarget={document.body} // Render the dropdown to the body
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure it has a high z-index
                                                    }}
                                                    onChange={(selectedOption) => this.handleJobMode(selectedOption)} />
                                                <span className="focus-border" />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <label>Key Skills*</label>
                                                <Select
                                                    isMulti
                                                    options={reactSelectOptions?.keyskill}
                                                    value={this.state.selectedKeySkills}
                                                    placeholder="Select Skills"
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    menuPortalTarget={document.body} // Render the dropdown to the body
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure it has a high z-index
                                                    }}
                                                    onChange={(selectedOption) => this.handleKeySkills(selectedOption)} />
                                                <span className="focus-border" />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <label>Education*</label>
                                                <Select
                                                    isMulti
                                                    options={reactSelectOptions?.education}
                                                    value={this.state.selectedEducation}
                                                    placeholder="Select Education"
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    menuPortalTarget={document.body} // Render the dropdown to the body
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure it has a high z-index
                                                    }}
                                                    onChange={(selectedOption) => this.handleEducation(selectedOption)} />
                                                <span className="focus-border" />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <label>Industry Type*</label>
                                                <Select
                                                    options={reactSelectOptions?.industries}
                                                    value={this.state.selectedIndustry}
                                                    placeholder="Select Industry Type"
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    menuPortalTarget={document.body} // Render the dropdown to the body
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure it has a high z-index
                                                    }}
                                                    onChange={(selectedOption) => this.handleIndustry(selectedOption)} />
                                                <span className="focus-border" />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <label>Department*</label>
                                                <Select
                                                    options={reactSelectOptions?.departments}
                                                    value={this.state.selectedDepartment}
                                                    placeholder="Select Department"
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    menuPortalTarget={document.body} // Render the dropdown to the body
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure it has a high z-index
                                                    }}
                                                    onChange={(selectedOption) => this.handleDepartment(selectedOption)} />
                                                <span className="focus-border" />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="form-group" style={{paddingBottom:"50px"}}>
                                                <ReactQuill
                                                    value={this.state.description}
                                                    onChange={this.handleJobDescription}
                                                    theme="snow"
                                                    modules={this.modules}
                                                    placeholder="Write job description..."
                                                    formats={this.formats}
                                                    style={{ height: "200px"}}
                                                />
                                            </div>
                                           
                                        </div>
                                        <div className="form-group-check" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <input
                                                    type="checkbox"
                                                    checked={this.state.isPackageDisclosed}
                                                    id="isRefundable"
                                                    name="isRefundable"
                                                    onChange={this.hanldeCheckChange}
                                                    style={{ width: "16px", height: "16px", cursor: "pointer" }}
                                                />
                                                <label htmlFor="isRefundable" style={{ cursor: "pointer", marginBottom: "0px" }}>
                                                    Don't want to disclose package ?
                                                </label>
                                            </div>
                                        <div className="col-lg-12">
                                            <div className="form-submit-group d-flex gap-3">
                                                <button
                                                    type="button"
                                                    className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                                                    onClick={this.handlePostSaveJob}
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
                                                    onClick={this.handlePostJob}
                                                >
                                                    <span className="icon-reverse-wrapper">
                                                        <span className="btn-text">Save and Publish</span>
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

                export default withNavigation(CreateJob);