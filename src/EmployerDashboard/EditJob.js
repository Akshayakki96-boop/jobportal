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

class EditJob extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFormValid: false,
            dashBoardData: {},
            ip: "Fetching...",
        };

    }
    componentDidMount() {
        this.fetchIP();
        let url = window.location.search;
        var urlParams = new URLSearchParams(url);
        var jobId = urlParams.get('jobId');
        this.jobId = jobId;
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
                this.getJobsById();

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
    }

    getJobsById = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Job/GetJobs`;
        const token = localStorage.getItem('authToken');
        var request = {
            "jobId": this.jobId,
            "jobtitle": "",
            "experienceFrom": 0,
            "experienceTo": 0,
            "packageId": 0,
            "roleId": 0,
            "emptypeId": 0,
            "deptId": 0,
            "industryId": 0,
            "keyskillIds": "",
            "educationId": "",
            "active": false,
            "user_id": 0,
            "cityIds": "1,2",
            "candidate_user_id": 0
        }
        axios.post(url, request, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('Editjoblistingdata', response.data.data);
                let packagename=this.packages.filter((item) => item.id == response.data.data[0].package_id)[0];
                this.setState({ jobId: response.data.data[0].jobid });
                this.setState({ title: response.data.data[0].jobtitle });
                this.setState({ description: response.data.data[0].description });
                this.setState({ openings: response.data.data[0].no_of_openings });
                this.setState({ selectedRole: { value: response.data.data[0].role_id, label: response.data.data[0].roleTitle } });
                this.setState({ selectedPackage: { value: response.data.data[0].package_id, label: packagename.value } });
                this.setState({ selectedEmpType: { value: response.data.data[0].emptypeid, label: response.data.data[0].empType } });
                this.setState({ selectedDepartment: { value: response.data.data[0].deptid, label: response.data.data[0].department } });
                this.setState({ selectedIndustry: { value: response.data.data[0].industry_id, label: response.data.data[0].industryname } });
                this.setState({ fromExperience: response.data.data[0].experience_from });
                this.setState({ toExperience: response.data.data[0].experience_to });
                this.setState({ selectedMode: { value: response.data.data[0].job_mode_id, label: response.data.data[0].jobmode } });
                this.setState({isPackageDisclosed: response.data.data[0].package_notdisclosed });
                this.setState({
                    selectedEducation: response.data.data[0].education_id.split(',').map((item, index) => ({
                        value: item,
                        label: response.data.data[0].education.split(',')[index]
                    }))
                });
                this.setState({
                    selectedKeySkills: response.data.data[0].keyskill_ids.split(',').map((item, index) => ({
                        value: item,
                        label: response.data.data[0].keyskills.split(',')[index]
                    }))
                });
                this.setState({
                    selectedCity: response.data.data[0].cityIds.split(',').map((item, index) => ({
                        value: item,
                        label: response.data.data[0].locations.split(',')[index]
                    }))
                });







            })
            .catch((error) => {
                //localStorage.removeItem('authToken');
                //this.props.navigate('/Login'); // Use `navigate`
            });

    }


    validateForm = () => {
        const {
            title,
            selectedRole,
            fromExperience,
            toExperience,
            packageFrom,
            packageTo,
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
            packageFrom &&
            packageTo &&
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
                this.packages= response.data.package;
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



    handlePostJob = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Job/PostJob`;
        const token = localStorage.getItem('authToken');
        var request = {
            "jobId": this.state.jobId,
            "title": this.state.title,
            "description": this.state.description,
            "experienceFrom": this.state.fromExperience,
            "experienceTo": this.state.toExperience,
            "job_mode": this.state.selectedMode ? this.state.selectedMode.value : 0,
            "packageId":this.state.selectedPackage? this.state.selectedPackage.value:0,
            "packageNotdisclosed": this.state.isPackageDisclosed,
            "roleId": this.state.selectedRole ? this.state.selectedRole.value : 0,
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
                //this.handlePublish(response.data.data);
                this.setState({ keepSpinner: false });
                this.setState({
                    responseMessage: (
                        <span>
                            Job Updated Successfully!
                        </span>
                    ),
                    alertVariant: 'success', // Success alert variant
                });
                window.scrollTo(0, 0);

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
                <AdvancedBreadcumb componentName="Edit Job" ComponentValue="Edit Job" redirectURL="/EmployerDashboard" />
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
                                <h3 className="title">Edit Job</h3>
                                <hr className="mb--30" />
                                <form onSubmit={(e) => e.preventDefault()} className="row row--15">
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <input name="title" type="text" value={this.state.title} onChange={(e) => this.handleTitle(e)} />
                                            <label>Title</label>
                                            <span className="focus-border" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                        <label>Role*</label>
                                            <Select
                                                isClearable={true}
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
                                                isClearable={true}
                                                options={reactSelectOptions?.package}
                                                value={this.state.selectedPackage}
                                                placeholder="Select Package"
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
                                                Package Not Disclosed
                                                </label>
                                            </div>

                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <input name="openings" type="text" value={this.state.openings} onChange={(e) => this.handleOpenings(e)} />
                                            <label>Openings</label>

                                            <span className="focus-border" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <label>City</label>
                                            <Select
                                                isMulti
                                                isClearable={true}
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
                                            <label>JobType</label>
                                            <Select
                                                isClearable={true}
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
                                            <label>Mode</label>
                                            <Select
                                                options={reactSelectOptions?.jobMode}
                                                isClearable={true}
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
                                            <label>Key Skills</label>
                                            <Select
                                                isMulti
                                                isClearable={true}
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
                                            <label>Education</label>
                                            <Select
                                                isMulti
                                                isClearable={true}
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
                                            <label>Industry Type</label>
                                            <Select
                                                isClearable={true}
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
                                            <label>Department</label>
                                            <Select
                                                isClearable={true}
                                                options={reactSelectOptions?.departments}
                                                value={this.state.selectedDepartment}
                                                placeholder="Select Department"
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body} // Render the dropdown to the body
                                                styles={{
                                                    // Ensure it has a high z-index
                                                }}
                                                onChange={(selectedOption) => this.handleDepartment(selectedOption)} />
                                            <span className="focus-border" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="form-group" style={{paddingBottom: "50px"}}>
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
                                  
                                    <div className="col-lg-12">
                                        <div className="form-submit-group d-flex gap-3">
                                            {/* <button
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
                                                                                                </button> */}
                                            <button
                                                type="button"
                                                className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                                                onClick={this.handlePostJob}
                                            >
                                                <span className="icon-reverse-wrapper">
                                                    <span className="btn-text">Save</span>
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

export default withNavigation(EditJob);