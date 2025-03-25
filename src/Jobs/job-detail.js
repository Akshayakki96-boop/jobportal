import React from 'react';
import axios from 'axios';
import withNavigation from '../withNavigation';
import Header from '../Header/header';
import { Alert, Button } from 'react-bootstrap';
import parse from 'html-react-parser';

class jobDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showUserDashboard: true,
      dashBoardData: {},
      isPublished: false, // Initial state
      isApplied:false
    };
    this.user="";
  }
  componentDidMount() {
    this.getDashboardUser();
    let url = window.location.search;
    var urlParams = new URLSearchParams(url);
    var jobId = urlParams.get('jobId');
    this.jobId=jobId;
    this.user= urlParams.get('user');
    console.log('jobId', jobId);

  }
  getAllJobs = (jobId) => {
    const baseUrl = process.env.REACT_APP_BASEURL;
    const url = `${baseUrl}/api/Job/GetJobs`;
    const token = localStorage.getItem('authToken');
    var request = {
      "jobId": jobId,
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
      "candidate_user_id": this.state.dashBoardData.role_id==1?this.state.dashBoardData.user_id:0
    }
    axios.post(url, request, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log('joblistingdata', response.data.data);
        this.setState({ jobDescription: response.data.data[0] });
        if(response.data.data[0].is_applied)
        {
          this.setState({ isApplied: true });
        }
        if(response.data.data[0].isactive)
        {
          this.setState({ isPublished: true });
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
        this.setState({ dashBoardData: response.data.data });
        setTimeout(() => {
          this.getAllJobs(this.jobId);
        }, 1000);

      })
      .catch((error) => {
        localStorage.removeItem('authToken');
        this.props.navigate('/Login'); // Use `navigate`
      });
  }

  handlePublish = () => {
    const baseUrl = process.env.REACT_APP_BASEURL;
    const url = `${baseUrl}/api/Job/ToggleJob`;
    const token = localStorage.getItem('authToken');
    const toggleData = {
      "jobId": this.state.jobDescription.jobid,
      "isactive": !this.state.isPublished,
    }
    axios.post(url, toggleData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        this.setState({ isPublished: !this.state.isPublished });
        this.setState({
          responseMessage: (
            <span>
              Job Published Successfully!
            </span>
          ),
          alertVariant: 'success', // Success alert variant
        });

      })
      .catch((error) => {
        localStorage.removeItem('authToken');
        this.props.navigate('/Login'); // Use `navigate`
      });
  }


  handleApply= ()=>{
    const baseUrl = process.env.REACT_APP_BASEURL;
    const url = `${baseUrl}/api/Candidate/applyjob`;
    const token = localStorage.getItem('authToken');
    const applyData = {
      "job_id": this.state.jobDescription.jobid,
      "candidate_user_id":this.state.dashBoardData.user_id,
       "ip_address":""
    };

    axios.post(url, applyData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        this.setState({ isApplied: true });
        this.setState({
          responseMessage: (
            <span>
              Job Applied Successfully!
            </span>
          ),
          alertVariant: 'success', // Success alert variant
        });
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        localStorage.removeItem('authToken');
        this.props.navigate('/Login'); // Use `navigate`
      });
  }




  render() {
console.log("user",this.user)
    return (
      <>
        <Header dashBoardData={this.state.dashBoardData} />
        <div className="rbt-page-banner-wrapper job-det-banner">
          {/* Start Banner BG Image  */}
          <div className="rbt-banner-image" />
          {/* End Banner BG Image  */}
          <div className="rbt-banner-content">
            {/* Start Banner Content Top  */}
            <div className="rbt-banner-content-top">
              <div className="container">
                <div className="container mt-5">
                  {/* Render Bootstrap alert if there's a responseMessage */}
                  {this.state.responseMessage && (
                    <Alert variant={this.state.alertVariant} onClose={() => this.setState({ responseMessage: '' })} dismissible>
                      {this.state.responseMessage}
                    </Alert>
                  )}
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="row">
                      <div className="col-lg-9">
                        {/* Start Breadcrumb Area  */}
                        <ul style={{textAlign:'left'}}  className="page-list">
                          <li className="rbt-breadcrumb-item">
                            <a href="/">Home</a>
                          </li>
                          <li>
                            <div className="icon-right">
                              <i className="feather-chevron-right" />
                            </div>
                          </li>
                          <li className="rbt-breadcrumb-item active">
                            {this.state.jobDescription && this.state.jobDescription.jobtitle}
                          </li>
                        </ul>
                        {/* End Breadcrumb Area  */}
                        <div className=" title-wrapper">
                          <h1 className="title mb--0">   {this.state.jobDescription && this.state.jobDescription.jobtitle}</h1>
                          <a href="#" className="rbt-badge-2">
                            {this.state.jobDescription && this.state.jobDescription.empType}
                          </a>
                        </div>
                        <div className="d-flex align-items-start flex-wrap mb--15 rbt-course-details-feature">
                          <div className="description">
                            <a href="#">{this.state.jobDescription && this.state.jobDescription.CompanyName}</a>{" "}
                          </div>
                          <div className="feature-sin rating ml--15">
                            <a href="#">4.8</a>
                            <a href="#">
                              <i className="fa fa-star" />
                            </a>
                            <a href="#">
                              <i className="fa fa-star" />
                            </a>
                            <a href="#">
                              <i className="fa fa-star" />
                            </a>
                            <a href="#">
                              <i className="fa fa-star" />
                            </a>
                            <a href="#">
                              <i className="fa fa-star" />
                            </a>
                          </div>
                          <div className="feature-sin total-rating">
                            <a className="rbt-badge-4" href="#">
                              164 Reviews
                            </a>
                          </div>
                          {/*<div class="feature-sin total-student">
                                  <span>616,029 students</span>
                              </div>*/}
                        </div>
                        <div className="d-flex align-items-start flex-wrap mb--15 rbt-course-details-feature">
                          {/*
								 <div class="sub-descp"><i class="fa fa-briefcase"></i> <span>1 - 3 years</span></div>
								 <div class="sub-descp ml--15"><i class="fa fa-rupee-sign"></i> <span>Not Disclosed</span></div>
*/}
                          <ul className="rbt-meta mtacolor">
                            <li>
                              <i className="feather-briefcase" />   {this.state.jobDescription && this.state.jobDescription.experience_from} - {this.state.jobDescription && this.state.jobDescription.experience_to} years
                            </li>
                            <li>
                              <i className="fa fa-rupee-sign" />
                              {this.state.jobDescription && this.state.jobDescription.package_notdisclosed
                                ? "Not Disclosed"
                                : `${this.state.jobDescription?.packagefrom || 0} - ${this.state.jobDescription?.packageto || 0} LPA`}

                            </li>
                          </ul>
                        </div>
                        <div className="d-flex align-items-start flex-wrap mb--15 rbt-course-details-feature">
                          <div className="sub-descp">
                            <i className="feather-map-pin" />{" "}
                            <span>{this.state.jobDescription && this.state.jobDescription.locations}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3  d-flex flex-column justify-content-center">
                        <div className="job-det-pic">
                          <a href="#">
                            <img src={this.state.jobDescription?.companylogo?`${process.env.REACT_APP_BASEURL}/Uploads/${this.state.jobDescription.companylogo}`:"assets/images/job-zob-img.jpg"} alt="Card image" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* End Banner Content Top  */}
            {/* Start Course Top  */}
            <div className="rbt-course-top-wrapper mt--20">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-lg-5 col-md-12">
                    <div className="rbt-sorting-list d-flex flex-wrap align-items-center">
                      <div className="rbt-short-item">
                        <span className="course-index">
                          Posted: <strong>{this.state.jobDescription && this.state.jobDescription?.postedDate
                            ? new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
                              .format(new Date(this.state.jobDescription.postedDate))
                            : "Date Unavailable"}</strong>
                        </span>
                      </div>
                      <div className="rbt-short-item">
                        <span className="course-index">
                          Openings: <strong>{this.state.jobDescription && this.state.jobDescription.no_of_openings}</strong>
                        </span>
                      </div>
                      <div className="rbt-short-item">
                        <span className="course-index">
                          Applicants: <strong>26</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-7 col-md-12">
                    <div className="rbt-sorting-list d-flex flex-wrap align-items-center justify-content-start justify-content-lg-end">
                     {this.state.dashBoardData?.role_id!=1 ? <div className="rbt-short-item">
                        <a className="rbt-btn btn-md btn-white icon-hover" href="#" onClick={(e) => {
                          e.preventDefault(); // Prevent default link behavior
                          this.handlePublish();
                        }}>
                          <span className="btn-text">{this.state.isPublished ? "Unpublish" : "Publish"}</span>
                          <span className="btn-icon">
                            <i className="feather-arrow-right" />
                          </span>
                        </a>
                      </div>:<div className="rbt-short-item">
                      {!this.state.isApplied ? <a className="rbt-btn btn-md btn-white icon-hover" href="#" onClick={(e) => {
                          e.preventDefault(); // Prevent default link behavior
                          this.handleApply();
                        }}>
                          <span className="btn-text">Apply</span>
                          <span className="btn-icon">
                            <i className="feather-arrow-right" />
                          </span>
                        </a>:<span className="text-success">Applied</span>}
                      </div>
                      }
                      {/* <div className="rbt-short-item">
                        <a className="rbt-btn btn-md" href="#">
                          Login to apply
                        </a>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* End Course Top  */}
          </div>
        </div>
        <div className="rbt-course-details-area rbt-section-gap">
          <div className="container">
            <div className="row g-5">
              <div className="col-lg-8">
                <div className="course-details-content">
                  {/* Start Course Feature Box  */}
                  <div className="rbt-feature-box rbt-shadow-box">
                    <div className="row g-5">
                      <div className="col-lg-12">
                        <div className="section-title">
                          <h4 className="title mb--10">Job description</h4>
                        </div>
                        <h5 className="title">About :</h5>
                       
                        {parse(this.state.jobDescription?.description || "")}
                      
                      </div>
                    </div>
                  </div>
                  {/* End Course Feature Box  */}
                  {/* Start Course Feature Box  */}
                  {/* End Course Feature Box  */}
                  {/* Start Course Feature Box  */}
                  <div className="rbt-feature-box rbt-shadow-box mt--60">
                    <div className="row g-5">
                      {/* Start Feture Box  */}
                      <div className="col-lg-12">
                        <div className="section-title">
                          <h4 className="title mb--10">
                            Required Skills &amp; Experience:
                          </h4>
                        </div>
                        <p>
                          <span className="d-block mb--5">
                            <strong>Role:</strong> {this.state.jobDescription && this.state.jobDescription.posted_by_designation}
                          </span>
                          <span className="d-block mb--5">
                            <strong>Industry Type:</strong> {this.state.jobDescription && this.state.jobDescription.industryname}
                          </span>
                          <span className="d-block mb--5">
                            <strong>Department:</strong> {this.state.jobDescription && this.state.jobDescription.department}
                          </span>
                          <span className="d-block mb--5">
                            <strong>Employment Type:</strong> {this.state.jobDescription && this.state.jobDescription.empType}
                          </span>
                          <span className="d-block mb--5">
                            <strong>Role Category:</strong> Digital Marketing
                          </span>
                        </p>
                        <h5 className="title">Education:</h5>
                        <p>
                          <span className="d-block mb--5">
                            {this.state.jobDescription && this.state.jobDescription.education}
                          </span>
                        </p>
                      </div>
                      {/* End Feture Box  */}
                    </div>
                  </div>
                  {/* End Course Feature Box  */}
                  {/* Start Course Content  */}
                  <div className="course-content rbt-shadow-box mt--60">
                    <div className="section-title">
                      <h4 className="title mb--10">Key Skills</h4>
                    </div>
                    <div className="rbt-tag-list">
                      {this.state.jobDescription?.keyskills
                        ? this.state.jobDescription.keyskills
                          .split(',')  // Split the keyskills string by commas
                          .map((skill, index) => (
                            <a href="#" key={index}>{skill.trim()}</a>  // Create an <a> tag for each skill
                          ))
                        : "No keyskills available"}
                    </div>

                    <div
                      className="rbt-post-share d-flex  pt--15 mt--15"
                      style={{ borderTop: "1px solid #ccc" }}
                    >
                      <ul className="social-icon social-default transparent-with-border justify-content-center">
                        <li>
                          <a href="https://www.facebook.com/">
                            <i className="feather-facebook" />
                          </a>
                        </li>
                        <li>
                          <a href="https://www.twitter.com">
                            <i className="feather-twitter" />
                          </a>
                        </li>
                        <li>
                          <a href="https://www.instagram.com/">
                            <i className="feather-instagram" />
                          </a>
                        </li>
                        <li>
                          <a href="https://www.linkdin.com/">
                            <i className="feather-linkedin" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* End Course Content  */}
                </div>
                {/* <div className="related-course mt--60">
                  <div className="row">
                    <div className="col-lg-12 mb--40">
                      <div className="section-title text-start">
                        <span className="subtitle bg-secondary-opacity">Zobskill</span>
                        <h2 className="title">Similar Jobs</h2>
                      </div>
                    </div>
                  </div>
                  <div className="row g-5">
                    <div className="course-grid-3">
                      <div className="rbt-card variation-01 rbt-hover card-list-2">
                        <div className="rbt-card-img">
                          <a href="#">
                            <img src="assets/images/job-zob-img.jpg" alt="Card image" />
                          </a>
                        </div>
                        <div className="rbt-card-body">
                          <h4 className="rbt-card-title">
                            <a href="#">Medical Assistant</a>
                          </h4>
                          <ul className="rbt-meta">
                            <li>
                              <i className="fas fa-building" /> MED002
                            </li>
                            <li>
                              <i className="fas fa-map-marker-alt" /> Los Angeles, CA
                            </li>
                          </ul>
                          <p className="rbt-card-text">
                            Assist physicians with patient examinations, perform
                            administrative tasks, and manage patient record
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="course-grid-3">
                      <div className="rbt-card variation-01 rbt-hover card-list-2">
                        <div className="rbt-card-img">
                          <a href="#">
                            <img src="assets/images/job-zob-img.jpg" alt="Card image" />
                          </a>
                        </div>
                        <div className="rbt-card-body">
                          <h4 className="rbt-card-title">
                            <a href="#">Medical Assistant</a>
                          </h4>
                          <ul className="rbt-meta">
                            <li>
                              <i className="fas fa-building" /> MED002
                            </li>
                            <li>
                              <i className="fas fa-map-marker-alt" /> Los Angeles, CA
                            </li>
                          </ul>
                          <p className="rbt-card-text">
                            Assist physicians with patient examinations, perform
                            administrative tasks, and manage patient record
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
          
                </div> */}
              </div>
              {/* <div className="col-lg-4 mt_md--60 mt_sm--60">
                <div className="course-sidebar sticky-top rbt-shadow-box rbt-gradient-border">
                  <div className="inner">
                    <div className="rbt-single-widget rbt-widget-recent">
                      <h4 className="rbt-widget-title">
                        Jobs you might be interested in
                      </h4>
                      <ul className="rbt-sidebar-list-wrapper recent-post-list">
                        <li>
                          <div className="thumbnail">
                            <a href="event-details.html">
                              <img
                                src="assets/images/event/grid-type-04.jpg"
                                alt="Event Images"
                              />
                              <div className="date-post-wrap">Posted 15 Days Ago</div>
                            </a>
                          </div>
                          <div className="content">
                            <h6 className="title">
                              <a href="event-details.html">
                                Digital Marketing Executive
                              </a>
                            </h6>
                            <div className="feature-sin rating">
                              <a href="#">
                                <i className="fa fa-star" /> 4.8
                              </a>
                              <div className="feature-sin total-rating">
                                <a className="rbt-badge-4" href="#">
                                  164 Reviews
                                </a>
                              </div>
                            </div>
                            <ul className="rbt-meta">
                              <li>
                                <i className="feather-map-pin" /> Lucknow
                              </li>
                            </ul>
                          </div>
                        </li>
                        <li>
                          <div className="thumbnail">
                            <a href="event-details.html">
                              <img
                                src="assets/images/event/grid-type-04.jpg"
                                alt="Event Images"
                              />
                              <div className="date-post-wrap">Posted 15 Days Ago</div>
                            </a>
                          </div>
                          <div className="content">
                            <h6 className="title">
                              <a href="event-details.html">
                                Digital Marketing Executive
                              </a>
                            </h6>
                            <div className="feature-sin rating">
                              <a href="#">
                                <i className="fa fa-star" /> 4.8
                              </a>
                              <div className="feature-sin total-rating">
                                <a className="rbt-badge-4" href="#">
                                  164 Reviews
                                </a>
                              </div>
                            </div>
                            <ul className="rbt-meta">
                              <li>
                                <i className="feather-map-pin" /> Lucknow
                              </li>
                            </ul>
                          </div>
                        </li>
                        <li>
                          <div className="thumbnail">
                            <a href="event-details.html">
                              <img
                                src="assets/images/event/grid-type-04.jpg"
                                alt="Event Images"
                              />
                              <div className="date-post-wrap">Posted 15 Days Ago</div>
                            </a>
                          </div>
                          <div className="content">
                            <h6 className="title">
                              <a href="event-details.html">
                                Digital Marketing Executive
                              </a>
                            </h6>
                            <div className="feature-sin rating">
                              <a href="#">
                                <i className="fa fa-star" /> 4.8
                              </a>
                              <div className="feature-sin total-rating">
                                <a className="rbt-badge-4" href="#">
                                  164 Reviews
                                </a>
                              </div>
                            </div>
                            <ul className="rbt-meta">
                              <li>
                                <i className="feather-map-pin" /> Lucknow
                              </li>
                            </ul>
                          </div>
                        </li>
                        <li>
                          <div className="thumbnail">
                            <a href="event-details.html">
                              <img
                                src="assets/images/event/grid-type-04.jpg"
                                alt="Event Images"
                              />
                              <div className="date-post-wrap">Posted 15 Days Ago</div>
                            </a>
                          </div>
                          <div className="content">
                            <h6 className="title">
                              <a href="event-details.html">
                                Digital Marketing Executive
                              </a>
                            </h6>
                            <div className="feature-sin rating">
                              <a href="#">
                                <i className="fa fa-star" /> 4.8
                              </a>
                              <div className="feature-sin total-rating">
                                <a className="rbt-badge-4" href="#">
                                  164 Reviews
                                </a>
                              </div>
                            </div>
                            <ul className="rbt-meta">
                              <li>
                                <i className="feather-map-pin" /> Lucknow
                              </li>
                            </ul>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>


      </>
    );
  }
}

export default withNavigation(jobDetails);