import React from 'react';
import Header from '../Header/header';
import axios from 'axios'; 
import parse from 'html-react-parser';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';


// import required modules
import { EffectCards } from 'swiper/modules';

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
                if(response.data.data && response.data.data.length > 0){
                const totalCount = response.data.data[0].TotalRecords;
                const topTwoJobs = response.data.data.slice(0, 2);
                this.setState({ joblistingdata: topTwoJobs, totalRecords: totalCount, errorMessage: "", keepSpinner: false });
                }
                else{
                    this.setState({ errorMessage: "No Jobs Found", keepSpinner: false });
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
                                            modules={[EffectCards]}
                                            spaceBetween={30}
                                            centeredSlides={true}
                                            slidesPerView={1}
                                            className="mySwiper"
                                        >
                                            {[1, 2, 3].map((_, index) => (
                                                <SwiperSlide style={{ width: "400px", height: "auto" }} key={index}>
                                                    <div className="rbt-card variation-01 rbt-hover" style={{ width: "350px", height: "450px" }}>
                                                        {/* Image Section */}
                                                        <div className="rbt-card-img">
                                                            <a href="course-details.html">
                                                                <img src={`assets/images/course/course-0${index + 1}.jpg`} alt="Card" />
                                                                <div className="rbt-badge-3 bg-white">
                                                                    <span>-40%</span>
                                                                    <span>Off</span>
                                                                </div>
                                                            </a>
                                                        </div>

                                                        {/* Course Details */}
                                                        <div className="rbt-card-body">
                                                            <ul className="rbt-meta">
                                                                <li><i className="fa fa-book"></i> 12 Lessons</li>
                                                                <li><i className="fa fa-users"></i> 50 Students</li>
                                                            </ul>
                                                            <h4 className="rbt-card-title">
                                                                <a href="course-details.html">React</a>
                                                            </h4>
                                                            <p className="rbt-card-text">It is a long established fact that a reader will be distracted.</p>

                                                            {/* Ratings */}
                                                            <div className="rbt-review">
                                                                <div className="rating">
                                                                    {[...Array(5)].map((_, i) => <i key={i} className="fa fa-star"></i>)}
                                                                </div>
                                                                <span className="rating-count"> (15 Reviews)</span>
                                                            </div>

                                                            {/* Price and CTA */}
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
                                            ))}
                                        </Swiper>
                                        <div className="rbt-swiper-pagination"></div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div><div className="rbt-categories-area bg-color-white rbt-section-gapBottom">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="section-title text-center">
                                    <span className="subtitle bg-primary-opacity">CATEGORIES</span>
                                    <h2 className="title">Explore Top Courses Categories <br /> That Change Yourself</h2>
                                </div>
                            </div>
                        </div>

                        <div className="row row--15 mt_dec--30 mt--20">
                            {/* Start Service Grid */}
                            <div className="col-lg-4 col-xl-3 col-xxl-3 col-md-6 col-sm-6 col-12 mt--30">
                                <div className="rbt-cat-box rbt-cat-box-1 service-card service-card-6">
                                    <div className="inner background">
                                        <div className="icon">
                                            <img src="assets/images/icons/001-bulb.png" alt="icons Images" />
                                        </div>
                                        <div className="content">
                                            <h6 className="title"><a href="#">Unlock Opportunities – 100+ Jobs Await You!</a></h6>
                                            <p className="description">Explore verified listings across industries and apply with confidence.</p>
                                        </div>
                                        <span className="number-text">1</span>
                                    </div>
                                </div>
                            </div>
                            {/* End Service Grid */}

                            {/* Start Service Grid */}
                            <div className="col-lg-4 col-xl-3 col-xxl-3 col-md-6 col-sm-6 col-12 mt--30">
                                <div className="rbt-cat-box rbt-cat-box-1 service-card service-card-6">
                                    <div className="inner background1">
                                        <div className="icon">
                                            <img src="assets/images/icons/002-hat.png" alt="Shape Images" />
                                        </div>
                                        <div className="content">
                                            <h6 className="title"><a href="#">Free Job Posting – Start Hiring Now!</a></h6>
                                            <p className="description">Post openings at no cost and connect with the best talent effortlessly.</p>
                                        </div>
                                        <span className="number-text">2</span>
                                    </div>
                                </div>
                            </div>
                            {/* End Service Grid */}

                            {/* Start Service Grid */}
                            <div className="col-lg-4 col-xl-3 col-xxl-3 col-md-6 col-sm-6 col-12 mt--30">
                                <div className="rbt-cat-box rbt-cat-box-1 service-card service-card-6">
                                    <div className="inner background2">
                                        <div className="icon">
                                            <img src="assets/images/icons/003-id-card.png" alt="Shape Images" />
                                        </div>
                                        <div className="content">
                                            <h6 className="title"><a href="#">100% Refund on Training & Job placement (T&C Apply)</a></h6>
                                            <p className="description">We prioritize your satisfaction with our flexible refund policy.</p>
                                        </div>
                                        <span className="number-text">3</span>
                                    </div>
                                </div>
                            </div>
                            {/* End Service Grid */}

                            {/* Start Service Grid */}
                            <div className="col-lg-4 col-xl-3 col-xxl-3 col-md-6 col-sm-6 col-12 mt--30">
                                <div className="rbt-cat-box rbt-cat-box-1 service-card service-card-6">
                                    <div className="inner background3">
                                        <div className="icon">
                                            <img src="assets/images/icons/004-pass.png" alt="Shape Images" />
                                        </div>
                                        <div className="content">
                                            <h6 className="title"><a href="#">Job Alerts and Notifications at Your Fingertips</a></h6>
                                            <p className="description">Never miss an opportunity with personalized job recommendations.</p>
                                        </div>
                                        <span className="number-text">4</span>
                                    </div>
                                </div>
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
                                        <h2 className="title">Know About Zobskill <br /> Learning Platform</h2>
                                    </div>

                                    <p className="description mt--30">
                                        Zobskill, a dynamic training and recruitment platform owned by Eduglobal Solutions, is designed to transform the careers of working professionals, graduates, and aspiring candidates across a variety of industries. By offering a holistic pathway from personalized training to certification and job placement, Zobskill empowers individuals to achieve their career goals—all in one place.
                                    </p>

                                    <p>
                                        Unlike other platforms, Zobskill leverages cutting-edge technology, a deep understanding of industry demands, and strategic partnerships to deliver a seamless and tailored experience for both candidates and employers.
                                    </p>

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
                        {/* Start Card Area */}
                        <div className="row g-5">
                            {/* Start Single Course */}
                            <div className="col-lg-4 col-md-6 col-12">
                                <div className="rbt-card variation-01 rbt-hover">
                                    <div className="rbt-card-img">
                                        <a href="course-details.html">
                                            <img src="assets/images/course/course-01.jpg" alt="Card image" />
                                            <div className="rbt-badge-3 bg-white">
                                                <span>-50%</span>
                                                <span>Off</span>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="rbt-card-body">
                                        <div className="rbt-card-top">
                                            <div className="rbt-review">
                                                <div className="rating">
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                </div>
                                                <span className="rating-count"> (15 Reviews)</span>
                                            </div>
                                            <div className="rbt-bookmark-btn">
                                                <a className="rbt-round-btn" title="Bookmark" href="#">
                                                    <i className="feather-bookmark"></i>
                                                </a>
                                            </div>
                                        </div>
                                        <h4 className="rbt-card-title">
                                            <a href="course-details.html">React Front To Back</a>
                                        </h4>
                                        <ul className="rbt-meta">
                                            <li><i className="feather-book"></i>20 Lessons</li>
                                            <li><i className="feather-users"></i>40 Students</li>
                                        </ul>
                                        <p className="rbt-card-text">
                                            React Js long fact that a reader will be distracted by the readable.
                                        </p>
                                        <div className="rbt-author-meta mb--20">
                                            <div className="rbt-avater">
                                                <a href="#">
                                                    <img src="assets/images/client/avater-01.png" alt="Sophia Jaymes" />
                                                </a>
                                            </div>
                                            <div className="rbt-author-info">
                                                By <a href="profile.html">Patrick</a> In <a href="#">Languages</a>
                                            </div>
                                        </div>
                                        <div className="rbt-card-bottom">
                                            <div className="rbt-price">
                                                <span className="current-price">$60</span>
                                                <span className="off-price">$120</span>
                                            </div>
                                            <a className="rbt-btn-link" href="course-details.html">
                                                Learn More<i className="feather-arrow-right"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* End Single Course */}

                            {/* Start Single Course */}
                            <div className="col-lg-4 col-md-6 col-12">
                                <div className="rbt-card variation-01 rbt-hover">
                                    <div className="rbt-card-img">
                                        <a href="course-details.html">
                                            <img src="assets/images/course/course-02.jpg" alt="Card image" />
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
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                </div>
                                                <span className="rating-count"> (15 Reviews)</span>
                                            </div>
                                            <div className="rbt-bookmark-btn">
                                                <a className="rbt-round-btn" title="Bookmark" href="#">
                                                    <i className="feather-bookmark"></i>
                                                </a>
                                            </div>
                                        </div>
                                        <h4 className="rbt-card-title">
                                            <a href="course-details.html">PHP Beginner + Advanced</a>
                                        </h4>
                                        <ul className="rbt-meta">
                                            <li><i className="feather-book"></i>12 Lessons</li>
                                            <li><i className="feather-users"></i>50 Students</li>
                                        </ul>
                                        <p className="rbt-card-text">
                                            It is a long established fact that a reader will be distracted by the readable.
                                        </p>
                                        <div className="rbt-author-meta mb--20">
                                            <div className="rbt-avater">
                                                <a href="#">
                                                    <img src="assets/images/client/avatar-02.png" alt="Sophia Jaymes" />
                                                </a>
                                            </div>
                                            <div className="rbt-author-info">
                                                By <a href="profile.html">Angela</a> In <a href="#">Development</a>
                                            </div>
                                        </div>
                                        <div className="rbt-card-bottom">
                                            <div className="rbt-price">
                                                <span className="current-price">$60</span>
                                                <span className="off-price">$120</span>
                                            </div>
                                            <a className="rbt-btn-link left-icon" href="course-details.html">
                                                <i className="feather-shopping-cart"></i> Add To Cart
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* End Single Course */}

                            {/* Start Single Course */}
                            <div className="col-lg-4 col-md-6 col-12">
                                <div className="rbt-card variation-01 rbt-hover">
                                    <div className="rbt-card-img">
                                        <a href="course-details.html">
                                            <img src="assets/images/course/course-03.jpg" alt="Card image" />
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
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                </div>
                                                <span className="rating-count"> (5 Reviews)</span>
                                            </div>
                                            <div className="rbt-bookmark-btn">
                                                <a className="rbt-round-btn" title="Bookmark" href="#">
                                                    <i className="feather-bookmark"></i>
                                                </a>
                                            </div>
                                        </div>
                                        <h4 className="rbt-card-title">
                                            <a href="course-details.html">Angular Zero to Mastery</a>
                                        </h4>
                                        <ul className="rbt-meta">
                                            <li><i className="feather-book"></i>8 Lessons</li>
                                            <li><i className="feather-users"></i>30 Students</li>
                                        </ul>
                                        <p className="rbt-card-text">
                                            Angular Js long fact that a reader will be distracted by the readable.
                                        </p>
                                        <div className="rbt-author-meta mb--20">
                                            <div className="rbt-avater">
                                                <a href="#">
                                                    <img src="assets/images/client/avatar-03.png" alt="Sophia Jaymes" />
                                                </a>
                                            </div>
                                            <div className="rbt-author-info">
                                                By <a href="profile.html">Slaughter</a> In <a href="#">Languages</a>
                                            </div>
                                        </div>
                                        <div className="rbt-card-bottom">
                                            <div className="rbt-price">
                                                <span className="current-price">$80</span>
                                                <span className="off-price">$100</span>
                                            </div>
                                            <a className="rbt-btn-link" href="course-details.html">
                                                Learn More<i className="feather-arrow-right"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* End Single Course */}
                        </div>
                        {/* End Card Area */}

                        <div className="row">
                            <div className="col-lg-12">
                                <div className="load-more-btn mt--60 text-center">
                                    <a className="rbt-btn btn-gradient btn-lg hover-icon-reverse" href="#">
                                        <span className="icon-reverse-wrapper">
                                            <span className="btn-text">Load More Course (40)</span>
                                            <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                                            <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
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
                        {/* Start Card Area */}
                        <div className="row row--15">
                            {this.state.joblistingdata && this.state.joblistingdata.length > 0 ? (
                                this.state.joblistingdata.map((job, index) => (
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 mt--30" key={index}>
                                        <div className="rbt-card variation-01 rbt-hover card-list-2">
                                            <div className="rbt-card-img">
                                                <a href="#">
                                                    <img src={job.companylogo ? `${process.env.REACT_APP_BASEURL}/Uploads/${job.companylogo}` : "assets/images/job-zob-img.jpg"} />
                                                </a>
                                            </div>
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
                                                <p className="rbt-card-text">
                                                      {parse(job.description)}
                                                </p>
                                                <div className="rbt-card-bottom">
                                                    <div className="rbt-price">
                                                        <span className="current-price"><i className="fas fa-rupee-sign"></i> {job.package_notdisclosed ? "Package not disclosed" : `${job.packagefrom}L - ${job.packageto || "N/A"}L`}</span>
                                                    </div>
                                                    <a className="rbt-btn-link" href="#">
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
                        {/* End Card Area */}
                    </div>
                </div>
                <div className="rbt-brand-area bg-color-white rbt-section-gap">
                    <div className="container">
                        <div className="row align-items-center g-5">
                            <div className="col-lg-3">
                                <div style={{textAlign:"left"}} className="brand-content-left">
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
                                    <span className="subtitle bg-primary-opacity">Zobskill Mentors</span>
                                    <h2 className="title">Whose Inspirs You</h2>
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
                                                    <img src="assets/images/team/team-01.jpg" alt="Testimonial Images" />
                                                </div>
                                            </div>
                                            <div className="rbt-team-details">
                                                <div className="author-info">
                                                    <h4 className="title">Mames Mary</h4>
                                                    <span className="designation theme-gradient">English Teacher</span>
                                                    <span className="team-form">
                                                        <i className="feather-map-pin"></i>
                                                        <span className="location">CO Miego, AD, USA</span>
                                                    </span>
                                                </div>
                                                <p>Zobskill The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.</p>
                                                <ul className="social-icon social-default mt--20 justify-content-start">
                                                    <li><a href="https://www.facebook.com/"><i className="feather-facebook"></i></a></li>
                                                    <li><a href="https://www.twitter.com"><i className="feather-twitter"></i></a></li>
                                                    <li><a href="https://www.instagram.com/"><i className="feather-instagram"></i></a></li>
                                                </ul>
                                                <ul className="rbt-information-list mt--25">
                                                    <li><a href="#"><i className="feather-phone"></i>+1-202-555-0174</a></li>
                                                    <li><a href="mailto:hello@example.com"><i className="feather-mail"></i>example@gmail.com</a></li>
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
                                        <a className="active" id="team-tab1-tab" data-bs-toggle="tab" data-bs-target="#team-tab1" role="tab" aria-controls="team-tab1" aria-selected="true">
                                            <div className="rbt-team-thumbnail">
                                                <div className="thumb">
                                                    <img src="assets/images/team/team-01.jpg" alt="Testimonial Images" />
                                                </div>
                                            </div>
                                        </a>
                                    </li>

                                    <li>
                                        <a id="team-tab2-tab" data-bs-toggle="tab" data-bs-target="#team-tab2" role="tab" aria-controls="team-tab2" aria-selected="false">
                                            <div className="rbt-team-thumbnail">
                                                <div className="thumb">
                                                    <img src="assets/images/team/team-02.jpg" alt="Testimonial Images" />
                                                </div>
                                            </div>
                                        </a>
                                    </li>

                                    <li>
                                        <a id="team-tab3-tab" data-bs-toggle="tab" data-bs-target="#team-tab3" role="tab" aria-controls="team-tab3" aria-selected="false">
                                            <div className="rbt-team-thumbnail">
                                                <div className="thumb">
                                                    <img src="assets/images/team/team-03.jpg" alt="Testimonial Images" />
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a id="team-tab4-tab" data-bs-toggle="tab" data-bs-target="#team-tab4" role="tab" aria-controls="team-tab4" aria-selected="false">
                                            <div className="rbt-team-thumbnail">
                                                <div className="thumb">
                                                    <img src="assets/images/team/team-04.jpg" alt="Testimonial Images" />
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a id="team-tab5-tab" data-bs-toggle="tab" data-bs-target="#team-tab5" role="tab" aria-controls="team-tab5" aria-selected="false">
                                            <div className="rbt-team-thumbnail">
                                                <div className="thumb">
                                                    <img src="assets/images/team/team-05.jpg" alt="Testimonial Images" />
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a id="team-tab6-tab" data-bs-toggle="tab" data-bs-target="#team-tab6" role="tab" aria-controls="team-tab6" aria-selected="false">
                                            <div className="rbt-team-thumbnail">
                                                <div className="thumb">
                                                    <img src="assets/images/team/team-06.jpg" alt="Testimonial Images" />
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
                                    <h2 className="title">Creating A Community Of <br /> Life Long Learners.</h2>
                                    <p className="description has-medium-font-size mt--20 mb--0">
                                        There are many variations of passages of the Ipsum available, but the majority have suffered alteration in some form, by injected humour.
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
                                                <span className="odometer" data-count="500">00</span>
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
                                                <span className="odometer" data-count="800">00</span>
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
                                                <span className="odometer" data-count="1000">00</span>
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
                                                <span className="odometer" data-count="100">00</span>
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

            </>


        );
    }
}

export default Home;