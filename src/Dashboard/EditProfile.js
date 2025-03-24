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


class EditProfileTrainer extends React.Component {
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
            countryCode: { value: "+91", label: "+91" },
            keyskillsSelected: null,
            showEmploymentModal: false,
            currentEmploymentIndex: null,
            employments: [],
            employmentForm: {
                company_name: "",
                jobtitle: "",
                workedFromMonth: "",
                workedFromYear: "",
                workedToMonth: "",
                workedToYear: "",
                jobprofile: ""
            },
            educationDetails: [],
            showEducationModal: false,
            currentEducationIndex: null,
            educationForm: {
                institutionName: "",
                degree: "",
                specialisation: "",
                fromYear: "",
                toYear: ""
            },
            trainerType: null,
            totalExperience: "",
            modeOfTraining: null,
        };

    }
    componentDidMount() {
        let url = window.location.search;
        var urlParams = new URLSearchParams(url);
        this.userId = urlParams.get('user_Id');
        this.getDashboardUser();
        this.bindCountry();
        this.getIndustry();
        this.getKeySkills();
        this.getPhoneCode();
    }

    getPhoneCode = () => {
            const baseUrl = process.env.REACT_APP_BASEURL;
            const url = `${baseUrl}/api/Master/GetCountryPhoneCode`;
            const token = localStorage.getItem('authToken');
            var req={
                "stateId": 0,
                "countryId": 0,
                "cityId": 0,
                "id": 0,
                "freetext": ""
              }
            axios.post(url, req, {
                headers: {
                    'Content-Type': 'application/json',
                    //Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    const phoneCodes = response.data?.map(phone => ({
                        value: phone.value,
                        label: phone.value
                    }));
                    this.setState({ phoneCodes });
    
    
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
        const url = `${baseUrl}/api/Trainer/GetTrainerProfile`;
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
                const { profile_image, resume_file } = response.data.data.basic_info;
                const employment = response.data.data.employment;
                const education = response.data.data.education;
                const keySkills = response.data.data.keyskills;
                const carrerInfo = response.data.data.carrierinfo;
                this.setState({
                    fullname: response.data.data.basic_info.fullname,
                    email: response.data.data.basic_info.email,
                    mobile_no: response.data.data.basic_info.mobile_no,
                    profile_summary: response.data.data.basic_info.profile_summary,
                    experience: response.data.data.basic_info.experience,
                    selectedDate: (response.data.data.basic_info.dob == "1900-01-01T00:00:00" || !response.data.data.basic_info.dob) ? new Date() : new Date(response.data.data.basic_info.dob),
                    userId: response.data.data.basic_info.user_id,
                    profile_title: response.data.data.basic_info.profile_title,
                    linkedInSelected: response.data.data.basic_info.linkedin_profile_url,
                    selectedGender: { value: response.data.data.basic_info.gender, label: response.data.data.basic_info.gender },
                    selectedCountry: { value: response.data.data.basic_info.country_id, label: response.data.data.basic_info.country },
                    selectedState: { value: response.data.data.basic_info.state_id, label: response.data.data.basic_info.state },
                    selectedCity: { value: response.data.data.basic_info.city_id, label: response.data.data.basic_info.city },
                    languague_name: response.data.data.basic_info.known_languague,
                    countryCode: { value: response.data.data.basic_info.countrycode, label: response.data.data.basic_info.countrycode }
                });


                if (profile_image) {
                    this.setState({
                        logoPreview: `${process.env.REACT_APP_BASEURL}/Uploads/${profile_image}`,
                        fileName: profile_image,
                    });
                }
                if (resume_file) {
                    this.setState({
                        resumePreview: `${process.env.REACT_APP_BASEURL}/Uploads/${resume_file}`,
                        resumefileName: resume_file,
                    });
                }

                if (employment && employment.length > 0) {
                    this.setState({
                        employments: employment.map((item) => ({
                            company_name: item.Institution_Company,
                            jobtitle: item.Role_Title,
                            workedFromYear: item.year_from,
                            workedToYear: item.year_to,
                            trainer_employment_id: item.trainer_employment_id
                        }))
                    });

                }
                if (education && education.length > 0) {
                    this.setState({
                        educationDetails: education.map((item) => ({
                            institutionName: item.university_board,
                            degree: item.education_title,
                            fromYear: item.passing_year,
                            trainer_education_id: item.trainer_edu_id
                        }))
                    });
                }
                if (keySkills && keySkills.length > 0) {
                    this.setState({
                        keyskillsSelected: keySkills.map((item) => ({
                            value: item.skill_id,
                            label: item.keyskills
                        }))
                    });
                }
                if (carrerInfo && carrerInfo.length > 0) {
                    const career = carrerInfo[0]; // Assuming you want the first item in the array
                    this.setState({
                        trainerType: career.trainer_type_id.split(',').map(type => ({ value: type, label: type })),
                        totalExperience: career.experience,
                        modeOfTraining: career.training_mode.split(',').map(mode => ({ value: mode, label: mode })),
                        trainer_skill_id: career.trainer_carrierinfo_id
                    });
                }


            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
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

    bindCountry = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Master/GetCountry`;
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
                const options = response.data.map((item) => ({
                    value: item.id,
                    label: item.value,
                }));
                this.setState({ countryOptions: options });
            })
            .catch((error) => {
                // localStorage.removeItem('authToken');
                // this.props.navigate('/Login'); // Use `navigate`
            });
    }


    bindCity = (stateId) => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Master/GetCity`;
        const token = localStorage.getItem('authToken');
        var text = {
            "freetext": "",
            "cityId": 0,
            "stateId": stateId,
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


    bindState = (countryId) => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Master/GetState`;
        const token = localStorage.getItem('authToken');
        var text = {
            "stateId": 0,
            "countryId": countryId,
            "freetext": ""
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


            })
            .catch((error) => {
                // localStorage.removeItem('authToken');
                // this.props.navigate('/Login'); // Use `navigate`
            });
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
            const url = `${baseUrl}/api/FileUpload/UploadCandidateResume`;
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
    handleTrainerInformation = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Trainer/UpdateBasicProfile`;
        const token = localStorage.getItem('authToken');
        var candidateData = {

            "profile_image": this.state.fileName,
            "country_code": this.state.countryCode.value,
            "gender": this.state.selectedGender.value,
            "fullname": this.state.fullname,
            "mobileno": this.state.mobile_no,
            "ipaddress": "192.168.1.1",
            "profile_title": this.state.profile_title,
            "profilesummary": this.state.profile_summary,
            "city_id": this.state.selectedCity.value,
            "state_id": this.state.selectedState.value,
            "country_id": this.state.selectedCountry.value,
            "known_languagues": this.state.languague_name,
            "linkedin_profile_url": this.state.linkedInSelected,
            "dob": this.state.selectedDate ? `${this.state.selectedDate.getFullYear()}-${String(this.state.selectedDate.getMonth() + 1).padStart(2, '0')}-${String(this.state.selectedDate.getDate()).padStart(2, '0')}` : null,
            "user_id": this.state.userId,
            "resume_file_path": this.state.resumefileName
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
                    responseMessage: error.response?.data.message,
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
    handleCountryChange = (selectedOptions) => {
        this.setState({ selectedCountry: selectedOptions });
        this.bindState(selectedOptions.value);
    };
    handleStateChange = (selectedOptions) => {
        this.setState({ selectedState: selectedOptions });
        this.bindCity(selectedOptions.value);
    };

    handleCityChange = (selectedOption) => {
        //this.handleInputChange('selectedCity', selectedOption);
        this.setState({ selectedCity: selectedOption });
    }

    handleProfileTitleChange = (event) => {
        this.setState({ profile_title: event.target.value });
    };

    handleGenderChange = (selectedOption) => {
        this.setState({ selectedGender: selectedOption });
    };
    handleLinkedinChange = (event) => {
        this.setState({ linkedInSelected: event.target.value });
    };

    handleCountryCodeChange = (event) => {
        this.setState({ countryCode: event });
    }

    handleKeySkillsUpdate = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Trainer/Updatekeyskills`;
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
                    responseMessage: error.response?.data.message,
                    alertVariant: 'danger', // Error alert variant
                });
                window.scrollTo(0, 0);
            });

    }
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
                    jobprofile: ""
                },
                showEmploymentModal: true
            });
        }
    };

    handleCloseEmploymentModal = () => {
        this.setState({ showEmploymentModal: false });
    };

    handleEmploymentFormChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            employmentForm: {
                ...prevState.employmentForm,
                [name]: value
            }
        }));
    };

    handleSaveEmployment = () => {
        const { employmentForm, employments, currentEmploymentIndex } = this.state;
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Trainer/UpdateEmployment`;
        const token = localStorage.getItem('authToken');

        const employmentData = {
            trainer_employment_id: currentEmploymentIndex !== null ? employments[currentEmploymentIndex].trainer_employment_id : 0,
            user_id: this.state.userId,
            role_title: employmentForm.jobtitle,
            year_from: parseInt(employmentForm.workedFromYear, 10),
            year_to: parseInt(employmentForm.workedToYear, 10),
            institution: employmentForm.company_name
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
                    responseMessage: error.response?.data.message,
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
                    responseMessage: error.response?.data.message,
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

    handleCareerInformation = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Trainer/UpdateCarrierInfo`;
        const token = localStorage.getItem('authToken');
        const careerData = {
            trainer_carrierinfo_id: this.state.trainer_skill_id ? this.state.trainer_skill_id : 0,
            user_id: this.state.userId,
            trainer_type_id: this.state.trainerType ? this.state.trainerType.map(type => type.value).join(",") : '',
            experience: parseInt(this.state.totalExperience, 10),
            training_mode: this.state.modeOfTraining ? this.state.modeOfTraining.map(mode => mode.value).join(",") : '',
            ipaddress: '192.168.1.1'
        };

        axios.post(url, careerData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                this.setState({
                    responseMessage: 'Career information updated successfully!',
                    alertVariant: 'success'
                });
                window.scrollTo(0, 0);
            })
            .catch((error) => {
                console.error('Error updating career information:', error.response?.data || error.message);
                this.setState({
                    responseMessage: error.response?.data.message,
                    alertVariant: 'danger'
                });
                window.scrollTo(0, 0);
            });
    };

    render() {
        const countryCodes = [
            { value: "+1", label: "+1", length: 10 },  // USA: 10 digits
            { value: "+91", label: "+91", length: 10 }, // India: 10 digits
            { value: "+44", label: "+44", length: 11 }, // UK: 11 digits
            { value: "+61", label: "+61", length: 9 }   // Australia: 9 digits
        ];

        const {
            fullname, email, mobile_no, profile_summary, experience, currentsalary, expectedsalary,
            logoPreview, isBasicInfoExpanded, isEmploymentDetailsExpanded, isProjectDetailsExpanded,
            showEducation, showKeySkills, preferredWorkLocation, selectedDate, resume_summary,
            noticePeriods, projects, preferredShift, specializations, keyskillsSelected, department_id,
            noticePeriodSelected, role_id, uploadStatus, languague_name, resumePreview, employments,
            employmentForm, showEmploymentModal
        } = this.state;

        return (
            <>
                <Header dashBoardData={this.state.dashBoardData} />
                <AdvancedBreadcumb componentName="Edit Profile" ComponentValue="Trainer" redirectURL="/TrainerDashboard" />
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
                           
                            <div className="col-lg-12">
                                <div className="rbt-contact-form contact-form-style-1 max-width-auto">
                                    <h3 className="title">Update Profile</h3>
                                    <hr className="mb--30" />
                                    <form onSubmit={(e) => e.preventDefault()} className="row row--15">
                                        { /* Candidate Basic Info Section */}
                                        <h3 className="section-header" onClick={() => this.toggleSection('isBasicInfoExpanded')} style={{ cursor: 'pointer' }}>
                                            Trainer Basic Information
                                            <span style={{ marginLeft: '10px' }}>
                                                {isBasicInfoExpanded ? '[-]' : '[+]'}
                                            </span>
                                        </h3>
                                        {isBasicInfoExpanded && (
                                            <div className="section-content">
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
                                                                    borderRadius: '50px',
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
                                                    <label className="mobile-label">Mobile Number *</label>
                                                    <div className="mobile-input d-flex align-items-center">
                                                        <Select
                                                            className="country-code-select"
                                                            options={this.state.phoneCodes}
                                                            value={this.state.countryCode}
                                                            onChange={this.handleCountryCodeChange}
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
                                                            id="mobile_no"
                                                            name="mobile_no"
                                                            value={mobile_no}
                                                            onChange={this.handleMobileChange}
                                                        />
                                                    </div>
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
                                                        value={this.state.selectedGender}
                                                        options={[
                                                            { value: 'Male', label: 'Male' },
                                                            { value: 'Female', label: 'Female' },
                                                            { value: 'Other', label: 'Other' }
                                                        ]}
                                                        placeholder="Select Gender"
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                        }}
                                                        onChange={this.handleGenderChange}
                                                    />
                                                    <label htmlFor="gender">Gender</label>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="country">Country</label>
                                                    <Select
                                                        id="country"
                                                        name="country"
                                                        value={this.state.selectedCountry}
                                                        options={this.state.countryOptions}
                                                        onChange={this.handleCountryChange}
                                                        placeholder="Type or select country..."
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <Select
                                                        options={this.state.stateOptions}
                                                        value={this.state.selectedState}
                                                        placeholder="Select State"
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                        }}
                                                        onChange={this.handleStateChange}
                                                    />
                                                    <label htmlFor="state">State</label>
                                                </div>
                                                <div className="form-group">
                                                    <Select
                                                        value={this.state.selectedCity}
                                                        options={this.state.cityOptions}
                                                        placeholder="Select City"
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                        }}
                                                        onChange={(selectedOption) => this.handleCityChange(selectedOption)}
                                                    />
                                                    <label htmlFor="city">City</label>
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
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="linkedin"
                                                        name="linkedin"
                                                        value={this.state.linkedInSelected}
                                                        onChange={this.handleLinkedinChange}
                                                    />
                                                    <label htmlFor="linkedin">LinkedIn Profile Url</label>
                                                </div>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="Profiletitle"
                                                        name="Profiletitle"
                                                        value={this.state.profile_title}
                                                        onChange={this.handleProfileTitleChange}
                                                    />
                                                    <label htmlFor="Profiletitle">Profile Title</label>
                                                </div>
                                                <div className="form-group" style={{ position: "relative" }}>
                                                    <label
                                                        htmlFor="profile_summary"
                                                        style={{
                                                            position: "absolute",
                                                            top: "-12px",
                                                            left: "10px",
                                                            background: "white",
                                                            padding: "0 4px",
                                                            fontSize: "17px",
                                                            color: "#6c757d",
                                                        }}
                                                    >
                                                        Profile Summary
                                                    </label>
                                                    <textarea
                                                        className="form-control"
                                                        id="profile_summary"
                                                        name="profile_summary"
                                                        value={profile_summary}
                                                        onChange={this.handleProfileChange}
                                                    ></textarea>
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
                                                                    <p>{this.state.resumefileName}</p>
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
                                                <div className="col-lg-12">
                                                    <div className="form-submit-group">
                                                        <button
                                                            type="button"
                                                            className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                                                            onClick={this.handleTrainerInformation}
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

                                       { /* Trainer Employment Section */}
                                        <h3 className="section-header" onClick={() => this.toggleSection('isEmploymentDetailsExpanded')} style={{ cursor: 'pointer' }}>
                                            Employment Details
                                            <span style={{ marginLeft: '10px' }}>
                                                {isEmploymentDetailsExpanded ? '[-]' : '[+]'}
                                            </span>
                                        </h3>
                                        {isEmploymentDetailsExpanded && (
                                            <div style={{ textAlign: 'left' }} className="section-content">
                                                {
                                                    this.state.employments.map((employment, index) => (
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
                                        ))
                                                                                        }
                                        <Button
                                            variant="success"
                                            style={{ fontSize: '14px' }}
                                            onClick={() => this.handleShowEmploymentModal()}
                                            className="rounded-pill fw-bold px-5 py-3 shadow-sm"
                                        >
                                            Add Employment
                                        </Button>

                                        <Modal show={showEmploymentModal} onHide={this.handleCloseEmploymentModal} size='lg'>
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
                                                    <label>Worked From:</label>
                                                    <div className="d-flex gap-3">
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
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button style={{ fontSize: '14px' }} type="button" className="rounded-pill fw-bold px-5 py-3 shadow-sm" variant="secondary" onClick={this.handleCloseEmploymentModal}>Cancel</Button>
                                                <Button style={{ fontSize: '14px' }} type="button" className="rounded-pill fw-bold px-5 py-3 shadow-sm" variant="primary" onClick={this.handleSaveEmployment}>Save</Button>
                                            </Modal.Footer>
                                        </Modal>
                                </div>
                                                                                )}
                                {/* Trainer Education Section */}
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

                                        <Modal show={this.state.showEducationModal} onHide={this.handleCloseEducationModal} size='lg'>
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
                                            <label htmlFor="trainerType">Trainer Type</label>
                                            <Select
                                                id="trainerType"
                                                name="trainerType"
                                                value={this.state.trainerType}
                                                options={[
                                                    { value: 'Fulltime', label: 'Fulltime' },
                                                    { value: 'Parttime', label: 'Parttime' }
                                                ]}
                                                onChange={(selectedOptions) => this.setState({ trainerType: selectedOptions })}
                                                isMulti
                                                placeholder="Select Trainer Type"
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="totalExperience">Total Experience</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="totalExperience"
                                                name="totalExperience"
                                                value={this.state.totalExperience}
                                                onChange={(e) => this.setState({ totalExperience: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="modeOfTraining">Mode of Training</label>
                                            <Select
                                                id="modeOfTraining"
                                                name="modeOfTraining"
                                                value={this.state.modeOfTraining}
                                                options={[
                                                    { value: 'Online', label: 'Online' },
                                                    { value: 'In-Person', label: 'In-Person' },
                                                    { value: 'Hybrid', label: 'Hybrid' }
                                                ]}
                                                onChange={(selectedOptions) => this.setState({ modeOfTraining: selectedOptions })}
                                                isMulti
                                                placeholder="Select Mode of Training"
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                            />
                                        </div>
                                        <div className="col-lg-10">
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
            </div >
                </div >
            </>
        );
    }
}

export default withNavigation(EditProfileTrainer);