import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import withNavigation from '../withNavigation';
import parse from 'html-react-parser';


class MyJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      joblistingdata: [],
      currentPage: 1, // Tracks the current page
      pageSize: 4, // Number of records per page
      totalPages: 1,
      totalRecords: 0, // Total number of records
      searchQuery: "", // State to store the search input
      error: "",
    };

  };


  componentDidMount() {
    this.getAllJobs(0, this.state.pageSize);
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
      "user_id": this.props.userData.user_id,
      "cityIds": "1,2",
      pageIndex: pageIndex,
      pagesize: pageSize,
    }
    axios.post(url, request, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log('joblistingdata', response.data);
        if (response.data.data && response.data.data.length > 0) {
          const totalCount = response.data.data[0].TotalRecords;
          this.setState({ joblistingdata: response.data.data, totalRecords: totalCount, keepSpinner: false, error: "" });
        }
        else {
          this.setState({ keepSpinner: false, error: "No Jobs Found" });
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
  // Handle page click
  handlePageChange = (pageIndex) => {
    this.setState({ currentPage: pageIndex }, () => {
      this.getAllJobs(pageIndex - 1, this.state.pageSize); // pageIndex - 1 for 0-based index
    });
  };
  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value.toLowerCase() }); // Normalize to lowercase for case-insensitive search
  };

    handlePublish = (job,isactive) => {
          const baseUrl = process.env.REACT_APP_BASEURL;
          const url = `${baseUrl}/api/Job/ToggleJob`;
          const token = localStorage.getItem('authToken');
          const toggleData = {
              "jobId": job.jobid,
              "isactive": isactive,
          }
          axios.post(url, toggleData, {
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
              },
          })
              .then((response) => {
                  // this.setState({ isPublished: !this.state.isPublished });
                  this.setState({
                    responseMessage: isactive
                      ? "Job Published Successfully!"
                      : "Job Unpublished Successfully!",
                    alertVariant: 'success', // Success alert variant
                  });
                    window.scrollTo(0, 0);
                    const { currentPage, pageSize } = this.state;
                    this.setState({ currentPage }, () => {
                      this.getAllJobs(this.state.currentPage - 1, pageSize); // Maintain the current page after refresh
                    });
  
              })
              .catch((error) => {
                  localStorage.removeItem('authToken');
                  this.props.navigate('/Login'); // Use `navigate`
              });
      }
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
      <div className="col-lg-9">
        {this.state.keepSpinner && <div class="custom-loader">
          <div class="loader-spinner"></div>
          <p class="loader-text">Please Wait while Jobs are loading...</p>
        </div>}
        <div className="rbt-page-banner-wrapper">
          {/* Start Banner BG Image  */}
          <div className="rbt-banner-image" />
          {/* End Banner BG Image  */}
          <div className="rbt-banner-content">
            {/* Start Banner Content Top  */}
            <div className="rbt-banner-content-top">
              <div className="container">
                  <div className="container mt-5">
                          {this.state.responseMessage && (
                            <Alert variant={this.state.alertVariant} onClose={() => this.setState({ responseMessage: '' })} dismissible>
                              {this.state.responseMessage}
                            </Alert>
                          )}
                        </div>
                <div className="row">
                  <div className="col-lg-12">

                    <div className=" title-wrapper">
                      <h1 className="title mb--0">Jobs</h1>
                    </div>
                    <h4 className="description">
                      Find Your Dream Job – Apply for top opportunities and get hired faster with Zobskill!:
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
                      {!this.state.error && <div className="rbt-short-item">
                        <span className="course-index">
                          Showing {startIndex} - {endIndex} of {totalRecords} results
                        </span>
                      </div>
                      }
                    </div>
                  </div>
                  <div className="col-lg-7 col-md-12">
                    <div className="rbt-sorting-list d-flex flex-wrap align-items-center justify-content-start justify-content-lg-end">
                      <div className="rbt-short-item mt-5">
                        <form action="#" className="rbt-search-style me-0">
                          <input type="text" placeholder="Jobid,location,title.." value={this.state.searchQuery}
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
          <div className="container">
            <div className="row row--30 gy-5">
              {!this.state.error ?
                <div className="col-lg-9 order-1 order-lg-2">
                  <div className="rbt-course-grid-column jobs-lst active-list-view">
                    {/* Start Single Card  */}
                    {/* Start Single Card  */}
                    {filteredJobs?.map((job) => (
                      <div key={job.jobid} className="course-grid-3">

                        <div className="rbt-card variation-01 rbt-hover card-list-2">
                          <div className="rbt-card-img">
                            <a href="#">
                              <img
                                src={job.companylogo ? `${process.env.REACT_APP_BASEURL}/Uploads/${job.companylogo}` : "assets/images/job-zob-img.jpg"}// Use a default image if companylogo is missing
                                alt="Card image"
                              />
                            </a>
                          </div>
                          <div className="rbt-card-body">
                            <div className="rbt-card-top">
                              <div className="rbt-category">
                                <a href="#">{job.empType || "Employment Type"}</a>
                                <a href="#">{job.department || "Department"}</a>
                              </div>
                            </div>
                            <h4 className="rbt-card-title">
                              <a href={`/Job-details?jobId=${job.jobid}`}>{job.jobtitle || "Job Title Unavailable"}</a>
                            </h4>
                            <ul className="rbt-meta">
                              <li>
                                <i className="fas fa-building" /> {job.CompanyName || "Company Name"}
                              </li>
                              <li>
                                <i className="fas fa-map-marker-alt" /> {job.locations || "Location Unavailable"}
                              </li>
                              <li>

                                {!job.isactive ? <a href="#" style={{ textDecoration: 'underline' }} onClick={() => this.handlePublish(job,true)}>Publish </a> : <a href="#" style={{ textDecoration: 'underline' }} onClick={() => this.handlePublish(job,false)}>UnPublish </a>}
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
                              <br />

                              <a className="rbt-btn-link" href={`/Job-details?jobId=${job.jobid}`}>
                                Learn More
                                <i className="feather-arrow-right" />
                              </a>
                              <a className="rbt-btn-link" href={`/CandidatesDetails?jobId=${job.jobid}`} style={{ marginRight: "10px" }}>
                                View Candidates
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
                </div> : <h2>{this.state.error}</h2>}
            </div>
          </div>
        </div>
        {/* End Card Style */}
      </div>





    );
  }
}

export default withNavigation(MyJobs);