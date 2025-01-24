import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import Select from 'react-select';
import withNavigation from '../withNavigation';
import { setSingleRequest } from '../actions/SingleRequestAction';
import { store } from '../index';
import Header from '../Header/header';
import JoditEditor from "jodit-react";

class CreateJob extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFormValid: false,
            dashBoardData: {},
        };

    }
    componentDidMount() {
        this.getDashboardUser();
        this.getJobPostingData()
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
            selectedExperience,
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
            selectedExperience &&
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
    handlePostJob = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Job/PostJob`;
        const token = localStorage.getItem('authToken');
        var request = {

            "title": this.state.title,
            "description": this.state.description,
            "experienceFrom": this.state.selectedExperience.value,
            "experienceTo": this.state.selectedExperience.value,
            "packageId": this.state.selectedPackage.value,
            "packageNotdisclosed": false,
            "roleId": this.state.selectedRole.value,
            "emptypeId": this.state.selectedEmpType.value,
            "deptId": this.state.selectedDepartment.value,
            "industryId": this.state.selectedIndustry.value,
            "keyskillIds": this.state.selectedKeySkills.map((item) => item.value).join(','),
            "educationId": this.state.selectedEducation.map((item) => item.value).join(','),
            "noOfOpening": this.state.openings,
            "isactive": false,
            "ipAddress": "192.168.1.1",
            "cityIds": this.state.selectedCity.map((item) => item.value).join(',')
        }
        axios.post(url, request, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('jobpostingdata', response.data);
                this.requestData = {};
                this.requestData.showSuccessJobPost = true;
                store.dispatch(setSingleRequest(this.requestData));
                this.props.navigate('/EmployerDashboard?message=success'); // Use `navigate`
                this.setState({ keepSpinner: false });

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
    render() {
        const { reactSelectOptions } = this.state;
        const config = {
            readonly: false, // All editing features are enabled
            placeholder: "Start typing here...",
            toolbar:true,
            "inline": true,
            "showWordsCounter": true,
            "showXPathInStatusbar": false,
            "buttons": "|,bold,strikethrough,underline,italic,|,superscript,subscript,|,ul,ol,|,outdent,indent,|,font,fontsize,brush,|,image,table,link,|,align,undo,redo,\n,selectall,cut,copy,paste,pastetext,|,hr,symbol,fullsize",
            "uploader": {
                "insertImageAsBase64URI": true
            }
          };
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
                                            <Select
                                                options={reactSelectOptions?.experience}
                                                value={this.state.selectedExperience}
                                                placeholder="Select Experience"
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body} // Render the dropdown to the body
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure it has a high z-index
                                                }}
                                                onChange={(selectedOption) => this.handleExperience(selectedOption)} />
                                            <span className="focus-border" />
                                        </div>
                                    </div>
                              
                                    <div className="col-lg-12">
                                        <div className="form-group">
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
                                        <div className="form-group">
                                            <JoditEditor
                                                value={this.state.description}
                                                config={config}
                                                onChange={(e) => this.handleJobDescription(e)}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-12">
                                        <div className="form-submit-group">
                                            <button
                                                disabled={!this.state.isFormValid}
                                                type="button"
                                                className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                                                onClick={this.handlePostJob}
                                            >
                                                <span className="icon-reverse-wrapper">
                                                    <span className="btn-text">Post a Job</span>
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