import React from 'react';
import axios from 'axios';
import withNavigation from '../withNavigation';
import UserDashBoard from './UserDashBoard';
import MyProfile from './MyProfile';
import MyJobs from './MyJobs';
import Header from '../Header/header';
import { connect } from 'react-redux';
import CandidateList from './CandidateList';
import { Alert, Button } from 'react-bootstrap';

class EmployerDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUserDashboard: true,
            dashBoardData: {},
            responseMessage: '',
        };

    }
    componentDidMount() {
        this.getDashboardUser();
        let url = window.location.search;
        var urlParams = new URLSearchParams(url);
        var reqType = urlParams.get('message');
        if (reqType == "success") {
            this.setState({
                responseMessage: (
                    <span>
                        Job Created Successfully!
                    </span>
                ),
            });
        }
        if (reqType == "profilesuccess") {
            this.setState({
                responseMessage: (
                    <span>
                        Profile Updated Successfully!
                    </span>
                ),
            });
        }

    }
    componentDidUpdate(prevProps) {
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
                if (token) {
                    this.getUserProfile(response.data.data.user_id, token);
                } else {
                    localStorage.removeItem('authToken');
                    this.props.navigate('/Login');
                }
                this.setState({ dashBoardData: response.data.data, dashBoardCounterData: response.data });

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
    }

    getUserProfile = (userId) => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Employer/GetProfile`;
        const token = localStorage.getItem('authToken');
        const userData = {
            "Id": userId,
        };
        axios.post(url, userData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('user data', response.data);
                this.setState({ userData: response.data.data })

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
    }

    setActiveComponent = (componentName) => {
        this.setState({
            showUserDashboard: false,
            showProfile: false,
            showMyJobs: false,
            showCandidate: false,
        });

        switch (componentName) {
            case 'dashboard':
                this.setState({ showUserDashboard: true, responseMessage: '' });
                break;
            case 'profile':
                this.setState({ showProfile: true });
                break;

            case 'myJobs':
                this.setState({ showMyJobs: true });
                break;
            case 'showCandidate':
                this.setState({ showCandidate: true });
                break;

            // Add more cases for other components as needed
            default:
                this.setState({ showUserDashboard: true });
                break;
        }
    };
    handleLogout = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const logoutUrl = `${baseUrl}/api/Logout/Logout`;
        const logoutData = {};
        const token = localStorage.getItem('authToken');
        axios.post(logoutUrl, logoutData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('Logout Success:', response.data);
                this.setState({ keepSpinner: false });

                this.props.navigate('/Login'); // Use `navigate`
            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
                this.setState({ keepSpinner: false });
            });
    }

    getInitials = (name) => {
        if (!name) return "U"; // Default to "U" if name is not provided

        const parts = name.trim().split(" "); // Trim to remove extra spaces

        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase() // Two initials
            : parts[0][0].toUpperCase(); // Single initial
    };

    render() {

        return (
            <>
                <Header dashBoardData={this.state.dashBoardData} />
                <div className="rbt-page-banner-wrapper">
                    {/* Start Banner BG Image  */}
                    <div className="rbt-banner-image"></div>
                    {/*  End Banner BG Image */}
                </div><div>

                    {/*Start Card Style */}
                    <div className="rbt-dashboard-area rbt-section-overlayping-top rbt-section-gapBottom">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    {/* Start Dashboard Top */}
                                    <div className="rbt-dashboard-content-wrapper">
                                        <div className="tutor-bg-photo bg_image bg_image--22 height-350"></div>
                                        <div className="tranr-titl">
                                            <div className="content text-center">
                                                <h6 className="subtitle sal-animate" >Hire with  {this.state?.dashBoardData.username}</h6>
                                            </div>
                                        </div>
                                        {/* Start Tutor Information */}
                                        <div className="rbt-tutor-information">
                                            <div className="rbt-tutor-information-left">
                                                <div className="thumbnail rbt-avatars size-lg">
                                                    {this.state?.userData?.companylogo ? (
                                                        <img
                                                            src={`${process.env.REACT_APP_BASEURL}/Uploads/${this.state.userData.companylogo}`}
                                                            alt="Instructor"
                                                        />
                                                    ) : (
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                width: "60px", // Adjust as needed
                                                                height: "60px", // Adjust as needed
                                                                backgroundColor: "#ccc", // Default background color
                                                                color: "#fff",
                                                                borderRadius: "50%",
                                                                fontWeight: "bold",
                                                                // Adjust font size as needed
                                                            }}
                                                        >
                                                            {this.getInitials(this.state?.dashBoardData?.username || "User")}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="tutor-content">
                                                    <h5 className="title">{this.state?.dashBoardData.username} (Employer)</h5>
                                                </div>
                                            </div>
                                            <div className="rbt-tutor-information-right">
                                                <div className="tutor-btn">
                                                    <div style={{ display: "flex", gap: "10px" }}> {/* Adds space between buttons */}
                                                        <a
                                                            className="rbt-btn btn-md hover-icon-reverse"
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                this.setActiveComponent('showCandidate');
                                                            }}
                                                        >
                                                            <span className="icon-reverse-wrapper">
                                                                <span className="btn-text">Find Candidate</span>
                                                                <span className="btn-icon">
                                                                    <i className="feather-arrow-right"></i>
                                                                </span>
                                                                <span className="btn-icon">
                                                                    <i className="feather-arrow-right"></i>
                                                                </span>
                                                            </span>
                                                        </a>
                                                        <a className="rbt-btn btn-md hover-icon-reverse" href="/createnew">
                                                            <span className="icon-reverse-wrapper">
                                                                <span className="btn-text">Create a New Job</span>
                                                                <span className="btn-icon">
                                                                    <i className="feather-arrow-right"></i>
                                                                </span>
                                                                <span className="btn-icon">
                                                                    <i className="feather-arrow-right"></i>
                                                                </span>
                                                            </span>
                                                        </a>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        {/* End Tutor Information */}
                                    </div>
                                    {/* End Dashboard Top */}
                                    <div class="row g-5">
                                        <div class="col-lg-3">
                                            {/* Start Dashboard Sidebar  */}
                                            <div className="rbt-default-sidebar sticky-top rbt-shadow-box rbt-gradient-border">
                                                <div className="inner">
                                                    <div className="content-item-content">

                                                        <div className="rbt-default-sidebar-wrapper">
                                                            <div className="section-title mb--20">
                                                                <h6 className="rbt-title-style-2">Welcome, {this.state?.dashBoardData.username}</h6>
                                                            </div>
                                                            <nav className="mainmenu-nav">
                                                                <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                                                                    <li>
                                                                        <a className={this.state.showUserDashboard ? 'active' : ''} onClick={(e) => { e.preventDefault(); this.setActiveComponent('dashboard'); }} href="#">
                                                                            <i className="feather-home"></i><span>Dashboard</span>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a className={this.state.showProfile ? 'active' : ''} onClick={(e) => { e.preventDefault(); this.setActiveComponent('profile'); }} href="#">
                                                                            <i className="feather-user"></i><span>My Profile</span>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a className={this.state.showCandidate ? 'active' : ''} onClick={(e) => { e.preventDefault(); this.setActiveComponent('showCandidate'); }} href="#">
                                                                            <i className="feather-users"></i><span>Candidate List</span>
                                                                        </a>
                                                                    </li>

                                                                    <li>
                                                                        <a className={this.state.showMyJobs ? 'active' : ''} onClick={(e) => { e.preventDefault(); this.setActiveComponent('myJobs'); }} href="#">
                                                                            <i className="feather-monitor"></i><span>My Jobs</span>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a className={this.state.showMyJobs ? 'active' : ''}   href={`/Community`}>
                                                                            <i className="feather-monitor"></i><span>My Blogs</span>
                                                                        </a>
                                                                    </li>

                                                                    <li>
                                                                        <a onClick={(e) => { e.preventDefault(); this.handleLogout(); }} href="#">
                                                                            <i className="feather-log-out"></i><span>Logout</span>
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                            </nav>

                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            {/* End Dashboard Sidebar   */}
                                        </div>
                                        {this.state.showUserDashboard && <div className="col-lg-9">
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
                                                            <a
                                                                href="#"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    this.setActiveComponent('showCandidate');
                                                                }}
                                                            >
                                                                <div className="rbt-counterup variation-01 rbt-hover-03 rbt-border-dashed bg-pink-opacity">
                                                                    <div className="inner">
                                                                        <div className="rbt-round-icon bg-pink-opacity">
                                                                            <i className="feather-users"></i>
                                                                        </div>
                                                                        <div className="content">
                                                                            <h3 className="counter without-icon color-pink">
                                                                                <span className="odometer" data-count="160">{this.state.dashBoardCounterData?.applied_candidate_count}</span>
                                                                            </h3>
                                                                            <span className="rbt-title-style-2 d-block">Candidates Applied</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        </div>
                                                        {/* Single Card - Total Courses */}
                                                        <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                                                            <a
                                                                href="#"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    this.setActiveComponent('myJobs');
                                                                }}
                                                            >
                                                                <div className="rbt-counterup variation-01 rbt-hover-03 rbt-border-dashed bg-coral-opacity">
                                                                    <div className="inner">
                                                                        <div className="rbt-round-icon bg-coral-opacity">
                                                                            <i className="feather-gift"></i>
                                                                        </div>
                                                                        <div className="content">
                                                                            <h3 className="counter without-icon color-coral">
                                                                                <span className="odometer" data-count="20">{this.state.dashBoardCounterData?.job_count}</span>
                                                                            </h3>
                                                                            <span className="rbt-title-style-2 d-block">Total Jobs</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>}
                                        {this.state.showProfile && <MyProfile userData={this.state.userData} />}
                                        {this.state.showMyJobs && <MyJobs userData={this.state.userData} />}
                                        {this.state.showCandidate && <CandidateList userData={this.state.userData} />}

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/*End Card Style */}
                </div></>
        );
    }
}
const mapStateToProps = (state) => ({
    singleRequestData: state.SingleRequestReducer.singleRequestData,
});
export default connect(mapStateToProps)(withNavigation(EmployerDashboard));