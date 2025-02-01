import React from 'react';
import withNavigation from '../withNavigation';
import axios from 'axios';
class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSticky: false,
        };
        this.headerRef = React.createRef(); // Reference for the header element
        this.placeholderRef = React.createRef();
    }
    componentDidMount() {
  
        this.handleScroll();

        window.addEventListener('scroll', this.handleScroll);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.dashBoardData !== this.props.dashBoardData) {
            if(this.props.dashBoardData!="")
            {
                this.getDashboardUser();
            }
            
        }  
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
                this.setState({ dashBoardData: response.data.data });

                if (response.data.data.role_id == 2) {
                    this.getUserProfile(response.data.data.user_id);
                }
                if (response.data.data.role_id == 3) {
                    this.getTrainerProfile(response.data.data.user_id);
                }

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
    }




    getTrainerProfile = (userId) => {
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
                this.setState({ userData: response.data.data.basic_info })

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
                this.setState({ userData: response.data.data });

            })
            .catch((error) => {
                //localStorage.removeItem('authToken');
                //this.props.navigate('/Login'); // Use `navigate`
            });


    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
    handleScroll = () => {
        const headerContainer = this.headerRef.current;
        const placeholder = this.placeholderRef.current;
        const headerContainerHeight = headerContainer ? headerContainer.offsetHeight : 0;
        const topHeaderHeight = document.querySelector('.rbt-header-top') ? document.querySelector('.rbt-header-top').offsetHeight : 0;
        const targetScroll = topHeaderHeight + 200;

        if (window.scrollY > targetScroll) {
            headerContainer.classList.add('rbt-sticky');
            if (placeholder) placeholder.style.height = `${headerContainerHeight}px`;
            this.setState({ isSticky: true });
        } else {
            headerContainer.classList.remove('rbt-sticky');
            if (placeholder) placeholder.style.height = '0';
            this.setState({ isSticky: false });
        }
    };
    handleNavigation = (roleId) => {
        this.props.navigate(`/SignUp?role_id=${roleId}`);
    }

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

    handleredirection = () => {
        if (this.props.dashBoardData.role_id == 1) {
            this.props.navigate('/CandidateDashboard');
        }
        else if (this.props.dashBoardData.role_id == 2) {
            this.props.navigate('/EmployerDashboard');
        }
        else {
            this.props.navigate('/TrainerDashboard');
        }
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
            <header className="rbt-header rbt-header-10">
                <div ref={this.placeholderRef} className="rbt-sticky-placeholder"></div>

                {/* Start Header Top */}
                <div className="rbt-header-top rbt-header-top-1 header-space-betwween bg-not-transparent bg-color-darker top-expended-activation">
                    <div className="container-fluid">
                        <div className="top-expended-wrapper">
                            <div className="top-expended-inner rbt-header-sec align-items-center">
                                <div className="rbt-header-sec-col rbt-header-left d-none d-xl-block">
                                    <div className="rbt-header-content">
                                        {/* Start Header Information List */}
                                        <div className="header-info">
                                            <ul className="rbt-information-list">
                                                <li>
                                                    <a href="#">
                                                        <i className="fas fa-phone"></i>+1-202-555-0174
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="mailto:support@zobskill.com">
                                                        <i className="fas fa-envelope"></i> support@zobskill.com
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        {/* End Header Information List */}
                                    </div>
                                </div>

                                <div className="rbt-header-sec-col rbt-header-right mt_md--10 mt_sm--10">
                                    <div className="rbt-header-content justify-content-start justify-content-lg-end">
                                        <div className="header-info d-none d-xl-block">
                                            <ul className="social-share-transparent">
                                                <li>
                                                    <a href="#">
                                                        <i className="fab fa-facebook-f"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fab fa-twitter"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fab fa-linkedin-in"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fab fa-instagram"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="header-info">
                                <div className="top-bar-expended d-block d-lg-none">
                                    <button className="topbar-expend-button rbt-round-btn">
                                        <i className="feather-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* admin dashboard */}

                <div ref={this.headerRef} className={`rbt-header-wrapper header-space-betwween ${this.state.isSticky ? 'rbt-sticky' : ''}`}>
                    <div className="container-fluid">
                        <div className="mainbar-row rbt-navigation-center align-items-center">
                            <div className="header-left rbt-header-content">
                                <div className="header-info">
                                    <div className="logo logo-dark">
                                        <a href="/">
                                            <img src="assets/images/Zobskill.gif" alt="Logo Images" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="rbt-main-navigation d-none d-xl-block">
                                <nav className="mainmenu-nav">
                                    <ul className="mainmenu">
                                        <li className={window.location.pathname === "/" ? "current active" : "current"}>
                                            <a href="/">Home</a>
                                        </li>
                                        {(this.props.dashBoardData?.role_id == 1 || this.props.dashBoardData == "") && (
                                            <li className={window.location.pathname === "/Course" ? "active" : ""}>
                                                <a href="/Course">Course</a>
                                            </li>
                                        )}

                                        {(this.props.dashBoardData?.role_id == 1 || this.props.dashBoardData == "") && (
                                            <li className={window.location.pathname === "/Jobs" || window.location.pathname === "/job-decription" || window.location.pathname === "/Job-details" ? "active" : ""}>
                                                <a href="/Jobs">Jobs</a>
                                            </li>
                                        )}
                                        {this.props.dashBoardData === "" && (
                                            <li className={window.location.pathname === "/SignUp" ? "active" : ""}>
                                                <a href="/SignUp">Candidate</a>
                                            </li>
                                        )}
                                        {this.props.dashBoardData === "" && (
                                            <li className={window.location.pathname === "/SignUp" ? "active" : ""}>
                                                <a href="/SignUp">Employer</a>
                                            </li>
                                        )}
                                        {this.props.dashBoardData === "" && (
                                            <li className={window.location.pathname === "/SignUp" ? "active" : ""}>
                                                <a href="/SignUp">Trainer</a>
                                            </li>
                                        )}
                                        {(this.props.dashBoardData?.role_id == 2 || this.props.dashBoardData?.role_id == 3 || this.props.dashBoardData == "") && (
                                            <li className={window.location.pathname === "/Community" ? "active" : ""}>
                                                <a href="/Community">Community</a>
                                            </li>
                                        )}
                                    </ul>

                                </nav>
                            </div>

                            <div className="header-right">
                                {/* Navbar Icons */}
                                <ul className="quick-access">
                                <li className="access-icon">
                                                                            <a className="search-trigger-active rbt-round-btn" href="#">
                                                                                <i className="feather-search"></i>
                                                                            </a>
                                                                        </li> 
                                                                        {!this.props.dashBoardData && <li className="access-icon rbt-mini-cart">
                                                                            <a className="rbt-cart-sidenav-activation rbt-round-btn" href="/Login">
                                                                                Login
                                                                            </a>
                                                                        </li>}

                                                                        {this.props.dashBoardData?.username && <li className="account-access rbt-user-wrapper d-none d-xl-block">
                                                                            <a href="#">
                                                                                <i className="feather-user"></i>{this.props.dashBoardData?.username} ({this.props.dashBoardData?.role_id == 1 ? "Candidate" : this.props.dashBoardData?.role_id == 2 ? "Employer" : "Trainer"})
                                                                            </a>
                                                                            <div className="rbt-user-menu-list-wrapper">
                                                                                <div className="inner">
                                                                                    <div className="rbt-admin-profile">
                                                                                        {this.props.dashBoardData?.role_id == 2 && <div className="admin-thumbnail">
                                                                                            {this.state?.userData?.companylogo ? (
                                                                                                <img
                                                                                                    src={`${process.env.REACT_APP_BASEURL}/Uploads/${this.state.userData.companylogo}`}
                                                                                                    alt="User Image"
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
                                                                {this.getInitials(this.props?.dashBoardData?.username || "User")}
                                                            </div>
                                                        )}
                                                    </div>
                                                    }
                                                    {this.props.dashBoardData?.role_id == 3 && <div className="admin-thumbnail">
                                                        {this.state?.userData?.profile_image ? (
                                                            <img
                                                                src={`${process.env.REACT_APP_BASEURL}/Uploads/${this.state.userData.profile_image}`}
                                                                alt="User Image"
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
                                                                {this.getInitials(this.props?.dashBoardData?.username || "User")}
                                                            </div>
                                                        )}
                                                    </div>
                                                    }
                                                </div>


                                                <ul className="user-list-wrapper">
                                                    <li>
                                                        <a onClick={(e) => { e.preventDefault(); this.handleredirection(); }} href="#">
                                                            <i className="feather-log-out"></i>
                                                            <span>
                                                                {this.props.dashBoardData?.role_id == 1
                                                                    ? "CandidateDashboard"
                                                                    : this.props.dashBoardData?.role_id == 2
                                                                        ? "EmployerDashboard"
                                                                        : "TrainerDashboard"}
                                                            </span>

                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a onClick={(e) => { e.preventDefault(); this.handleLogout(); }} href="#">
                                                            <i className="feather-log-out"></i>
                                                            <span>Logout</span>
                                                        </a>
                                                    </li>
                                                </ul>
                                                {/* Start Mobile-Menu-Bar */}
                                                <div className="mobile-menu-bar d-block d-xl-none">
                                                    <div className="hamberger">
                                                        <button className="hamberger-button rbt-round-btn">
                                                            <i className="feather-menu"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                {/* End Mobile-Menu-Bar */}

                                            </div>
                                        </div>
                                    </li>}

                                    <li className="access-icon rbt-user-wrapper d-block d-xl-none">
                                        <a className="rbt-round-btn" href="#">
                                            <i className="feather-user"></i>
                                        </a>
                                        <div className="rbt-user-menu-list-wrapper">
                                            <div className="inner">
                                                <div className="rbt-admin-profile">
                                                    <div className="admin-thumbnail">
                                                        <img
                                                            src="assets/images/team/avatar.jpg"
                                                            alt="User Images"
                                                        />
                                                    </div>
                                                    <div className="admin-info">
                                                        <span className="name">RainbowIT</span>
                                                        <a className="rbt-btn-link color-primary" href="#">
                                                            View Profile
                                                        </a>
                                                    </div>
                                                </div>
                                                <ul className="user-list-wrapper">
                                                    <li>
                                                        <a href="#">
                                                            <i className="feather-home"></i>
                                                            <span>My Dashboard</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <i className="feather-bookmark"></i>
                                                            <span>Bookmark</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <i className="feather-shopping-bag"></i>
                                                            <span>Enrolled Courses</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <i className="feather-heart"></i>
                                                            <span>Wishlist</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <i className="feather-star"></i>
                                                            <span>Reviews</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <i className="feather-list"></i>
                                                            <span>My Quiz Attempts</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <i className="feather-clock"></i>
                                                            <span>Order History</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <i className="feather-message-square"></i>
                                                            <span>Question & Answer</span>
                                                        </a>
                                                    </li>
                                                </ul>
                                                <hr className="mt--10 mb--10" />
                                                <ul className="user-list-wrapper">
                                                    <li>
                                                        <a href="#">
                                                            <i className="feather-book-open"></i>
                                                            <span>Getting Started</span>
                                                        </a>
                                                    </li>
                                                </ul>
                                                <hr className="mt--10 mb--10" />
                                                <ul className="user-list-wrapper">
                                                    <li>
                                                        <a href="#">
                                                            <i className="feather-settings"></i>
                                                            <span>Settings</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="index.html">
                                                            <i className="feather-log-out"></i>
                                                            <span>Logout</span>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                </ul>

                                {/* Start Mobile-Menu-Bar */}
                                <div className="mobile-menu-bar d-block d-xl-none">
                                    <div className="hamberger">
                                        <button className="hamberger-button rbt-round-btn">
                                            <i className="feather-menu"></i>
                                        </button>
                                    </div>
                                </div>
                                {/* End Mobile-Menu-Bar */}
                            </div>
                        </div>
                    </div>

                    {/*start Search Dropdown */}
                    <div className="rbt-search-dropdown">
                        <div className="wrapper">
                            <div className="row">
                                <div className="col-lg-12">
                                    <form action="#">
                                        <input type="text" placeholder="What are you looking for?" />
                                        <div className="submit-btn">
                                            <a className="rbt-btn btn-gradient btn-md" href="#">Search</a>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div className="rbt-separator-mid">
                                <hr className="rbt-separator m-0" />
                            </div>

                            <div className="row g-4 pt--30 pb--60">
                                <div className="col-lg-12">
                                    <div className="section-title">
                                        <h5 className="rbt-title-style-2">Our Top Course</h5>
                                    </div>
                                </div>

                                {/* Start Single Card */}
                                <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                                    <div className="rbt-card variation-01 rbt-hover">
                                        <div className="rbt-card-img">
                                            <a href="course-details.html">
                                                <img src="assets/images/course/course-online-01.jpg" alt="Card image" />
                                            </a>
                                        </div>
                                        <div className="rbt-card-body">
                                            <h5 className="rbt-card-title"><a href="course-details.html">React Js</a></h5>
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
                                            <div className="rbt-card-bottom">
                                                <div className="rbt-price">
                                                    <span className="current-price">$15</span>
                                                    <span className="off-price">$25</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* End Single Card */}

                                {/* Repeat the structure for other cards */}

                                <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                                    <div className="rbt-card variation-01 rbt-hover">
                                        <div className="rbt-card-img">
                                            <a href="course-details.html">
                                                <img src="assets/images/course/course-online-02.jpg" alt="Card image" />
                                            </a>
                                        </div>
                                        <div className="rbt-card-body">
                                            <h5 className="rbt-card-title"><a href="course-details.html">Java Program</a></h5>
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
                                            <div className="rbt-card-bottom">
                                                <div className="rbt-price">
                                                    <span className="current-price">$10</span>
                                                    <span className="off-price">$40</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Continue for the rest of the cards */}

                            </div>

                        </div>
                    </div>
                    {/*end Search Dropdown */}
                </div>

            </header>

        );
    }
}

export default withNavigation(Header);