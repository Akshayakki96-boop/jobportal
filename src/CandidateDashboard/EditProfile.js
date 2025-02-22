import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import withNavigation from '../withNavigation';
import Header from '../Header/header';
import Select from 'react-select';
import { DatePicker } from '@fluentui/react';
import '@fluentui/react/dist/css/fabric.css';
import { Alert } from 'react-bootstrap';
import AdvancedBreadcumb from '../Breadcumb/advancebreadcrumb';
import { Modal, Button } from 'react-bootstrap';


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
            showEmploymentModal: false,
            employments: [],
            employmentForm: {
                company_name: "",
                jobtitle: "",
                workedFromMonth: "",
                workedFromYear: "",
                workedToMonth: "",
                workedToYear: "",
                jobprofile: "",
                employmentType: "",
                jobprofile: "",
                keyskillselected: null,
                isCurrentCompany: false
            },
            projectForm: {
                projectname: "",
                client: "",
                projectDetails: "",
                workedFromMonth: "",
                workedFromYear: "",
                workedToMonth: "",
                workedToYear: "",
            },
            educationForm: {
                institutionName: "",
                degree: "",
                specialisation: "",
                fromYear: "",
                toYear: ""
            },
            projects: [],
            preferredShift: [], // Example: [{ value: "Day", label: "Day" }]
            preferredWorkLocation: [], // Example: [{ value: "Remote", label: "Remote" }]
            employmentType: [],
            educationDetails: [],
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
            keyskillsSelected: null,
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
        this.getEmploymentType();
        this.getKeySkills();
        this.getDepartments();
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
                const { profile_image, resumefile } = response.data.data;
                this.setState({
                    fullname: response.data.data.fullname, email: response.data.data.email,
                    mobile_no: response.data.data.mobile_no, profile_summary: response.data.data.profile_summary,
                    experience: response.data.data.experience, currentsalary: response.data.data.CTC, expectedsalary: response.data.data.ExpectedCTC,
                    resume_summary: response.data.data.resume_headline,
                    selectedCity: response.data.data.current_location ? { value: response.data.data.city_id, label: response.data.data.current_location } : null,
                    selectedDate: response.data.data.DOB == "1900-01-01T00:00:00" ? new Date() : new Date(response.data.data.DOB), userId: response.data.data.user_id, languague_name: response.data.data.language_name, role_id: response.data.data.designation, noticePeriodSelected: response.data.data.notice_period ? { value: response.data.data.notice_period, label: response.data.data.notice_periods } : null
                });

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
    getEmploymentType = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Master/GetEmploymentType`;
        const token = localStorage.getItem('authToken');
        axios.post(url, {}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                const employmentType = response.data.map((item) => ({
                    value: item.id,
                    label: item.value,
                }));
                this.setState({ employmentType });
            })
            .catch((error) => {
                //localStorage.removeItem('authToken');
                //this.props.navigate('/Login'); // Use `navigate`
            });
    }

    getDepartments=()=>{
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Master/GetDepartments`;
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
                const departments = response.data.map((item) => ({
                    value: item.id,
                    label: item.value,
                }));
                this.setState({ departments });
            })
            .catch((error) => {
                //localStorage.removeItem('authToken');
                //this.props.navigate('/Login'); // Use `navigate`
            });
    }

    getKeySkills = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Master/Getkeyskills`;
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
                const keyskills = response.data.map((item) => ({
                    value: item.id,
                    label: item.value,
                }));
                this.setState({ keyskills: keyskills });
            })
            .catch((error) => {
                //localStorage.removeItem('authToken');
                //this.props.navigate('/Login'); // Use `navigate`
            });
    };
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
            "resumefile": this.state.resumefileName ? this.state.resumefileName : null,
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

    handleShowEmploymentModal = (index = null) => {
        if (index !== null) {
            this.setState({
                currentEmploymentIndex: index,
                employmentForm: { ...this.state.employments[index] },
                showEmploymentModal: true
            });
        } else {
            this.setState({
                currentEmploymentIndex: null,
                employmentForm: {
                    company_name: "",
                    jobtitle: "",
                    workedFromMonth: "",
                    workedFromYear: "",
                    workedToMonth: "",
                    workedToYear: "",
                    jobprofile: "",
                    isCurrentCompany: false,
                    employmentType: "",
                    jobprofile: "",
                    keyskillselected: null
                },
                showEmploymentModal: true
            });
        }
    };

    handleCloseEmploymentModal = () => {
        this.setState({ showEmploymentModal: false });
    };

    removeEmployment = (index) => {
        const updatedEmployments = this.state.employments.filter(
            (_, i) => i !== index
        );
        this.setState({ employments: updatedEmployments });
    };

    handleEmploymentFormChange = (e) => {

        const { name, type, checked, value } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;
        this.setState((prevState) => ({
            employmentForm: {
                ...prevState.employmentForm,
                [name]: fieldValue
            }
        }));
    };

    handleSaveEmployment = () => {
        const { employmentForm, employments, currentEmploymentIndex } = this.state;
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Candidate/UpdateEmployment`;
        const token = localStorage.getItem('authToken');

        const employmentData = {
            candidate_employment_id: currentEmploymentIndex !== null ? employments[currentEmploymentIndex].candidate_employment_id : 0,
            user_id: this.state.userId,
            jobtitle: employmentForm.jobtitle,
            joiningdate_year: parseInt(employmentForm.workedFromYear, 10),
            leavingdate_year: parseInt(employmentForm.workedToYear, 10),
            is_current_employment: employmentForm.isCurrentCompany,
            joiningdate_month: employmentForm.workedFromMonth,
            leavingdate_month: employmentForm.workedToMonth,
            company_name: employmentForm.company_name,
            employmentType: employmentForm.employmentType,
            jobprofile: employmentForm.jobprofile,
            keyskill_ids: employmentForm.keyskillselected ? employmentForm.keyskillselected.map(skill => skill.value).join(',') : ''
        };

        axios.post(url, employmentData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('Employment data saved successfully:', response.data);
                this.setState({
                    responseMessage: 'Employment data saved successfully!',
                    alertVariant: 'success'
                });
                window.scrollTo(0, 0);
            })
            .catch((error) => {
                console.error('Error saving employment data:', error.response?.data || error.message);
                this.setState({
                    responseMessage: 'Error saving employment data!',
                    alertVariant: 'danger'
                });
                window.scrollTo(0, 0);
            });

        if (currentEmploymentIndex !== null) {
            const updatedEmployments = employments.map((employment, index) =>
                index === currentEmploymentIndex ? employmentForm : employment
            );
            this.setState({ employments: updatedEmployments });
        } else {
            this.setState((prevState) => ({
                employments: [...prevState.employments, employmentForm]
            }));
        }
        this.handleCloseEmploymentModal();
    };

    handleShowProjectModal = (index = null) => {
        if (index !== null) {
            this.setState({
                currentProjectIndex: index,
                projectForm: { ...this.state.projects[index] },
                showProjectModal: true
            });
        } else {
            this.setState({
                currentProjectIndex: null,
                projectForm: {
                    projectname: "",
                    client: "",
                    projectDetails: "",
                    workedFromMonth: "",
                    workedFromYear: "",
                    workedToMonth: "",
                    workedToYear: "",
                },
                showProjectModal: true
            });
        }
    };

    removeProjects = (index) => {
        const updatedProjects = this.state.projects.filter((_, i) => i !== index);
        this.setState({ projects: updatedProjects });
    };

    handleCloseProjectModal = () => {
        this.setState({ showProjectModal: false });
    };

    handleProjectFormChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            projectForm: {
                ...prevState.projectForm,
                [name]: value
            }
        }));
    };

    handleSaveProject = () => {
        const { projectForm, projects, currentProjectIndex } = this.state;

        if (currentProjectIndex !== null) {
            const updatedProjects = projects.map((project, index) =>
                index === currentProjectIndex ? projectForm : project
            );
            this.setState({ projects: updatedProjects });
        } else {
            this.setState((prevState) => ({
                projects: [...prevState.projects, projectForm]
            }));
        }
        this.handleCloseProjectModal();
    };

    handleShowEducationModal = (index = null) => {
        if (index !== null) {
            this.setState({
                currentEducationIndex: index,
                educationForm: { ...this.state.educationDetails[index] },
                showEducationModal: true
            });
        } else {
            this.setState({
                currentEducationIndex: null,
                educationForm: {
                    institutionName: "",
                    degree: "",
                    specialisation: "",
                    fromYear: "",
                    toYear: ""
                },
                showEducationModal: true
            });
        }
    };

    handleCloseEducationModal = () => {
        this.setState({ showEducationModal: false });
    };

    handleEducationFormChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            educationForm: {
                ...prevState.educationForm,
                [name]: value
            }
        }));
    };

    handleSaveEducation = () => {
        const { educationForm, educationDetails, currentEducationIndex } = this.state;
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Trainer/UpdateEducation`;
        const token = localStorage.getItem('authToken');

        const educationData = {
            trainer_edu_id: currentEducationIndex !== null ? educationDetails[currentEducationIndex].trainer_education_id : 0,
            user_id: this.state.userId,
            university_board: educationForm.institutionName,
            education_title: educationForm.degree,
            passing_year: parseInt(educationForm.fromYear, 10),
        };

        axios.post(url, educationData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('Education data saved successfully:', response.data);
                this.setState({
                    responseMessage: 'Education details saved successfully!',
                    alertVariant: 'success'
                });
                window.scrollTo(0, 0);
            })
            .catch((error) => {
                console.error('Error saving education data:', error.response?.data || error.message);
                this.setState({
                    responseMessage: 'Error saving education data!',
                    alertVariant: 'danger'
                });
                window.scrollTo(0, 0);
            });

        if (currentEducationIndex !== null) {
            const updatedEducationDetails = educationDetails.map((education, index) =>
                index === currentEducationIndex ? educationForm : education
            );
            this.setState({ educationDetails: updatedEducationDetails });
        } else {
            this.setState((prevState) => ({
                educationDetails: [...prevState.educationDetails, educationForm]
            }));
        }
        this.handleCloseEducationModal();
    };
    removeEducation = (index) => {
        const updatedEducationDetails = this.state.educationDetails.filter(
            (_, i) => i !== index
        );
        this.setState({ educationDetails: updatedEducationDetails });
    };

    handleKeySkillsUpdate = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Candidate/Updatekeyskills`;
        const token = localStorage.getItem('authToken');
        var updateSkills = {
            "user_id": this.state.userId,
            "keyskill_ids": this.state.keyskillsSelected.map(skill => skill.value).join(","),
            "ipaddress": "192.168.1.1",
            "keyskills": this.state.keyskillsSelected.map(skill => skill.label).join(","),
        };

        axios.post(url, updateSkills, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                this.setState({
                    responseMessage: (
                        <span>
                            Skills  Updated Successfully
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


    render() {
        const { fullname, email, mobile_no, profile_summary, experience, currentsalary, expectedsalary, logoPreview, isBasicInfoExpanded, isEmploymentDetailsExpanded, isProjectDetailsExpanded, showEducation, showKeySkills, preferredWorkLocation, selectedDate, resume_summary, noticePeriods, employments, projects, preferredShift, specializations, department_id, noticePeriodSelected, role_id, uploadStatus, languague_name, resumePreview, employmentForm, showEmploymentModal } = this.state;
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
                                                {uploadStatus && <small className={uploadStatus=="File uploaded successfully!"?"text-success":"text-danger"}>{uploadStatus}</small>}
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

                                                {this.state.uploadResumeStatus && <small className={this.state.uploadResumeStatus=="Resume uploaded successfully!"?"text-success":"text-danger"}>{this.state.uploadResumeStatus}</small>}
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
                                        <h3 className="section-header" onClick={() => this.toggleSection('isEmploymentDetailsExpanded')} style={{ cursor: 'pointer' }}>
                                            Employment Details
                                            <span style={{ marginLeft: '10px' }}>
                                                {isEmploymentDetailsExpanded ? '[-]' : '[+]'}</span>
                                        </h3>
                                        {isEmploymentDetailsExpanded && (
                                            <div style={{ textAlign: 'left' }} className="section-content">
                                                {this.state.employments.map((employment, index) => (
                                                    <div key={index} className="employment-entry mb-4 border p-3 rounded position-relative">
                                                        <div className="d-flex justify-content-end position-absolute" style={{ top: '10px', right: '10px' }}>
                                                            <Button
                                                                className="rounded-pill fw-bold px-5 py-3 shadow-sm"
                                                                variant="primary"
                                                                style={{ fontSize: '14px' }}
                                                                onClick={() => this.handleShowEmploymentModal(index)}
                                                            >
                                                                <i className="feather-edit" />
                                                            </Button>
                                                            <Button
                                                                className="rounded-pill fw-bold px-5 py-3 shadow-sm ms-2"
                                                                variant="danger"
                                                                style={{ fontSize: '14px' }}
                                                                onClick={() => this.removeEmployment(index)}
                                                            >
                                                                <i className="feather-trash" />
                                                            </Button>
                                                        </div>
                                                        <h5>Employment {index + 1}</h5>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <p style={{ fontWeight: "bold" }}>Company Name: {employment.company_name}</p>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <p style={{ fontWeight: "bold" }}>Job Title: {employment.jobtitle}</p>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <p style={{ fontWeight: "bold" }}>Worked From: {employment.workedFromYear}</p>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <p style={{ fontWeight: "bold" }}>Worked To: {employment.workedToYear}</p>
                                                            </div>

                                                        </div>
                                                    </div>
                                                ))}
                                                <Button
                                                    variant="success"
                                                    style={{ fontSize: '14px' }}
                                                    onClick={() => this.handleShowEmploymentModal()}
                                                    className="rounded-pill fw-bold px-5 py-3 shadow-sm"
                                                >
                                                    Add Employment
                                                </Button>

                                                <Modal show={showEmploymentModal} onHide={this.handleCloseEmploymentModal}>
                                                    <Modal.Header closeButton>
                                                        <Modal.Title>{this.state.currentEmploymentIndex !== null ? 'Edit Employment' : 'Add Employment'}</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <div className="form-group">
                                                            <label htmlFor="company_name">Company Name</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="company_name"
                                                                name="company_name"
                                                                value={employmentForm.company_name}
                                                                onChange={this.handleEmploymentFormChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="jobtitle">Job Title</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="jobtitle"
                                                                name="jobtitle"
                                                                value={employmentForm.jobtitle}
                                                                onChange={this.handleEmploymentFormChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="employmentType">Employment Type</label>
                                                            <select
                                                                id="employmentType"
                                                                name="employmentType"
                                                                className="form-control"
                                                                value={employmentForm.employmentType}
                                                                onChange={this.handleEmploymentFormChange}
                                                            >
                                                                {this.state.employmentType.map((type) => (
                                                                    <option key={type.value} value={type.value}>
                                                                        {type.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Worked From:</label>
                                                            <div className="d-flex gap-3">
                                                                <select
                                                                    className="form-control"
                                                                    id="workedFromMonth"
                                                                    name="workedFromMonth"
                                                                    value={employmentForm.workedFromMonth}
                                                                    onChange={this.handleEmploymentFormChange}
                                                                >
                                                                    <option value="">Select Month</option>
                                                                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                                                                        <option key={month} value={index + 1}>
                                                                            {month}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <select
                                                                    className="form-control"
                                                                    id="workedFromYear"
                                                                    name="workedFromYear"
                                                                    value={employmentForm.workedFromYear}
                                                                    onChange={this.handleEmploymentFormChange}
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
                                                            <label>Worked To:</label>
                                                            <div className="d-flex gap-3">
                                                                <select
                                                                    className="form-control"
                                                                    id="workedToMonth"
                                                                    name="workedToMonth"
                                                                    value={employmentForm.workedToMonth}
                                                                    onChange={this.handleEmploymentFormChange}
                                                                >
                                                                    <option value="">Select Month</option>
                                                                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                                                                        <option key={month} value={index + 1}>
                                                                            {month}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <select
                                                                    className="form-control"
                                                                    id="workedToYear"
                                                                    name="workedToYear"
                                                                    value={employmentForm.workedToYear}
                                                                    onChange={this.handleEmploymentFormChange}
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
                                                        {employmentForm.workedFromYear && employmentForm.workedToYear && parseInt(employmentForm.workedFromYear) > parseInt(employmentForm.workedToYear) && (
                                                            <span style={{ color: 'red' }}>Worked From year cannot be greater than Worked To year.</span>
                                                        )}
                                                        <div className="form-group">
                                                            <input
                                                                type="checkbox"
                                                                name="isCurrentCompany"
                                                                checked={employmentForm.isCurrentCompany}
                                                                className="form-control"
                                                                id="isCurrentCompany"
                                                                onChange={this.handleEmploymentFormChange} />
                                                            <label htmlFor="isCurrentCompany">Is Current Company</label>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="keyskillselected">Key Skills</label>
                                                            <Select
                                                                id="keyskillselected"
                                                                name="keyskillselected"
                                                                value={employmentForm.keyskillselected}
                                                                onChange={(selectedOptions) =>
                                                                    this.setState((prevState) => ({
                                                                        employmentForm: {
                                                                            ...prevState.employmentForm,
                                                                            keyskillselected: selectedOptions
                                                                        }
                                                                    }))
                                                                }
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                                }}
                                                                options={this.state.keyskills}
                                                                isMulti
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <textarea
                                                                className="form-control"
                                                                id="jobprofile"
                                                                name="jobprofile"
                                                                value={employmentForm.jobprofile}
                                                                onChange={this.handleEmploymentFormChange}
                                                            ></textarea>
                                                            <label htmlFor="jobprofile">Job Profile</label>
                                                        </div>
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                        <Button style={{ fontSize: '14px' }} type="button" className="rounded-pill fw-bold px-5 py-3 shadow-sm" variant="secondary" onClick={this.handleCloseEmploymentModal}>Cancel</Button>
                                                        <Button style={{ fontSize: '14px' }} type="button" className="rounded-pill fw-bold px-5 py-3 shadow-sm" variant="primary" onClick={this.handleSaveEmployment}>Save</Button>
                                                    </Modal.Footer>
                                                </Modal>
                                            </div>
                                        )}

                                        {/* Candidate Project Section */}
                                        <h3 className="section-header" onClick={() => this.toggleSection('isProjectDetailsExpanded')} style={{ cursor: 'pointer' }}>
                                            Project Details
                                            <span style={{ marginLeft: '10px' }}>
                                                {isProjectDetailsExpanded ? '[-]' : '[+]'}
                                            </span>
                                        </h3>
                                        {isProjectDetailsExpanded && (
                                            <div style={{ textAlign: 'left' }} className="section-content">
                                                {projects.map((project, index) => (
                                                    <div key={index} className="employment-entry mb-4 border p-3 rounded position-relative">
                                                        <div className="d-flex justify-content-end position-absolute" style={{ top: '10px', right: '10px' }}>
                                                            <Button
                                                                className="rounded-pill fw-bold px-5 py-3 shadow-sm"
                                                                variant="primary"
                                                                style={{ fontSize: '14px' }}
                                                                onClick={() => this.handleShowProjectModal(index)}
                                                            >
                                                                <i className="feather-edit" />
                                                            </Button>
                                                            <Button
                                                                className="rounded-pill fw-bold px-5 py-3 shadow-sm ms-2"
                                                                variant="danger"
                                                                style={{ fontSize: '14px' }}
                                                                onClick={() => this.removeProjects(index)}
                                                            >
                                                                <i className="feather-trash" />
                                                            </Button>
                                                        </div>
                                                        <h5>Project {index + 1}</h5>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <p style={{ fontWeight: "bold" }}>Project Name: {project.projectname}</p>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <p style={{ fontWeight: "bold" }}>Client: {project.client}</p>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <p style={{ fontWeight: "bold" }}>Worked From: {project.workedFromMonth} {project.workedFromYear}</p>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <p style={{ fontWeight: "bold" }}>Worked To: {project.workedToMonth} {project.workedToYear}</p>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <p style={{ fontWeight: "bold" }}>Project Details: {project.projectDetails}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <Button
                                                    variant="success"
                                                    style={{ fontSize: '14px' }}
                                                    onClick={() => this.handleShowProjectModal()}
                                                    className="rounded-pill fw-bold px-5 py-3 shadow-sm"
                                                >
                                                    Add Project
                                                </Button>

                                                <Modal show={this.state.showProjectModal} onHide={this.handleCloseProjectModal}>
                                                    <Modal.Header closeButton>
                                                        <Modal.Title>{this.state.currentProjectIndex !== null ? 'Edit Project' : 'Add Project'}</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <div className="form-group">
                                                            <label htmlFor="projectname">Project Name</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="projectname"
                                                                name="projectname"
                                                                value={this.state.projectForm.projectname}
                                                                onChange={this.handleProjectFormChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="client">Client</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="client"
                                                                name="client"
                                                                value={this.state.projectForm.client}
                                                                onChange={this.handleProjectFormChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Worked From:</label>
                                                            <div className="d-flex gap-3">
                                                                <select
                                                                    className="form-control"
                                                                    id="workedFromMonth"
                                                                    name="workedFromMonth"
                                                                    value={this.state.projectForm.workedFromMonth}
                                                                    onChange={this.handleProjectFormChange}
                                                                >
                                                                    <option value="">Select Month</option>
                                                                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                                                                        <option key={month} value={index + 1}>
                                                                            {month}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <select
                                                                    className="form-control"
                                                                    id="workedFromYear"
                                                                    name="workedFromYear"
                                                                    value={this.state.projectForm.workedFromYear}
                                                                    onChange={this.handleProjectFormChange}
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
                                                            <label>Worked To:</label>
                                                            <div className="d-flex gap-3">
                                                                <select
                                                                    className="form-control"
                                                                    id="workedToMonth"
                                                                    name="workedToMonth"
                                                                    value={this.state.projectForm.workedToMonth}
                                                                    onChange={this.handleProjectFormChange}
                                                                >
                                                                    <option value="">Select Month</option>
                                                                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                                                                        <option key={month} value={index + 1}>
                                                                            {month}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <select
                                                                    className="form-control"
                                                                    id="workedToYear"
                                                                    name="workedToYear"
                                                                    value={this.state.projectForm.workedToYear}
                                                                    onChange={this.handleProjectFormChange}
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
                                                            <label htmlFor="projectdetails">Project Details</label>
                                                            <textarea
                                                                className="form-control"
                                                                id="projectdetails"
                                                                name="projectdetails"
                                                                value={this.state.projectForm.projectDetails}
                                                                onChange={this.handleProjectFormChange}
                                                            ></textarea>
                                                        </div>
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                        <Button style={{ fontSize: '14px' }} type="button" className="rounded-pill fw-bold px-5 py-3 shadow-sm" variant="secondary" onClick={this.handleCloseProjectModal}>Cancel</Button>
                                                        <Button style={{ fontSize: '14px' }} type="button" className="rounded-pill fw-bold px-5 py-3 shadow-sm" variant="primary" onClick={this.handleSaveProject}>Save</Button>
                                                    </Modal.Footer>
                                                </Modal>
                                            </div>
                                        )}
                                        {/* Candidate Education Section */}
                                        <h3 className="section-header" onClick={() => this.toggleSection("showEducation")} style={{ cursor: "pointer" }}>
                                            Education Details <span style={{ marginLeft: '10px' }}>{showEducation ? '[-]' : '[+]'}</span>
                                        </h3>
                                        {showEducation && (
                                            <div style={{ textAlign: "left" }} className="section-content">
                                                {this.state.educationDetails &&
                                                    this.state.educationDetails.map((education, index) => (
                                                        <div key={index} className="education-entry mb-4 border p-3 rounded position-relative">
                                                            <div className="d-flex justify-content-end position-absolute" style={{ top: '10px', right: '10px' }}>
                                                                <Button
                                                                    className="rounded-pill fw-bold px-5 py-3 shadow-sm"
                                                                    variant="primary"
                                                                    style={{ fontSize: '14px' }}
                                                                    onClick={() => this.handleShowEducationModal(index)}
                                                                >
                                                                    <i className="feather-edit" />
                                                                </Button>
                                                                <Button
                                                                    className="rounded-pill fw-bold px-5 py-3 shadow-sm ms-2"
                                                                    variant="danger"
                                                                    style={{ fontSize: '14px' }}
                                                                    onClick={() => this.removeEducation(index)}
                                                                >
                                                                    <i className="feather-trash" />
                                                                </Button>
                                                            </div>
                                                            <h5>Education {index + 1}</h5>
                                                            <p style={{ fontWeight: "bold" }}>Institution Name: {education.institutionName}</p>
                                                            <p style={{ fontWeight: "bold" }}>Degree with Specialisation: {education.degree}</p>
                                                            <p style={{ fontWeight: "bold" }}>Completed Year: {education.fromYear}</p>
                                                        </div>
                                                    ))}
                                                <Button
                                                    variant="success"
                                                    onClick={() => this.handleShowEducationModal()}
                                                    className="rounded-pill fw-bold px-5 py-3 shadow-sm"
                                                    style={{ fontSize: '14px' }}
                                                >
                                                    Add Education
                                                </Button>

                                                <Modal show={this.state.showEducationModal} onHide={this.handleCloseEducationModal}>
                                                    <Modal.Header closeButton>
                                                        <Modal.Title>{this.state.currentEducationIndex !== null ? 'Edit Education' : 'Add Education'}</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <div className="form-group">
                                                            <label htmlFor="institutionName">Institution Name</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="institutionName"
                                                                name="institutionName"
                                                                value={this.state.educationForm.institutionName}
                                                                onChange={this.handleEducationFormChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="degree">Degree with Specialisation</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="degree"
                                                                name="degree"
                                                                value={this.state.educationForm.degree}
                                                                onChange={this.handleEducationFormChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Completed Year:</label>
                                                            <select
                                                                className="form-control"
                                                                id="fromYear"
                                                                name="fromYear"
                                                                value={this.state.educationForm.fromYear}
                                                                onChange={this.handleEducationFormChange}
                                                            >
                                                                <option value="">Select Year</option>
                                                                {Array.from({ length: new Date().getFullYear() - 1970 + 1 }, (_, i) => 1970 + i).map((year) => (
                                                                    <option key={year} value={year}>
                                                                        {year}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                        <Button type="button" className="rounded-pill fw-bold px-5 py-3 shadow-sm" variant="secondary" onClick={this.handleCloseEducationModal} style={{ fontSize: '14px' }}>Cancel</Button>
                                                        <Button type="button" className="rounded-pill fw-bold px-5 py-3 shadow-sm" variant="primary" onClick={this.handleSaveEducation} style={{ fontSize: '14px' }}>Save</Button>
                                                    </Modal.Footer>
                                                </Modal>
                                            </div>
                                        )}
                                        <h3 className="section-header" onClick={() => this.toggleSection("showKeySkills")} style={{ cursor: "pointer" }}>
                                            Key Skills <span style={{ marginLeft: '10px' }}>{showKeySkills ? '[-]' : '[+]'}</span>
                                        </h3>
                                        {showKeySkills && (
                                            <div className="section-content">
                                                <div className="form-group">
                                                    <Select
                                                        id="keyskills_id"
                                                        name="keyskills_id"
                                                        value={this.state.keyskillsSelected}
                                                        options={this.state.keyskills}
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
                                                <div className="col-lg-12">
                                                    <div className="form-submit-group">
                                                        <button
                                                            type="button"
                                                            className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                                                            onClick={this.handleKeySkillsUpdate}
                                                        >
                                                            <span className="icon-reverse-wrapper">
                                                                <span className="btn-text">Update Skills</span>
                                                                <span className="btn-icon">
                                                                    <i className="feather-arrow-right" />
                                                                </span>
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

<h3 className="section-header" onClick={() => this.toggleSection("showCareerProfile")} style={{ cursor: "pointer" }}>
                                    Career Info <span style={{ marginLeft: '10px' }}>{this.state.showCareerProfile ? '[-]' : '[+]'}</span>
                                </h3>
                                {this.state.showCareerProfile && (
                                    <div className="section-content">
                                        <div className="form-group">
                                            <label htmlFor="employmentTypes">Employment Type</label>
                                            <Select
                                                id="employmentTypes"
                                                name="employmentTypes"
                                                value={this.state.employmentTypes}
                                                options={this.state.employmentType}
                                                onChange={(selectedOptions) => this.setState({ employmentTypes: selectedOptions })}
                                                isMulti
                                                placeholder="Select Employment Type"
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            
                                            <label htmlFor="jobType">Job Type</label>
                                            <Select
                                                id="jobType"
                                                name="jobType"
                                                value={this.state.jobType}
                                                options={[
                                                    { value: 'Contractual', label: 'Contractual' },
                                                    { value: 'Permanent', label: 'Permanent' }
                                                ]}
                                                onChange={(selectedOptions) => this.setState({ jobType: selectedOptions })}
                                                isMulti
                                                placeholder="Select Job Type"
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="currentindustry">Current Industry</label>
                                            <Select
                                                id="currentindustry"
                                                name="currentindustry"
                                                value={this.state.currentindustry}
                                                options={this.state.industry}
                                                onChange={(selectedOptions) => this.setState({ currentindustry: selectedOptions })}
                                                placeholder="Select Industry"
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="department">Department</label>
                                            <Select
                                                id="department"
                                                name="department"
                                                value={this.state.department}
                                                options={this.state.departments}
                                                onChange={(selectedOptions) => this.setState({ department: selectedOptions })}
                                                placeholder="Select Department"
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                            />
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="form-submit-group">
                                                <button
                                                    type="button"
                                                    className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                                                    onClick={this.handleCareerInformation}
                                                >
                                                    <span className="icon-reverse-wrapper">
                                                        <span className="btn-text">Update Career Info</span>
                                                        <span className="btn-icon">
                                                            <i className="feather-arrow-right" />
                                                        </span>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

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