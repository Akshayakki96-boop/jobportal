import React from 'react';
import axios from 'axios';
import withNavigation from '../withNavigation';

class Assignment extends React.Component {
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
                  <h4 className="rbt-title-style-3">Assignments</h4>
                </div>
                {/* Start Filter */}
                <div className="rbt-dashboard-filter-wrapper">
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
                        <th>Assignment Name</th>
                        <th>Total Marks</th>
                        <th>Total Submit</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>
                          <span className="h6 mb--5">
                            Write a short essay on yourself using the 5
                          </span>
                          <p className="b3">
                            Course: <a href="#">Fundamentals 101</a>
                          </p>
                        </th>
                        <td>
                          <p className="b3">80</p>
                        </td>
                        <td>
                          <p className="b3">2</p>
                        </td>
                        <td>
                          <div className="rbt-button-group justify-content-end">
                            <a
                              className="rbt-btn btn-xs bg-primary-opacity radius-round"
                              href="#"
                              title="Edit"
                            >
                              <i className="feather-edit pl--0" /> Edit
                            </a>
                            <a
                              className="rbt-btn btn-xs bg-color-danger-opacity radius-round color-danger"
                              href="#"
                              title="Delete"
                            >
                              <i className="feather-trash-2 pl--0" />
                            </a>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>
                          <span className="h6 mb--5">Speaking Korean for Beginners</span>
                          <p className="b3">
                            Course: <a href="#">Speaking 101</a>
                          </p>
                        </th>
                        <td>
                          <p className="b3">20</p>
                        </td>
                        <td>
                          <p className="b3">3</p>
                        </td>
                        <td>
                          <div className="rbt-button-group justify-content-end">
                            <a
                              className="rbt-btn btn-xs bg-primary-opacity radius-round"
                              href="#"
                              title="Edit"
                            >
                              <i className="feather-edit pl--0" /> Edit
                            </a>
                            <a
                              className="rbt-btn btn-xs bg-color-danger-opacity radius-round color-danger"
                              href="#"
                              title="Delete"
                            >
                              <i className="feather-trash-2 pl--0" />
                            </a>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>
                          <span className="h6 mb--5">Song Writing Techniques 101</span>
                          <p className="b3">
                            Course: <a href="#">Song Writing</a>
                          </p>
                        </th>
                        <td>
                          <p className="b3">60</p>
                        </td>
                        <td>
                          <p className="b3">10</p>
                        </td>
                        <td>
                          <div className="rbt-button-group justify-content-end">
                            <a
                              className="rbt-btn btn-xs bg-primary-opacity radius-round"
                              href="#"
                              title="Edit"
                            >
                              <i className="feather-edit pl--0" /> Edit
                            </a>
                            <a
                              className="rbt-btn btn-xs bg-color-danger-opacity radius-round color-danger"
                              href="#"
                              title="Delete"
                            >
                              <i className="feather-trash-2 pl--0" />
                            </a>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>
                          <span className="h6 mb--5">Arabic For Beginners</span>
                          <p className="b3">
                            Course: <a href="#">Arabic Writing</a>
                          </p>
                        </th>
                        <td>
                          <p className="b3">40</p>
                        </td>
                        <td>
                          <p className="b3">15</p>
                        </td>
                        <td>
                          <div className="rbt-button-group justify-content-end">
                            <a
                              className="rbt-btn btn-xs bg-primary-opacity radius-round"
                              href="#"
                              title="Edit"
                            >
                              <i className="feather-edit pl--0" /> Edit
                            </a>
                            <a
                              className="rbt-btn btn-xs bg-color-danger-opacity radius-round color-danger"
                              href="#"
                              title="Delete"
                            >
                              <i className="feather-trash-2 pl--0" />
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

export default withNavigation(Assignment);