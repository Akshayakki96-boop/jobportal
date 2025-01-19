import React from 'react';
import axios from 'axios';
import withNavigation from '../withNavigation';
import Header from '../Header/header';

class Course extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUserDashboard: true,
            dashBoardData: ""
        };

    }
    componentDidMount() {
        this.getDashboardUser();

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
                this.getUserProfile(response.data.user_id);
                this.setState({ dashBoardData: response.data.data });
                this.setState({ keepSpinner: false });

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
    }

    getUserProfile = (userId) => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Employer/GetProfile`;
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
                this.setState({ keepSpinner: false });

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
    }

    setActiveComponent = (componentName) => {
        this.setState({
            showUserDashboard: false,
            showProfile: false,
            showEnrollCourse: false,
            showMyCourses: false,
            showAssignment: false
        });

        switch (componentName) {
            case 'dashboard':
                this.setState({ showUserDashboard: true });
                break;
            case 'profile':
                this.setState({ showProfile: true });
                break;
            case 'enrolledCourses':
                this.setState({ showEnrollCourse: true });
                break;
            case 'myCourses':
                this.setState({ showMyCourses: true });
                break;
            case 'announcements':
                this.setState({ showAnnouncement: true });
                break;
            case 'assignments':
                this.setState({ showAssignment: true });
                break;
            // Add more cases for other components as needed
            default:
                this.setState({ showUserDashboard: true });
                break;
        }
    };
    handleLogout = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const logoutUrl = `${baseUrl}/api/Logout/Logout`;
        const logoutData = {};
        const token = localStorage.getItem('authToken');
        axios.post(logoutUrl, logoutData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('Logout Success:', response.data);
                this.setState({ keepSpinner: false });

                this.props.navigate('/Login'); // Use `navigate`
            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
                this.setState({ keepSpinner: false });
            });
    }

    render() {

        return (
            <>
                <Header dashBoardData={this.state.dashBoardData} />

                <>
                    <div className="rbt-page-banner-wrapper">
                        {/* Start Banner BG Image  */}
                        <div className="rbt-banner-image" />
                        {/* End Banner BG Image  */}
                        <div className="rbt-banner-content">
                            {/* Start Banner Content Top  */}
                            <div className="rbt-banner-content-top">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            {/* Start Breadcrumb Area  */}
                                            <ul className="page-list">
                                                <li className="rbt-breadcrumb-item">
                                                    <a href="index.html">Home</a>
                                                </li>
                                                <li>
                                                    <div className="icon-right">
                                                        <i className="feather-chevron-right" />
                                                    </div>
                                                </li>
                                                <li className="rbt-breadcrumb-item active">All Course</li>
                                            </ul>
                                            {/* End Breadcrumb Area  */}
                                            <div className=" title-wrapper">
                                                <h1 className="title mb--0">All Courses</h1>
                                                <a href="#" className="rbt-badge-2">
                                                    <div className="image">🎉</div> 50 Courses
                                                </a>
                                            </div>
                                            <p className="description">
                                                Courses that help beginner designers become true unicorns.{" "}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* End Banner Content Top  */}
                            {/* Start Course Top  */}
                            <div className="rbt-course-top-wrapper mt--40 mt_sm--20">
                                <div className="container">
                                    <div className="row g-5 align-items-center">
                                        <div className="col-lg-5 col-md-12">
                                            <div className="rbt-sorting-list d-flex flex-wrap align-items-center">
                                                <div className="rbt-short-item switch-layout-container">
                                                    <ul className="course-switch-layout">
                                                        <li className="course-switch-item">
                                                            <button
                                                                className="rbt-grid-view active"
                                                                title="Grid Layout"
                                                            >
                                                                <i className="feather-grid" />{" "}
                                                                <span className="text">Grid</span>
                                                            </button>
                                                        </li>
                                                        <li className="course-switch-item">
                                                            <button className="rbt-list-view" title="List Layout">
                                                                <i className="feather-list" />{" "}
                                                                <span className="text">List</span>
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="rbt-short-item">
                                                    <span className="course-index">Showing 1-9 of 19 results</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-7 col-md-12">
                                            <div className="rbt-sorting-list d-flex flex-wrap align-items-center justify-content-start justify-content-lg-end">
                                                <div className="rbt-short-item">
                                                    <form action="#" className="rbt-search-style me-0">
                                                        <input type="text" placeholder="Search Your Course.." />
                                                        <button
                                                            type="submit"
                                                            className="rbt-search-btn rbt-round-btn"
                                                        >
                                                            <i className="feather-search" />
                                                        </button>
                                                    </form>
                                                </div>
                                                <div className="rbt-short-item">
                                                    <div className="view-more-btn text-start text-sm-end">
                                                        <button className="discover-filter-button discover-filter-activation rbt-btn btn-white btn-md radius-round">
                                                            Filter
                                                            <i className="feather-filter" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Start Filter Toggle  */}
                                    <div className="default-exp-wrapper default-exp-expand">
                                        <div className="filter-inner">
                                            <div className="filter-select-option">
                                                <div className="filter-select rbt-modern-select">
                                                    <span className="select-label d-block">Short By</span>
                                                    <select>
                                                        <option>Default</option>
                                                        <option>Latest</option>
                                                        <option>Popularity</option>
                                                        <option>Trending</option>
                                                        <option>Price: low to high</option>
                                                        <option>Price: high to low</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="filter-select-option">
                                                <div className="filter-select rbt-modern-select">
                                                    <span className="select-label d-block">Short By Author</span>
                                                    <select
                                                        data-live-search="true"
                                                        title="Select Author"
                                                        multiple=""
                                                        data-size={7}
                                                        data-actions-box="true"
                                                        data-selected-text-format="count > 2"
                                                    >
                                                        <option data-subtext="Experts">Janin Afsana</option>
                                                        <option data-subtext="Experts">Joe Biden</option>
                                                        <option data-subtext="Experts">Fatima Asrafy</option>
                                                        <option data-subtext="Experts">Aysha Baby</option>
                                                        <option data-subtext="Experts">Mohamad Ali</option>
                                                        <option data-subtext="Experts">Jone Li</option>
                                                        <option data-subtext="Experts">Alberd Roce</option>
                                                        <option data-subtext="Experts">Zeliski Noor</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="filter-select-option">
                                                <div className="filter-select rbt-modern-select">
                                                    <span className="select-label d-block">Short By Offer</span>
                                                    <select>
                                                        <option>Free</option>
                                                        <option>Paid</option>
                                                        <option>Premium</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="filter-select-option">
                                                <div className="filter-select rbt-modern-select">
                                                    <span className="select-label d-block">Short By Category</span>
                                                    <select data-live-search="true">
                                                        <option>Web Design</option>
                                                        <option>Graphic</option>
                                                        <option>App Development</option>
                                                        <option>Figma Design</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="filter-select-option">
                                                <div className="filter-select">
                                                    <span className="select-label d-block">Price Range</span>
                                                    <div className="price_filter s-filter clear">
                                                        <form action="#" method="GET">
                                                            <div id="slider-range" />
                                                            <div className="slider__range--output">
                                                                <div className="price__output--wrap">
                                                                    <div className="price--output">
                                                                        <span>Price :</span>
                                                                        <input type="text" id="amount" />
                                                                    </div>
                                                                    <div className="price--filter">
                                                                        <a className="rbt-btn btn-gradient btn-sm" href="#">
                                                                            Filter
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Filter Toggle  */}
                                </div>
                            </div>
                            {/* End Course Top  */}
                        </div>
                    </div>
                    <div className="rbt-section-overlayping-top rbt-section-gapBottom">
                        <div className="inner">
                            <div className="container">
                                <div className="rbt-course-grid-column courall">
                                    {/* Start Single Card  */}
                                    <div className="course-grid-3">
                                        <div className="rbt-card variation-01 rbt-hover">
                                            <div className="rbt-card-img">
                                                <a href="/Course-Details">
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
                                                    <a href="/Course-Details">React Front To Back</a>
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
                                                    It is a long established fact that a reader will be distracted.
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
                                                    <a className="rbt-btn-link" href="/Course-Details">
                                                        Learn More
                                                        <i className="feather-arrow-right" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Single Card  */}
                                    {/* Start Single Card  */}
                                    <div className="course-grid-3">
                                        <div className="rbt-card variation-01 rbt-hover">
                                            <div className="rbt-card-img">
                                                <a href="/Course-Details">
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
                                                    <a href="/Course-Details">PHP Beginner Advanced</a>
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
                                                    It is a long established fact that a reader will be distracted.
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
                                                        href="/Course-Details"
                                                    >
                                                        <i className="feather-shopping-cart" /> Add To Cart
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Single Card  */}
                                    {/* Start Single Card  */}
                                    <div className="course-grid-3">
                                        <div className="rbt-card variation-01 rbt-hover">
                                            <div className="rbt-card-img">
                                                <a href="/Course-Details">
                                                    <img
                                                        src="assets/images/course/course-online-03.jpg"
                                                        alt="Card image"
                                                    />
                                                    <div className="rbt-badge-3 bg-white">
                                                        <span>-10%</span>
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
                                                        <span className="rating-count"> (5 Reviews)</span>
                                                    </div>
                                                    <div className="rbt-bookmark-btn">
                                                        <a className="rbt-round-btn" title="Bookmark" href="#">
                                                            <i className="feather-bookmark" />
                                                        </a>
                                                    </div>
                                                </div>
                                                <h4 className="rbt-card-title">
                                                    <a href="/Course-Details">Angular Zero to Mastery</a>
                                                </h4>
                                                <ul className="rbt-meta">
                                                    <li>
                                                        <i className="feather-book" />8 Lessons
                                                    </li>
                                                    <li>
                                                        <i className="feather-users" />
                                                        30 Students
                                                    </li>
                                                </ul>
                                                <p className="rbt-card-text">
                                                    Angular Js long fact that a reader will be distracted by the
                                                    readable.
                                                </p>
                                                <div className="rbt-author-meta mb--20">
                                                    <div className="rbt-avater">
                                                        <a href="#">
                                                            <img
                                                                src="assets/images/client/avatar-03.png"
                                                                alt="Sophia Jaymes"
                                                            />
                                                        </a>
                                                    </div>
                                                    <div className="rbt-author-info">
                                                        By <a href="profile.html">Slaughter</a> In{" "}
                                                        <a href="#">Languages</a>
                                                    </div>
                                                </div>
                                                <div className="rbt-card-bottom">
                                                    <div className="rbt-price">
                                                        <span className="current-price">$80</span>
                                                        <span className="off-price">$100</span>
                                                    </div>
                                                    <a className="rbt-btn-link" href="/Course-Details">
                                                        Learn More
                                                        <i className="feather-arrow-right" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Single Card  */}
                                    {/* Start Single Card  */}
                                    <div className="course-grid-3">
                                        <div className="rbt-card variation-01 rbt-hover">
                                            <div className="rbt-card-img">
                                                <a href="/Course-Details">
                                                    <img
                                                        src="assets/images/course/course-online-04.jpg"
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
                                                    <a href="/Course-Details">Web Front To Back</a>
                                                </h4>
                                                <ul className="rbt-meta">
                                                    <li>
                                                        <i className="feather-book" />
                                                        20 Lessons
                                                    </li>
                                                    <li>
                                                        <i className="feather-users" />
                                                        40 Students
                                                    </li>
                                                </ul>
                                                <p className="rbt-card-text">
                                                    Web Js long fact that a reader will be distracted by the
                                                    readable.
                                                </p>
                                                <div className="rbt-author-meta mb--20">
                                                    <div className="rbt-avater">
                                                        <a href="#">
                                                            <img
                                                                src="assets/images/client/avater-01.png"
                                                                alt="Sophia Jaymes"
                                                            />
                                                        </a>
                                                    </div>
                                                    <div className="rbt-author-info">
                                                        By <a href="profile.html">Patrick</a> In{" "}
                                                        <a href="#">Languages</a>
                                                    </div>
                                                </div>
                                                <div className="rbt-card-bottom">
                                                    <div className="rbt-price">
                                                        <span className="current-price">$60</span>
                                                        <span className="off-price">$120</span>
                                                    </div>
                                                    <a className="rbt-btn-link" href="/Course-Details">
                                                        Learn More
                                                        <i className="feather-arrow-right" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Single Card  */}
                                    {/* Start Single Card  */}
                                    <div className="course-grid-3">
                                        <div className="rbt-card variation-01 rbt-hover">
                                            <div className="rbt-card-img">
                                                <a href="/Course-Details">
                                                    <img
                                                        src="assets/images/course/course-online-05.jpg"
                                                        alt="Card image"
                                                    />
                                                    <div className="rbt-badge-3 bg-white">
                                                        <span>-20%</span>
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
                                                    <a href="/Course-Details">SQL Beginner Advanced</a>
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
                                                    It is a long established fact that a reader will be distracted
                                                    by the readable.
                                                </p>
                                                <div className="rbt-author-meta mb--20">
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
                                                        href="/Course-Details"
                                                    >
                                                        <i className="feather-shopping-cart" /> Add To Cart
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Single Card  */}
                                    {/* Start Single Card  */}
                                    <div className="course-grid-3">
                                        <div className="rbt-card variation-01 rbt-hover">
                                            <div className="rbt-card-img">
                                                <a href="/Course-Details">
                                                    <img
                                                        src="assets/images/course/course-online-06.jpg"
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
                                                        <span className="rating-count"> (5 Reviews)</span>
                                                    </div>
                                                    <div className="rbt-bookmark-btn">
                                                        <a className="rbt-round-btn" title="Bookmark" href="#">
                                                            <i className="feather-bookmark" />
                                                        </a>
                                                    </div>
                                                </div>
                                                <h4 className="rbt-card-title">
                                                    <a href="/Course-Details">JS Zero to Mastery</a>
                                                </h4>
                                                <ul className="rbt-meta">
                                                    <li>
                                                        <i className="feather-book" />8 Lessons
                                                    </li>
                                                    <li>
                                                        <i className="feather-users" />
                                                        30 Students
                                                    </li>
                                                </ul>
                                                <p className="rbt-card-text">
                                                    Angular Js long fact that a reader will be distracted by the
                                                    readable.
                                                </p>
                                                <div className="rbt-author-meta mb--20">
                                                    <div className="rbt-avater">
                                                        <a href="#">
                                                            <img
                                                                src="assets/images/client/avatar-03.png"
                                                                alt="Sophia Jaymes"
                                                            />
                                                        </a>
                                                    </div>
                                                    <div className="rbt-author-info">
                                                        By <a href="profile.html">Slaughter</a> In{" "}
                                                        <a href="#">Languages</a>
                                                    </div>
                                                </div>
                                                <div className="rbt-card-bottom">
                                                    <div className="rbt-price">
                                                        <span className="current-price">$80</span>
                                                        <span className="off-price">$100</span>
                                                    </div>
                                                    <a className="rbt-btn-link" href="/Course-Details">
                                                        Learn More
                                                        <i className="feather-arrow-right" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Single Card  */}
                                </div>
                                <div className="row">
                                    <div className="col-lg-12 mt--60">
                                        <nav>
                                            <ul className="rbt-pagination">
                                                <li>
                                                    <a href="#" aria-label="Previous">
                                                        <i className="feather-chevron-left" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">1</a>
                                                </li>
                                                <li className="active">
                                                    <a href="#">2</a>
                                                </li>
                                                <li>
                                                    <a href="#">3</a>
                                                </li>
                                                <li>
                                                    <a href="#" aria-label="Next">
                                                        <i className="feather-chevron-right" />
                                                    </a>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </>



            </>
        );
    }
}

export default withNavigation(Course);