import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import withNavigation from '../withNavigation';

class MyJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      };
      
    };

  
  componentDidMount() {
    this.getAllJobs();
  }

  getAllJobs = () => {
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
      "cityIds": "1,2"
    }
    axios.post(url, request, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log('joblistingdata', response.data);
        this.setState({ joblistingdata: response.data.data });

      })
      .catch((error) => {
        localStorage.removeItem('authToken');
        this.props.navigate('/Login'); // Use `navigate`
      });

  }


  render() {

    return (
      <div className="col-lg-9">
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

                    <div className=" title-wrapper">
                      <h1 className="title mb--0">All Jobs</h1>
                      <a href="#" className="rbt-badge-2">
                        <div className="image">🎉</div> 50 Jobs
                      </a>
                    </div>
                    <p className="description">
                      Jobs that help beginner designers become true unicorns.{" "}
                    </p>
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
                      <div className="rbt-short-item switch-layout-container">
                        <ul className="course-switch-layout">
                          {/*                                        <li class="course-switch-item"><button class="rbt-grid-view" title="Grid Layout"><i class="feather-grid"></i> <span class="text">Grid</span></button></li>*/}
                          <li className="course-switch-item">
                            <button
                              className="rbt-list-view active"
                              title="List Layout"
                              style={{ pointerEvents: "none" }}
                            >
                              <i className="feather-list" />{" "}
                              <span className="text">List</span>
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="rbt-short-item">
                        <span className="course-index">Showing 10 of 10 results</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-7 col-md-12">
                    <div className="rbt-sorting-list d-flex flex-wrap align-items-center justify-content-start justify-content-lg-end">
                      <div className="rbt-short-item mt-5">
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
                        <div className="filter-select">
                          <span className="select-label d-block">Short By</span>
                          <div className="filter-select rbt-modern-select search-by-category">
                            <select data-size={7}>
                              <option>Default</option>
                              <option>Latest</option>
                              <option>Popularity</option>
                              <option>Trending</option>
                              <option>Price: low to high</option>
                              <option>Price: high to low</option>
                            </select>
                          </div>
                        </div>
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
              <div className="col-lg-3 order-2 order-lg-1">
                <aside className="rbt-sidebar-widget-wrapper">
                  {/* Start Widget Area  */}
                  {/*
                  <div class="rbt-single-widget rbt-widget-search">
                      <div class="inner">
                          <form action="#" class="rbt-search-style-1">
                              <input type="text" placeholder="Search Courses">
                              <button class="search-btn"><i class="feather-search"></i></button>
                          </form>
                      </div>
                  </div>
*/}
                  {/* End Widget Area  */}
                  {/* Start Widget Area  */}
                  <div className="rbt-single-widget rbt-widget-categories has-show-more">
                    <div className="inner">
                      <h4 className="rbt-widget-title">Categories</h4>
                      <ul className="rbt-sidebar-list-wrapper categories-list-check has-show-more-inner-content">
                        <li className="rbt-check-group">
                          <input id="cat-list-1" type="checkbox" name="cat-list-1" />
                          <label htmlFor="cat-list-1">
                            Art &amp; Humanities{" "}
                            <span className="rbt-lable count">15</span>
                          </label>
                        </li>
                        <li className="rbt-check-group">
                          <input id="cat-list-2" type="checkbox" name="cat-list-2" />
                          <label htmlFor="cat-list-2">
                            Web Design <span className="rbt-lable count">20</span>
                          </label>
                        </li>
                        <li className="rbt-check-group">
                          <input id="cat-list-3" type="checkbox" name="cat-list-3" />
                          <label htmlFor="cat-list-3">
                            Graphic Design <span className="rbt-lable count">10</span>
                          </label>
                        </li>
                        <li className="rbt-check-group">
                          <input id="cat-list-4" type="checkbox" name="cat-list-4" />
                          <label htmlFor="cat-list-4">
                            Art &amp; Humanities{" "}
                            <span className="rbt-lable count">15</span>
                          </label>
                        </li>
                        <li className="rbt-check-group">
                          <input id="cat-list-5" type="checkbox" name="cat-list-5" />
                          <label htmlFor="cat-list-5">
                            Technology <span className="rbt-lable count">20</span>
                          </label>
                        </li>
                        <li className="rbt-check-group">
                          <input id="cat-list-6" type="checkbox" name="cat-list-6" />
                          <label htmlFor="cat-list-6">
                            Humanities Art <span className="rbt-lable count">25</span>
                          </label>
                        </li>
                        <li className="rbt-check-group">
                          <input id="cat-list-7" type="checkbox" name="cat-list-7" />
                          <label htmlFor="cat-list-7">
                            Management <span className="rbt-lable count">50</span>
                          </label>
                        </li>
                        <li className="rbt-check-group">
                          <input id="cat-list-8" type="checkbox" name="cat-list-8" />
                          <label htmlFor="cat-list-8">
                            Photoshop <span className="rbt-lable count">45</span>
                          </label>
                        </li>
                        <li className="rbt-check-group">
                          <input id="cat-list-9" type="checkbox" name="cat-list-9" />
                          <label htmlFor="cat-list-9">
                            Online Course <span className="rbt-lable count">45</span>
                          </label>
                        </li>
                        <li className="rbt-check-group">
                          <input
                            id="cat-list-10"
                            type="checkbox"
                            name="cat-list-10"
                          />
                          <label htmlFor="cat-list-10">
                            English Clud <span className="rbt-lable count">45</span>
                          </label>
                        </li>
                        <li className="rbt-check-group">
                          <input
                            id="cat-list-11"
                            type="checkbox"
                            name="cat-list-11"
                          />
                          <label htmlFor="cat-list-11">
                            Graphic Design <span className="rbt-lable count">45</span>
                          </label>
                        </li>
                      </ul>
                    </div>
                    <div className="rbt-show-more-btn">Show More</div>
                  </div>
                  {/* End Widget Area  */}
                  {/* Start Widget Area  */}
                  <div className="rbt-single-widget rbt-widget-rating">
                    <div className="inner">
                      <h4 className="rbt-widget-title">Ratings</h4>
                      <ul className="rbt-sidebar-list-wrapper rating-list-check">
                        <li className="rbt-check-group">
                          <input id="cat-radio-1" type="radio" name="rbt-radio" />
                          <label htmlFor="cat-radio-1">
                            <span className="rating">
                              <i className="fas fa-star" />
                              <i className="fas fa-star" />
                              <i className="fas fa-star" />
                              <i className="fas fa-star" />
                              <i className="fas fa-star" />
                            </span>
                            <span className="rbt-lable count">5</span>
                          </label>
                        </li>
                        <li className="rbt-check-group">
                          <input id="cat-radio-2" type="radio" name="rbt-radio" />
                          <label htmlFor="cat-radio-2">
                            <span className="rating">
                              <i className="fas fa-star" />
                              <i className="fas fa-star" />
                              <i className="fas fa-star" />
                              <i className="fas fa-star" />
                              <i className="off fas fa-star" />
                            </span>
                            <span className="rbt-lable count">4</span>
                          </label>
                        </li>
                        <li className="rbt-check-group">
                          <input id="cat-radio-3" type="radio" name="rbt-radio" />
                          <label htmlFor="cat-radio-3">
                            <span className="rating">
                              <i className="fas fa-star" />
                              <i className="fas fa-star" />
                              <i className="fas fa-star" />
                              <i className="off fas fa-star" />
                              <i className="off fas fa-star" />
                            </span>
                            <span className="rbt-lable count">3</span>
                          </label>
                        </li>
                        <li className="rbt-check-group">
                          <input id="cat-radio-4" type="radio" name="rbt-radio" />
                          <label htmlFor="cat-radio-4">
                            <span className="rating">
                              <i className="fas fa-star" />
                              <i className="fas fa-star" />
                              <i className="off fas fa-star" />
                              <i className="off fas fa-star" />
                              <i className="off fas fa-star" />
                            </span>
                            <span className="rbt-lable count">2</span>
                          </label>
                        </li>
                        <li className="rbt-check-group">
                          <input id="cat-radio-5" type="radio" name="rbt-radio" />
                          <label htmlFor="cat-radio-5">
                            <span className="rating">
                              <i className="fas fa-star" />
                              <i className="off fas fa-star" />
                              <i className="off fas fa-star" />
                              <i className="off fas fa-star" />
                              <i className="off fas fa-star" />
                            </span>
                            <span className="rbt-lable count">1</span>
                          </label>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* End Widget Area  */}
                  {/* Start Widget Area  */}
                  <div className="rbt-single-widget rbt-widget-instructor">
                    <div className="inner">
                      <h4 className="rbt-widget-title">Instructors</h4>
                      <ul className="rbt-sidebar-list-wrapper instructor-list-check">
                        <li className="rbt-check-group">
                          <input id="ins-list-1" type="checkbox" name="ins-list-1" />
                          <label htmlFor="ins-list-1">
                            Slaughter <span className="rbt-lable count">15</span>
                          </label>
                        </li>
                        <li className="rbt-check-group">
                          <input id="ins-list-2" type="checkbox" name="ins-list-2" />
                          <label htmlFor="ins-list-2">
                            Patrick <span className="rbt-lable count">20</span>
                          </label>
                        </li>
                        <li className="rbt-check-group">
                          <input id="ins-list-3" type="checkbox" name="ins-list-3" />
                          <label htmlFor="ins-list-3">
                            Angela <span className="rbt-lable count">10</span>
                          </label>
                        </li>
                        <li className="rbt-check-group">
                          <input id="ins-list-4" type="checkbox" name="ins-list-4" />
                          <label htmlFor="ins-list-4">
                            Fatima Asrafy <span className="rbt-lable count">15</span>
                          </label>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* End Widget Area  */}
                  {/* Start Widget Area  */}
                  <div className="rbt-single-widget rbt-widget-prices">
                    <div className="inner">
                      <h4 className="rbt-widget-title">Prices</h4>
                      <ul className="rbt-sidebar-list-wrapper prices-list-check">
                        <li className="rbt-check-group">
                          <input
                            id="prices-list-1"
                            type="checkbox"
                            name="prices-list-1"
                          />
                          <label htmlFor="prices-list-1">
                            All <span className="rbt-lable count">15</span>
                          </label>
                        </li>
                        <li className="rbt-check-group">
                          <input
                            id="prices-list-2"
                            type="checkbox"
                            name="prices-list-2"
                          />
                          <label htmlFor="prices-list-2">
                            Free <span className="rbt-lable count">0</span>
                          </label>
                        </li>
                        <li className="rbt-check-group">
                          <input
                            id="prices-list-3"
                            type="checkbox"
                            name="prices-list-3"
                          />
                          <label htmlFor="prices-list-3">
                            Paid <span className="rbt-lable count">10</span>
                          </label>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* End Widget Area  */}
                  {/* Start Widget Area  */}
                  <div className="rbt-single-widget rbt-widget-lavels">
                    <div className="inner">
                      <h4 className="rbt-widget-title">Levels</h4>
                      <ul className="rbt-sidebar-list-wrapper lavels-list-check">
                        <li className="rbt-check-group">
                          <input
                            id="lavels-list-1"
                            type="checkbox"
                            name="lavels-list-1"
                          />
                          <label htmlFor="lavels-list-1">
                            All Levels<span className="rbt-lable count">15</span>
                          </label>
                        </li>
                        <li className="rbt-check-group">
                          <input
                            id="lavels-list-2"
                            type="checkbox"
                            name="lavels-list-2"
                          />
                          <label htmlFor="lavels-list-2">
                            Beginner <span className="rbt-lable count">0</span>
                          </label>
                        </li>
                        <li className="rbt-check-group">
                          <input
                            id="lavels-list-3"
                            type="checkbox"
                            name="lavels-list-3"
                          />
                          <label htmlFor="lavels-list-3">
                            Intermediate <span className="rbt-lable count">10</span>
                          </label>
                        </li>
                        <li className="rbt-check-group">
                          <input
                            id="lavels-list-4"
                            type="checkbox"
                            name="lavels-list-4"
                          />
                          <label htmlFor="lavels-list-4">
                            Expert <span className="rbt-lable count">10</span>
                          </label>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* End Widget Area  */}
                </aside>
              </div>
              <div className="col-lg-9 order-1 order-lg-2">
                <div className="rbt-course-grid-column jobs-lst active-list-view">
                  {/* Start Single Card  */}
                  {this.state.joblistingdata?.map((job) => (
                  <div key={job.jobid} className="course-grid-3">
                   
                      <div  className="rbt-card variation-01 rbt-hover card-list-2">
                        <div className="rbt-card-img">
                          <a href="jobs-detail.html">
                            <img
                              src="assets/images/job-zob-img.jpg" // Use a default image if companylogo is missing
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
                          </ul>
                          <p className="rbt-card-text">
                            {job.description || "No description provided."}
                          </p>
                          <div className="rbt-card-bottom">
                            <div className="rbt-price">
                              <span className="current-price">
                                <i className="fas fa-rupee-sign" />{" "}
                                {job.package_notdisclosed
                                  ? "Package not disclosed"
                                  : `${job.packagefrom || "N/A"}L - ${job.packageto || "N/A"}L`}
                              </span>
                            </div>
                            <a className="rbt-btn-link" href="/Job-details">
                              Learn More
                              <i className="feather-arrow-right" />
                            </a>
                          </div>
                        </div>
                      </div>
                  
                  </div>
    ))}
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
        </div>
        {/* End Card Style */}
      </div>





    );
  }
}

export default withNavigation(MyJobs);