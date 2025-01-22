import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import Select from 'react-select';
import withNavigation from '../withNavigation';
import {setSingleRequest} from '../actions/SingleRequestAction';
import {store} from '../index';

class CreateJob extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFormValid: false,
        };

    }
    componentDidMount() {
        this.getJobPostingData()
        this.getAllCountry();
     
    }
    validateForm = () => {
        const {
          title,
          selectedRole,
          selectedExperience,
          description,
          selectedPackage,
          openings,
          selectedCountry,
          selectedState,
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
          selectedCountry &&
          selectedState &&
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
    getJobPostingData=()=>{
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Master/GetJobPostingMasterData`;
        const token = localStorage.getItem('authToken');
       var text= {
            "freetext":""
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
    getAllCountry = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Master/GetCountry`;
        const token = localStorage.getItem('authToken');
       var text= {
            "freetext":""
        }
        axios.post(url, text, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('dashboard data', response.data);
                const options = response.data.map((item) => ({
                    value: item.id,
                    label: item.value,
                  }));
                  this.setState({ countryOptions: options });

                this.setState({ keepSpinner: false });

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
        }

    handleCountryChange = (selectedOption) => {
        this.handleInputChange('selectedCountry', selectedOption);
        this.setState({ selectedCountry: selectedOption });
        this.bindState(selectedOption.value);

    }

    bindState = (countryId) => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Master/GetState`;
        const token = localStorage.getItem('authToken');
       var text= {
            "freetext":"",
            "countryId":countryId,
            "stateId":1,
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
                  this.setState({ stateOptions: options });

                this.setState({ keepSpinner: false });

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
    }

    handleStateChange = (selectedOption) => {
        this.handleInputChange('selectedState', selectedOption);
        this.setState({ selectedState: selectedOption });
        this.bindCity(selectedOption.value);
    }

    bindCity = (stateId) => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Master/GetCity`;
        const token = localStorage.getItem('authToken');
       var text= {
            "freetext":"",
            "cityId":2,
            "stateId":stateId,
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
    handleTitle=(e)=>{
        this.handleInputChange('title', e.target.value);
        this.setState({title:e.target.value})
    };
    handleRoles=(selectedOption)=>{
        this.handleInputChange('selectedRole', selectedOption);
        this.setState({selectedRole:selectedOption})
    };

    handleExperience=(selectedOption)=>{
        this.handleInputChange('selectedExperience', selectedOption);
        this.setState({selectedExperience:selectedOption})
    };
    handleJobDescription=(e)=>{
        this.handleInputChange('description', e.target.value);
        this.setState({description:e.target.value})
    };
handlePostJob=()=>{
    const baseUrl = process.env.REACT_APP_BASEURL;
    const url = `${baseUrl}/api/Job/PostJob`;
    const token = localStorage.getItem('authToken');
   var request= {
  
    "title":this.state.title, 
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
             this.requestData={};
             this.requestData.showSuccessJobPost=true;
             store.dispatch(setSingleRequest(this.requestData));
            this.props.navigate('/EmployeeDashboard?message=success'); // Use `navigate`
            this.setState({ keepSpinner: false });

        })
        .catch((error) => {
            localStorage.removeItem('authToken');
            this.props.navigate('/Login'); // Use `navigate`
        });
}
handlePackage=(selectedOption)=>{
    this.handleInputChange('selectedPackage', selectedOption);
    this.setState({selectedPackage:selectedOption})
}
handleOpenings=(e)=>{
    this.handleInputChange('openings', e.target.value);
    this.setState({openings:e.target.value})
};
handleJobType=(selectedOption)=>{  
    this.handleInputChange('selectedEmpType', selectedOption);
    this.setState({selectedEmpType:selectedOption})
}
handleJobMode=(selectedOption)=>{
    this.handleInputChange('selectedMode', selectedOption);
    this.setState({selectedMode:selectedOption})
}
handleKeySkills=(selectedOption)=>{
    this.handleInputChange('selectedKeySkills', selectedOption);
    this.setState({selectedKeySkills:selectedOption})
}
handleEducation=(selectedOption)=>{
    this.handleInputChange('selectedEducation', selectedOption);
    this.setState({selectedEducation:selectedOption})
}
handleIndustry=(selectedOption)=>{
    this.handleInputChange('selectedIndustry', selectedOption);
    this.setState({selectedIndustry:selectedOption})
}
handleDepartment=(selectedOption)=>{
    this.handleInputChange('selectedDepartment', selectedOption);
    this.setState({selectedDepartment:selectedOption})
}
    render() {
const {reactSelectOptions} = this.state;
        return (

            <div className="rbt-become-area bg-color-white rbt-section-gap">
                <div className="container">

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
                                <h3 className="title">Create New Job</h3>
                                <hr className="mb--30" />
                                <form onSubmit={(e) => e.preventDefault()} className="row row--15">
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <input name="title" type="text" value={this.state.title} onChange={(e) => this.handleTitle(e)}/>
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
                                                onChange={(selectedOption) => this.handleRoles(selectedOption)}
                                            />
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
                                                onChange={(selectedOption) => this.handleExperience(selectedOption)}
                                            />
                                            <span className="focus-border" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <textarea placeholder='Enter your Description upto 2000 characters.'  maxLength="2000" name="description" value={this.state.description} onChange={(e)=>this.handleJobDescription(e)}></textarea>
                                            <label>Description*</label>
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
                                                onChange={(selectedOption) => this.handlePackage(selectedOption)}
                                            />
                                            <span className="focus-border" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <input name="openings" type="text" value={this.state.openings} onChange={(e)=>this.handleOpenings(e)} />
                                            <label>Openings*</label>

                                            <span className="focus-border" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <Select
                                                options={this.state.countryOptions}
                                                value={this.state.selectedCountry}
                                                placeholder="Select Country"
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body} // Render the dropdown to the body
                                                styles={{
                                                  menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure it has a high z-index
                                                }}
                                                onChange={(selectedOption) => this.handleCountryChange(selectedOption)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="form-group">

                                            <label>State*</label>
                                            <Select
                                                //isMulti
                                                options={this.state.stateOptions}
                                                value={this.state.selectedState}
                                                placeholder="Select State"
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body} // Render the dropdown to the body
                                                styles={{
                                                  menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure it has a high z-index
                                                }}
                                                onChange={(selectedOption) => this.handleStateChange(selectedOption)}
                                            />
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
                                                onChange={(selectedOption) => this.handleCityChange(selectedOption)}
                                            />
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
                                                onChange={(selectedOption) => this.handleJobType(selectedOption)}
                                            />
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
                                                onChange={(selectedOption) => this.handleJobMode(selectedOption)}
                                            />
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
                                                onChange={(selectedOption) => this.handleKeySkills(selectedOption)}
                                            />
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
                                                onChange={(selectedOption) => this.handleEducation(selectedOption)}
                                            />
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
                                                onChange={(selectedOption) => this.handleIndustry(selectedOption)}
                                            />
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
                                                onChange={(selectedOption) => this.handleDepartment(selectedOption)}
                                            />
                                            <span className="focus-border" />
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
            </div>


        );
    }
}

export default withNavigation(CreateJob);