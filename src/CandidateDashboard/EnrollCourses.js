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
            "candidate_user_id": this.state.updatedUserData.basic_info.user_id

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
                    this.setState({ errorMessage: "No Training Found", keepSpinner: false });
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

    applyCourse = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Candidate/ApplyCourse`;
        const token = localStorage.getItem('authToken');
        var request =
        {
            "applied_course_id": 0,
            "course_id": this.courseId,
            "candidate_user_id": this.state.updatedUserData.basic_info.user_id,
            "ip_address": "string",
            "status": 1,
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

                    this.setState({ responseMessage: "Training Enrolled successfully", alertVariant: 'success' });
                    window.scrollTo(0, 0);
                    const { currentPage, pageSize } = this.state;
                    this.setState({ currentPage }, () => {
                        this.getAllCourse(this.state.currentPage - 1, pageSize); // Maintain the current page after refresh
                      });
                    
            })
            .catch((error) => {
                this.setState({
                    responseMessage: "Something went wrong !",
                    alertVariant: 'danger', // Error alert variant
                });
                window.scrollTo(0, 0);
                });
            }

      enrollCourse = (course) => {
        this.courseId=course.courseid;
        this.setState({ showConfirmPopup: true });

    }
    cancelEnrollment = (course) => {
        this.courseId=course.courseid;
        this.setState({ showCancelConfirmPopup: true });
    }

    cancelCourse = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Candidate/ApplyCourse`;
        const token = localStorage.getItem('authToken');
        var request =
        {
            "applied_course_id": 0,
            "course_id": this.courseId,
            "candidate_user_id": this.state.updatedUserData.basic_info.user_id,
            "ip_address": "string",
            "status": 0,
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

                    this.setState({ responseMessage: "Enrollment cancel successfully", alertVariant: 'success' });
                    window.scrollTo(0, 0);
                    const { currentPage, pageSize } = this.state;
                    this.setState({ currentPage }, () => {
                        this.getAllCourse(this.state.currentPage - 1, pageSize); // Maintain the current page after refresh
                      });
                    
            })
            .catch((error) => {
                this.setState({
                    responseMessage: "Something went wrong !",
                    alertVariant: 'danger', // Error alert variant
                });
                window.scrollTo(0, 0);
                });
            }


    getInitials = (name) => {
        if (!name) return "U"; // Default to "U" if name is not provided
    
        const parts = name.trim().split(" "); // Trim to remove extra spaces
    
        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase() // Two initials
            : parts[0][0].toUpperCase(); // Single initial
    };

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
                <p class="loader-text">Please Wait while training are loading...</p>
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
                            <h1 className="title mb--0">Trainings</h1>
                        </div>
                        <p className="description">
                            Learn. Certify. Succeed. – Upskill with industry-leading training and unlock new career opportunities!
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
                                <input type="text" placeholder="Search your training.." value={this.state.searchQuery}
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
            <div>&nbsp;</div>
            <div className="rbt-section-overlayping-top rbt-section-gapBottom">
                <div className="inner">
                <div className="container">
                    <div className="rbt-course-grid-column courall">
                    {filteredCourse?.length > 0 ? (
        filteredCourse.map((course) => (
        <div className="course-grid-3" key={course.courseid}>
            <div className="rbt-card variation-01 rbt-hover">
            <div className="rbt-card-img">
                <a href={`/Course-Details?courseId=${course.courseid}`}>
                {!course.course_image ? (
                    <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "60px",
                        height: "60px",
                        backgroundColor: "#ccc",
                        color: "#fff",
                        borderRadius: "50%",
                        fontWeight: "bold",
                        fontSize: "18px",
                    }}
                    >
                    {this.getInitials(course.coursetitle || "User")}
                    </div>
                ) : (
                    <img
                    src={`${process.env.REACT_APP_BASEURL}/Uploads/${course.course_image}`}
                    alt="Card image"
                    style={{
                        maxWidth: "500px", // Adjust as needed
                        maxHeight: "150px", // Adjust as needed
                      }}
                    />
                )}
                </a>
            </div>
            <div className="rbt-card-body">
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
                   {course.applied_candidate_count} Students
                </li>
                {/* <li>
                    {!course.is_applied ? (
                    <a
                        href="#"
                        style={{ textDecoration: "underline", color: "blue" }}
                        onClick={() => this.enrollCourse(course)}
                    >
                        Enroll Now
                    </a>
                    ) : (
                    <a
                        href="#"
                        style={{ textDecoration: "underline", color: "blue" }}
                        onClick={() => this.cancelEnrollment(course)}
                    >
                        Cancel Enrollment
                    </a>
                    )}
                </li> */}
                </ul>

                <div className="rbt-card-bottom">
                <div className="rbt-price">
                    <span className="current-price">
                    {course.currency
                        ? course.currency + "-" + course.course_fees
                        : course.course_fees}
                    </span>
                </div>
                <a className="rbt-btn-link" href={`/Course-Details?courseId=${course.courseid}`}>
                    Learn More
                    <i className="feather-arrow-right" />
                </a>
                </div>
            </div>
            </div>
        </div>
        ))
    ) : (
        <div className="no-courses-found">
        <p>No Training Found</p>
        </div>
    )}


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
            {this.state.showCancelConfirmPopup && (
  <>
    {/* Background overlay */}
    <div className="modal-backdrop show"></div>

    {/* Modal */}
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      style={{
        position: "fixed",
        top: "100%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1050, // Ensures modal is above the backdrop
      }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Cancel Enrollment</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => this.setState({ showCancelConfirmPopup: false })}
            ></button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to cancel the enrollment?</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => {
                this.setState({ showCancelConfirmPopup: false });
                this.cancelCourse();
              }}
            >
              OK
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={() => this.setState({ showCancelConfirmPopup: false })}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
)}


{this.state.showConfirmPopup && (
                <>
                {/* Background overlay */}
                <div className="modal-backdrop show"></div>

                {/* Modal */}
                <div className="modal show d-block" tabIndex="-1" role="dialog"  style={{
        position: "fixed",
        top: "100%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1050, // Ensures modal is above the backdrop
      }}>
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
                        <p>Are you sure you want to enroll for the Training?</p>
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

            </div>




        );
    }
}

export default withNavigation(EnrollCourses);