import React from 'react';
import axios from 'axios';
import withNavigation from '../withNavigation';
import Header from '../Header/header';
import parse from 'html-react-parser';
import { Alert, Button } from 'react-bootstrap';


class CourseDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUserDashboard: true,
            dashBoardData: {},
            activeSection: 'overview',
        };
        this.sections = [];
        this.observer = null;
    }
    componentDidMount() {
        let url = window.location.search;
        var urlParams = new URLSearchParams(url);
        var courseId = urlParams.get('courseId');
        this.courseId = courseId;
        this.sections = document.querySelectorAll('div[id]');
        const options = {
            root: null,
            rootMargin: '-50px 0px 0px 0px',
            threshold: 0.2, // Trigger when 60% of the div is visible
        };

        this.observer = new IntersectionObserver(this.handleIntersect, options);
        this.sections.forEach((section) => this.observer.observe(section));
        const token = localStorage.getItem('authToken');
        if (token) {
            this.getDashboardUser();
        }
        else {
            this.setState({ dashBoardData: "" });
        }



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
                if (response.data.data.role_id == 1) {
                    setTimeout(() => {
                        this.getAllCourseCandidate(0, 10);
                    }, 1000); // Delay of 1 second
                }
                else {
                    setTimeout(() => {
                        this.getAllCourse(this.courseId);
                    }, 1000); // Delay of 1 second
                }
            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
    }
    getAllCourseCandidate = (pageIndex, pageSize) => {
        //this.setState({ keepSpinner: true, courseListingData: [] });
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Course/GetCourse`;
        const token = localStorage.getItem('authToken');
        var request =
        {
            "courseId": this.courseId,
            "coursetitle": "",
            "isactive": true,
            "user_id": 0,
            "pageIndex": pageIndex,
            "pagesize": pageSize,
            "candidate_user_id": this.state.dashBoardData.user_id

        }


        axios.post(url, request, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('courseListingData', response.data);
                if (response.data.data && response.data.data.length > 0) {
                    const totalCount = response.data.data[0].TotalRecords;

                    this.setState({ courseListingData: response.data.data[0], totalRecords: totalCount, keepSpinner: false });
                }
                else {
                    this.setState({ errorMessage: "No Course Found", keepSpinner: false });
                }

            })
            .catch((error) => {
                this.setState({
                    responseMessage: "Something went wrong !",
                    alertVariant: 'danger', // Error alert variant
                });
                window.scrollTo(0, 0);
            });
    }
    getAllCourse = (courseId) => {
        //this.setState({ keepSpinner: true });
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Course/GetCourse`;
        const token = localStorage.getItem('authToken');
        var request =
        {
            "courseId": courseId,
            "coursetitle": "",
            "isactive": false,
            "user_id": 0,
            "pageIndex": 0,
            "pagesize": 1
        }


        axios.post(url, request, {
            headers: {
                'Content-Type': 'application/json',
                //Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('courseListingData', response.data);
                if (response.data.data && response.data.data.length > 0) {
                    const totalCount = response.data.data[0].TotalRecords;

                    this.setState({ courseListingData: response.data.data[0], totalRecords: totalCount, keepSpinner: false });
                }
                else {
                    this.setState({ errorMessage: "No Course Found", keepSpinner: false });
                }

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });

    }

    componentWillUnmount() {
        if (this.observer) {
            this.sections.forEach((section) => this.observer.unobserve(section));
        }
    }
    handleIntersect = (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                this.setState({ activeSection: entry.target.id });
            }
        });
    };

    getInitials = (name) => {
        if (!name) return "U"; // Default to "U" if name is not provided

        const parts = name.trim().split(" "); // Trim to remove extra spaces

        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase() // Two initials
            : parts[0][0].toUpperCase(); // Single initial
    };

    applyCourse = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Candidate/ApplyCourse`;
        const token = localStorage.getItem('authToken');
        var request =
        {
            "applied_course_id": 0,
            "course_id": this.courseId,
            "candidate_user_id": this.state.dashBoardData.role_id == 1 ? this.state.dashBoardData.user_id : 0,
            "ip_address": "string",
            "status": 0
        }

        axios.post(url, request, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('applyCourse', response.data);
                this.setState({ applyCourseData: response.data.data });
                this.setState({ responseMessage: "Course Enrolled !", alertVariant: 'success' });
                window.scrollTo(0, 0);
                this.getAllCourseCandidate(0, 6); // Refresh the course details after enrollment
            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
    }
    enrollCourse = () => {
        this.setState({ showConfirmPopup: true });

    }



    render() {
        const formatDate = (dateString) => {
            if (!dateString) return ""; // Handle null/undefined values
            const date = new Date(dateString);
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            const dd = String(date.getDate()).padStart(2, "0");
            const yyyy = date.getFullYear();
            return `${mm}/${dd}/${yyyy}`;
        };
        const { activeSection } = this.state;
        return (
            <>
                <Header dashBoardData={this.state.dashBoardData} />
                {this.state.showConfirmPopup && (
                    <>
                        {/* Background overlay */}
                        <div className="modal-backdrop show"></div>

                        {/* Modal */}
                        <div className="modal show d-block" tabIndex="-1" role="dialog">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Confirm Enrollment</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            aria-label="Close"
                                            onClick={() => this.setState({ showConfirmPopup: false })}
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        <p>Are you sure you want to enroll for the course?</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-lg" // Increased size
                                            onClick={() => {
                                                this.setState({ showConfirmPopup: false });
                                                this.applyCourse();
                                            }}
                                        >
                                            OK
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-lg" // Increased size
                                            onClick={() => this.setState({ showConfirmPopup: false })}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div className="container mt-5">
                    {this.state.responseMessage && (
                        <Alert variant={this.state.alertVariant} onClose={() => this.setState({ responseMessage: '' })} dismissible>
                            {this.state.responseMessage}
                        </Alert>
                    )}
                </div>

                {/* Start breadcrumb Area */}
                <div className="rbt-breadcrumb-default rbt-breadcrumb-style-3">
                    <div className="breadcrumb-inner breadcrumb-dark">
                        <img src="assets/images/bg/bg-image-10.jpg" alt="Education Images" />
                    </div>
                    <div className="container">

                        <div className="row">
                            <div className="col-lg-8">
                                <div className="content text-start course-dp">
                                    <ul className="page-list">
                                        <li className="rbt-breadcrumb-item">
                                            <a href={this.state.dashBoardData.role_id==3 ? "/TrainerDashboard" : this.state.dashBoardData.role_id==1 ?"/CandidateDashboard": "/"}>{this.state.dashBoardData ? "Dashboard" : "Home"}</a>
                                        </li>
                                        <li>
                                            <div className="icon-right">
                                                <i className="feather-chevron-right" />
                                            </div>
                                        </li>
                                        <li className="rbt-breadcrumb-item active">{this.state.courseListingData?.coursetitle}</li>
                                    </ul>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}> {/* Aligns title and buttons inline */}
                                        <h2 className="title">
                                            {this.state.courseListingData?.coursetitle}
                                        </h2>
                                        {this.state.dashBoardData && this.state.dashBoardData.role_id == 3 && <a className="rbt-btn btn-md hover-icon-reverse" href={`/edit-course?courseId=${this.courseId}`}>
                                            <span className="icon-reverse-wrapper">
                                                <span className="btn-text">Edit Course</span>
                                                <span className="btn-icon">
                                                    <i className="feather-arrow-right"></i>
                                                </span>
                                                <span className="btn-icon">
                                                    <i className="feather-arrow-right"></i>
                                                </span>
                                            </span>
                                        </a>}
                                        {this.state.dashBoardData && this.state.dashBoardData.role_id == 1 && !this.state.courseListingData?.is_applied && <a className="rbt-btn btn-md hover-icon-reverse" href="#" onClick={this.enrollCourse}>
                                            <span className="icon-reverse-wrapper">
                                                <span className="btn-text">Enroll Course</span>
                                                <span className="btn-icon">
                                                    <i className="feather-arrow-right"></i>
                                                </span>
                                                <span className="btn-icon">
                                                    <i className="feather-arrow-right"></i>
                                                </span>
                                            </span>
                                        </a>}
                                    </div>
                                    <p className="description">
                                        {parse(
                                            this.state.courseListingData?.description.split(" ").length > 20
                                                ? this.state.courseListingData?.description.split(" ").slice(0, 20).join(" ") + "..."
                                                : this.state.courseListingData?.description || ""
                                        )}
                                    </p>
                                    <div className="d-flex align-items-center mb--20 flex-wrap rbt-course-details-feature">
                                        {/* <div className="feature-sin best-seller-badge">
                                                                            <span className="rbt-badge-2">
                                                                                <span className="image">
                                                                                    <img
                                                                                        src="assets/images/icons/card-icon-1.png"
                                                                                        alt="Best Seller Icon"
                                                                                    />
                                                                                </span>{" "}
                                                                                Bestseller
                                                                            </span>
                                                                        </div> */}
                                        {/* <div className="feature-sin rating">
                                            <a href="#">4.8</a>
                                            <a href="#">
                                                <i className="fa fa-star" />
                                            </a>
                                            <a href="#">
                                                <i className="fa fa-star" />
                                            </a>
                                            <a href="#">
                                                <i className="fa fa-star" />
                                            </a>
                                            <a href="#">
                                                <i className="fa fa-star" />
                                            </a>
                                            <a href="#">
                                                <i className="fa fa-star" />
                                            </a>
                                        </div> */}
                                        {/* <div className="feature-sin total-rating">
                                            <a className="rbt-badge-4" href="#">
                                                215,475 rating
                                            </a>
                                        </div> */}
                                        <div className="feature-sin total-student">
                                            <span>616,029 students</span>
                                        </div>
                                    </div>
                                    <div className="rbt-author-meta mb--20">
                                        <div className="rbt-avater">
                                            <a href="#">
                                                {this.state.courseListingData?.profile_image ? (<img
                                                    src={`${process.env.REACT_APP_BASEURL}/Uploads/${this.state.courseListingData?.profile_image}`}
                                                    alt={this.state.courseListingData?.FullName}
                                                />
                                                ) : (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            width: "60px", // Adjust as needed
                                                            height: "60px", // Adjust as needed
                                                            backgroundColor: "#ccc", // Default background color
                                                            color: "#fff",
                                                            borderRadius: "50%",
                                                            fontWeight: "bold",
                                                            fontSize: "18px", // Adjust font size as needed
                                                        }}
                                                    >
                                                        {this.getInitials(this.state.courseListingData?.FullName || "User")}
                                                    </div>
                                                )}
                                            </a>
                                        </div>
                                        <div className="rbt-author-info">
                                            By {this.state.courseListingData?.FullName}
                                            {/* <a href="#">Development</a> */}
                                        </div>
                                    </div>
                                    <ul className="rbt-meta">
                                        <li>
                                            <i className="feather-calendar" />
                                            Last updated <strong>{this.state.courseListingData && this.state.courseListingData?.updateddate
                                                ? new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
                                                    .format(new Date(this.state.courseListingData?.updateddate))
                                                : "Date Unavailable"}</strong>
                                        </li>
                                        <li>
                                            <i className="feather-globe" />
                                            English
                                        </li>
                                        <li>
                                            <i className="feather-award" />
                                            Certified Course
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End Breadcrumb Area */}

                <div className="rbt-course-details-area ptb--60">
                    <div className="container">
                        <div className="row g-5">
                            <div className="col-lg-8">
                                <div className="course-details-content">
                                    <div className="rbt-course-feature-box rbt-shadow-box thuumbnail">
                                        <img
                                            src={this.state.courseListingData ? `${process.env.REACT_APP_BASEURL}/Uploads/${this.state.courseListingData?.course_image}` : "assets/images/course/course-01.jpg"}
                                            alt="Card image"
                                        />
                                    </div>
                                    <div className="rbt-inner-onepage-navigation sticky-top mt--30">
                                        <nav className="mainmenu-nav onepagenav">
                                            <ul className="mainmenu">
                                                <li className={activeSection === 'overview' ? 'current' : ''}>
                                                    <a href="#overview">Overview</a>
                                                </li>
                                                <li className={activeSection === 'coursecontent' ? 'current' : ''}>
                                                    <a href="#coursecontent">Course Content</a>
                                                </li>
                                                <li className={activeSection === 'details' ? 'current' : ''}>
                                                    <a href="#details">Details</a>
                                                </li>
                                                <li className={activeSection === 'intructor' ? 'current' : ''}>
                                                    <a href="#intructor">Instructor</a>
                                                </li>
                                                <li className={activeSection === 'review' ? 'current' : ''}>
                                                    <a href="#review">Review</a>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                    {/* Start Course Feature Box  */}
                                    <div
                                        className="rbt-course-feature-box overview-wrapper rbt-shadow-box mt--30 has-show-more"
                                        id="overview"
                                    >
                                        <div className="rbt-course-feature-inner has-show-more-inner-content">
                                            <div className="section-title">
                                                <h4 className="rbt-title-style-3">What you'll learn</h4>
                                            </div>
                                            <p style={{ textAlign: 'left' }}>
                                                {parse(this.state.courseListingData?.description || "")}
                                            </p>
                                            {/* <div className="row g-5 mb--30"> */}
                                            {/* Start Feture Box  */}
                                            {/* <div className="col-lg-6">
                                                    <ul className="rbt-list-style-1">
                                                        <li>
                                                            <i className="feather-check" />
                                                            Become an advanced, confident, and modern JavaScript
                                                            developer from scratch.
                                                        </li>
                                                        <li>
                                                            <i className="feather-check" />
                                                            Have an intermediate skill level of Python programming.
                                                        </li>
                                                        <li>
                                                            <i className="feather-check" />
                                                            Have a portfolio of various data analysis projects.
                                                        </li>
                                                        <li>
                                                            <i className="feather-check" />
                                                            Use the numpy library to create and manipulate arrays.
                                                        </li>
                                                    </ul>
                                                </div> */}
                                            {/* End Feture Box  */}
                                            {/* Start Feture Box  */}
                                            {/* <div className="col-lg-6">
                                                    <ul className="rbt-list-style-1">
                                                        <li>
                                                            <i className="feather-check" />
                                                            Use the Jupyter Notebook Environment. JavaScript developer
                                                            from scratch.
                                                        </li>
                                                        <li>
                                                            <i className="feather-check" />
                                                            Use the pandas module with Python to create and structure
                                                            data.
                                                        </li>
                                                        <li>
                                                            <i className="feather-check" />
                                                            Have a portfolio of various data analysis projects.
                                                        </li>
                                                        <li>
                                                            <i className="feather-check" />
                                                            Create data visualizations using matplotlib and the
                                                            seaborn.
                                                        </li>
                                                    </ul>
                                                </div> */}
                                            {/* End Feture Box  */}
                                            {/* </div> */}

                                        </div>
                                        <div className="rbt-show-more-btn">Show More</div>
                                    </div>
                                    {/* End Course Feature Box  */}
                                    {/* Start Course Content  */}
                                    <div
                                        className="course-content rbt-shadow-box coursecontent-wrapper mt--30"
                                        id="coursecontent"
                                    >
                                        <div className="rbt-course-feature-inner">
                                            <div className="section-title">
                                                <h4 className="rbt-title-style-3">Course Content</h4>
                                            </div>
                                            <div style={{ textAlign: "left" }}>
                                                {parse(this.state.courseListingData?.course_materials || "")}
                                            </div>
                                            {/* <div className="rbt-accordion-style rbt-accordion-02 accordion">
                                                <div className="accordion" id="accordionExampleb2">
                                                    <div className="accordion-item card">
                                                        <h2
                                                            className="accordion-header card-header"
                                                            id="headingTwo1"
                                                        >
                                                            <button
                                                                className="accordion-button"
                                                                type="button"
                                                                data-bs-toggle="collapse"
                                                                data-bs-target="#collapseTwo1"
                                                                aria-expanded="true"
                                                                aria-controls="collapseTwo1"
                                                            >
                                                                Intro to Course and Histudy{" "}
                                                                <span className="rbt-badge-5 ml--10">1hr 30min</span>
                                                            </button>
                                                        </h2>
                                                        <div
                                                            id="collapseTwo1"
                                                            className="accordion-collapse collapse show"
                                                            aria-labelledby="headingTwo1"
                                                            data-bs-parent="#accordionExampleb2"
                                                        >
                                                            <div className="accordion-body card-body pr--0">
                                                                <ul className="rbt-course-main-content liststyle">
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-play-circle" />{" "}
                                                                                <span className="text">Course Intro</span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="min-lable">30 min</span>
                                                                                <span className="rbt-badge variation-03 bg-primary-opacity">
                                                                                    <i className="feather-eye" /> Preview
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-play-circle" />{" "}
                                                                                <span className="text">Watch Before Start</span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="min-lable">0.5 min</span>
                                                                                <span className="rbt-badge variation-03 bg-primary-opacity">
                                                                                    <i className="feather-eye" /> Preview
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-file-text" />{" "}
                                                                                <span className="text">
                                                                                    Read Before You Start
                                                                                </span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="accordion-item card">
                                                        <h2
                                                            className="accordion-header card-header"
                                                            id="headingTwo2"
                                                        >
                                                            <button
                                                                className="accordion-button collapsed"
                                                                type="button"
                                                                data-bs-toggle="collapse"
                                                                data-bs-target="#collapseTwo2"
                                                                aria-expanded="false"
                                                                aria-controls="collapseTwo2"
                                                            >
                                                                Course Fundamentals{" "}
                                                                <span className="rbt-badge-5 ml--10">2hr 30min</span>
                                                            </button>
                                                        </h2>
                                                        <div
                                                            id="collapseTwo2"
                                                            className="accordion-collapse collapse"
                                                            aria-labelledby="headingTwo2"
                                                            data-bs-parent="#accordionExampleb2"
                                                        >
                                                            <div className="accordion-body card-body pr--0">
                                                                <ul className="rbt-course-main-content liststyle">
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-play-circle" />{" "}
                                                                                <span className="text">Course Intro</span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-file-text" />{" "}
                                                                                <span className="text">
                                                                                    Read Before You Start
                                                                                </span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-play-circle" />{" "}
                                                                                <span className="text">
                                                                                    Why You Should Not Go To Education.
                                                                                </span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-file-text" />{" "}
                                                                                <span className="text">
                                                                                    Read Before You Start
                                                                                </span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-play-circle" />{" "}
                                                                                <span className="text">
                                                                                    Ten Factors That Affect Education's Longevity.
                                                                                </span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-file-text" />{" "}
                                                                                <span className="text">
                                                                                    Read Before You Start
                                                                                </span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="accordion-item card">
                                                        <h2
                                                            className="accordion-header card-header"
                                                            id="headingTwo3"
                                                        >
                                                            <button
                                                                className="accordion-button collapsed"
                                                                type="button"
                                                                data-bs-toggle="collapse"
                                                                data-bs-target="#collapseTwo3"
                                                                aria-expanded="false"
                                                                aria-controls="collapseTwo3"
                                                            >
                                                                You can develop skill and setup{" "}
                                                                <span className="rbt-badge-5 ml--10">1hr 50min</span>
                                                            </button>
                                                        </h2>
                                                        <div
                                                            id="collapseTwo3"
                                                            className="accordion-collapse collapse"
                                                            aria-labelledby="headingTwo3"
                                                            data-bs-parent="#accordionExampleb2"
                                                        >
                                                            <div className="accordion-body card-body pr--0">
                                                                <ul className="rbt-course-main-content liststyle">
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-play-circle" />{" "}
                                                                                <span className="text">Course Intro</span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-file-text" />{" "}
                                                                                <span className="text">
                                                                                    Read Before You Start
                                                                                </span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-play-circle" />{" "}
                                                                                <span className="text">
                                                                                    Why You Should Not Go To Education.
                                                                                </span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-file-text" />{" "}
                                                                                <span className="text">
                                                                                    Read Before You Start
                                                                                </span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-play-circle" />{" "}
                                                                                <span className="text">
                                                                                    Ten Factors That Affect Education's Longevity.
                                                                                </span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-file-text" />{" "}
                                                                                <span className="text">
                                                                                    Read Before You Start
                                                                                </span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="accordion-item card">
                                                        <h2
                                                            className="accordion-header card-header"
                                                            id="headingTwo4"
                                                        >
                                                            <button
                                                                className="accordion-button collapsed"
                                                                type="button"
                                                                data-bs-toggle="collapse"
                                                                data-bs-target="#collapseTwo4"
                                                                aria-expanded="false"
                                                                aria-controls="collapseTwo4"
                                                            >
                                                                15 Things To Know About Education?{" "}
                                                                <span className="rbt-badge-5 ml--10">2hr 60min</span>
                                                            </button>
                                                        </h2>
                                                        <div
                                                            id="collapseTwo4"
                                                            className="accordion-collapse collapse"
                                                            aria-labelledby="headingTwo4"
                                                            data-bs-parent="#accordionExampleb2"
                                                        >
                                                            <div className="accordion-body card-body pr--0">
                                                                <ul className="rbt-course-main-content liststyle">
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-play-circle" />{" "}
                                                                                <span className="text">Course Intro</span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-file-text" />{" "}
                                                                                <span className="text">
                                                                                    Read Before You Start
                                                                                </span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-play-circle" />{" "}
                                                                                <span className="text">
                                                                                    Why You Should Not Go To Education.
                                                                                </span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-file-text" />{" "}
                                                                                <span className="text">
                                                                                    Read Before You Start
                                                                                </span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-play-circle" />{" "}
                                                                                <span className="text">
                                                                                    Ten Factors That Affect Education's Longevity.
                                                                                </span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-file-text" />{" "}
                                                                                <span className="text">
                                                                                    Read Before You Start
                                                                                </span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="accordion-item card">
                                                        <h2
                                                            className="accordion-header card-header"
                                                            id="headingTwo5"
                                                        >
                                                            <button
                                                                className="accordion-button collapsed"
                                                                type="button"
                                                                data-bs-toggle="collapse"
                                                                data-bs-target="#collapseTwo5"
                                                                aria-expanded="false"
                                                                aria-controls="collapseTwo5"
                                                            >
                                                                Course Description{" "}
                                                                <span className="rbt-badge-5 ml--10">2hr 20min</span>
                                                            </button>
                                                        </h2>
                                                        <div
                                                            id="collapseTwo5"
                                                            className="accordion-collapse collapse"
                                                            aria-labelledby="headingTwo5"
                                                            data-bs-parent="#accordionExampleb2"
                                                        >
                                                            <div className="accordion-body card-body pr--0">
                                                                <ul className="rbt-course-main-content liststyle">
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-play-circle" />{" "}
                                                                                <span className="text">Course Intro</span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-file-text" />{" "}
                                                                                <span className="text">
                                                                                    Read Before You Start
                                                                                </span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-play-circle" />{" "}
                                                                                <span className="text">
                                                                                    Why You Should Not Go To Education.
                                                                                </span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-file-text" />{" "}
                                                                                <span className="text">
                                                                                    Read Before You Start
                                                                                </span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-play-circle" />{" "}
                                                                                <span className="text">
                                                                                    Ten Factors That Affect Education's Longevity.
                                                                                </span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="lesson.html">
                                                                            <div className="course-content-left">
                                                                                <i className="feather-file-text" />{" "}
                                                                                <span className="text">
                                                                                    Read Before You Start
                                                                                </span>
                                                                            </div>
                                                                            <div className="course-content-right">
                                                                                <span className="course-lock">
                                                                                    <i className="feather-lock" />
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                    {/* End Course Content  */}
                                    {/* Start Course Feature Box  */}
                                    <div
                                        className="rbt-course-feature-box rbt-shadow-box details-wrapper mt--30"
                                        id="details"
                                    >
                                        <div className="row g-5">

                                            {/* Start Feture Box  */}
                                            <div className="col-lg-12">
                                                <div className="section-title">
                                                    <h4 className="rbt-title-style-3 mb--20">Description</h4>
                                                </div>
                                                <div style={{ textAlign: "left" }}>
                                                    {parse(this.state.courseListingData?.description || "")}
                                                </div>
                                            </div>
                                            {/* End Feture Box  */}
                                        </div>
                                    </div>
                                    {/* End Course Feature Box  */}
                                    {/* Start Intructor Area  */}
                                    <div
                                        className="rbt-instructor rbt-shadow-box intructor-wrapper mt--30"
                                        id="intructor"
                                    >
                                        <div className="about-author border-0 pb--0 pt--0">
                                            <div className="section-title mb--30">
                                                <h4 className="rbt-title-style-3">Instructor</h4>
                                            </div>
                                            <div className="media align-items-center">
                                                <div className="thumbnail">
                                                    <a href="#">
                                                        {this.state?.courseListingData?.profile_image ? (<img
                                                            src={`${process.env.REACT_APP_BASEURL}/Uploads/${this.state.courseListingData?.profile_image}`}
                                                            alt="Author Images" />
                                                        ) : (
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    width: "60px", // Adjust as needed
                                                                    height: "60px", // Adjust as needed
                                                                    backgroundColor: "#ccc", // Default background color
                                                                    color: "#fff",
                                                                    borderRadius: "50%",
                                                                    fontWeight: "bold",
                                                                    fontSize: "18px", // Adjust font size as needed
                                                                }}
                                                            >
                                                                {this.getInitials(this.state.courseListingData?.FullName || "User")}
                                                            </div>
                                                        )}
                                                    </a>
                                                </div>
                                                <div className="media-body">
                                                    <div className="author-info">
                                                        <h5 className="title">
                                                            <a className="hover-flip-item-wrapper" href="author.html">
                                                                {this.state.courseListingData?.FullName}
                                                            </a>
                                                        </h5>
                                                        <span className="b3 subtitle">Advanced Educator</span>
                                                        <ul className="rbt-meta mb--20 mt--10">
                                                            <li>
                                                                <i className="fa fa-star color-warning" />
                                                                75,237 Reviews{" "}
                                                                <span className="rbt-badge-5 ml--5">4.4 Rating</span>
                                                            </li>
                                                            <li>
                                                                <i className="feather-users" />
                                                                912,970 Students
                                                            </li>
                                                            <li>
                                                                <a href="#">
                                                                    <i className="feather-video" />
                                                                    16 Courses
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="content">
                                                        <p className="description" >
                                                            {this.state.courseListingData?.FullName} is a brilliant educator
                                                        </p>
                                                        <ul className="social-icon social-default icon-naked justify-content-start">
                                                            <li>
                                                                <a href="https://www.facebook.com/">
                                                                    <i className="feather-facebook" />
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a href="https://www.twitter.com">
                                                                    <i className="feather-twitter" />
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a href="https://www.instagram.com/">
                                                                    <i className="feather-instagram" />
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a href="https://www.linkdin.com/">
                                                                    <i className="feather-linkedin" />
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Intructor Area  */}
                                    {/* Start Edu Review List  */}
                                    <div
                                        className="rbt-review-wrapper rbt-shadow-box review-wrapper mt--30"
                                        id="review"
                                    >
                                        <div className="course-content">
                                            <div className="section-title">
                                                <h4 className="rbt-title-style-3">Review</h4>
                                            </div>
                                            <div className="row g-5 align-items-center">
                                                <div className="col-lg-3">
                                                    <div className="rating-box">
                                                        <div className="rating-number">5.0</div>
                                                        <div className="rating">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width={16}
                                                                height={16}
                                                                fill="currentColor"
                                                                className="bi bi-star-fill"
                                                                viewBox="0 0 16 16"
                                                            >
                                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                            </svg>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width={16}
                                                                height={16}
                                                                fill="currentColor"
                                                                className="bi bi-star-fill"
                                                                viewBox="0 0 16 16"
                                                            >
                                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                            </svg>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width={16}
                                                                height={16}
                                                                fill="currentColor"
                                                                className="bi bi-star-fill"
                                                                viewBox="0 0 16 16"
                                                            >
                                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                            </svg>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width={16}
                                                                height={16}
                                                                fill="currentColor"
                                                                className="bi bi-star-fill"
                                                                viewBox="0 0 16 16"
                                                            >
                                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                            </svg>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width={16}
                                                                height={16}
                                                                fill="currentColor"
                                                                className="bi bi-star-fill"
                                                                viewBox="0 0 16 16"
                                                            >
                                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                            </svg>
                                                        </div>
                                                        <span className="sub-title">Course Rating</span>
                                                    </div>
                                                </div>
                                                <div className="col-lg-9">
                                                    <div className="review-wrapper">
                                                        <div className="single-progress-bar">
                                                            <div className="rating-text">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star-fill"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                                </svg>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star-fill"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                                </svg>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star-fill"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                                </svg>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star-fill"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                                </svg>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star-fill"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                                </svg>
                                                            </div>
                                                            <div className="progress">
                                                                <div
                                                                    className="progress-bar"
                                                                    role="progressbar"
                                                                    style={{ width: "63%" }}
                                                                    aria-valuenow={63}
                                                                    aria-valuemin={0}
                                                                    aria-valuemax={100}
                                                                />
                                                            </div>
                                                            <span className="value-text">63%</span>
                                                        </div>
                                                        <div className="single-progress-bar">
                                                            <div className="rating-text">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star-fill"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                                </svg>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star-fill"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                                </svg>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star-fill"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                                </svg>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star-fill"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                                </svg>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                                                                </svg>
                                                            </div>
                                                            <div className="progress">
                                                                <div
                                                                    className="progress-bar"
                                                                    role="progressbar"
                                                                    style={{ width: "29%" }}
                                                                    aria-valuenow={29}
                                                                    aria-valuemin={0}
                                                                    aria-valuemax={100}
                                                                />
                                                            </div>
                                                            <span className="value-text">29%</span>
                                                        </div>
                                                        <div className="single-progress-bar">
                                                            <div className="rating-text">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star-fill"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                                </svg>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star-fill"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                                </svg>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star-fill"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                                </svg>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                                                                </svg>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                                                                </svg>
                                                            </div>
                                                            <div className="progress">
                                                                <div
                                                                    className="progress-bar"
                                                                    role="progressbar"
                                                                    style={{ width: "6%" }}
                                                                    aria-valuenow={6}
                                                                    aria-valuemin={0}
                                                                    aria-valuemax={100}
                                                                />
                                                            </div>
                                                            <span className="value-text">6%</span>
                                                        </div>
                                                        <div className="single-progress-bar">
                                                            <div className="rating-text">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star-fill"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                                </svg>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star-fill"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                                </svg>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                                                                </svg>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                                                                </svg>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                                                                </svg>
                                                            </div>
                                                            <div className="progress">
                                                                <div
                                                                    className="progress-bar"
                                                                    role="progressbar"
                                                                    style={{ width: "1%" }}
                                                                    aria-valuenow={1}
                                                                    aria-valuemin={0}
                                                                    aria-valuemax={100}
                                                                />
                                                            </div>
                                                            <span className="value-text">1%</span>
                                                        </div>
                                                        <div className="single-progress-bar">
                                                            <div className="rating-text">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star-fill"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                                </svg>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                                                                </svg>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                                                                </svg>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                                                                </svg>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    fill="currentColor"
                                                                    className="bi bi-star"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                                                                </svg>
                                                            </div>
                                                            <div className="progress">
                                                                <div
                                                                    className="progress-bar"
                                                                    role="progressbar"
                                                                    style={{ width: "1%" }}
                                                                    aria-valuenow={1}
                                                                    aria-valuemin={0}
                                                                    aria-valuemax={100}
                                                                />
                                                            </div>
                                                            <span className="value-text">1%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Edu Review List  */}
                                    {/* <div className="about-author-list rbt-shadow-box featured-wrapper mt--30 has-show-more">
                                        <div className="section-title">
                                            <h4 className="rbt-title-style-3">Featured review</h4>
                                        </div>
                                        <div className="has-show-more-inner-content rbt-featured-review-list-wrapper">
                                            <div className="rbt-course-review about-author">
                                                <div className="media">
                                                    <div className="thumbnail">
                                                        <a href="#">
                                                            <img
                                                                src="assets/images/testimonial/testimonial-3.jpg"
                                                                alt="Author Images"
                                                            />
                                                        </a>
                                                    </div>
                                                    <div className="media-body">
                                                        <div className="author-info">
                                                            <h5 className="title">
                                                                <a className="hover-flip-item-wrapper" href="#">
                                                                    Farjana Bawnia
                                                                </a>
                                                            </h5>
                                                            <div className="rating">
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div className="content">
                                                            <p className="description">
                                                                At 29 years old, my favorite compliment is being told
                                                                that I look like my mom. Seeing myself in her image,
                                                                like this daughter up top.
                                                            </p>
                                                            <ul className="social-icon social-default transparent-with-border justify-content-start">
                                                                <li>
                                                                    <a href="#">
                                                                        <i className="feather-thumbs-up" />
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a href="#">
                                                                        <i className="feather-thumbs-down" />
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="rbt-course-review about-author">
                                                <div className="media">
                                                    <div className="thumbnail">
                                                        <a href="#">
                                                            <img
                                                                src="assets/images/testimonial/testimonial-4.jpg"
                                                                alt="Author Images"
                                                            />
                                                        </a>
                                                    </div>
                                                    <div className="media-body">
                                                        <div className="author-info">
                                                            <h5 className="title">
                                                                <a className="hover-flip-item-wrapper" href="#">
                                                                    Razwan Islam
                                                                </a>
                                                            </h5>
                                                            <div className="rating">
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div className="content">
                                                            <p className="description">
                                                                My favorite compliment is being told that I look like my
                                                                mom. Seeing myself in her image, like this daughter up
                                                                top.
                                                            </p>
                                                            <ul className="social-icon social-default transparent-with-border justify-content-start">
                                                                <li>
                                                                    <a href="#">
                                                                        <i className="feather-thumbs-up" />
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a href="#">
                                                                        <i className="feather-thumbs-down" />
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="rbt-course-review about-author">
                                                <div className="media">
                                                    <div className="thumbnail">
                                                        <a href="#">
                                                            <img
                                                                src="assets/images/testimonial/testimonial-1.jpg"
                                                                alt="Author Images"
                                                            />
                                                        </a>
                                                    </div>
                                                    <div className="media-body">
                                                        <div className="author-info">
                                                            <h5 className="title">
                                                                <a className="hover-flip-item-wrapper" href="#">
                                                                    Babor Azom
                                                                </a>
                                                            </h5>
                                                            <div className="rating">
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div className="content">
                                                            <p className="description">
                                                                My favorite compliment is being told that I look like my
                                                                mom. Seeing myself in her image, like this daughter up
                                                                top.
                                                            </p>
                                                            <ul className="social-icon social-default transparent-with-border justify-content-start">
                                                                <li>
                                                                    <a href="#">
                                                                        <i className="feather-thumbs-up" />
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a href="#">
                                                                        <i className="feather-thumbs-down" />
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="rbt-course-review about-author">
                                                <div className="media">
                                                    <div className="thumbnail">
                                                        <a href="#">
                                                            <img
                                                                src="assets/images/testimonial/testimonial-6.jpg"
                                                                alt="Author Images"
                                                            />
                                                        </a>
                                                    </div>
                                                    <div className="media-body">
                                                        <div className="author-info">
                                                            <h5 className="title">
                                                                <a className="hover-flip-item-wrapper" href="#">
                                                                    Mohammad Ali
                                                                </a>
                                                            </h5>
                                                            <div className="rating">
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div className="content">
                                                            <p className="description">
                                                                My favorite compliment is being told that I look like my
                                                                mom. Seeing myself in her image, like this daughter up
                                                                top.
                                                            </p>
                                                            <ul className="social-icon social-default transparent-with-border justify-content-start">
                                                                <li>
                                                                    <a href="#">
                                                                        <i className="feather-thumbs-up" />
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a href="#">
                                                                        <i className="feather-thumbs-down" />
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="rbt-course-review about-author">
                                                <div className="media">
                                                    <div className="thumbnail">
                                                        <a href="#">
                                                            <img
                                                                src="assets/images/testimonial/testimonial-8.jpg"
                                                                alt="Author Images"
                                                            />
                                                        </a>
                                                    </div>
                                                    <div className="media-body">
                                                        <div className="author-info">
                                                            <h5 className="title">
                                                                <a className="hover-flip-item-wrapper" href="#">
                                                                    Sakib Al Hasan
                                                                </a>
                                                            </h5>
                                                            <div className="rating">
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                                <a href="#">
                                                                    <i className="fa fa-star" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div className="content">
                                                            <p className="description">
                                                                My favorite compliment is being told that I look like my
                                                                mom. Seeing myself in her image, like this daughter up
                                                                top.
                                                            </p>
                                                            <ul className="social-icon social-default transparent-with-border justify-content-start">
                                                                <li>
                                                                    <a href="#">
                                                                        <i className="feather-thumbs-up" />
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a href="#">
                                                                        <i className="feather-thumbs-down" />
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rbt-show-more-btn">Show More</div>
                                    </div> */}
                                </div>
                                <div className="related-course mt--60">
                                    <div className="row g-5 align-items-end mb--40">
                                        <div className="col-lg-8 col-md-8 col-12">
                                            <div className="section-title">
                                                <span className="subtitle bg-pink-opacity">Top Course</span>
                                                <h4 className="title">
                                                    More Course By{" "}
                                                    <strong className="color-primary">{this.state.courseListingData?.FullName ? this.state.courseListingData?.FullName : ""}</strong>
                                                </h4>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-12">
                                            <div className="read-more-btn text-start text-md-end">
                                                <a
                                                    className="rbt-btn rbt-switch-btn btn-border btn-sm"
                                                    href={`/Course?user_id=${this.state.courseListingData?.posted_by}`}
                                                >
                                                    <span data-text="View All Course">View All Course</span>
                                                </a>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="row g-5">
                                        {/* Start Single Card  */}
                                        <div
                                            className="col-lg-6 col-md-6 col-sm-6 col-12"
                                            data-sal-delay={150}
                                            data-sal="slide-up"
                                            data-sal-duration={800}
                                        >
                                            <div className="rbt-card variation-01 rbt-hover">
                                                <div className="rbt-card-img">
                                                    <a href="course-details.html">
                                                        <img
                                                            src="assets/images/course/course-online-01.jpg"
                                                            alt="Card image"
                                                        />
                                                        <div className="rbt-badge-3 bg-white">
                                                            <span>-40%</span>
                                                            <span>Off</span>
                                                        </div>
                                                    </a>
                                                </div>
                                                <div className="rbt-card-body">
                                                    <div className="rbt-card-top">
                                                        <div className="rbt-review">
                                                            <div className="rating">
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                            </div>
                                                            <span className="rating-count"> (15 Reviews)</span>
                                                        </div>
                                                        <div className="rbt-bookmark-btn">
                                                            <a className="rbt-round-btn" title="Bookmark" href="#">
                                                                <i className="feather-bookmark" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <h4 className="rbt-card-title">
                                                        <a href="course-details.html">React Front To Back</a>
                                                    </h4>
                                                    <ul className="rbt-meta">
                                                        <li>
                                                            <i className="feather-book" />
                                                            12 Lessons
                                                        </li>
                                                        <li>
                                                            <i className="feather-users" />
                                                            50 Students
                                                        </li>
                                                    </ul>
                                                    <p className="rbt-card-text">
                                                        It is a long established fact that a reader will be
                                                        distracted.
                                                    </p>
                                                    <div className="rbt-author-meta mb--10">
                                                        <div className="rbt-avater">
                                                            <a href="#">
                                                                <img
                                                                    src="assets/images/client/avatar-02.png"
                                                                    alt="Sophia Jaymes"
                                                                />
                                                            </a>
                                                        </div>
                                                        <div className="rbt-author-info">
                                                            By <a href="profile.html">Angela</a> In{" "}
                                                            <a href="#">Development</a>
                                                        </div>
                                                    </div>
                                                    <div className="rbt-card-bottom">
                                                        <div className="rbt-price">
                                                            <span className="current-price">$60</span>
                                                            <span className="off-price">$120</span>
                                                        </div>
                                                        <a className="rbt-btn-link" href="course-details.html">
                                                            Learn More
                                                            <i className="feather-arrow-right" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* End Single Card  */}
                                        {/* Start Single Card  */}
                                        <div
                                            className="col-lg-6 col-md-6 col-sm-6 col-12"
                                            data-sal-delay={150}
                                            data-sal="slide-up"
                                            data-sal-duration={800}
                                        >
                                            <div className="rbt-card variation-01 rbt-hover">
                                                <div className="rbt-card-img">
                                                    <a href="course-details.html">
                                                        <img
                                                            src="assets/images/course/course-online-02.jpg"
                                                            alt="Card image"
                                                        />
                                                    </a>
                                                </div>
                                                <div className="rbt-card-body">
                                                    <div className="rbt-card-top">
                                                        <div className="rbt-review">
                                                            <div className="rating">
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                            </div>
                                                            <span className="rating-count"> (15 Reviews)</span>
                                                        </div>
                                                        <div className="rbt-bookmark-btn">
                                                            <a className="rbt-round-btn" title="Bookmark" href="#">
                                                                <i className="feather-bookmark" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <h4 className="rbt-card-title">
                                                        <a href="course-details.html">PHP Beginner Advanced</a>
                                                    </h4>
                                                    <ul className="rbt-meta">
                                                        <li>
                                                            <i className="feather-book" />
                                                            12 Lessons
                                                        </li>
                                                        <li>
                                                            <i className="feather-users" />
                                                            50 Students
                                                        </li>
                                                    </ul>
                                                    <p className="rbt-card-text">
                                                        It is a long established fact that a reader will be
                                                        distracted.
                                                    </p>
                                                    <div className="rbt-author-meta mb--10">
                                                        <div className="rbt-avater">
                                                            <a href="#">
                                                                <img
                                                                    src="assets/images/client/avatar-02.png"
                                                                    alt="Sophia Jaymes"
                                                                />
                                                            </a>
                                                        </div>
                                                        <div className="rbt-author-info">
                                                            By <a href="profile.html">Angela</a> In{" "}
                                                            <a href="#">Development</a>
                                                        </div>
                                                    </div>
                                                    <div className="rbt-card-bottom">
                                                        <div className="rbt-price">
                                                            <span className="current-price">$60</span>
                                                            <span className="off-price">$120</span>
                                                        </div>
                                                        <a
                                                            className="rbt-btn-link left-icon"
                                                            href="course-details.html"
                                                        >
                                                            <i className="feather-shopping-cart" /> Add To Cart
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* End Single Card  */}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="course-sidebar sticky-top rbt-shadow-box course-sidebar-top rbt-gradient-border" style={{ zIndex: 1 }}>
                                    <div className="inner">
                                        {/* Start Viedo Wrapper  */}
                                        <a
                                            className="video-popup-with-text video-popup-wrapper text-center popup-video sidebar-video-hidden mb--15"
                                            href="https://www.youtube.com/watch?v=nA1Aqp0sPQo"
                                        >
                                            {/* <div className="video-content">
                                                                                        <img
                                                                                            className="w-100 rbt-radius"
                                                                                            src="assets/images/others/video-01.jpg"
                                                                                            alt="Video Images"
                                                                                        />
                                                                                        <div className="position-to-top">
                                                                                            <span className="rbt-btn rounded-player-2 with-animation">
                                                                                                <span className="play-icon" />
                                                                                            </span>
                                                                                        </div>
                                                                                        <span className="play-view-text d-block color-white">
                                                                                            <i className="feather-eye" /> Preview this course
                                                                                        </span>
                                                                                    </div> */}
                                        </a>
                                        {/* End Viedo Wrapper  */}
                                        <div className="content-item-content">
                                            <div className="rbt-price-wrapper d-flex flex-wrap align-items-center justify-content-between">
                                                <div className="rbt-price">
                                                    <span className="current-price">{this.state.courseListingData?.currency ? this.state.courseListingData?.currency + '-' + this.state.courseListingData?.course_fees : this.state.courseListingData?.course_fees}</span>
                                                    { /* <span className="off-price">$84.99</span> */}
                                                </div>
                                                <div className="discount-time">
                                                    <span className="rbt-badge color-danger bg-color-danger-opacity">
                                                        <i className="feather-clock" /> {Math.max(0, Math.ceil((new Date(this.state.courseListingData?.startdate) - new Date()) / (1000 * 60 * 60 * 24)))} days left!
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="subtitle">
                                                <i className="feather-rotate-ccw" /> Qualifies for 50% refund
                                            </span>
                                            <div className="rbt-widget-details has-show-more">
                                                <ul className="has-show-more-inner-content rbt-course-details-list-wrapper">
                                                    <li>
                                                        <span>Start Date</span>
                                                        <span className="rbt-feature-value rbt-badge-5">
                                                            <span>{formatDate(this.state.courseListingData?.startdate)}</span>
                                                        </span>
                                                    </li>
                                                    <li>
                                                        <span>Enrolled</span>
                                                        <span className="rbt-feature-value rbt-badge-5">100</span>
                                                    </li>
                                                    <li>
                                                        <span>Lectures</span>
                                                        <span className="rbt-feature-value rbt-badge-5">{this.state.courseListingData?.no_of_lessons}</span>
                                                    </li>
                                                    <li>
                                                        <span>Skill Level</span>
                                                        <span className="rbt-feature-value rbt-badge-5">{this.state.courseListingData?.course_level_name}</span>
                                                    </li>
                                                    <li>
                                                        <span>Language</span>
                                                        <span className="rbt-feature-value rbt-badge-5">
                                                            English
                                                        </span>
                                                    </li>
                                                </ul>
                                                <div className="rbt-show-more-btn">Show More</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="video-content">
                                                <img
                                                    className="w-100 rbt-radius"
                                                    src="assets/images/others/video-01.jpg"
                                                    alt="Video Images"
                                                />
                                                <div className="position-to-top">
                                                    <span className="rbt-btn rounded-player-2 with-animation">
                                                        <span className="play-icon" />
                                                    </span>
                                                </div>
                                                <span className="play-view-text d-block color-white">
                                                    <i className="feather-eye" /> Preview this course
                                                </span>
                                            </div> */}

                                {/* End Viedo Wrapper  */}
                                <div className="content-item-content">
                                    <div className="rbt-price-wrapper d-flex flex-wrap align-items-center justify-content-between">
                                        <div className="rbt-price">
                                            <span className="current-price">{this.state.courseListingData?.currency ? this.state.courseListingData?.currency + '-' + this.state.courseListingData?.course_fees : this.state.courseListingData?.course_fees}</span>
                                            { /* <span className="off-price">$84.99</span> */}
                                        </div>
                                        <div className="discount-time">
                                            <span className="rbt-badge color-danger bg-color-danger-opacity">
                                                <i className="feather-clock" /> {Math.max(0, Math.ceil((new Date(this.state.courseListingData?.startdate) - new Date()) / (1000 * 60 * 60 * 24)))} days left!
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>







            </>
        );
    }
}

export default withNavigation(CourseDetails);