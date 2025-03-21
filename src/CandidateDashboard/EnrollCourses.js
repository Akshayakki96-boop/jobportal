import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import withNavigation from '../withNavigation';
import parse from 'html-react-parser';

class EnrollCourses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updatedUserData: { ...this.props.userData },
            courseListingData: [],
            currentPage: 1, // Tracks the current page
            pageSize: 6, // Number of records per page
            totalPages: 1,
            totalRecords: 0, // Total number of records
            searchQuery: "", // State to store the search input
        };

    }
    componentDidMount() {
        this.getAllCourse(0, this.state.pageSize);
    }

    getAllCourse = (pageIndex, pageSize) => {
        this.setState({ keepSpinner: true, courseListingData: [] });
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Course/GetCourse`;
        const token = localStorage.getItem('authToken');
        var request =
        {
            "courseId": 0,
            "coursetitle": "",
            "isactive": true,
            "user_id": 0,
            "pageIndex": pageIndex,
            "pagesize": pageSize,
            "candidate_user_id": this.state.updatedUserData.user_id

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

                    this.setState({ courseListingData: response.data.data, totalRecords: totalCount, keepSpinner: false });
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

    handlePageChange = (pageIndex) => {
        this.setState({ currentPage: pageIndex }, () => {
            this.getAllCourse(pageIndex - 1, this.state.pageSize); // pageIndex - 1 for 0-based index
        });
    };
    handleSearchChange = (e) => {
        this.setState({ searchQuery: e.target.value.toLowerCase() }); // Normalize to lowercase for case-insensitive search
    };

    applyCourse = (course) => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Candidate/ApplyCourse`;
        const token = localStorage.getItem('authToken');
        var request =
        {
            "applied_course_id": 0,
            "course_id": course.courseid,
            "candidate_user_id": this.state.updatedUserData.user_id,
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
                this.setState({ applyCourseData: response.data.data,isEnroll:true });

                    this.setState({ responseMessage: "Course Enrolled successfully", alertVariant: 'success' });
                    window.scrollTo(0, 0);
                    this.getAllCourse(0, this.state.pageSize);
            })
            .catch((error) => {
                this.setState({
                    responseMessage: "Something went wrong !",
                    alertVariant: 'danger', // Error alert variant
                });
                window.scrollTo(0, 0);
                });
    }

    render() {
        const { courseListingData, currentPage, pageSize, totalRecords, searchQuery } = this.state;
        const startIndex = (currentPage - 1) * pageSize + 1;
        const endIndex = Math.min(currentPage * pageSize, totalRecords);

        const filteredCourse = courseListingData?.filter((job) => {
            const course_code = job.course_code?.toString().toLowerCase() || ""; // Ensure it's a string
            const coursetitle = job.coursetitle?.toLowerCase() || "";
            const course_level_name = job.course_level_name?.toLowerCase() || "";

            return (
                course_code.includes(searchQuery) ||
                coursetitle.includes(searchQuery) ||
                course_level_name.includes(searchQuery)
            );
        });
        return (
            <div className="col-lg-9">
                {this.state.keepSpinner && <div class="custom-loader">
                    <div class="loader-spinner"></div>
                    <p class="loader-text">Please Wait while Courses are loading...</p>
                </div>}
                <div className="container mt-5">
                    {this.state.responseMessage && (
                        <Alert variant={this.state.alertVariant} onClose={() => this.setState({ responseMessage: '' })} dismissible>
                            {this.state.responseMessage}
                        </Alert>
                    )}
                </div>
                <div className="rbt-page-banner-wrapper">
                    {/* Start Banner BG Image  */}
                    <div className="rbt-banner-image" />
                    {/* End Banner BG Image  */}
                    <div className="rbt-banner-content">
                        {/* Start Banner Content Top  */}
                        <div className="rbt-banner-content-top">
                            <div className="container">
                                <div style={{ textAlign: 'left' }} className="row">
                                    <div className="col-lg-12">

                                        <div className=" title-wrapper">
                                            <h1 className="title mb--0">Courses</h1>
                                        </div>
                                        <p className="description">
                                            Courses that help beginner designers become true unicorns.{" "}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End Banner Content Top  */}
                        { /* Start Course Top  */}
                        <div className="rbt-course-top-wrapper mt--40">
                            <div className="container">
                                <div className="row g-5 align-items-center">
                                    <div className="col-lg-5 col-md-12">
                                        <div className="rbt-sorting-list d-flex flex-wrap align-items-center">
                                            <div className="rbt-short-item">
                                                <span className="course-index">
                                                    Showing {filteredCourse.length > 0 ? startIndex : 0} - {filteredCourse.length > 0 ? endIndex : 0} of {totalRecords} results
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-7 col-md-12">
                                        <div className="rbt-sorting-list d-flex flex-wrap align-items-center justify-content-start justify-content-lg-end">
                                            <div className="rbt-short-item mt-5">
                                                <form action="#" className="rbt-search-style me-0">
                                                    <input type="text" placeholder="Search your courses.." value={this.state.searchQuery}
                                                        onChange={this.handleSearchChange} />
                                                    <button
                                                        type="button"
                                                        className="rbt-search-btn rbt-round-btn"
                                                        onClick={(e) => e.preventDefault()} // Prevent default form submission
                                                    >
                                                        <i className="feather-search" />
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End Course Top  */}

                    </div>
                </div>
                <div className="rbt-section-overlayping-top rbt-section-gapBottom">
                    <div className="inner">
                        <div className="container">
                            <div className="rbt-course-grid-column courall">
                                {filteredCourse?.map((course) => (
                                    <div className="course-grid-3" key={course.courseid}>
                                        <div className="rbt-card variation-01 rbt-hover">
                                            <div className="rbt-card-img">
                                                <a href={`/Course-Details?courseId=${course.courseid}`}>
                                                    <img
                                                        src={course.course_image ? `${process.env.REACT_APP_BASEURL}/Uploads/${course.course_image}` : "assets/images/job-zob-img.jpg"}// Use a default image if companylogo is missing
                                                        alt="Card image"
                                                    />

                                                </a>
                                            </div>
                                            <div className="rbt-card-body">
                                                <div className="rbt-card-top">

                                                </div>
                                                <h4 className="rbt-card-title">
                                                    <a href={`/Course-Details?courseId=${course.courseid}`}>{course.coursetitle}</a>
                                                </h4>
                                                <ul className="rbt-meta">
                                                    <li>
                                                        <i className="feather-book" />
                                                        {course.no_of_lessons} Lessons
                                                    </li>
                                                    <li>
                                                        <i className="feather-users" />
                                                        50 Students
                                                    </li>
                                                    <li>

                                                       {!course.is_applied ? <a href="#" style={{ textDecoration: 'underline',color:'blue' }} onClick={() => this.applyCourse(course)}>Enroll Now</a>:'Enrolled'}
                                                    </li>
                                                </ul>

                                                {/* <p className="rbt-card-text">
                          {parse(
                            course.description.split(" ").length > 20
                              ? course.description.split(" ").slice(0, 20).join(" ") + "..."
                              : course.description
                          )}
                        </p> */}

                                                <div className="rbt-card-bottom">
                                                    <div className="rbt-price">
                                                        <span className="current-price">{course.currency ? course.currency + '-' + course.course_fees : course.course_fees}</span>
                                                        {/* <span className="off-price">$120</span> */}
                                                    </div>
                                                    <a className="rbt-btn-link" href={`/Course-Details?courseId=${course.courseid}`}>
                                                        Learn More
                                                        <i className="feather-arrow-right" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                            <div className="row">
                                <div className="col-lg-12 mt--60">
                                    <nav>
                                        <ul className="rbt-pagination">
                                            {/* Previous Button */}
                                            <li>
                                                <a
                                                    href="#"
                                                    aria-label="Previous"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (currentPage > 1) this.handlePageChange(currentPage - 1);
                                                    }}
                                                >
                                                    <i className="feather-chevron-left" />
                                                </a>
                                            </li>

                                            {/* Page Numbers */}
                                            {Array.from({ length: Math.ceil(totalRecords / pageSize) }, (_, index) => (
                                                <li key={index} className={currentPage === index + 1 ? "active" : ""}>
                                                    <a
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            this.handlePageChange(index + 1); // 1-based index
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </a>
                                                </li>
                                            ))}

                                            {/* Next Button */}
                                            <li>
                                                <a
                                                    href="#"
                                                    aria-label="Next"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (currentPage < Math.ceil(totalRecords / pageSize)) this.handlePageChange(currentPage + 1);
                                                    }}
                                                >
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
                {/* End Card Style */}
            </div>




        );
    }
}

export default withNavigation(EnrollCourses);