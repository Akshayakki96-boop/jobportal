import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import withNavigation from '../withNavigation';

class Announcement extends React.Component {
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
                  <h4 className="rbt-title-style-3">Announcements</h4>
                </div>
                {/* Start Call To Action  */}
                <div className="rbt-callto-action rbt-cta-default style-2">
                  <div className="content-wrapper overflow-hidden pt--30 pb--30 bg-color-primary-opacity">
                    <div className="row gy-5 align-items-end">
                      <div className="col-lg-8">
                        <div className="inner">
                          <div className="content text-left">
                            <h5 className="mb--5">Notify your all students.</h5>
                            <p className="b3">Create Announcement</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="call-to-btn text-start text-lg-end position-relative">
                          <a
                            className="rbt-btn btn-sm rbt-switch-btn rbt-switch-y"
                            href="#"
                          >
                            <span data-text="Add New Announcement">
                              Add New Announcement
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Call To Action  */}
                {/* Start Filter */}
                <div className="rbt-dashboard-filter-wrapper mt--60">
                  <div className="row g-5">
                    <div className="col-lg-6">
                      <div className="filter-select rbt-modern-select">
                        <span className="select-label d-block">Courses</span>
                        <select
                          className="w-100"
                          data-live-search="true"
                          title="All"
                          multiple=""
                          data-size={7}
                          data-actions-box="true"
                          data-selected-text-format="count > 2"
                        >
                          <option data-subtext="HTML">Web Design</option>
                          <option data-subtext="Photoshop">Graphic</option>
                          <option data-subtext="Career">English</option>
                          <option data-subtext="Career">Spoken English</option>
                          <option data-subtext="Experts">Art Painting</option>
                          <option data-subtext="Experts">App Development</option>
                          <option data-subtext="Experts">Web Application</option>
                          <option data-subtext="Experts">Php Development</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="filter-select rbt-modern-select">
                        <span className="select-label d-block">Short By</span>
                        <select className="w-100">
                          <option>Default</option>
                          <option>Latest</option>
                          <option>Popularity</option>
                          <option>Trending</option>
                          <option>Price: low to high</option>
                          <option>Price: high to low</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="filter-select rbt-modern-select">
                        <span className="select-label d-block">Short By Offer</span>
                        <select className="w-100">
                          <option>Free</option>
                          <option>Paid</option>
                          <option>Premium</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Filter */}
                <hr className="mt--30" />
                <div className="rbt-dashboard-table table-responsive mobile-table-750 mt--30">
                  <table className="rbt-table table table-borderless">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Announcements</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>
                          <span className="h6 mb--5">March 16, 2024</span>
                          <p className="b3">10.00am</p>
                        </th>
                        <td>
                          <span className="h6 mb--5">Announcement Title</span>
                          <p className="b3">Course: Fundamentals 101</p>
                        </td>
                        <td>
                          <div className="rbt-button-group justify-content-end">
                            <a className="rbt-btn-link left-icon" href="#">
                              <i className="feather-edit" /> Edit
                            </a>
                            <a className="rbt-btn-link left-icon" href="#">
                              <i className="feather-trash-2" /> Delete
                            </a>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>
                          <span className="h6 mb--5">Janu 16, 2024</span>
                          <p className="b3">12.00am</p>
                        </th>
                        <td>
                          <span className="h6 mb--5">Web Design</span>
                          <p className="b3">Course: Web Design</p>
                        </td>
                        <td>
                          <div className="rbt-button-group justify-content-end">
                            <a className="rbt-btn-link left-icon" href="#">
                              <i className="feather-edit" /> Edit
                            </a>
                            <a className="rbt-btn-link left-icon" href="#">
                              <i className="feather-trash-2" /> Delete
                            </a>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>
                          <span className="h6 mb--5">Janu 16, 2024</span>
                          <p className="b3">12.00am</p>
                        </th>
                        <td>
                          <span className="h6 mb--5">App Development</span>
                          <p className="b3">Course: App Development</p>
                        </td>
                        <td>
                          <div className="rbt-button-group justify-content-end">
                            <a className="rbt-btn-link left-icon" href="#">
                              <i className="feather-edit" /> Edit
                            </a>
                            <a className="rbt-btn-link left-icon" href="#">
                              <i className="feather-trash-2" /> Delete
                            </a>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>
                          <span className="h6 mb--5">Janu 16, 2024</span>
                          <p className="b3">12.00am</p>
                        </th>
                        <td>
                          <span className="h6 mb--5">Announcement Title</span>
                          <p className="b3">Course: Web Design</p>
                        </td>
                        <td>
                          <div className="rbt-button-group justify-content-end">
                            <a className="rbt-btn-link left-icon" href="#">
                              <i className="feather-edit" /> Edit
                            </a>
                            <a className="rbt-btn-link left-icon" href="#">
                              <i className="feather-trash-2" /> Delete
                            </a>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          



        );
    }
}

export default withNavigation(Announcement);