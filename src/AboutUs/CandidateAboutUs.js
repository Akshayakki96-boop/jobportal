import React, { Component } from 'react';
import Header from '../Header/header';
import axios from 'axios';
import withNavigation from '../withNavigation';
import { setSingleRequest } from '../actions/SingleRequestAction';
import { store } from '../index';

class CandidateAboutUs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dashBoardData: ""
      // initialize your state here
    };
  }
  componentDidMount = () => {
    // this.getDashboardUser();
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

      })
      .catch((error) => {
        localStorage.removeItem('authToken');
        this.props.navigate('/Login'); // Use `navigate`
      });
  }
  handleRegister = () => {
    this.requestData = {};
    this.requestData.SignUpType = "Candidate";
    store.dispatch(setSingleRequest(this.requestData));
    this.props.navigate('/SignUp'); // Use `navigate`
  }
  render() {
    return (
      <div>
        <>
          <Header dashBoardData={this.state.dashBoardData} />
          {/* Start breadcrumb Area */}
          <div className="rbt-breadcrumb-default ptb--100 ptb_md--50 ptb_sm--30 bg-gradient-1">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="breadcrumb-inner text-center">
                    <h2 className="title">Candidate</h2>
                    <ul className="page-list">
                      <li className="rbt-breadcrumb-item">
                        <a href="/">Home</a>
                      </li>
                      <li>
                        <div className="icon-right">
                          <i className="feather-chevron-right" />
                        </div>
                      </li>
                      <li className="rbt-breadcrumb-item active">Candidate</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End Breadcrumb Area */}

          <div className="rbt-about-area about-style-1 bg-color-white rbt-section-gap">
            <div className="container">
              <div className="row g-5 align-items-center">
                <div style={{marginLeft:'47px'}} className="col-lg-4">
                  <div className="form-submit-group">
                    <button
                      type="button"
                      className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                      onClick={this.handleRegister}

                    >
                      <span className="icon-reverse-wrapper">
                        <span className="btn-text">Register with us</span>
                        <span className="btn-icon">
                          <i className="feather-arrow-right"></i>
                        </span>
                        <span className="btn-icon">
                          <i className="feather-arrow-right"></i>
                        </span>
                      </span>
                    </button>
                  </div>

                </div>
                <div style={{ textAlign: 'left' }} className="col-lg-12">
                  <div className="inner pl--50 pl_sm--0 pl_md--0">
                    <p className="description mt--10" style={{ textAlign: 'left' }}>
                      <ul>
                        <li><strong>100% Training Fee Refund –</strong> Get 50% refund when you pass the certification exam & another 50% refund when you secure a job through Zobskill. *(T&C Apply)*</li>
                        <li><strong>Job-Ready Training Programs –</strong> Learn high-demand skills with top trainers & industry-recognized certifications to boost your career prospects.  </li>
                        <li><strong>Exclusive Access to Verified Job Listings –</strong> Apply for global job opportunities from trusted employers & recruitment agencies in your field.</li>
                        <li><strong>Zobskill Mentor Badge & Community Support –</strong> Get recognized as a Zobskill Mentor after passing your exam & network with industry experts to accelerate your career.</li>
                      </ul>
                    </p>

                  </div>
                </div>


              </div>
            </div>
          </div>



        </>

      </div>
    );
  }
}

export default withNavigation(CandidateAboutUs);