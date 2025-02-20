import React, { Component } from 'react';
import Header from '../Header/header';
import axios from 'axios';
import withNavigation from '../withNavigation';
import { setSingleRequest } from '../actions/SingleRequestAction';
import { store } from '../index';

class TrainerAboutUs extends React.Component {
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
    this.requestData.SignUpType = "Trainer";
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
                    <h2 className="title">Trainer</h2>
                    <ul className="page-list">
                      <li className="rbt-breadcrumb-item">
                        <a href="/">Home</a>
                      </li>
                      <li>
                        <div className="icon-right">
                          <i className="feather-chevron-right" />
                        </div>
                      </li>
                      <li className="rbt-breadcrumb-item active">Trainer</li>
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
              <div className="col-lg-5">
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
                <div className="col-lg-12">
                  <div className="inner pl--50 pl_sm--0 pl_md--0">
                    <p className="description mt--10" style={{ textAlign: 'left' }}>
                    <ul>
                        <li><strong>Earn More with Incentives – </strong>Get paid incentives for every candidate who successfully passes their certification exam. (Higher student success = Higher earnings!)</li>
                        <li><strong>Expand Your Reach & Grow Your Enrollments –</strong>List your courses on Zobskill Marketplace and get access to a wider audience of aspiring professionals.</li>
                        <li><strong>No Upfront Cost –</strong>Pay Only on Success – Zero listing fees! Only pay a small commission per enrollment, making it risk-free for trainers.</li>
                        <li><strong>Host Webinars & Build Your Brand –</strong>Conduct live sessions, demo classes, and Q&A webinars to engage with potential students and grow your training business.</li>
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

export default withNavigation(TrainerAboutUs);