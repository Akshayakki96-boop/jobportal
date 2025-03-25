import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import withNavigation from '../withNavigation';
import Header from '../Header/header';
import AdvancedBreadcumb from '../Breadcumb/advancebreadcrumb';

class CandidateList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keepSpinner: true,
            candidateListing: [],
            currentPage: 1, // Tracks the current page
            pageSize: 4, // Number of records per page
            totalPages: 1,
            totalRecords: 0, // Total number of records
            searchQuery: "", // State to store the search input
            error: "",
        };

    }
    componentDidMount() {
        let url = window.location.search;
        var urlParams = new URLSearchParams(url);
        var jobId = urlParams.get('jobId');
        this.jobId = jobId;
        this.user = urlParams.get('user');
        this.getCandidates(0, 6);
    }



    getCandidates = (pageIndex, pageSize) => {
        this.setState({ keepSpinner: true });
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Employer/CandidateList`;
        const token = localStorage.getItem('authToken');
        var request = {
            "candidate_user_id": 0,
            "location": "string",
            "keyskills": "string",
            "notice_periods": 0,
            "pageIndex": pageIndex,
            "pageSize": pageSize
        }

        axios.post(url, request, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('candidatelisting', response.data);
                if (response.data.data && response.data.data.length > 0) {
                    const totalCount = response.data.data[0].total_records;
                    this.setState({ candidateListing: response.data.data, totalRecords: totalCount, keepSpinner: false, errorMessage: "" });
                }
                else {
                    this.setState({ keepSpinner: false, errorMessage: "No Candidate Found" });
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

    handlePageChange = (pageIndex) => {
        this.setState({ currentPage: pageIndex }, () => {
            this.getCandidates(pageIndex - 1, this.state.pageSize); // pageIndex - 1 for 0-based index
        });
    };
    handleSearchChange = (e) => {
        this.setState({ searchQuery: e.target.value.toLowerCase() }); // Normalize to lowercase for case-insensitive search
    };

    render() {
        const maskMobileNumber = (number) => {
            return number.slice(-4).padStart(number.length, 'X');
        };
        const maskEmail = (email) => {
            const [name, domain] = email.split("@");
            const maskedName = name.charAt(0) + "*****";
            return `${maskedName}@${domain}`;
        };
        
        const { candidateListing, currentPage, pageSize, totalRecords, searchQuery } = this.state;
        const startIndex = (currentPage - 1) * pageSize + 1;
        const endIndex = Math.min(currentPage * pageSize, totalRecords);

        const filteredCandidates = candidateListing?.filter((job) => {
            const prefer_location = job.prefer_location?.toString().toLowerCase() || ""; // Ensure it's a string
            // const fullname = job.fullname?.toLowerCase() || "";
            // const mobile_no = job.mobile_no?.toLowerCase() || "";

            return (
                prefer_location.includes(searchQuery) 
                // fullname.includes(searchQuery) ||
                // mobile_no.includes(searchQuery)
            );
        });
        return (
            <div className="col-lg-9">
                {this.state.keepSpinner && <div class="custom-loader">
                    <div class="loader-spinner"></div>
                    <p class="loader-text">Please Wait while Candidates are loading...</p>
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
                                            <h1 className="title mb--0">Candidates</h1>
                                        </div>

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
                                                    Showing {filteredCandidates.length > 0 ? startIndex : 0} - {filteredCandidates.length > 0 ? endIndex : 0} of {totalRecords} results
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-7 col-md-12">
                                        <div className="rbt-sorting-list d-flex flex-wrap align-items-center justify-content-start justify-content-lg-end">
                                            <div className="rbt-short-item mt-5">
                                                <form action="#" className="rbt-search-style me-0">
                                                    <input type="text" placeholder="Search by location.." value={this.state.searchQuery}
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
                                {filteredCandidates?.map((course) => (
                                    <div className="course-grid-3" key={course.courseid}>
                                        <div className="rbt-card variation-01 rbt-hover">
                                            <div className="rbt-card-img">
                                                <a href="#">
                                                    {course.profile_image ? <img src={`${process.env.REACT_APP_BASEURL}/Uploads/${course.profile_image}`} alt="Card image" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50px' }} /> :
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
                                                                fontSize: "12px", // Adjust font size as needed
                                                            }}
                                                        >
                                                            {this.getInitials(course.fullname || "User")}
                                                        </div>}


                                                </a>
                                            </div>
                                            <div className="rbt-card-body">
                                                <div className="rbt-card-top">

                                                </div>
                                                <h4 className="rbt-card-title">
                                                    {course.fullname}
                                                </h4>
                                                <ul className="rbt-meta">
                                                    <li>
                                                        <i className="fas fa-phone" />
                                                        {course.mobile_no ? maskMobileNumber(course.mobile_no) : "N/A"}
                                                    </li>
                                                    <li>
                                                        <i className="fas fa-envelope" />
                                                        {course.Email ? maskEmail(course.Email) : "N/A"}
                                                    </li>
                                                    <li>

                                                        <i className="fas fa-briefcase" />
                                                        {course.experience} years
                                                    </li>
                                                    <li>
                                                        <i
                                                            className="fas fa-id-badge"
                                                        />
                                                        {course.designation}
                                                    </li>
                                                    <li>
                                                        <i className="fas fa-money-bill-wave" /> {course.CTC || "NA"}
                                                    </li>

                                                    <li>
                                                        <i className="fas fa-chart-line" /> {course.ExpectedCTC || "NA"}
                                                    </li>
                                                    <li>
                                                        <i className="fas fa-map-marker-alt" /> {course.prefer_location || "NA"}
                                                    </li>
                                                </ul>
                                                <div className="rbt-card-bottom">
                                                    <div className="rbt-price">
                                                        <span className="current-price">
                                                            {course.notice_periods}  notice period
                                                        </span>
                                                    </div>
                                                    {/* <a className="rbt-btn-link" target='_blank' href={`${process.env.REACT_APP_BASEURL}/Uploads/${course.resumefile}`}>
                                                            View Profile
                                                            <i className="feather-arrow-right" />
                                                        </a> */}

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

export default withNavigation(CandidateList);