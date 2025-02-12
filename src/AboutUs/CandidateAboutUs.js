import React, { Component } from 'react';
import Header from '../Header/header';
import axios from 'axios';
import withNavigation from '../withNavigation';

class CandidateAboutUs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
              dashBoardData: ""
            // initialize your state here
        };
    }
    componentDidMount=()=>{
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
  <div style={{ textAlign: 'center', fontSize: '1.5em', padding: '20px' }}>
  "Don’t just wait—take the first step towards your dream career. Sign up on Zobskill now and unlock your potential!"
  </div>
  <div className="rbt-about-area about-style-1 bg-color-white rbt-section-gap">
  <div className="container">
    <div className="row g-5 align-items-center">
    <div className="col-lg-4 ">&nbsp;</div>
      <div className="col-lg-4 ">
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
                        <div className="col-lg-4 ">&nbsp;</div>
   
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