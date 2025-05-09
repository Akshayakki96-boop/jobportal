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
            ip: "Fetching...",
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
                toYear: "",
                coursename: ""
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
            countryCode: { value: "+91", label: "+91" },
        };

    }
    componentDidMount() {
        this.fetchIP();
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
        this.getPhoneCode();
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

    getPhoneCode = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Master/GetCountryPhoneCode`;
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
                console.log('user data candidate', response.data);
                this.setState({ userData: response.data.data })
                const { profile_image, resumefile } = response.data.data.basic_info;
                const { employment, projects, education, carrierinfo, keyskill } = response.data.data;

                this.setState({
                    fullname: response.data.data.basic_info.
                        fullname, email: response.data.data.basic_info.email,
                    mobile_no: response.data.data.basic_info.mobile_no, profile_summary: response.data.data.basic_info.profile_summary,
                    experience: response.data.data.basic_info.experience, currentsalary: response.data.data.basic_info.CTC, expectedsalary: response.data.data.basic_info.ExpectedCTC,
                    resume_summary: response.data.data.basic_info.resume_headline,
                    selectedCity: response.data.data.basic_info.current_location ? { value: response.data.data.basic_info.city_id, label: response.data.data.basic_info.current_location } : null,
                    selectedDate: response.data.data.basic_info.DOB == "1900-01-01T00:00:00" ? new Date() : new Date(response.data.data.basic_info.DOB), userId: response.data.data.basic_info.user_id, languague_name: response.data.data.basic_info.language_name, role_id: response.data.data.basic_info.designation, noticePeriodSelected: response.data.data.basic_info.notice_period ? { value: response.data.data.basic_info.notice_period, label: response.data.data.basic_info.notice_periods } : null
                });

                var prefer_location = response.data.data.basic_info.prefer_location;
                var prefer_location_Id = response.data.data.basic_info.preferred_location_id;
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
                if (employment && employment.length > 0) {
                    const employmentData = employment.map((emp) => ({
                        candidate_employment_id: emp.candidate_employment_id,
                        user_id: emp.user_id,
                        createddate: emp.createddate,
                        updateddate: emp.updateddate,
                        isCurrentCompany: emp.is_current_employment,
                        employmentType: emp.employmentType,
                        empType: emp.empType,
                        keyskillselected: emp.keyskill_ids ? emp.keyskill_ids.split(',').map((id, index) => ({
                            value: id,
                            label: emp.keyskills.split(',')[index]
                        })) : [],
                        keyskills: emp.keyskills,
                        company_name: emp.company_name,
                        jobtitle: emp.jobtitle,
                        jobprofile: emp.jobprofile,
                        notice_period_id: emp.notice_period_id,
                        workedFromMonth: emp.joiningdate_month,
                        workedFromYear: emp.joiningdate_year,
                        workedToMonth: emp.leavingdate_month,
                        workedToYear: emp.leavingdate_year,
                    }));

                    this.setState({ employments: employmentData });
                }

                if (projects && projects.length > 0) {
                    const projectData = projects.map((proj) => ({
                        candidate_project_id: proj.candidate_project_id,
                        user_id: proj.user_id,
                        createddate: proj.createddate,
                        updateddate: proj.updateddate,
                        projectname: proj.project_title,
                        projectDetails: proj.project_description,
                        keyskillsSelected: proj.used_skill_ids ? proj.used_skill_ids.split(',').map((id, index) => ({
                            value: id,
                            label: proj.keyskills.split(',')[index]
                        })) : [],
                        teamSize: proj.teamsize,
                        keyskills: proj.keyskills,

                    }));

                    this.setState({ projects: projectData });
                }

                if (education && education.length > 0) {
                    const educationData = education.map((edu) => ({
                        candidate_education_id: edu.candidate_education_id,
                        user_id: edu.user_id,
                        createddate: edu.createddate,
                        updateddate: edu.updateddate,
                        education_type_id: edu.education_type_id,
                        degree: edu.education,
                        coursename: edu.coursename,
                        courseType: edu.coursetype ? { value: edu.coursetype, label: edu.coursetype === "1" ? "Full time" : edu.coursetype === "2" ? "Part time" : "Correspondence" } : null,
                        fromYear: edu.course_duration_from,
                        toYear: edu.course_duration_to,
                    }));

                    this.setState({ educationDetails: educationData });
                }

                if (carrierinfo && carrierinfo.length > 0) {
                    let employmentTypes = carrierinfo[0].employment_type ? carrierinfo[0].employment_type.split(',').map((id, index) => ({
                        value: id,
                        label: carrierinfo[0].empType.split(',')[index]
                    })) : [];
                    this.setState({ employmentTypes });

                    let jobType = carrierinfo[0].job_type ? carrierinfo[0].job_type.split(',').map((id, index) => ({
                        value: id,
                        label: carrierinfo[0].job_type.split(',')[index]
                    })) : [];
                    this.setState({ jobType });

                    let currentindustry = { value: carrierinfo[0].industry_id, label: carrierinfo[0].industryname };
                    this.setState({ currentindustry });
                    let department = { value: carrierinfo[0].department_id, label: carrierinfo[0].department };
                    this.setState({ department });

                    this.setState({ candidate_career_id: carrierinfo[0].candidate_career_id });
                }

                if (keyskill && keyskill.length > 0) {
                    const keyskillsData = keyskill.map((skill) => ({
                        candidate_keyskill_id: skill.candidate_keyskill_id,
                        user_id: skill.user_id,
                        createddate: skill.createddate,
                        updateddate: skill.updateddate,
                        keyskills: skill.keyskills,
                        keyskills_id: skill.keyskills_id,
                    }));

                    const keyskillsSelected = keyskillsData.map((skill) => ({
                        value: skill.keyskills_id,
                        label: skill.keyskills,
                    }));

                    this.setState({ keyskillsSelected });
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

    getDepartments = () => {
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

        if (file) {
                   const image = new Image();
                   image.src = URL.createObjectURL(file);
       
                   image.onload = () => {
                    //    if (image.width !== 150 || image.height !== 150) {
                    //        this.setState({ uploadStatus: 'Image dimensions must be 150x150 pixels!' });
                    //        return;
                    //    }
       
                       if (!validImageTypes.includes(file.type)) {
                           // Set an error message if the file type is not valid
                           this.setState({ uploadStatus: 'Invalid file type! Please upload an image file.' });
                           return;
                       }
       
                       this.setState({
                           logo: file,
                           logoPreview: URL.createObjectURL(file), // Preview the uploaded file
                           uploadStatus: null,
                           // Clear any previous error
                       }, this.validateForm);
       
                       // Create FormData and append the file
                       const formData = new FormData();
                       formData.append('file', file);
       
                       // Call the API to upload the file
                       axios.post(url, formData, {
                           headers: {
                               'Content-Type': 'multipart/form-data',
                               Authorization: `Bearer ${token}`,
                           },
                       })
                       .then((response) => {
                           console.log('File uploaded successfully:', response.data);
                           this.setState({ fileName: response.data.filePath });
                           this.setState({ uploadStatus: 'File uploaded successfully!' });
                       })
                       .catch((error) => {
                           console.error('Error uploading file:', error);
                           this.setState({ uploadStatus: 'Error uploading file!' });
                       });
                   };
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
            "ipaddress": this.state.ip,
            "resumeheadline": this.state.resume_summary,
            "profilesummary": this.state.profile_summary,
            "expereince": this.state.experience ? this.state.experience : 0,
            "ctc": this.state.currentsalary ? this.state.currentsalary : 0,
            "ex_ctc": this.state.expectedsalary ? this.state.expectedsalary : 0,
            "current_cities": this.state.selectedCity ? this.state.selectedCity.value : "",
            "preferred_location": this.state.preferredWorkLocation ? this.state.preferredWorkLocation.map((item) => item.value).join(',') : "",
            "notice_period_id": this.state.noticePeriodSelected ? this.state.noticePeriodSelected.value : 0,
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
            joiningdate_year: parseInt(employmentForm.workedFromYear, 10) ? parseInt(employmentForm.workedFromYear, 10) : 0,
            leavingdate_year: parseInt(employmentForm.workedToYear, 10) ? parseInt(employmentForm.workedToYear, 10) : 0,
            is_current_employment: employmentForm.isCurrentCompany,
            joiningdate_month: employmentForm.workedFromMonth ? employmentForm.workedFromMonth : 0,
            leavingdate_month: employmentForm.workedToMonth ? employmentForm.workedToMonth : 0,
            company_name: employmentForm.company_name,
            employmentType: employmentForm.employmentType ? employmentForm.employmentType : 0,
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

                console.log('Employment data saved successfully:', response.data);
                this.setState({
                    responseMessage: 'Employment data saved successfully!',
                    alertVariant: 'success'
                });
                window.scrollTo(0, 0);
                this.handleCloseEmploymentModal();
            })
            .catch((error) => {
                console.error('Error saving employment data:', error.response?.data || error.message);
                this.setState({
                    responseerrorMessage: error.response?.data,
                    alertVariant: 'danger'
                });

                //window.scrollTo(0, 0);
                // Removed invalid break statement
            });


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
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Candidate/UpdateCandidateProjects`;
        const token = localStorage.getItem('authToken');
        const projectData = {
            candidate_project_id: currentProjectIndex !== null ? projects[currentProjectIndex].candidate_project_id : 0,
            user_id: this.state.userId,
            project_title: projectForm.projectname,
            project_description: projectForm.projectDetails,
            skill_ids: projectForm.keyskillsSelected ? projectForm.keyskillsSelected.map(skill => skill.value).join(',') : '',
            teamsize: projectForm.teamSize ? projectForm.teamSize : 0,
        };

        axios.post(url, projectData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
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
                console.log('Project data saved successfully:', response.data);
                this.setState({
                    responseMessage: 'Project data saved successfully!',
                    alertVariant: 'success'
                });
                window.scrollTo(0, 0);
            })
            .catch((error) => {
                console.error('Error saving project data:', error.response?.data || error.message);
                this.setState({
                    responseerrorMessage: error.response?.data,
                    alertVariant: 'danger'
                });
                window.scrollTo(0, 0);
            });





    }

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
                    toYear: "",
                    coursename: ""
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
        const url = `${baseUrl}/api/Candidate/UpdateCandidateEducation`;
        const token = localStorage.getItem('authToken');

        const educationData = {
            candidate_education_id: currentEducationIndex !== null ? educationDetails[currentEducationIndex].candidate_education_id : 0,
            user_id: this.state.userId,
            educationType: 1,
            coursename: educationForm.coursename,
            specialization: educationForm.degree,
            coursetype: educationForm.courseType ? educationForm.courseType.value : "",
            course_duration_from: parseInt(educationForm.fromYear, 10) ? parseInt(educationForm.fromYear, 10) : 0,
            course_duration_to: parseInt(educationForm.toYear, 10) ? parseInt(educationForm.toYear, 10) : 0,
        };

        axios.post(url, educationData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
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
                    responseerrorMessage: error.response?.data,
                    alertVariant: 'danger'
                });
                // window.scrollTo(0, 0);
            });


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
            "ipaddress": this.state.ip,
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

    handleCareerInformation = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Candidate/UpdateCandidateCarrierProfile`;
        const token = localStorage.getItem('authToken');
        const careerData = {
            "candidate_career_id": this.state.candidate_career_id ? this.state.candidate_career_id : 0,
            "user_id": this.state.userId,
            "industry_id": this.state.currentindustry.value ? this.state.currentindustry.value : 0,
            "department_id": this.state.department.value ? this.state.department.value : 0,
            "role_id": this.state.role_id,
            "job_type": this.state.jobType.map(option => option.value).join(','),
            "employment_type": this.state.employmentTypes.map(option => option.value).join(','),
        }

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
                    responseMessage: error.response?.data,
                    alertVariant: 'danger'
                });
                window.scrollTo(0, 0);
            });
    }

    handleCountryCodeChange = (event) => {
        this.setState({ countryCode: event });
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
                            <div className="col-lg-12">
                                <div className="rbt-contact-form contact-form-style-1 max-width-auto">
                                    <h3 className="title">Complete Your Profile</h3>
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
                                                 {/* <p style={{ textAlign: "left" ,fontWeight:"bold",fontSize:'13px' }}>Note: Please upload a Profile pic with dimensions of 150x150 pixels.</p> */}
                                                <label htmlFor="profile_image">Profile Image</label>
                                                {logoPreview && (
                                                    <div className="mt-3">
                                                        <img
                                                            src={logoPreview}
                                                            alt="Logo Preview"
                                                            style={{
                                                                width: '30%',
                                                                height: '30%',
                                                                objectFit: 'cover',
                                                                borderRadius: '50px',
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                               
                                                {uploadStatus && <small className={uploadStatus == "File uploaded successfully!" ? "text-success" : "text-danger"}>{uploadStatus}</small>}
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
                                            <div className="form-group phone-input-group">
                                                <label htmlFor="mobile_no">Mobile Number</label>
                                                <div className="phone-row">
                                                    <Select
                                                        className="country-code-select"
                                                        options={this.state.phoneCodes}
                                                        value={this.state.countryCode}
                                                        onChange={this.handleCountryCodeChange}
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                            control: (base) => ({
                                                                ...base,
                                                                height: '40px',
                                                                minHeight: '40px',
                                                                fontSize: '16px',
                                                                borderRadius: '4px',
                                                                minWidth: '70px',         // Optional: minimum width
                                                                width: 'max-content',            // Let it grow
                                                                paddingRight: '4px'
                                                            }),
                                                            container: (base) => ({
                                                                ...base,
                                                                flexShrink: 0,            // Prevent shrinking
                                                                width: 'max-content',      // Let it grow
                                                            }),
                                                            valueContainer: (base) => ({
                                                                ...base,
                                                                padding: '0 8px',
                                                            }),
                                                            indicatorsContainer: (base) => ({
                                                                ...base,
                                                                height: '40px',
                                                            }),
                                                            singleValue: (base) => ({
                                                                ...base,
                                                                lineHeight: '40px',
                                                            }),
                                                        }}
                                                    />

                                                    <input
                                                        type="text"
                                                        className="form-control"
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
                                                    isClearable={true}
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
                                                    isClearable={true}
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
                                                    isClearable={true}
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

                                                {this.state.uploadResumeStatus && <small className={this.state.uploadResumeStatus == "Resume uploaded successfully!" ? "text-success" : "text-danger"}>{this.state.uploadResumeStatus}</small>}
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
                                                    type="number"
                                                    className="form-control"
                                                    id="experience"
                                                    name="experience"
                                                    value={experience}
                                                    onChange={this.handleExperienceChange}
                                                />
                                                <label htmlFor="experience">Total Experience(in years)</label>
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
                                                <label htmlFor="currentsalary">Current CTC (LPA)</label>
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
                                                <label htmlFor="expectedsalary">Expected CTC (LPA)</label>
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
                                                                <i className="fas fa-trash-alt" />
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
                                                                <p style={{ fontWeight: "bold" }}>Worked To: {employment.workedToYear ? employment.workedToYear : "Present"}</p>
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

                                                <Modal show={showEmploymentModal} onHide={this.handleCloseEmploymentModal} size="lg">
                                                    <Modal.Header closeButton>
                                                        <Modal.Title>{this.state.currentEmploymentIndex !== null ? 'Edit Employment' : 'Add Employment'}</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        {this.state.responseerrorMessage && (
                                                            <Alert variant={this.state.alertVariant} onClose={() => this.setState({ responseerrorMessage: '' })} dismissible>
                                                                {this.state.responseerrorMessage}
                                                            </Alert>
                                                        )}
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
                                                            <label htmlFor="jobtitle">Job Profile</label>
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
                                                        {!employmentForm.isCurrentCompany && <div className="form-group">
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
                                                            {employmentForm.workedToYear !== 0 && <div> {employmentForm.workedFromYear && employmentForm.workedToYear && parseInt(employmentForm.workedFromYear) > parseInt(employmentForm.workedToYear) && (
                                                                <span style={{ color: 'red', fontSize: '10px' }}>Worked From year cannot be greater than Worked To year.</span>
                                                            )}</div>}
                                                        </div>}


                                                        <input
                                                            type="checkbox"
                                                            name="isCurrentCompany"
                                                            checked={employmentForm.isCurrentCompany}
                                                            id="isCurrentCompany"
                                                            onChange={this.handleEmploymentFormChange} />
                                                        <label htmlFor="isCurrentCompany">Is Current Company</label>


                                                        <div className="form-group">
                                                            <label htmlFor="keyskillselected">Key Skills</label>
                                                            <Select
                                                                id="keyskillselected"
                                                                name="keyskillselected"
                                                                isClearable={true}
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
                                                                <i className="fas fa-trash-alt" />
                                                            </Button>
                                                        </div>
                                                        <h5>Project {index + 1}</h5>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <p style={{ fontWeight: "bold" }}>Project Name: {project.projectname}</p>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <p style={{ fontWeight: "bold" }}>Team Size: {project.teamSize}</p>
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

                                                <Modal show={this.state.showProjectModal} onHide={this.handleCloseProjectModal} size='lg'>
                                                    <Modal.Header closeButton>
                                                        <Modal.Title>{this.state.currentProjectIndex !== null ? 'Edit Project' : 'Add Project'}</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        {this.state.responseerrorMessage && (
                                                            <Alert variant={this.state.alertVariant} onClose={() => this.setState({ responseerrorMessage: '' })} dismissible>
                                                                {this.state.responseerrorMessage}
                                                            </Alert>
                                                        )}
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
                                                        <div className='form-group'>
                                                            <label htmlFor="teamSize">Team Size</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="teamSize"
                                                                name="teamSize"
                                                                value={this.state.projectForm.teamSize}
                                                                onChange={this.handleProjectFormChange}
                                                            />

                                                        </div>
                                                        <div className="form-group">
                                                            <Select
                                                                id="keyskills_id"
                                                                name="keyskills_id"
                                                                isClearable={true}
                                                                value={this.state.projectForm.keyskillsSelected}
                                                                options={this.state.keyskills}
                                                                onChange={(selectedOptions) =>
                                                                    this.setState((prevState) => ({
                                                                        projectForm: {
                                                                            ...prevState.projectForm,
                                                                            keyskillsSelected: selectedOptions
                                                                        }
                                                                    }))
                                                                }
                                                                isMulti
                                                                placeholder="Type or select skills..."
                                                                className="basic-multi-select"
                                                                classNamePrefix="select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                                }}
                                                            />
                                                            <label htmlFor="keyskills_id">Used Skills</label>
                                                        </div>

                                                        <div className="form-group">

                                                            <textarea
                                                                className="form-control"
                                                                id="projectDetails"
                                                                name="projectDetails"
                                                                value={this.state.projectForm.projectDetails}
                                                                onChange={this.handleProjectFormChange}
                                                            ></textarea>
                                                            <label htmlFor="projectDetails">Project Details</label>
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
                                                                    <i className="fas fa-trash-alt" />
                                                                </Button>
                                                            </div>
                                                            <h5>Education {index + 1}</h5>
                                                            <p style={{ fontWeight: "bold" }}>Course Name: {education.coursename}</p>
                                                            <p style={{ fontWeight: "bold" }}>Degree with Specialisation: {education.degree}</p>
                                                            <p style={{ fontWeight: "bold" }}>Started : {education.fromYear}</p>
                                                            <p style={{ fontWeight: "bold" }}>Completed : {education.toYear}</p>
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
                                                        {this.state.responseerrorMessage && (
                                                            <Alert variant={this.state.alertVariant} onClose={() => this.setState({ responseerrorMessage: '' })} dismissible>
                                                                {this.state.responseerrorMessage}
                                                            </Alert>
                                                        )}
                                                        <div className="form-group">
                                                            <label htmlFor="coursename">Course Name</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="coursename"
                                                                name="coursename"
                                                                value={this.state.educationForm.coursename}
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

                                                            <label htmlFor="courseType">Course Type</label>
                                                            <Select
                                                                id="courseType"
                                                                name="courseType"
                                                                value={this.state.educationForm.courseType}
                                                                options={[
                                                                    { value: "1", label: 'Full time' },
                                                                    { value: "2", label: 'Part time' },
                                                                    { value: "3", label: 'Correspondence' },
                                                                ]}
                                                                onChange={(selectedOptions) =>
                                                                    this.setState((prevState) => ({
                                                                        educationForm: {
                                                                            ...prevState.educationForm,
                                                                            courseType: selectedOptions
                                                                        }
                                                                    }))
                                                                }
                                                                placeholder="Select Course Type"
                                                                className="basic-multi-select"
                                                                classNamePrefix="select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>From:</label>
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
                                                        <div className="form-group">
                                                            <label>To:</label>
                                                            <select
                                                                className="form-control"
                                                                id="toYear"
                                                                name="toYear"
                                                                value={this.state.educationForm.toYear}
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
                                                        {this.state.educationForm.fromYear && this.state.educationForm.toYear && parseInt(this.state.educationForm.fromYear) > parseInt(this.state.educationForm.toYear) && (
                                                            <span style={{ color: 'red' }}> From year cannot be greater than To year.</span>
                                                        )}
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
                                                        isClearable={true}
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
                                                        isClearable={true}
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
                                                        isClearable={true}
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
                                                        isClearable={true}
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
                                                        isClearable={true}
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