import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import withNavigation from '../withNavigation';

class MyCourses extends React.Component {
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
                  <h4 className="rbt-title-style-3">My Courses</h4>
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
                        className="tab-button active"
                        id="publish-tab-4"
                        data-bs-toggle="tab"
                        data-bs-target="#publish-4"
                        role="tab"
                        aria-controls="publish-4"
                        aria-selected="true"
                      >
                        <span className="title">Publish</span>
                      </a>
                    </li>
                    <li role="presentation">
                      <a
                        href="#"
                        className="tab-button"
                        id="pending-tab-4"
                        data-bs-toggle="tab"
                        data-bs-target="#pending-4"
                        role="tab"
                        aria-controls="pending-4"
                        aria-selected="false"
                      >
                        <span className="title">Pending</span>
                      </a>
                    </li>
                    <li role="presentation">
                      <a
                        href="#"
                        className="tab-button"
                        id="draft-tab-4"
                        data-bs-toggle="tab"
                        data-bs-target="#draft-4"
                        role="tab"
                        aria-controls="draft-4"
                        aria-selected="false"
                      >
                        <span className="title">Draft</span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="tab-content">
                  <div
                    className="tab-pane fade active show"
                    id="publish-4"
                    role="tabpanel"
                    aria-labelledby="publish-tab-4"
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
                            <div className="rbt-card-bottom">
                              <div className="rbt-price">
                                <span className="current-price">$60</span>
                                <span className="off-price">$120</span>
                              </div>
                              <a className="rbt-btn-link left-icon" href="#">
                                <i className="feather-edit" /> Edit
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
                            <div className="rbt-card-bottom">
                              <div className="rbt-price">
                                <span className="current-price">$20</span>
                                <span className="off-price">$43</span>
                              </div>
                              <a className="rbt-btn-link left-icon" href="#">
                                <i className="feather-edit" /> Edit
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
                            <div className="rbt-card-bottom">
                              <div className="rbt-price">
                                <span className="current-price">$23</span>
                                <span className="off-price">$45</span>
                              </div>
                              <a className="rbt-btn-link left-icon" href="#">
                                <i className="feather-edit" /> Edit
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
                    id="pending-4"
                    role="tabpanel"
                    aria-labelledby="pending-tab-4"
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
                              <a className="rbt-btn-link left-icon" href="#">
                                <i className="feather-edit" /> Edit
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
                              <a className="rbt-btn-link left-icon" href="#">
                                <i className="feather-edit" /> Edit
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
                              <a className="rbt-btn-link left-icon" href="#">
                                <i className="feather-edit" /> Edit
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
                    id="draft-4"
                    role="tabpanel"
                    aria-labelledby="draft-tab-4"
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
                            <div className="rbt-card-bottom">
                              <div className="rbt-price">
                                <span className="current-price">$60</span>
                                <span className="off-price">$120</span>
                              </div>
                              <a className="rbt-btn-link left-icon" href="#">
                                <i className="feather-edit" /> Edit
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
                            <div className="rbt-card-bottom">
                              <div className="rbt-price">
                                <span className="current-price">$20</span>
                                <span className="off-price">$43</span>
                              </div>
                              <a className="rbt-btn-link left-icon" href="#">
                                <i className="feather-edit" /> Edit
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
                            <div className="rbt-card-bottom">
                              <div className="rbt-price">
                                <span className="current-price">$23</span>
                                <span className="off-price">$45</span>
                              </div>
                              <a className="rbt-btn-link left-icon" href="#">
                                <i className="feather-edit" /> Edit
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
          </div>
          



        );
    }
}

export default withNavigation(MyCourses);