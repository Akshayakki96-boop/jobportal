import React from 'react';
import axios from 'axios';
import withNavigation from '../withNavigation';
import UserDashBoard from './TrainerDashboard';
import MyProfile from './MyProfile';
import EnrolledCourses from './EnrolledCourses';
import MyCourses from './MyCourses';
import Announcement from './Announcement';
import Assignment from './Assignment';
import Header from '../Header/header';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUserDashboard: true,
            dashBoardData:{}
        };

    }
    componentDidMount() {
        this.getDashboardUser();

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
                this.setState({dashBoardData:response.data.data,dashboardCounterData:response.data});
                this.getUserProfile(response.data.data.user_id);
                

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
    }

    getUserProfile = (userId) => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Trainer/GetTrainerProfile`;
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
                this.setState({userData:response.data.data})

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
            showEnrollCourse: false,
            showMyCourses: false,
            showAssignment: false
        });

        switch (componentName) {
            case 'dashboard':
                this.setState({ showUserDashboard: true });
                break;
            case 'profile':
                this.setState({ showProfile: true });
                break;
            case 'enrolledCourses':
                this.setState({ showEnrollCourse: true });
                break;
            case 'myCourses':
                this.setState({ showMyCourses: true });
                break;
            case 'announcements':
                this.setState({ showAnnouncement: true });
                break;
            case 'assignments':
                this.setState({ showAssignment: true });
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
        const parts = name.split(" ");
        return parts.length > 1
          ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
          : parts[0][0].toUpperCase();
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
                                                <h6 className="subtitle sal-animate" >Trainer</h6>
                                                <h3 style={{textAlign:"center"}} className="title sal-animate">Learn with <span>{this.state?.userData?.basic_info.fullname}</span></h3>
                                            </div>
                                        </div>
                                        {/* Start Tutor Information */}
                                        <div className="rbt-tutor-information">
                                            <div className="rbt-tutor-information-left">
                                            <div className="thumbnail rbt-avatars size-lg">
                                                    {this.state?.userData?.basic_info.profile_image ? (
                                                        <img
                                                            src={`${process.env.REACT_APP_BASEURL}/Uploads/${this.state.userData.basic_info.profile_image}`}
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
                                                    <h5 className="title">{this.state?.dashBoardData.username} (Trainer)</h5>
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
                                            <div className="rbt-tutor-information-right">
                                                <div className="tutor-btn">
                                                    <a className="rbt-btn btn-md hover-icon-reverse" href="/create-new">
                                                        <span className="icon-reverse-wrapper">
                                                            <span className="btn-text">Create a New Course</span>
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
                                                                        <a className={this.state.showMyCourses ? 'active' : ''} onClick={(e) => { e.preventDefault(); this.setActiveComponent('myCourses'); }} href="#">
                                                                            <i className="feather-monitor"></i><span>My Courses</span>
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
                                        {this.state.showUserDashboard && <UserDashBoard dashBoardData={this.state?.dashboardCounterData} />}
                                        {this.state.showProfile && <MyProfile userData={this.state.userData} />}
                                        {this.state.showEnrollCourse && <EnrolledCourses />}
                                        {this.state.showMyCourses && <MyCourses />}
                                        {this.state.showAnnouncement && <Announcement />}
                                        {this.state.showAssignment && <Assignment />}
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

export default withNavigation(Dashboard);