import React from 'react';
import axios from 'axios';
import withNavigation from '../withNavigation';
import UserDashBoard from './UserDashboard';
import MyProfile from './MyProfile';
import Header from '../Header/header';
import { connect } from 'react-redux';
import { Alert, Button } from 'react-bootstrap';
import MyJobs from './MyJobs';


class CandidateDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUserDashboard: true,
            dashBoardData: {},
            responseMessage: '',
            showMyJobs: false,
        };

    }
    componentDidMount() {
        this.getDashboardUser();


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
                this.getUserProfile(response.data.data.user_id);
                this.setState({ dashBoardData: response.data.data });

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
    }

    getUserProfile = (userId) => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Candidate/GetBasicProfile`;
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
                this.setState({ userData: response.data.data?.basic_info })
                this.setState({CompanyName:response.data.data?.employment.filter(x=>x.is_current_employment==true)[0].company_name});            
                this.setState({ keepSpinner: false });

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
            });
    }
    getInitials = (name) => {
        if (!name) return "U"; // Default to "U" if name is not provided
        const parts = name.split(" ");
        return parts.length > 1
            ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
            : parts[0][0].toUpperCase();
    };

    render() {
        console.log(this.state.CompanyName)    
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
                                            <h6 className="subtitle sal-animate" >Candidate</h6>
                                                <h3 style={{textAlign:"center"}} className="title sal-animate">Learn with <span>{this.state?.userData?.fullname}</span></h3>
                                            </div>
                                        </div>
                                        {/* Start Tutor Information */}
                                        <div className="rbt-tutor-information">
                                            <div className="rbt-tutor-information-left">
                                                <div className="thumbnail rbt-avatars size-lg">
                                                    {this.state?.userData?.profile_image ? (
                                                        <img
                                                            src={`${process.env.REACT_APP_BASEURL}/Uploads/${this.state.userData.profile_image}`}
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
                                                                fontSize: "18px", // Adjust font size as needed
                                                            }}
                                                        >
                                                            {this.getInitials(this.state?.dashBoardData?.username || "User")}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="tutor-content">
                                                    <h5 className="title">{this.state?.dashBoardData.username} (Candidate)</h5>
                                                    <div className="rbt-review">
                                                        <div className="rating">
                                                            <i className="fas fa-star"></i>
                                                            <i className="fas fa-star"></i>
                                                            <i className="fas fa-star"></i>
                                                            <i className="fas fa-star"></i>
                                                            <i className="fas fa-star"></i>
                                                        </div>
                                                        <span className="rating-count"> (15 Reviews)</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="rbt-tutor-information-right">
                                                <div className="tutor-btn">
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
                                            </div> */}
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
                                                                        <a className={this.state.showEnrollCourse ? 'active' : ''} onClick={(e) => { e.preventDefault(); this.setActiveComponent('enrolledCourses'); }} href="#">
                                                                            <i className="feather-book-open"></i><span>Enrolled Jobs</span>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a className={this.state.showMyJobs ? 'active' : ''} onClick={(e) => { e.preventDefault(); this.setActiveComponent('myJobs'); }} href="#">
                                                                            <i className="feather-monitor"></i><span>Jobs</span>
                                                                        </a>
                                                                    </li>
                                                                    {/* <li>
                                                                        <a className={this.state.showAnnouncement ? 'active' : ''} onClick={(e) => { e.preventDefault(); this.setActiveComponent('announcements'); }} href="#">
                                                                            <i className="feather-volume-2"></i><span>Announcements</span>
                                                                        </a>
                                                                    </li> */}
                                                                    {/* <li>
                                                                        <a className={this.state.showAssignment ? 'active' : ''} onClick={(e) => { e.preventDefault(); this.setActiveComponent('assignments'); }} href="#">
                                                                            <i className="feather-list"></i><span>Assignments</span>
                                                                        </a>
                                                                    </li> */}
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
                                        {this.state.showUserDashboard && <UserDashBoard message={this.state.responseMessage} />}
                                        {this.state.showProfile && <MyProfile userData={this.state.userData} CompanyName={this.state.CompanyName} />}
                                        {this.state.showMyJobs && <MyJobs />}
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
export default connect(mapStateToProps)(withNavigation(CandidateDashboard));