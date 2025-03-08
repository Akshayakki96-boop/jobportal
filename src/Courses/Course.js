import React from 'react';
import axios from 'axios';
import withNavigation from '../withNavigation';
import Header from '../Header/header';
import parse from 'html-react-parser';

class Course extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courseListingData: [],
            currentPage: 1, // Tracks the current page
            pageSize: 6, // Number of records per page
            totalPages: 1,
            totalRecords: 0, // Total number of records
            searchQuery: "", // State to store the search input
            dashBoardData: "",
            searchFilteredQuery: "",
            errorMessage: "",
        };

    }
    componentDidMount() {
        //this.getDashboardUser();
        this.getAllCourse(0, this.state.pageSize);

    }

    getAllCourse = (pageIndex, pageSize) => {
        this.setState({ keepSpinner: true });
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
            "pagesize": pageSize
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

                    this.setState({ courseListingData: response.data.data, totalRecords: totalCount, keepSpinner: false, errorMessage: "" });
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

    handlePageChange = (pageIndex) => {
        this.setState({ currentPage: pageIndex }, () => {
            this.getAllJobs(pageIndex - 1, this.state.pageSize); // pageIndex - 1 for 0-based index
        });
    };
    handleSearchChange = () => {
        this.setState({ searchFilteredQuery: this.state.searchQuery }); // Normalize to lowercase for case-insensitive search
    };

    handleSearchQuery = (e) => {
        this.setState({ searchQuery: e.target.value.toLowerCase() }); // Normalize to lowercase for case-insensitive search
    }

    getInitials = (name) => {
        if (!name) return "U"; // Default to "U" if name is not provided
        const parts = name.split(" ");
        return parts.length > 1
            ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
            : parts[0][0].toUpperCase();
    };
    render() {
        const { courseListingData, currentPage, pageSize, totalRecords, searchFilteredQuery } = this.state;
        const startIndex = (currentPage - 1) * pageSize + 1;
        const endIndex = Math.min(currentPage * pageSize, totalRecords);
        const filteredCourse = courseListingData?.filter((job) => {
            const course_code = job.course_code?.toString().toLowerCase() || ""; // Ensure it's a string
            const coursetitle = job.coursetitle?.toLowerCase() || "";
            const course_level_name = job.course_level_name?.toLowerCase() || "";

            return (
                course_code.includes(searchFilteredQuery) ||
                coursetitle.includes(searchFilteredQuery) ||
                course_level_name.includes(searchFilteredQuery)
            );
        });
        return (
            <>
                <Header dashBoardData={this.state.dashBoardData} />

                <>
                    {this.state.keepSpinner && <div class="custom-loader">
                        <div class="loader-spinner"></div>
                        <p class="loader-text">Please Wait while Courses are loading...</p>
                    </div>}
                    <div className="rbt-page-banner-wrapper">
                        {/* Start Banner BG Image  */}
                        <div className="rbt-banner-image" />
                        {/* End Banner BG Image  */}
                        <div className="rbt-banner-content">
                            {/* Start Banner Content Top  */}
                            <div className="rbt-banner-content-top">
                                <div className="container">
                                    <div style={{ textAlign: "left" }} className="row">
                                        <div className="col-lg-12">
                                            {/* Start Breadcrumb Area  */}
                                            <ul className="page-list">
                                                <li className="rbt-breadcrumb-item">
                                                    <a href="/">Home</a>
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
                                                    <div className="image">🎉</div> {filteredCourse.length} Courses
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
                                                {/* <div className="rbt-short-item switch-layout-container">
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
                                                </div> */}
                                                <div className="rbt-short-item">
                                                    <span className="course-index">Showing {filteredCourse.length > 0 ? startIndex : 0} - {filteredCourse.length > 0 ? endIndex : 0} of {filteredCourse.length} results</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-7 col-md-12">
                                            <div className="rbt-sorting-list d-flex flex-wrap align-items-center justify-content-start justify-content-lg-end">
                                                <div className="rbt-short-item">
                                                    <form action="#" className="rbt-search-style me-0">
                                                        <input type="text" placeholder="Search your Course" value={this.state.searchQuery}
                                                            onChange={this.handleSearchQuery} />
                                                        <button
                                                            type="button"
                                                            className="rbt-search-btn rbt-round-btn"
                                                        // Prevent default form submission
                                                        >
                                                            <i className="feather-search" />
                                                        </button>
                                                    </form>
                                                </div>
                                                <div className="rbt-short-item">
                                                    <div className="view-more-btn text-start text-sm-end">
                                                        <button type="button" onClick={this.handleSearchChange} className="discover-filter-button discover-filter-activation rbt-btn btn-white btn-md radius-round">
                                                            Filter
                                                            <i className="feather-filter" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Start Filter Toggle */}
                                    {/* <div className="default-exp-wrapper default-exp-expand">
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
                                    </div> */}
                                    {/* End Filter Toggle  */}
                                </div>
                            </div>
                            {/* End Course Top  */}
                        </div>
                    </div>
                    <div className="rbt-section-overlayping-top rbt-section-gapBottom">
                        <div className="inner">
                            {!this.state.errorMessage ? (
                                <div className="container">
                                    <div className="rbt-course-grid-column courall">
                                        {/* Start Single Card */}
                                        {filteredCourse?.map((course) => (
                                            <div className="course-grid-3" key={course.courseid}>
                                                <div className="rbt-card variation-01 rbt-hover">
                                                    <div className="rbt-card-img">
                                                        <a href={`/Course-Details?courseId=${course.courseid}`}>
                                                            <img
                                                                src={course.course_image ? `${process.env.REACT_APP_BASEURL}/Uploads/${course.course_image}` : "assets/images/job-zob-img.jpg"}
                                                                alt="Card image"
                                                            />
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
                                                                50 Students
                                                            </li>
                                                            <li>
                                                                {!course.isactive ? (
                                                                    <a href="#" onClick={() => this.ActivateCourse(course)}>
                                                                        Activate Course
                                                                    </a>
                                                                ) : (
                                                                    "Activated"
                                                                )}
                                                            </li>
                                                        </ul>
                                                         <p className="rbt-card-text">
                                                                                  {parse(
                                                                                    course.description.split(" ").length > 20
                                                                                      ? course.description.split(" ").slice(0, 20).join(" ") + "..."
                                                                                      : course.description
                                                                                  )}
                                                                                </p>
                                                        <div className="rbt-author-meta mb--20">
                                                            <div className="rbt-avater">
                                                                <a href="#">
                                                                    {course.profile_image ? (
                                                                        <img
                                                                            src={`${process.env.REACT_APP_BASEURL}/Uploads/${course.profile_image}`}
                                                                            alt={course.FullName}
                                                                        />
                                                                    ) : (
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
                                                                            {this.getInitials(course.FullName || "User")}
                                                                        </div>
                                                                    )}
                                                                </a>
                                                            </div>
                                                            <div className="rbt-author-info">
                                                                By {course.FullName}
                                                            </div>
                                                        </div>
                                                        <div className="rbt-card-bottom">
                                                            <div className="rbt-price">
                                                                <span className="current-price">{course.currency ? course.currency + '-' + course.course_fees : course.course_fees}</span>
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
                                        {/* End Single Card */}
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
                                                                    this.handlePageChange(index + 1);
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
                            ) : (
                                <h2>{this.state.errorMessage}</h2>
                            )}

                        </div>
                    </div>


                </>



            </>
        );
    }
}

export default withNavigation(Course);