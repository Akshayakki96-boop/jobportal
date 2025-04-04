import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import withNavigation from '../withNavigation';

class UserDashBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalRecords:0
    };

  }
  componentDidMount() {
    this.setState({ dashBoardData: this.props.dashBoardData });
    this.getAllJobs(0, 4);
  }

  componentDidUpdate(previousProps) {
    if (this.props.dashBoardData !== previousProps.dashBoardData) {
     this.setState({ dashBoardData: this.props.dashBoardData });
     console.log("dashBoardcounterData",this.state.dashBoardData)
    }
   
  }


  getAllJobs = (pageIndex, pageSize) => {
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
          this.setState({ joblistingdata: response.data.data, totalRecords: totalCount });
        }
        

      })
      .catch((error) => {
        localStorage.removeItem('authToken');
        this.props.navigate('/Login'); // Use `navigate`
      });

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

            <div className="row g-5">
              {/* Single Card - Enrolled Courses */}
              {/* <div className="col-lg-4 col-md-4 col-sm-6 col-12">
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
              </div> */}
              {/* Single Card - Active Courses */}
              {/* <div className="col-lg-4 col-md-4 col-sm-6 col-12">
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
              </div> */}
              {/* Single Card - Completed Courses */}
              {/* <div className="col-lg-4 col-md-4 col-sm-6 col-12">
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
              </div> */}
              {/* Single Card - Total Students */}
              <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                <div className="rbt-counterup variation-01 rbt-hover-03 rbt-border-dashed bg-pink-opacity">
                  <div className="inner">
                    <div className="rbt-round-icon bg-pink-opacity">
                      <i className="feather-users"></i>
                    </div>
                    <div className="content">
                      <h3 className="counter without-icon color-pink">
                        <span className="odometer" data-count="160">{this.state.dashBoardData?.applied_candidate_count}</span>
                      </h3>
                      <span className="rbt-title-style-2 d-block">Candidates Applied</span>
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
                        <span className="odometer" data-count="20">{this.state.dashBoardData?.job_count}</span>
                      </h3>
                      <span className="rbt-title-style-2 d-block">Total Jobs</span>
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