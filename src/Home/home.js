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
        };

    }
    componentDidMount() {
        this.getDashboardUser();
        this.getAllJobs(0, this.state.pageSize);
        this.getAllCourse(0, 6);
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
            "active": false,
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
                    const topTwoJobs = response.data.data.slice(0, 2);
                    this.setState({ joblistingdata: topTwoJobs, totalRecords: totalCount, errorMessage: "", keepSpinner: false });
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

    render() {

        return (
            <>
                <Header dashBoardData={this.state.dashBoardData} />
                <div className="rbt-banner-area rbt-banner-1">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-12 pb--120 pt--70">
                                <div className="content">
                                    <div className="inner">
                                        <h1 className="title">
                                            Welcome to Zobskill
                                        </h1>
                                        <h5>Marketplace for Training & Jobs</h5>
                                        <p className="description">
                                            We specialize in offering high-quality courses and connecting you with top employers across industries. Whether you're preparing for career opportunities or exploring diverse training programs, ZobSkill is here to guide your journey.
                                        </p>
                                        <div className="slider-btn">
                                            <a className="rbt-btn btn-gradient hover-icon-reverse" href="/course">
                                                <span className="icon-reverse-wrapper">
                                                    <span className="btn-text">Start Your Training</span>
                                                    <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                                                    <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                                                </span>
                                            </a>
                                            <a className="rbt-btn btn-gradient hover-icon-reverse" href="/jobs">
                                                <span className="icon-reverse-wrapper">
                                                    <span className="btn-text">Explore Your Dream Job</span>
                                                    <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                                                    <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                                                </span>
                                            </a>
                                        </div>
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
                                                            <div className="rbt-card-img">
                                                                <a href={`/Course-Details?courseId=${course.courseid}`}>
                                                                    <img src={course.course_image ? `${process.env.REACT_APP_BASEURL}/Uploads/${course.course_image}` : "assets/images/job-zob-img.jpg"}// Use a default image if companylogo is missing 
                                                                        alt="Card" />
                                                                    {/* <div className="rbt-badge-3 bg-white">
                                        <span>-40%</span>
                                        <span>Off</span>
                                    </div> */}
                                                                </a>
                                                            </div>
                                                            <div className="rbt-card-body">
                                                                <ul className="rbt-meta">
                                                                    <li><i className="fa fa-book"></i> {course.no_of_lessons} Lessons</li>
                                                                    <li><i className="fa fa-users"></i> {course.students} Students</li>
                                                                </ul>
                                                                <h4 className="rbt-card-title">
                                                                    <a href={`/Course-Details?courseId=${course.courseid}`}>{course.coursetitle}</a>
                                                                </h4>
                                                                <p className="rbt-card-text">{course.description}</p>
                                                                <div className="rbt-review">
                                                                    <div className="rating">
                                                                        {[...Array(course.rating)].map((_, i) => <i key={i} className="fa fa-star"></i>)}
                                                                    </div>
                                                                    <span className="rating-count"> ({course.reviews} Reviews)</span>
                                                                </div>
                                                                <div className="rbt-card-bottom">
                                                                    <div className="rbt-price">
                                                                        <span className="current-price">${course.course_fees}</span>
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
                                                            <div className="rbt-card-img">
                                                                <a href="course-details.html">
                                                                    <img src={`assets/images/course/course-0${index + 1}.jpg`} alt="Card" />
                                                                    <div className="rbt-badge-3 bg-white">
                                                                        <span>-40%</span>
                                                                        <span>Off</span>
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
                                                                    <span className="rating-count"> (15 Reviews)</span>
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
            </>
        );
    }
}

export default Home;