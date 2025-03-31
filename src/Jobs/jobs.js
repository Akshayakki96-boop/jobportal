import React from 'react';
import axios from 'axios';
import withNavigation from '../withNavigation';
import Header from '../Header/header';
import parse from 'html-react-parser';

class jobs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUserDashboard: true,
            dashBoardData: "",
            joblistingdata: [],
            currentPage: 1, // Tracks the current page
            pageSize: 4, // Number of records per page
            totalPages: 1,
            totalRecords: 0, // Total number of records
            searchQuery: "", // State to store the search input
            errorMessage: "",
        };

    }
    componentDidMount() {
        const token = localStorage.getItem('authToken');
        if (token) {
            this.getDashboardUser();
        }
        else {
            this.setState({ dashBoardData: "" });
        }
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
                    this.setState({ joblistingdata: response.data.data, totalRecords: totalCount, errorMessage: "", keepSpinner: false });
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
    // Handle page click
    handlePageChange = (pageIndex) => {
        this.setState({ currentPage: pageIndex }, () => {
            this.getAllJobs(pageIndex - 1, this.state.pageSize); // pageIndex - 1 for 0-based index
        });
    };
    handleSearchChange = (e) => {
        this.setState({ searchQuery: e.target.value.toLowerCase() }); // Normalize to lowercase for case-insensitive search
    };

    getInitials = (name) => {
        if (!name) return "U"; // Default to "U" if name is not provided
    
        const parts = name.trim().split(" "); // Trim to remove extra spaces
    
        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase() // Two initials
            : parts[0][0].toUpperCase(); // Single initial
    };
    render() {
        const { joblistingdata, currentPage, pageSize, totalRecords, searchQuery } = this.state;
        const startIndex = (currentPage - 1) * pageSize + 1;
        const endIndex = Math.min(currentPage * pageSize, totalRecords);

        const filteredJobs = joblistingdata?.filter((job) => {
            const jobId = job.jobid?.toString().toLowerCase() || ""; // Ensure it's a string
            const jobTitle = job.jobtitle?.toLowerCase() || "";
            const jobLocation = job.locations?.toLowerCase() || "";

            return (
                jobId.includes(searchQuery) ||
                jobTitle.includes(searchQuery) ||
                jobLocation.includes(searchQuery)
            );
        });
        return (
            <>
                <Header dashBoardData={this.state.dashBoardData} />
                <div className="rbt-page-banner-wrapper">
                    {/* Start Banner BG Image  */}
                    <div className="rbt-banner-image" />
                    {/* End Banner BG Image  */}
                    <div className="rbt-banner-content">
                        {/* Start Banner Content Top  */}
                        <div className="rbt-banner-content-top">
                            <div className="container">
                                {this.state.keepSpinner && <div class="custom-loader">
                                    <div class="loader-spinner"></div>
                                    <p class="loader-text">Please Wait while Jobs are loading...</p>
                                </div>}
                                <div className="row">
                                    <div className="col-lg-12">

                                        <div className=" title-wrapper">
                                            <h1 className="title mb--0">All Jobs</h1>
                                        </div>
                                        <h4 className="description">
                                        Find Your Dream Job – Apply for top opportunities and get hired faster with Zobskill!
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End Banner Content Top  */}
                        {/* Start Course Top  */}
                        <div className="rbt-course-top-wrapper mt--40">
                            <div className="container">
                                <div className="row g-5 align-items-center">
                                    <div className="col-lg-5 col-md-12">
                                        <div className="rbt-sorting-list d-flex flex-wrap align-items-center">
                                            {!this.state.errorMessage && <div className="rbt-short-item">
                                                <span className="course-index">Showing {startIndex} - {endIndex} of {totalRecords} results</span>
                                            </div>}
                                        </div>
                                    </div>
                                    <div className="col-lg-7 col-md-12">
                                        <div className="rbt-sorting-list d-flex flex-wrap align-items-center justify-content-start justify-content-lg-end">
                                            <div className="rbt-short-item mt-5">
                                                <form action="#" className="rbt-search-style me-0">
                                                    <input type="text" placeholder="Location,title." value={this.state.searchQuery}
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
                    <div className="container">
                        <div className="row row--30 gy-5">
                            {!this.state.errorMessage ? <div className="col-lg-12 order-1 order-lg-2">
                                <div className="rbt-course-grid-column jobs-lst active-list-view">
                                    {/* Start Single Card  */}
                                    {/* Start Single Card  */}
                                    {filteredJobs?.map((job) => (
                                        <div key={job.jobid} className="course-grid-3">

                                            <div className="rbt-card variation-01 rbt-hover card-list-2">
                                                {job.companylogo?(
                                                <div className="rbt-card-img">
                                                    <a href="#">
                                                        <img
                                                        src={job.companylogo?`${process.env.REACT_APP_BASEURL}/Uploads/${job.companylogo}`:"assets/images/job-zob-img.jpg"}// Use a default image if companylogo is missing
                                                        alt="Card image"
                                                        style={{
                                                            maxWidth: "500px", // Adjust as needed
                                                            maxHeight: "150px", // Adjust as needed
                                                          }}
                                                        />
                                                    </a>
                                                </div>
                                                ):(
                                                    <div className="rbt-card-img">
                                          <div className="company-logo-name">     <h2>   {this.getInitials(job.CompanyName)}</h2>
                                          </div>    </div>
                                                )
                                            }
                                                <div className="rbt-card-body">
                                                    <div className="rbt-card-top">
                                                        <div className="rbt-category">
                                                            <a href="#">{job.empType || "Employment Type"}</a>
                                                            <a href="#">{job.department || "Department"}</a>
                                                        </div>
                                                    </div>
                                                    <h4 className="rbt-card-title">
                                                        <a href={localStorage.getItem('authToken') ? `/Job-details?jobId=${job.jobid}` : `/job-decription?jobId=${job.jobid}`}>
                                                            {job.jobtitle || "Job Title Unavailable"}
                                                        </a>
                                                    </h4>
                                                    <ul className="rbt-meta">
                                                        <li>
                                                            <i className="fas fa-building" /> {job.CompanyName || "Company Name"}
                                                        </li>
                                                        <li>
                                                            <i className="fas fa-map-marker-alt" /> {job.locations || "Location Unavailable"}
                                                        </li>
                                                    </ul>
                                                    {/* <p className="rbt-card-text">
                                                        {parse(job.description)}
                                                    </p> */}
                                                    <div className="rbt-card-bottom">
                                                        <div className="rbt-price">
                                                            <span className="current-price">
                                                                <i className="fas fa-rupee-sign" />{" "}
                                                                {job.package_notdisclosed
                                                                    ? "Package not disclosed"
                                                                    : `${job.packagefrom}L - ${job.packageto || "N/A"}L`}
                                                            </span>
                                                        </div>
                                                        <a className="rbt-btn-link" href={localStorage.getItem('authToken') ? `/Job-details?jobId=${job.jobid}` : `/job-decription?jobId=${job.jobid}`}>
                                                            Learn More
                                                            <i className="feather-arrow-right" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                    {/* End Single Card  */}
                                    {/* End Single Card  */}


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
                            </div> : <h2>{this.state.errorMessage}</h2>}
                        </div>
                    </div>
                </div>
                {/* End Card Style */}

            </>
        );
    }
}

export default withNavigation(jobs);