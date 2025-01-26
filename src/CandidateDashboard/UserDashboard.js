import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import withNavigation from '../withNavigation';

class UserDashBoard extends React.Component {
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
        {/* Dashboard Content Wrapper */}
        <div className="rbt-dashboard-content bg-color-white rbt-shadow-box mb--60">
          <div className="content">
          <div className="container mt-5">
                        {/* Render Bootstrap alert if there's a responseMessage */}
                        {this.props.message && (
                            <Alert variant='success' onClose={() => this.setState({ responseMessage: '' })} dismissible>
                                {this.props.message}
                            </Alert>
                        )}
                    </div>
            {/* Dashboard Section Title */}
            {/* <div className="section-title">
              <h4 className="rbt-title-style-3">Dashboard</h4>
            </div> */}
            <div className="row g-5">
              {/* Single Card - Enrolled Courses */}
              <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                <div className="rbt-counterup variation-01 rbt-hover-03 rbt-border-dashed bg-primary-opacity">
                  <div className="inner">
                    <div className="rbt-round-icon bg-primary-opacity">
                      <i className="feather-book-open"></i>
                    </div>
                    <div className="content">
                      <h3 className="counter without-icon color-primary">
                        <span className="odometer" data-count="30">00</span>
                      </h3>
                      <span className="rbt-title-style-2 d-block">Enrolled Jobs</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Single Card - Active Courses */}
              <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                <div className="rbt-counterup variation-01 rbt-hover-03 rbt-border-dashed bg-secondary-opacity">
                  <div className="inner">
                    <div className="rbt-round-icon bg-secondary-opacity">
                      <i className="feather-monitor"></i>
                    </div>
                    <div className="content">
                      <h3 className="counter without-icon color-secondary">
                        <span className="odometer" data-count="10">00</span>
                      </h3>
                      <span className="rbt-title-style-2 d-block">Active Jobs</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Single Card - Completed Courses */}
              <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                <div className="rbt-counterup variation-01 rbt-hover-03 rbt-border-dashed bg-violet-opacity">
                  <div className="inner">
                    <div className="rbt-round-icon bg-violet-opacity">
                      <i className="feather-award"></i>
                    </div>
                    <div className="content">
                      <h3 className="counter without-icon color-violet">
                        <span className="odometer" data-count="7">00</span>
                      </h3>
                      <span className="rbt-title-style-2 d-block">Completed Jobs</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Single Card - Total Students */}
              <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                <div className="rbt-counterup variation-01 rbt-hover-03 rbt-border-dashed bg-pink-opacity">
                  <div className="inner">
                    <div className="rbt-round-icon bg-pink-opacity">
                      <i className="feather-users"></i>
                    </div>
                    <div className="content">
                      <h3 className="counter without-icon color-pink">
                        <span className="odometer" data-count="160">00</span>
                      </h3>
                      <span className="rbt-title-style-2 d-block">Total Students</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Single Card - Total Courses */}
              <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                <div className="rbt-counterup variation-01 rbt-hover-03 rbt-border-dashed bg-coral-opacity">
                  <div className="inner">
                    <div className="rbt-round-icon bg-coral-opacity">
                      <i className="feather-gift"></i>
                    </div>
                    <div className="content">
                      <h3 className="counter without-icon color-coral">
                        <span className="odometer" data-count="20">00</span>
                      </h3>
                      <span className="rbt-title-style-2 d-block">Total Jobs</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Single Card - Total Earnings */}
              <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                <div className="rbt-counterup variation-01 rbt-hover-03 rbt-border-dashed bg-warning-opacity">
                  <div className="inner">
                    <div className="rbt-round-icon bg-warning-opacity">
                      <i className="feather-dollar-sign"></i>
                    </div>
                    <div className="content">
                      <h3 className="counter color-warning">
                        <span className="odometer" data-count="25000">00</span>
                      </h3>
                      <span className="rbt-title-style-2 d-block">Total Earnings</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    );
  }
}

export default withNavigation(UserDashBoard);