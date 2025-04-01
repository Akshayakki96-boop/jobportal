import React from 'react';
import Header from '../Header/header';
import axios from 'axios';
import parse from 'html-react-parser';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';


// import required modules
import { EffectCards, Pagination } from 'swiper/modules';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dashBoardData: {},
            joblistingdata: [],
            currentPage: 1, // Tracks the current page
            pageSize: 4, // Number of records per page
            totalPages: 1,
            totalRecords: 0, // Total number of records
            showLoadMore: true,
            showJobMore: true
        };

    }
    componentDidMount() {
        this.getDashboardUser();
        this.getAllJobs(0,3);
        this.getAllCourse(0, 3);
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
                this.setState({ dashBoardData: "" });
                localStorage.removeItem('authToken');

            });
    }

    getAllJobs = (pageIndex, pageSize) => {
        this.setState({ keepSpinner: true });
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Job/GetJobs`;
        const token = localStorage.getItem('authToken');
        var request = {
            "jobId": 0,
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
            "active": true,
            "user_id": 0,
            "cityIds": "1,2",
            pageIndex: pageIndex,
            pagesize: pageSize,
        }
        axios.post(url, request, {
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('joblistingdata', response.data);
                if (response.data.data && response.data.data.length > 0) {
                    const totalCount = response.data.data[0].TotalRecords;
                    this.setState({ joblistingdata: response.data.data, totalJobRecords: totalCount, errorMessage: "", keepSpinner: false });
                }
                else {
                    this.setState({ errorMessage: "No Jobs Found", keepSpinner: false });
                }

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });

    }


    getAllCourse = (pageIndex, pageSize) => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Course/GetCourse`;
        //const token = localStorage.getItem('authToken');
        var request =
        {
            "courseId": 0,
            "coursetitle": "",
            "isactive": true,
            "user_id": 0,
            "pageIndex": pageIndex,
            "pagesize": pageSize
        }


        axios.post(url, request, {
            headers: {
                'Content-Type': 'application/json',
                //Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('courseListingDataheader', response.data);
                if (response.data.data && response.data.data.length > 0) {
                    const totalCount = response.data.data[0].TotalRecords;
                    this.setState({ courseListingData: response.data.data, totalRecords: totalCount, keepSpinner: false });

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


    getInitials = (name) => {
        if (!name) return "U"; // Default to "U" if name is not provided

        const parts = name.trim().split(" "); // Trim to remove extra spaces

        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase() // Two initials
            : parts[0][0].toUpperCase(); // Single initial
    };
    loadMoreCourses = (e) => {
        e.preventDefault();
        this.setState({ showLoadMore: false });
        this.getAllCourse(0, this.state.totalRecords);
    };

    seeLessCourses = (e) => {
        e.preventDefault();
        this.setState({ showLoadMore: true });
        const limitedCourses = this.state.courseListingData.slice(0, 3);
        this.setState({ courseListingData: limitedCourses });
        //this.getAllCourse(0, this.state.totalRecords);
    }

    loadMoreJobs = (e) => {
        e.preventDefault();
        this.setState({ showJobMore: false });
        this.getAllJobs(0, this.state.totalJobRecords);
    }

    seeLessJobs = (e) => {
        e.preventDefault();
        this.setState({ showJobMore: true });
        const limitedJobs = this.state.joblistingdata.slice(0, 3);
        this.setState({ joblistingdata: limitedJobs });
        //this.getAllCourse(0, this.state.totalRecords);
    }
    
    render() {
        const maskMobileNumber = (number) => {
            return number.replace(/\d(?=\d{4})/g, 'X');
        };
        const maskEmail = (email) => {
            return email.replace(/.(?=.*@)/g, "*");

        };

        return (
            <>
                <Header dashBoardData={this.state.dashBoardData} />
                <div className="rbt-banner-area rbt-banner-1">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-12 pb--120 pt--10">
                                <div className="content">
                                    <div className="inner">
                                        <div className="slider-btn">
                                            <a className="rbt-btn btn-gradient hover-icon-reverse" href="/course">
                                                <span className="icon-reverse-wrapper">
                                                    <span className="btn-text">Start Your Training</span>
                                                    <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                                                    <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                                                </span>
                                            </a>&nbsp;
                                            <a className="rbt-btn btn-gradient hover-icon-reverse" href="/jobs">
                                                <span className="icon-reverse-wrapper">
                                                    <span className="btn-text">Explore Your Dream Job</span>
                                                    <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                                                    <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                                                </span>
                                            </a>
                                        </div>
                                        <h1 className="title">
                                            Welcome to Zobskill
                                        </h1>
                                        <h5>Marketplace for Training & Jobs</h5>
                                        <p className="description">
                                            We specialize in offering high-quality courses and connecting you with top employers across industries. Whether you're preparing for career opportunities or exploring diverse training programs, ZobSkill is here to guide your journey.
                                        </p>

                                    </div>
                                    <div className="shape-wrapper" id="scene">
                                        <img src="assets/images/banner/banner-01.png" alt="Hero Image" />
                                        <div className="hero-bg-shape-1 layer" data-depth="0.4">
                                            <img src="assets/images/shape/shape-01.png" alt="Hero Image Background Shape" />
                                        </div>
                                        <div className="hero-bg-shape-2 layer" data-depth="0.4">
                                            <img src="assets/images/shape/shape-02.png" alt="Hero Image Background Shape" />
                                        </div>
                                    </div>

                                    <div className="banner-card pb--60 mb--50 swiper rbt-dot-bottom-center banner-swiper-active">
                                        <Swiper
                                            effect={"cards"}
                                            grabCursor={true}
                                            pagination={{ clickable: true }}
                                            modules={[EffectCards, Pagination]}
                                            spaceBetween={30}
                                            centeredSlides={true}
                                            slidesPerView={1}
                                            className="mySwiper"
                                        >
                                            {this.state.courseListingData && this.state.courseListingData.length > 0 ? (
                                                this.state.courseListingData.map((course, index) => (
                                                    <SwiperSlide style={{ width: "400px", height: "auto" }} key={index}>
                                                        <div className="rbt-card variation-01 rbt-hover">
                                                            <div className="rbt-card-img min-height">
                                                                <a href={`/Course-Details?courseId=${course.courseid}`}>
                                                                    <img src={course.course_image ? `${process.env.REACT_APP_BASEURL}/Uploads/${course.course_image}` : "assets/images/job-zob-img.jpg"}// Use a default image if companylogo is missing 
                                                                        alt="Card" />
                                                                    <div style={{ width: "76px" }} className="rbt-badge-3 bg-white">
                                                                        <span>Applicable</span>
                                                                        <span>for refund</span>
                                                                    </div>
                                                                    {/* <div className="rbt-badge-3 bg-white">
                                        <span>-40%</span>
                                        <span>Off</span>
                                    </div> */}
                                                                </a>
                                                            </div>
                                                            <div className="rbt-card-body">
                                                                <ul className="rbt-meta">
                                                                    <li><i className="fa fa-book"></i> {course.no_of_lessons} Lessons</li>
                                                                    <li><i className="fa fa-users"></i> {course.applied_candidate_count} Students</li>
                                                                </ul>
                                                                <h4 className="rbt-card-title">
                                                                    <a href={`/Course-Details?courseId=${course.courseid}`}>{course.coursetitle}</a>
                                                                </h4>
                                                                {/* <p className="rbt-card-text">
                                                                    {parse(
                                                                        course.description.split(" ").length > 20
                                                                            ? course.description.split(" ").slice(0, 20).join(" ") + "..."
                                                                            : course.description
                                                                    )}
                                                                </p> */}
                                                                <div className="rbt-review">
                                                                    <div className="rating">
                                                                        {[...Array(course.rating)].map((_, i) => <i key={i} className="fa fa-star"></i>)}
                                                                    </div>
                                                                    <span className="rating-count"> Reviews</span>
                                                                </div>
                                                                <div className="rbt-card-bottom">
                                                                    <div className="rbt-price">
                                                                        <span className="current-price">{course.currency ? course.currency + '-' + course.course_fees : course.course_fees}</span>
                                                                        {/* <span className="off-price">${course.offPrice}</span> */}
                                                                    </div>
                                                                    <a className="rbt-btn-link" href={`/Course-Details?courseId=${course.courseid}`}>
                                                                        Learn More <i className="fa fa-arrow-right"></i>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                ))
                                            ) : (
                                                [1, 2, 3].map((_, index) => (
                                                    <SwiperSlide style={{ width: "400px", height: "auto" }} key={index}>
                                                        <div className="rbt-card variation-01 rbt-hover">
                                                            <div className="rbt-card-img min-height">
                                                                <a href="course-details.html">
                                                                    <img src={`assets/images/course/course-0${index + 1}.jpg`} alt="Card" />
                                                                    <div style={{ width: "76px" }} className="rbt-badge-3 bg-white">
                                                                        <span>Applicable</span>
                                                                        <span>for refund</span>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                            <div className="rbt-card-body">
                                                                <ul className="rbt-meta">
                                                                    <li><i className="fa fa-book"></i> 12 Lessons</li>
                                                                    <li><i className="fa fa-users"></i> 50 Students</li>
                                                                </ul>
                                                                <h4 className="rbt-card-title">
                                                                    <a href="course-details.html">React</a>
                                                                </h4>
                                                                <p className="rbt-card-text">It is a long established fact that a reader will be distracted.</p>
                                                                <div className="rbt-review">
                                                                    <div className="rating">
                                                                        {[...Array(5)].map((_, i) => <i key={i} className="fa fa-star"></i>)}
                                                                    </div>
                                                                    <span className="rating-count"> Reviews</span>
                                                                </div>
                                                                <div className="rbt-card-bottom">
                                                                    <div className="rbt-price">
                                                                        <span className="current-price">$70</span>
                                                                        <span className="off-price">$120</span>
                                                                    </div>
                                                                    <a className="rbt-btn-link" href="course-details.html">
                                                                        Learn More <i className="fa fa-arrow-right"></i>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                ))
                                            )}
                                        </Swiper>
                                        <div className="rbt-swiper-pagination"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Other sections */}
                </div>
                <div className="rbt-categories-area bg-color-white rbt-section-gapBottom">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="section-title text-center">
                                    <span className="subtitle bg-primary-opacity">CATEGORIES</span>
                                    <h2 className="title">Train, Certify, Get Hired</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row row--15 mt_dec--30 mt--20">
                            {/* Start Service Grid */}
                                                        <div className="col-lg-4 col-xl-3 col-xxl-3 col-md-6 col-sm-6 col-12 mt--30">
                                                            <a href="/jobs">
                                                                <div className="rbt-cat-box rbt-cat-box-1 service-card service-card-6">
                                                                    <div className="inner background">
                                                                        <div className="icon">
                                                                            <img src="assets/images/icons/001-bulb.png" alt="icons Images" />
                                                                        </div>
                                                                        <div className="content">
                                                                            <h6 className="title">Unlock Opportunities – 100+ Jobs Await You!</h6>
                                                                            <p className="description">Explore verified listings across industries and apply with confidence.</p>
                                                                        </div>
                                                                        {/* <span className="number-text">1</span> */}
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        </div>
                                                        {/* End Service Grid */}
                            {/* Start Service Grid */}
                            <div className="col-lg-4 col-xl-3 col-xxl-3 col-md-6 col-sm-6 col-12 mt--30">
                            <a href="/employer">
                                <div className="rbt-cat-box rbt-cat-box-1 service-card service-card-6">
                                    <div className="inner background1">
                                        <div className="icon">
                                            <img src="assets/images/icons/002-hat.png" alt="Shape Images" />
                                        </div>
                                        <div className="content">
                                            <h6 className="title">Free Job Posting – Start Hiring Now!</h6>
                                            <p className="description">Post openings at no cost and connect with the best talent effortlessly.</p>
                                        </div>
                                        {/* <span className="number-text">2</span> */}
                                    </div>
                                </div>
                                </a>
                            </div>
                            {/* End Service Grid */}
                            {/* Start Service Grid */}
                            <div className="col-lg-4 col-xl-3 col-xxl-3 col-md-6 col-sm-6 col-12 mt--30">
                            <a href="/candidate">
                                <div className="rbt-cat-box rbt-cat-box-1 service-card service-card-6">
                                    <div className="inner background2">
                                        <div className="icon">
                                            <img src="assets/images/icons/003-id-card.png" alt="Shape Images" />
                                        </div>
                                        <div className="content">
                                            <h6 className="title">100% Refund on Training & Job placement (T&C Apply)</h6>
                                            <p className="description">We prioritize your satisfaction with our flexible refund policy.</p>
                                        </div>
                                        {/* <span className="number-text">3</span> */}
                                    </div>
                                </div>
                                </a>
                            </div>
                            {/* End Service Grid */}
                            {/* Start Service Grid */}
                            <div className="col-lg-4 col-xl-3 col-xxl-3 col-md-6 col-sm-6 col-12 mt--30">
                            <a href="/trainer">
                                <div className="rbt-cat-box rbt-cat-box-1 service-card service-card-6">
                                    <div className="inner background3">
                                        <div className="icon">
                                            <img src="assets/images/icons/004-pass.png" alt="Shape Images" />
                                        </div>
                                        <div className="content">
                                            <h6 className="title">Trainer Incentives for Excellence</h6>
                                            <p className="description">Trainers earn incentives for every candidate who passes their relevant exam.</p>
                                        </div>
                                        {/* <span className="number-text">4</span> */}
                                    </div>
                                </div>
                                </a>
                            </div>
                            {/* End Service Grid */}
                        </div>
                    </div>
                </div>
                <div className="rbt-about-area bg-color-white rbt-section-gapTop pb_md--80 pb_sm--80 about-style-1">
                    <div className="container">
                        <div className="row g-5 align-items-center">
                            <div className="col-lg-6">
                                <div className="thumbnail-wrapper">
                                    <div className="thumbnail image-1">
                                        <img data-parallax='{"x": 0, "y": -20}' src="assets/images/about/about-01.png" alt="Education Images" />
                                    </div>
                                    <div className="thumbnail image-2 d-none d-xl-block">
                                        <img data-parallax='{"x": 0, "y": 60}' src="assets/images/about/about-02.png" alt="Education Images" />
                                    </div>
                                    <div className="thumbnail image-3 d-none d-md-block">
                                        <img data-parallax='{"x": 0, "y": 80}' src="assets/images/about/about-03.png" alt="Education Images" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="inner pl--50 pl_sm--0 pl_md--0">
                                    <div className="section-title text-start">
                                        <span className="subtitle bg-coral-opacity">About Zobskill</span>
                                        <h3 className="title">Zobskill – Where Learning Meets Opportunity!</h3>
                                    </div>
                                    <p style={{ textAlign: 'left' }} className="description mt--30">
                                        At Zobskill, we believe that the right skills can change lives. Whether you're looking to upgrade your expertise, earn a certification, or land a job you love, we’re here to make it happen.
                                    </p>
                                    <p style={{ textAlign: 'left' }}>
                                        Think of us as your career partner—helping you at every step, from learning in-demand skills to connecting you with real job opportunities. And the best part?<strong> We reward your success! When you pass your certification exam and secure a job through Zobskill, you get 100% of your training fees refunded. (T&C Apply)</strong>
                                    </p>
                                    <div style={{ textAlign: 'left' }}>
                                        <strong>Why Zobskill?</strong>
                                    </div>
                                    <p style={{ textAlign: 'left' }}>
                                        <ul>
                                            <li>
                                                Learn from the best – Industry-leading trainers & real-world skills.
                                            </li>
                                            <li>
                                                Get certified, get hired – Employers prefer job-ready professionals
                                            </li>
                                            <li>
                                                Earn as you teach – Trainers get incentives when students succeed.
                                            </li>
                                            <li>
                                                Join a thriving community – Mentors, trainers & recruiters helping each other grow.
                                            </li>
                                            <li>
                                                Your career journey starts here. Ready to take the next step?
                                            </li>
                                        </ul>
                                    </p>
                                    <div style={{ textAlign: 'left', fontWeight: "300" }}><a href='/login'>Join Zobskill today!</a></div>

                                    <div className="about-btn mt--40">
                                        <a className="rbt-btn btn-gradient hover-icon-reverse" href="/aboutus">
                                            <span className="icon-reverse-wrapper">
                                                <span className="btn-text">Know More</span>
                                                <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                                                <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rbt-course-area bg-color-extra2 rbt-section-gap">
                    <div className="container">
                        <div className="row mb--60">
                            <div className="col-lg-12">
                                <div className="section-title text-center">
                                    <span className="subtitle bg-secondary-opacity">Top Popular Course</span>
                                    <h2 className="title">Zobskill Course student <br /> can join with us.</h2>
                                </div>
                            </div>
                        </div>
                        { /* Start Card Area */}
                        <div className="row g-5">
                            {this.state.courseListingData && this.state.courseListingData.length > 0 ? (
                                this.state.courseListingData.map((course, index) => (
                                    <div className="col-lg-4 col-md-6 col-12" key={index}>
                                        <div className="rbt-card variation-01 rbt-hover">
                                            <div className="rbt-card-img  min-height">
                                                <a href={`/Course-Details?courseId=${course.courseid}`}>
                                                    <img src={course.course_image ? `${process.env.REACT_APP_BASEURL}/Uploads/${course.course_image}` : "assets/images/course/course-01.jpg"} alt="Card image" />
                                                    <div style={{ width: "76px" }} className="rbt-badge-3 bg-white">
                                                        <span>Applicable</span>
                                                        <span>for refund</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div className="rbt-card-body">
                                                <div className="rbt-card-top">
                                                    <div className="rbt-review">
                                                        <div className="rating">
                                                            {[...Array(course.rating)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
                                                        </div>
                                                        <span className="rating-count">{course.reviews} Reviews</span>
                                                    </div>
                                                    <div className="rbt-bookmark-btn">
                                                        <a className="rbt-round-btn" title="Bookmark" href="#">
                                                            <i className="feather-bookmark"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <h4 className="rbt-card-title">
                                                    <a href={`/Course-Details?courseId=${course.courseid}`}>{course.coursetitle}</a>
                                                </h4>
                                                <ul className="rbt-meta">
                                                    <li><i className="feather-book"></i>{course.no_of_lessons} Lessons</li>
                                                    <li><i className="feather-users"></i>{course.applied_candidate_count} Students</li>
                                                </ul>
                                                {/* <p className="rbt-card-text">
                                                    {parse(
                                                        course.description.split(" ").length > 20
                                                            ? course.description.split(" ").slice(0, 20).join(" ") + "..."
                                                            : course.description
                                                    )}
                                                </p> */}

                                                <div className="rbt-author-meta mb--20">
                                                    <div className="rbt-avater">
                                                        <a href="#">
                                                            {course.profile_image ? (<img
                                                                src={`${process.env.REACT_APP_BASEURL}/Uploads/${course.profile_image}`}
                                                                alt={course.FullName}
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
                                                                    {this.getInitials(course.FullName || "User")}
                                                                </div>
                                                            )}
                                                        </a>
                                                    </div>
                                                    <div className="rbt-author-info">
                                                        By {course.FullName}
                                                        {/* <a href="#">Development</a> */}
                                                    </div>
                                                </div>
                                                <div className="rbt-card-bottom">
                                                    <div className="rbt-price">
                                                        <span className="current-price">{course.currency ? course.currency + '-' + course.course_fees : course.course_fees}</span>
                                                        {/* <span className="off-price">$120</span> */}
                                                    </div>
                                                    <a className="rbt-btn-link" href={`/Course-Details?courseId=${course.courseid}`}>
                                                        Learn More<i className="feather-arrow-right"></i>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 mt--30">
                                    <div className="alert alert-warning" role="alert">
                                        No Courses Found
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* End Card Area */}
                        {this.state?.totalRecords > 3 && <div className="row">
                            <div className="col-lg-12">
                                <div className="load-more-btn mt--60 text-center">
                                    {this.state.showLoadMore ? (
                                        <a className="rbt-btn btn-gradient btn-lg hover-icon-reverse" href="#" onClick={this.loadMoreCourses}>
                                            <span className="icon-reverse-wrapper">
                                                <span className="btn-text">Load More Courses</span>
                                                <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                                                <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                                            </span>
                                        </a>
                                    ) : (
                                        <a className="rbt-btn btn-gradient btn-lg hover-icon-reverse" href="#" onClick={this.seeLessCourses}>
                                            <span className="icon-reverse-wrapper">
                                                <span className="btn-text">See less</span>
                                                <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                                                <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                                            </span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                        }

                    </div>
                    {/* <div className="rbt-callto-action-area mt_dec--half rbt-section-gap">
                    <div className="container">
                        <div className="row g-5">
                            <div className="col-lg-6">
                                <div className="rbt-callto-action callto-action-default bg-color-white rbt-radius shadow-1">
                                    <div className="row align-items-center">
                                        <div className="col-lg-12 col-xl-5">
                                            <div className="inner">
                                                <div className="rbt-category mb--20">
                                                    <a href="#">New Collection</a>
                                                </div>
                                                <h4 className="title mb--15">Online Courses from Zobskill</h4>
                                                <p className="mb--15">Top instructors from around the world</p>
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-xl-7">
                                            <div className="video-popup-wrapper mt_lg--10 mt_md--20 mt_sm--20">
                                                <img className="w-100 rbt-radius" src="assets/images/others/video-01.jpg" alt="Video Images" />
                                                <a
                                                    className="rbt-btn rounded-player-2 sm-size popup-video position-to-top with-animation"
                                                    href="https://www.youtube.com/watch?v=nA1Aqp0sPQo"
                                                >
                                                    <span className="play-icon"></span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="rbt-callto-action callto-action-default bg-color-white rbt-radius shadow-1">
                                    <div className="row align-items-center">
                                        <div className="col-lg-12">
                                            <div className="inner">
                                                <div className="rbt-category mb--20">
                                                    <a href="#">Top Teacher</a>
                                                </div>
                                                <h4 className="title mb--10">Free Online Courses from Zobskill School To Education</h4>
                                                <p className="mb--15">Top instructors from around the world</p>
                                                <div className="read-more-btn">
                                                    <a className="rbt-btn rbt-switch-btn btn-gradient btn-sm" href="#">
                                                        <span data-text="Join Now">Join Now</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
                    <div className="rbt-rbt-card-area rbt-section-gap bg-color-white" style={{ marginTop: '140px' }}>
                        <div className="container">
                            <div className="row mb--60">
                                <div className="col-lg-12">
                                    <div className="section-title text-center">
                                        <span className="subtitle bg-secondary-opacity">Top Popular Jobs</span>
                                        <h2 className="title">Current Openings on Zobskill</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="row row--15">
                                {this.state.joblistingdata && this.state.joblistingdata.length > 0 ? (
                                    this.state.joblistingdata.map((job, index) => (
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 mt--30" style={{ width: "50%" }} key={index}>
                                            <div className="rbt-card variation-01 rbt-hover card-list-2">
                                                {job.companylogo ? (
                                                    <div className="rbt-card-img">
                                                        <a href="#">
                                                            <img src={job.companylogo ? `${process.env.REACT_APP_BASEURL}/Uploads/${job.companylogo}` : "assets/images/job-zob-img.jpg"} />
                                                        </a>
                                                    </div>) : (
                                                    <div className="rbt-card-img company-logo-name">
                                                        <h2>{this.getInitials(job.CompanyName)}</h2></div>
                                                )}
                                                <div className="rbt-card-body">
                                                    <div className="rbt-card-top">
                                                        <div className="rbt-category">
                                                            <a href="#">{job.empType || "Employment Type"}</a>
                                                        </div>
                                                    </div>
                                                    <h4 className="rbt-card-title">
                                                        <a href={`/job-decription?jobId=${job.jobid}`}>{job.jobtitle || "Job Title Unavailable"}</a>
                                                    </h4>
                                                    <ul className="rbt-meta">
                                                        <li><i className="fas fa-building"></i> {job.CompanyName}</li>
                                                        <li><i className="fas fa-map-marker-alt"></i> {job.locations}</li>
                                                    </ul>
                                                    <div className="rbt-card-bottom">
                                                        <div className="rbt-price">
                                                            <span className="current-price"><i className="fas fa-rupee-sign"></i> {job.package_notdisclosed ? "Package not disclosed" : `${job.packagefrom}L - ${job.packageto || "N/A"}L`}</span>
                                                        </div>
                                                        <a className="rbt-btn-link" href={localStorage.getItem('authToken') ? `/Job-details?jobId=${job.jobid}` : `/job-decription?jobId=${job.jobid}`}>
                                                            Learn More<i className="feather-arrow-right"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12 mt--30">
                                        <div className="alert alert-warning" role="alert">
                                            No Jobs Found
                                        </div>
                                    </div>
                                )}
                            </div>
                            {this.state?.totalJobRecords > 3 && <div className="row">
                            <div className="col-lg-12">
                                <div className="load-more-btn mt--60 text-center">
                                    {this.state.showJobMore ? (
                                        <a className="rbt-btn btn-gradient btn-lg hover-icon-reverse" href="#" onClick={this.loadMoreJobs}>
                                            <span className="icon-reverse-wrapper">
                                                <span className="btn-text">Load More Jobs</span>
                                                <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                                                <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                                            </span>
                                        </a>
                                    ) : (
                                        <a className="rbt-btn btn-gradient btn-lg hover-icon-reverse" href="#" onClick={this.seeLessJobs}>
                                            <span className="icon-reverse-wrapper">
                                                <span className="btn-text">See less</span>
                                                <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                                                <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                                            </span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                        }
                        </div>
                    </div>
                    <div className="rbt-brand-area bg-color-white rbt-section-gap">
                        <div className="container">
                            <div className="row align-items-center g-5">
                                <div className="col-lg-3">
                                    <div style={{ textAlign: "left" }} className="brand-content-left">
                                        <h4 className="mb--0">Our Trusted Featured Employers</h4>
                                    </div>
                                </div>
                                <div className="col-lg-9">
                                    <ul className="brand-list brand-style-2 justify-content-center justify-content-lg-between">
                                        <li><a href="#"><img src="assets/images/brand/brand-01.png" alt="Brand Image" /></a></li>
                                        <li><a href="#"><img src="assets/images/brand/brand-02.png" alt="Brand Image" /></a></li>
                                        <li><a href="#"><img src="assets/images/brand/brand-03.png" alt="Brand Image" /></a></li>
                                        <li><a href="#"><img src="assets/images/brand/brand-04.png" alt="Brand Image" /></a></li>
                                        <li><a href="#"><img src="assets/images/brand/brand-05.png" alt="Brand Image" /></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rbt-team-area bg-color-white rbt-section-gap">
                        <div className="container">
                            <div className="row mb--60">
                                <div className="col-lg-12">
                                    <div className="section-title text-center">
                                        {/* <span className="subtitle bg-primary-opacity">Zobskill Mentors</span>
                                    <h2 className="title">Who Inspires You</h2> */}
                                        <h2 className="title">Zobskill Mentors</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-5">
                                <div className="col-lg-7">
                                    {/* Start Tab Content */}
                                    <div className="rbt-team-tab-content tab-content" id="myTabContent">
                                        <div className="tab-pane fade active show" id="team-tab1" role="tabpanel" aria-labelledby="team-tab1-tab">
                                            <div className="inner">
                                                <div className="rbt-team-thumbnail">
                                                    <div className="thumb">
                                                        <img src="assets/images/team/team-08.jpg" alt="Testimonial Images" />
                                                        <div className="home-badges">
                                                            <img src="assets/images/zob-bad.png" alt="badges" />
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="rbt-team-details">
                                                    <div className="author-info">
                                                        <h4 className="title">R.K. Dhiman</h4>
                                                        <span className="designation theme-gradient">UX Designer</span>
                                                        <span className="team-form">
                                                            <i className="feather-map-pin"></i>
                                                            <span className="location">Noida, India</span>
                                                        </span>
                                                    </div>
                                                    <p> R.K. Dhiman specializes in creating user friendly designs...{" "}</p>
                                                    <ul className="social-icon social-default mt--20 justify-content-start">
                                                        <li><a href="https://www.facebook.com/"><i className="feather-facebook"></i></a></li>
                                                        <li><a href="https://www.twitter.com"><i className="feather-twitter"></i></a></li>
                                                        <li><a href="https://www.instagram.com/"><i className="feather-instagram"></i></a></li>
                                                    </ul>
                                                    <ul className="rbt-information-list mt--25">
                                                        <li><a href="#"><i className="feather-phone"></i>xxxxxxxx</a></li>
                                                        <li><a href="#"><i className="feather-mail"></i>xxxxxxxxxxxxxxx</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="tab-pane fade"
                                            id="team-tab2"
                                            role="tabpanel"
                                            aria-labelledby="team-tab2-tab"
                                        >
                                            <div className="inner">
                                                <div className="rbt-team-thumbnail">
                                                    <div className="thumb">
                                                        <img src="assets/images/team/team-05.jpg" alt="Testimonial Images" />
                                                    </div>
                                                </div>
                                                <div className="rbt-team-details">
                                                    <div className="author-info">
                                                        <h4 className="title">Ayush</h4>
                                                        <span className="designation theme-gradient">Project Manager</span>
                                                        <span className="team-form">
                                                            <i className="feather-map-pin" />
                                                            <span className="location">CO Miego, AD,USA</span>
                                                        </span>
                                                    </div>
                                                    <p>
                                                        Ayush is an expert in managing complex projects...
                                                    </p>
                                                    <ul className="social-icon social-default mt--20 justify-content-start">
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
                                                    </ul>
                                                    <ul className="rbt-information-list mt--25">
                                                        <li>
                                                            <a href="#">
                                                                <i className="feather-phone" />
                                                                xxxxxxxxxxx
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="mailto:hello@example.com">
                                                                <i className="feather-mail" />
                                                                xxxx@xxxx.com
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            className="tab-pane fade"
                                            id="team-tab3"
                                            role="tabpanel"
                                            aria-labelledby="team-tab3-tab"
                                        >
                                            <div className="inner">
                                                <div className="rbt-team-thumbnail">
                                                    <div className="thumb">
                                                        <img src="assets/images/team/team-06.jpg" alt="Testimonial Images" />
                                                    </div>
                                                </div>
                                                <div className="rbt-team-details">
                                                    <div className="author-info">
                                                        <h4 className="title">Gautam Sidarth</h4>
                                                        <span className="designation theme-gradient"> Senior Software Engineer</span>
                                                        <span className="team-form">
                                                            <i className="feather-map-pin" />
                                                            <span className="location">CO Miego, AD,USA</span>
                                                        </span>
                                                    </div>
                                                    <p>
                                                        Gautam has 5 years of experience in software development...
                                                    </p>
                                                    <ul className="social-icon social-default mt--20 justify-content-start">
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
                                                    </ul>
                                                    <ul className="rbt-information-list mt--25">
                                                        <li>
                                                            <a href="#">
                                                                <i className="feather-phone" />
                                                                xxxxxxxxxxx
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="#">
                                                                <i className="feather-mail" />
                                                                xxxx@xxxx.com
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>


                                        {/* Repeat similar structure for other tabs */}
                                        {/* team-tab2, team-tab3, etc. */}
                                    </div>
                                    {/* End Tab Content */}
                                </div>
                                <div className="col-lg-5">
                                    {/* Start Tab Nav */}
                                    <ul className="rbt-team-tab-thumb nav nav-tabs" id="myTab" role="tablist">
                                        <li>
                                            <a className='active' id="team-tab4-tab" data-bs-toggle="tab" data-bs-target="#team-tab4" role="tab" aria-controls="team-tab4" aria-selected="false">
                                                <div className="rbt-team-thumbnail">
                                                    <div className="inner">
                                                        <div className="thmbnail">
                                                            <div className="thumb">
                                                                <img src="assets/images/team/team-08.jpg" alt="Testimonial Images" />
                                                                <div className="home-badges-1">
                                                                    <img src="assets/images/zob-bad.png" alt="badges" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                        <li>
                                            <a id="team-tab5-tab" data-bs-toggle="tab" data-bs-target="#team-tab5" role="tab" aria-controls="team-tab5" aria-selected="false">
                                                <div className="rbt-team-thumbnail">
                                                    <div className="thumb">
                                                        <img src="assets/images/team/team-05.jpg" alt="Testimonial Images" />
                                                        <div className="home-badges-1">
                                                            <img src="assets/images/zob-bad.png" alt="badges" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                        <li>
                                            <a id="team-tab6-tab" data-bs-toggle="tab" data-bs-target="#team-tab6" role="tab" aria-controls="team-tab6" aria-selected="false">
                                                <div className="rbt-team-thumbnail">
                                                    <div className="thumb">
                                                        <img src="assets/images/team/team-06.jpg" alt="Testimonial Images" />
                                                        <div className="home-badges-1">
                                                            <img src="assets/images/zob-bad.png" alt="badges" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                    </ul>
                                    {/* End Tab Nav */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rbt-counterup-area bg-color-white rbt-section-gap">
                        <div className="container">
                            <div className="row mb--60">
                                <div className="col-lg-12">
                                    <div className="section-title text-center">
                                        <span className="subtitle bg-secondary-opacity">Why Choose Us</span>
                                        <h2 className="title">Creating A Community Of <br /> Life Long Learners</h2>
                                        <p className="description has-medium-font-size mt--20 mb--0">
                                            At Zobskill, we believe learning never stops! Our platform connects aspiring professionals, expert trainers, and industry leaders to foster continuous growth, upskilling, and career success.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-5 hanger-line">
                                {/* Start Single Counter */}
                                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                                    <div className="rbt-counterup rbt-hover-03 border-bottom-gradient">
                                        <div className="top-circle-shape"></div>
                                        <div className="inner">
                                            <div className="rbt-round-icon">
                                                <img src="assets/images/icons/counter-01.png" alt="Icons Images" />
                                            </div>
                                            <div className="content">
                                                <h3 className="counter">
                                                    <span className="odometer" data-count="500">10</span>
                                                </h3>
                                                <span className="subtitle">Learners &amp; counting</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* End Single Counter */}
                                {/* Start Single Counter */}
                                <div className="col-lg-3 col-md-6 col-sm-6 col-12 mt--60 mt_md--30 mt_sm--30 mt_mobile--60">
                                    <div className="rbt-counterup rbt-hover-03 border-bottom-gradient">
                                        <div className="top-circle-shape"></div>
                                        <div className="inner">
                                            <div className="rbt-round-icon">
                                                <img src="assets/images/icons/counter-02.png" alt="Icons Images" />
                                            </div>
                                            <div className="content">
                                                <h3 className="counter">
                                                    <span className="odometer" data-count="800">30</span>
                                                </h3>
                                                <span className="subtitle">Courses & Video</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* End Single Counter */}
                                {/* Start Single Counter */}
                                <div className="col-lg-3 col-md-6 col-sm-6 col-12 mt_md--60 mt_sm--60">
                                    <div className="rbt-counterup rbt-hover-03 border-bottom-gradient">
                                        <div className="top-circle-shape"></div>
                                        <div className="inner">
                                            <div className="rbt-round-icon">
                                                <img src="assets/images/icons/counter-03.png" alt="Icons Images" />
                                            </div>
                                            <div className="content">
                                                <h3 className="counter">
                                                    <span className="odometer" data-count="1000">20</span>
                                                </h3>
                                                <span className="subtitle">Certified Students</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* End Single Counter */}
                                {/* Start Single Counter */}
                                <div className="col-lg-3 col-md-6 col-sm-6 col-12 mt--60 mt_md--30 mt_sm--30 mt_mobile--60">
                                    <div className="rbt-counterup rbt-hover-03 border-bottom-gradient">
                                        <div className="top-circle-shape"></div>
                                        <div className="inner">
                                            <div className="rbt-round-icon">
                                                <img src="assets/images/icons/counter-04.png" alt="Icons Images" />
                                            </div>
                                            <div className="content">
                                                <h3 className="counter">
                                                    <span className="odometer" data-count="100">40</span>
                                                </h3>
                                                <span className="subtitle">Registered Enrolls</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* End Single Counter */}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Home;