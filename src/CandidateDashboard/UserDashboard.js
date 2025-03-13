import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import withNavigation from '../withNavigation';

class UserDashBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dashBoardData:""
    };

  }
  componentDidMount() {
    this.setState({ dashBoardData: this.props.dashBoardData });
  }

  componentDidUpdate(previousProps) {
    if (this.props.dashBoardData !== previousProps.dashBoardData) {
     this.setState({ dashBoardData: this.props.dashBoardData });
     console.log("dashBoardcounterData",this.state.dashBoardData)
    }
   
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
                        <span className="odometer" data-count="30">{this.state.dashBoardData?.applied_job_count}</span>
                      </h3>
                      <span className="rbt-title-style-2 d-block">Applied Jobs</span>
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
                        <span className="odometer" data-count="10">{this.state.dashBoardData?.applied_course_count}</span>
                      </h3>
                      <span className="rbt-title-style-2 d-block">Enrolled Courses</span>
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