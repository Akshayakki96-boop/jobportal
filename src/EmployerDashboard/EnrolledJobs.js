import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import withNavigation from '../withNavigation';

class EnrolledJobs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }
    componentDidMount() {

    }



    render() {

        return (
            <div className="col-lg-9">
                <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
                    <div className="content">
                        <div className="section-title">
                            <h4 className="rbt-title-style-3">Enrolled Courses</h4>
                        </div>
                        <div className="advance-tab-button mb--30">
                            <ul
                                className="nav nav-tabs tab-button-style-2 justify-content-start"
                                id="myTab-4"
                                role="tablist"
                            >
                                <li role="presentation">
                                    <a
                                        href="#"
                                        //className={`tab-button ${activeTab === 'enrolledCourses' ? 'active' : ''}`}
                                        id="home-tab-4"
                                        // onClick={(e) => {
                                        //     e.preventDefault();
                                        //     handleTabClick('enrolledCourses');
                                        // }}
                                        data-bs-toggle="tab"
                                        data-bs-target="#home-4"
                                        role="tab"
                                        aria-controls="home-4"
                                        //aria-selected={activeTab === 'enrolledCourses'}
                                    >
                                        <span className="title">Enrolled Courses</span>
                                    </a>
                                </li>
                                <li role="presentation">
                                    <a
                                        href="#"
                                       // className={`tab-button ${activeTab === 'activeCourses' ? 'active' : ''}`}
                                        id="profile-tab-4"
                                        // onClick={(e) => {
                                        //     e.preventDefault();
                                        //     handleTabClick('activeCourses');
                                        // }}
                                        data-bs-toggle="tab"
                                        data-bs-target="#profile-4"
                                        role="tab"
                                        aria-controls="profile-4"
                                        //aria-selected={activeTab === 'activeCourses'}
                                    >
                                        <span className="title">Active Courses</span>
                                    </a>
                                </li>
                                <li role="presentation">
                                    <a
                                        href="#"
                                       // className={`tab-button ${activeTab === 'completedCourses' ? 'active' : ''}`}
                                        id="contact-tab-4"
                                        onClick={(e) => {
                                            e.preventDefault();
                                          // handleTabClick('completedCourses');
                                        }}
                                        data-bs-toggle="tab"
                                        data-bs-target="#contact-4"
                                        role="tab"
                                        aria-controls="contact-4"
                                        //aria-selected={activeTab === 'completedCourses'}
                                    >
                                        <span className="title">Completed Courses</span>
                                    </a>
                                </li>
                            </ul>

                            <div className="tab-content">
                                {/* {activeTab === 'enrolledCourses' && (
                                    <div id="home-4" className="tab-pane fade show active" role="tabpanel">
                                        <p>Content for Enrolled Courses</p>
                                    </div>
                                )} */}
                                {/* {activeTab === 'activeCourses' && (
                                    <div id="profile-4" className="tab-pane fade show active" role="tabpanel">
                                        <p>Content for Active Courses</p>
                                    </div>
                                )} */}
                                {/* {activeTab === 'completedCourses' && (
                                    <div id="contact-4" className="tab-pane fade show active" role="tabpanel">
                                        <p>Content for Completed Courses</p>
                                    </div>
                                )} */}
                            </div>
                        </div>
                        <div className="tab-content">
                            <div
                                className="tab-pane fade active show"
                                id="home-4"
                                role="tabpanel"
                                aria-labelledby="home-tab-4"
                            >
                                <div className="row g-5">
                                    {/* Start Single Course  */}
                                    <div className="col-lg-4 col-md-6 col-12">
                                        <div className="rbt-card variation-01 rbt-hover">
                                            <div className="rbt-card-img">
                                                <a href="course-details.html">
                                                    <img
                                                        src="assets/images/course/course-online-01.jpg"
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
                                                    <a href="course-details.html">React Front To Back</a>
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
                                                <div className="rbt-progress-style-1 mb--20 mt--10">
                                                    <div className="single-progress">
                                                        <h6 className="rbt-title-style-2 mb--10">Complete</h6>
                                                        <div className="progress">
                                                            <div
                                                                className="progress-bar wow fadeInLeft bar-color-success"
                                                                data-wow-duration="0.5s"
                                                                data-wow-delay=".3s"
                                                                role="progressbar"
                                                                style={{ width: "90%" }}
                                                                aria-valuenow={90}
                                                                aria-valuemin={0}
                                                                aria-valuemax={100}
                                                            ></div>
                                                            <span className="rbt-title-style-2 progress-number">90%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="rbt-card-bottom">
                                                    <a
                                                        className="rbt-btn btn-sm bg-primary-opacity w-100 text-center"
                                                        href="#"
                                                    >
                                                        Download Certificate
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Single Course  */}
                                    {/* Start Single Course  */}
                                    <div className="col-lg-4 col-md-6 col-12">
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
                                                    <a href="course-details.html">PHP Beginner + Advanced</a>
                                                </h4>
                                                <ul className="rbt-meta">
                                                    <li>
                                                        <i className="feather-book" />
                                                        10 Lessons
                                                    </li>
                                                    <li>
                                                        <i className="feather-users" />
                                                        30 Students
                                                    </li>
                                                </ul>
                                                <div className="rbt-progress-style-1 mb--20 mt--10">
                                                    <div className="single-progress">
                                                        <h6 className="rbt-title-style-2 mb--10">Complete</h6>
                                                        <div className="progress">
                                                            <div
                                                                className="progress-bar wow fadeInLeft bar-color-success"
                                                                data-wow-duration="0.5s"
                                                                data-wow-delay=".3s"
                                                                role="progressbar"
                                                                style={{ width: "40%" }}
                                                                aria-valuenow={40}
                                                                aria-valuemin={0}
                                                                aria-valuemax={100}
                                                            ></div>
                                                            <span className="rbt-title-style-2 progress-number">40%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="rbt-card-bottom">
                                                    <a
                                                        className="rbt-btn btn-sm bg-primary-opacity w-100 text-center"
                                                        href="#"
                                                    >
                                                        Download Certificate
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Single Course  */}
                                    {/* Start Single Course  */}
                                    <div className="col-lg-4 col-md-6 col-12">
                                        <div className="rbt-card variation-01 rbt-hover">
                                            <div className="rbt-card-img">
                                                <a href="course-details.html">
                                                    <img
                                                        src="assets/images/course/course-online-03.jpg"
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
                                                        <span className="rating-count"> (4 Reviews)</span>
                                                    </div>
                                                    <div className="rbt-bookmark-btn">
                                                        <a className="rbt-round-btn" title="Bookmark" href="#">
                                                            <i className="feather-bookmark" />
                                                        </a>
                                                    </div>
                                                </div>
                                                <h4 className="rbt-card-title">
                                                    <a href="course-details.html">Angular Zero to Mastery</a>
                                                </h4>
                                                <ul className="rbt-meta">
                                                    <li>
                                                        <i className="feather-book" />
                                                        14 Lessons
                                                    </li>
                                                    <li>
                                                        <i className="feather-users" />
                                                        26 Students
                                                    </li>
                                                </ul>
                                                <div className="rbt-progress-style-1 mb--20 mt--10">
                                                    <div className="single-progress">
                                                        <h6 className="rbt-title-style-2 mb--10">Complete</h6>
                                                        <div className="progress">
                                                            <div
                                                                className="progress-bar wow fadeInLeft bar-color-success"
                                                                data-wow-duration="0.5s"
                                                                data-wow-delay=".3s"
                                                                role="progressbar"
                                                                style={{ width: "65%" }}
                                                                aria-valuenow={65}
                                                                aria-valuemin={0}
                                                                aria-valuemax={100}
                                                            ></div>
                                                            <span className="rbt-title-style-2 progress-number">65%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="rbt-card-bottom">
                                                    <a
                                                        className="rbt-btn btn-sm bg-primary-opacity w-100 text-center"
                                                        href="#"
                                                    >
                                                        Download Certificate
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Single Course  */}
                                </div>
                            </div>
                            <div
                                className="tab-pane fade"
                                id="profile-4"
                                role="tabpanel"
                                aria-labelledby="profile-tab-4"
                            >
                                <div className="row g-5">
                                    {/* Start Single Course  */}
                                    <div className="col-lg-4 col-md-6 col-12">
                                        <div className="rbt-card variation-01 rbt-hover">
                                            <div className="rbt-card-img">
                                                <a href="course-details.html">
                                                    <img
                                                        src="assets/images/course/course-online-04.jpg"
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
                                                        <span className="rating-count"> (3 Reviews)</span>
                                                    </div>
                                                    <div className="rbt-bookmark-btn">
                                                        <a className="rbt-round-btn" title="Bookmark" href="#">
                                                            <i className="feather-bookmark" />
                                                        </a>
                                                    </div>
                                                </div>
                                                <h4 className="rbt-card-title">
                                                    <a href="course-details.html">English Langiage Club</a>
                                                </h4>
                                                <ul className="rbt-meta">
                                                    <li>
                                                        <i className="feather-book" />
                                                        20 Lessons
                                                    </li>
                                                    <li>
                                                        <i className="feather-users" />
                                                        30 Students
                                                    </li>
                                                </ul>
                                                <div className="rbt-card-bottom">
                                                    <div className="rbt-price">
                                                        <span className="current-price">$40</span>
                                                        <span className="off-price">$86</span>
                                                    </div>
                                                    <a className="rbt-btn-link" href="course-details.html">
                                                        Learn More
                                                        <i className="feather-arrow-right" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Single Course  */}
                                    {/* Start Single Course  */}
                                    <div className="col-lg-4 col-md-6 col-12">
                                        <div className="rbt-card variation-01 rbt-hover">
                                            <div className="rbt-card-img">
                                                <a href="course-details.html">
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
                                                        <span className="rating-count"> (3 Reviews)</span>
                                                    </div>
                                                    <div className="rbt-bookmark-btn">
                                                        <a className="rbt-round-btn" title="Bookmark" href="#">
                                                            <i className="feather-bookmark" />
                                                        </a>
                                                    </div>
                                                </div>
                                                <h4 className="rbt-card-title">
                                                    <a href="course-details.html">Graphic Courses Club</a>
                                                </h4>
                                                <ul className="rbt-meta">
                                                    <li>
                                                        <i className="feather-book" />
                                                        50 Lessons
                                                    </li>
                                                    <li>
                                                        <i className="feather-users" />
                                                        10 Students
                                                    </li>
                                                </ul>
                                                <div className="rbt-card-bottom">
                                                    <div className="rbt-price">
                                                        <span className="current-price">$40</span>
                                                        <span className="off-price">$86</span>
                                                    </div>
                                                    <a className="rbt-btn-link" href="course-details.html">
                                                        Learn More
                                                        <i className="feather-arrow-right" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Single Course  */}
                                    {/* Start Single Course  */}
                                    <div className="col-lg-4 col-md-6 col-12">
                                        <div className="rbt-card variation-01 rbt-hover">
                                            <div className="rbt-card-img">
                                                <a href="course-details.html">
                                                    <img
                                                        src="assets/images/course/course-online-05.jpg"
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
                                                        <span className="rating-count"> (3 Reviews)</span>
                                                    </div>
                                                    <div className="rbt-bookmark-btn">
                                                        <a className="rbt-round-btn" title="Bookmark" href="#">
                                                            <i className="feather-bookmark" />
                                                        </a>
                                                    </div>
                                                </div>
                                                <h4 className="rbt-card-title">
                                                    <a href="course-details.html">Wed Design Club</a>
                                                </h4>
                                                <ul className="rbt-meta">
                                                    <li>
                                                        <i className="feather-book" />
                                                        20 Lessons
                                                    </li>
                                                    <li>
                                                        <i className="feather-users" />
                                                        30 Students
                                                    </li>
                                                </ul>
                                                <div className="rbt-card-bottom">
                                                    <div className="rbt-price">
                                                        <span className="current-price">$40</span>
                                                        <span className="off-price">$86</span>
                                                    </div>
                                                    <a className="rbt-btn-link" href="course-details.html">
                                                        Learn More
                                                        <i className="feather-arrow-right" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Single Course  */}
                                </div>
                            </div>
                            <div
                                className="tab-pane fade"
                                id="contact-4"
                                role="tabpanel"
                                aria-labelledby="contact-tab-4"
                            >
                                <div className="row g-5">
                                    {/* Start Single Course  */}
                                    <div className="col-lg-4 col-md-6 col-12">
                                        <div className="rbt-card variation-01 rbt-hover">
                                            <div className="rbt-card-img">
                                                <a href="course-details.html">
                                                    <img
                                                        src="assets/images/course/course-online-01.jpg"
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
                                                    <a href="course-details.html">React Front To Back</a>
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
                                                <div className="rbt-progress-style-1 mb--20 mt--10">
                                                    <div className="single-progress">
                                                        <h6 className="rbt-title-style-2 mb--10">Complete</h6>
                                                        <div className="progress">
                                                            <div
                                                                className="progress-bar wow fadeInLeft bar-color-success"
                                                                data-wow-duration="0.5s"
                                                                data-wow-delay=".3s"
                                                                role="progressbar"
                                                                style={{ width: "100%" }}
                                                                aria-valuenow={100}
                                                                aria-valuemin={0}
                                                                aria-valuemax={100}
                                                            ></div>
                                                            <span className="rbt-title-style-2 progress-number">
                                                                100%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="rbt-card-bottom">
                                                    <a
                                                        className="rbt-btn btn-sm bg-primary-opacity w-100 text-center"
                                                        href="#"
                                                    >
                                                        Download Certificate
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Single Course  */}
                                    {/* Start Single Course  */}
                                    <div className="col-lg-4 col-md-6 col-12">
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
                                                    <a href="course-details.html">PHP Beginner + Advanced</a>
                                                </h4>
                                                <ul className="rbt-meta">
                                                    <li>
                                                        <i className="feather-book" />
                                                        10 Lessons
                                                    </li>
                                                    <li>
                                                        <i className="feather-users" />
                                                        30 Students
                                                    </li>
                                                </ul>
                                                <div className="rbt-progress-style-1 mb--20 mt--10">
                                                    <div className="single-progress">
                                                        <h6 className="rbt-title-style-2 mb--10">Complete</h6>
                                                        <div className="progress">
                                                            <div
                                                                className="progress-bar wow fadeInLeft bar-color-success"
                                                                data-wow-duration="0.5s"
                                                                data-wow-delay=".3s"
                                                                role="progressbar"
                                                                style={{ width: "100%" }}
                                                                aria-valuenow={100}
                                                                aria-valuemin={0}
                                                                aria-valuemax={100}
                                                            ></div>
                                                            <span className="rbt-title-style-2 progress-number">
                                                                100%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="rbt-card-bottom">
                                                    <a
                                                        className="rbt-btn btn-sm bg-primary-opacity w-100 text-center"
                                                        href="#"
                                                    >
                                                        Download Certificate
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Single Course  */}
                                    {/* Start Single Course  */}
                                    <div className="col-lg-4 col-md-6 col-12">
                                        <div className="rbt-card variation-01 rbt-hover">
                                            <div className="rbt-card-img">
                                                <a href="course-details.html">
                                                    <img
                                                        src="assets/images/course/course-online-03.jpg"
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
                                                        <span className="rating-count"> (4 Reviews)</span>
                                                    </div>
                                                    <div className="rbt-bookmark-btn">
                                                        <a className="rbt-round-btn" title="Bookmark" href="#">
                                                            <i className="feather-bookmark" />
                                                        </a>
                                                    </div>
                                                </div>
                                                <h4 className="rbt-card-title">
                                                    <a href="course-details.html">Angular Zero to Mastery</a>
                                                </h4>
                                                <ul className="rbt-meta">
                                                    <li>
                                                        <i className="feather-book" />
                                                        14 Lessons
                                                    </li>
                                                    <li>
                                                        <i className="feather-users" />
                                                        26 Students
                                                    </li>
                                                </ul>
                                                <div className="rbt-progress-style-1 mb--20 mt--10">
                                                    <div className="single-progress">
                                                        <h6 className="rbt-title-style-2 mb--10">Complete</h6>
                                                        <div className="progress">
                                                            <div
                                                                className="progress-bar wow fadeInLeft bar-color-success"
                                                                data-wow-duration="0.5s"
                                                                data-wow-delay=".3s"
                                                                role="progressbar"
                                                                style={{ width: "100%" }}
                                                                aria-valuenow={100}
                                                                aria-valuemin={0}
                                                                aria-valuemax={100}
                                                            ></div>
                                                            <span className="rbt-title-style-2 progress-number">
                                                                100%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="rbt-card-bottom">
                                                    <a
                                                        className="rbt-btn btn-sm bg-primary-opacity w-100 text-center"
                                                        href="#"
                                                    >
                                                        Download Certificate
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Single Course  */}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div >



        );
    }
}

export default withNavigation(EnrolledJobs);