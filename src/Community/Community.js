import React from 'react';
import axios from 'axios';
import withNavigation from '../withNavigation';
import Header from '../Header/header';

class Community extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUserDashboard: true,
            dashBoardData: ""
        };

    }
    componentDidMount() {
        //this.getDashboardUser();

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
                this.setState({ keepSpinner: false });

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

    render() {

        return (
            <>
                <Header dashBoardData={this.state.dashBoardData} />
                <div className="rbt-page-banner-wrapper">
                    {/* Start Banner BG Image  */}
                    <div className="rbt-banner-image" />
                    {/* End Banner BG Image  */}
                    <div className="rbt-banner-content">
                        {/* Start Banner Content Top  */}
                        <div className="rbt-banner-content-top">
                            <div className="container">
                                <div className="row">
                                    <div style={{ textAlign: "left" }} className="col-lg-12">
                                        {/* Start Breadcrumb Area  */}
                                        <ul className="page-list">
                                            <li className="rbt-breadcrumb-item">
                                                <a href="/">Home</a>
                                            </li>
                                            <li>
                                                <div className="icon-right">
                                                    <i className="feather-chevron-right" />
                                                </div>
                                            </li>
                                            <li className="rbt-breadcrumb-item active">Community</li>
                                        </ul>
                                        {/* End Breadcrumb Area  */}
                                        <div style={{ textAlign: "left" }} className=" title-wrapper">
                                            <h1 className="title mb--0">Latest Blogs</h1>
                                            {/*
                          <a href="#" class="rbt-badge-2">
                              <div class="image">🎉</div> 50 Articles
                          </a>
*/}
                                        </div>
                                        <p style={{ textAlign: "left" }} className="description">
                                            Blog that help beginner designers become true unicorns.{" "}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End Banner Content Top  */}
                    </div>
                </div>

                <>
                    <>
                        {/* Start Card Style */}
                        <div className="rbt-blog-area rbt-section-overlayping-top rbt-section-gapBottom">
                            <div className="container">
                                {/* Start Card Area */}
                                <div className="row g-5">
                                    <div
                                        className="col-lg-12 col-md-12 col-sm-12 col-12"
                                    >
                                        <div className="blglst rbt-card card-list variation-02 rbt-hover mt--30">
                                            <div className="rbt-card-img">
                                                <a href="#">
                                                    <img
                                                        src="assets/images/blog/blog-card-02.jpg"
                                                        alt="Card image"
                                                    />{" "}
                                                </a>
                                            </div>
                                            <div style={{ textAlign: "left" }} className="rbt-card-body">
                                                <h5 className="rbt-card-title">
                                                    <a href="#">Why Is Education So Famous?</a>
                                                </h5>
                                                <p className="rbt-card-text">
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                                                    enim ad minim veniam,
                                                </p>
                                                <div className="rbt-card-bottom">
                                                    <a className="transparent-button" href="#">
                                                        Read More
                                                        <i>
                                                            <svg
                                                                width={17}
                                                                height={12}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <g stroke="#27374D" fill="none" fillRule="evenodd">
                                                                    <path d="M10.614 0l5.629 5.629-5.63 5.629" />
                                                                    <path strokeLinecap="square" d="M.663 5.572h14.594" />
                                                                </g>
                                                            </svg>
                                                        </i>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="blglst rbt-card card-list variation-02 rbt-hover mt--30">
                                            <div style={{ textAlign: "left" }} className="rbt-card-body">
                                                <h5 className="rbt-card-title">
                                                    <a href="#">Difficult Things About Education.</a>
                                                </h5>
                                                <p className="rbt-card-text">
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                                                    enim ad minim veniam,
                                                </p>
                                                <div className="rbt-card-bottom">
                                                    <a className="transparent-button" href="#">
                                                        Read More
                                                        <i>
                                                            <svg
                                                                width={17}
                                                                height={12}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <g stroke="#27374D" fill="none" fillRule="evenodd">
                                                                    <path d="M10.614 0l5.629 5.629-5.63 5.629" />
                                                                    <path strokeLinecap="square" d="M.663 5.572h14.594" />
                                                                </g>
                                                            </svg>
                                                        </i>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="rbt-card-img">
                                                <a href="#">
                                                    <img
                                                        src="assets/images/blog/blog-card-03.jpg"
                                                        alt="Card image"
                                                    />{" "}
                                                </a>
                                            </div>
                                        </div>
                                        {/*
	<div class="blglst rbt-card card-list variation-02 rbt-hover mt--30">
		<div class="rbt-card-img">
			<a href="#">
				<img src="assets/images/blog/blog-card-02.jpg" alt="Card image"> </a>
		</div>
		<div class="rbt-card-body">
			<h5 class="rbt-card-title"><a href="#">Why Is Education So Famous?</a></h5>
			<p class="rbt-card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,</p>
			<div class="rbt-card-bottom">
				<a class="transparent-button" href="#">
					Read More<i><svg width="17" height="12" xmlns="http://www.w3.org/2000/svg"><g stroke="#27374D" fill="none" fill-rule="evenodd"><path d="M10.614 0l5.629 5.629-5.63 5.629"></path><path stroke-linecap="square" d="M.663 5.572h14.594"></path></g></svg></i>
				</a>
			</div>
		</div>
	</div>
	
	
	<div class="blglst rbt-card card-list variation-02 rbt-hover mt--30">
		<div class="rbt-card-body">
			<h5 class="rbt-card-title"><a href="#">Difficult Things About Education.</a></h5>
			<p class="rbt-card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,</p>
			<div class="rbt-card-bottom">
				<a class="transparent-button" href="#">
					Read More<i><svg width="17" height="12" xmlns="http://www.w3.org/2000/svg"><g stroke="#27374D" fill="none" fill-rule="evenodd"><path d="M10.614 0l5.629 5.629-5.63 5.629"></path><path stroke-linecap="square" d="M.663 5.572h14.594"></path></g></svg></i>
				</a>
			</div>
		</div>		
		<div class="rbt-card-img">
			<a href="#">
				<img src="assets/images/blog/blog-card-03.jpg" alt="Card image"> </a>
		</div>
	</div>		
*/}
                                    </div>
                                </div>
                                {/* End Card Area */}
                            </div>
                        </div>
                        {/* End Card Style */}
                    </>

                    <div className="rbt-counterup-area  rbt-section-gap">
                        <div className="container">
                            <div className="row mb--60">
                                <div className="col-lg-12">
                                    <div className="section-title text-center">
                                        <span className="subtitle  bg-primary-opacity">Zobskill</span>
                                        <h2 className="title">Upcoming Events</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-5">
                                {/* Start Single Event  */}
                                <div className="col-lg-4 col-md-6 col-12">
                                    <div className="rbt-card event-grid-card variation-01 rbt-hover">
                                        <div className="rbt-card-img">
                                            <a href="#">
                                                <img
                                                    src="assets/images/event/grid-type-01.jpg"
                                                    alt="Card image"
                                                />
                                                <div className="rbt-badge-3 bg-white">
                                                    <span>11 Mar</span>
                                                    <span>2025</span>
                                                </div>
                                            </a>
                                        </div>
                                        <div className="rbt-card-body">
                                            <ul className="rbt-meta">
                                                <li>
                                                    <i className="feather-map-pin" />
                                                    IAC Building
                                                </li>
                                                <li>
                                                    <i className="feather-clock" />
                                                    8:00 am - 5:00 pm
                                                </li>
                                            </ul>
                                            <h4 className="rbt-card-title">
                                                <a href="#">International Education Fair 2024</a>
                                            </h4>
                                            <div className="read-more-btn">
                                                <a
                                                    className="rbt-btn btn-border hover-icon-reverse btn-sm radius-round"
                                                    href="event-details.html"
                                                >
                                                    <span className="icon-reverse-wrapper">
                                                        <span className="btn-text">Get Ticket</span>
                                                        <span className="btn-icon">
                                                            <i className="feather-arrow-right" />
                                                        </span>
                                                        <span className="btn-icon">
                                                            <i className="feather-arrow-right" />
                                                        </span>
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* End Single Event  */}
                                {/* Start Single Event  */}
                                <div className="col-lg-4 col-md-6 col-12">
                                    <div className="rbt-card event-grid-card variation-01 rbt-hover">
                                        <div className="rbt-card-img">
                                            <a href="#">
                                                <img
                                                    src="assets/images/event/grid-type-02.jpg"
                                                    alt="Card image"
                                                />
                                                <div className="rbt-badge-3 bg-white">
                                                    <span>11 Apr</span>
                                                    <span>2025</span>
                                                </div>
                                            </a>
                                        </div>
                                        <div className="rbt-card-body">
                                            <ul className="rbt-meta">
                                                <li>
                                                    <i className="feather-map-pin" />
                                                    Vancouver
                                                </li>
                                                <li>
                                                    <i className="feather-clock" />
                                                    8:00 am - 5:00 pm
                                                </li>
                                            </ul>
                                            <h4 className="rbt-card-title">
                                                <a href="#">Painting Art Contest 2020</a>
                                            </h4>
                                            <div className="read-more-btn">
                                                <a
                                                    className="rbt-btn btn-border hover-icon-reverse btn-sm radius-round"
                                                    href="event-details.html"
                                                >
                                                    <span className="icon-reverse-wrapper">
                                                        <span className="btn-text">Get Ticket</span>
                                                        <span className="btn-icon">
                                                            <i className="feather-arrow-right" />
                                                        </span>
                                                        <span className="btn-icon">
                                                            <i className="feather-arrow-right" />
                                                        </span>
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* End Single Event  */}
                                {/* Start Single Event  */}
                                <div className="col-lg-4 col-md-6 col-12">
                                    <div className="rbt-card event-grid-card variation-01 rbt-hover">
                                        <div className="rbt-card-img">
                                            <a href="#">
                                                <img
                                                    src="assets/images/event/grid-type-03.jpg"
                                                    alt="Card image"
                                                />
                                                <div className="rbt-badge-3 bg-white">
                                                    <span>11 Oct</span>
                                                    <span>2025</span>
                                                </div>
                                            </a>
                                        </div>
                                        <div className="rbt-card-body">
                                            <ul className="rbt-meta">
                                                <li>
                                                    <i className="feather-map-pin" />
                                                    Paris
                                                </li>
                                                <li>
                                                    <i className="feather-clock" />
                                                    8:00 am - 5:00 pm
                                                </li>
                                            </ul>
                                            <h4 className="rbt-card-title">
                                                <a href="#">Histudy Education Fair 2024</a>
                                            </h4>
                                            <div className="read-more-btn">
                                                <a
                                                    className="rbt-btn btn-border hover-icon-reverse btn-sm radius-round"
                                                    href="event-details.html"
                                                >
                                                    <span className="icon-reverse-wrapper">
                                                        <span className="btn-text">Get Ticket</span>
                                                        <span className="btn-icon">
                                                            <i className="feather-arrow-right" />
                                                        </span>
                                                        <span className="btn-icon">
                                                            <i className="feather-arrow-right" />
                                                        </span>
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* End Single Event  */}
                            </div>
                            {/*
      <div class="row">
          <div class="col-lg-12 mt--60">
              <nav>
                  <ul class="rbt-pagination">
                      <li><a href="#" aria-label="Previous"><i class="feather-chevron-left"></i></a></li>
                      <li><a href="#">1</a></li>
                      <li class="active"><a href="#">2</a></li>
                      <li><a href="#">3</a></li>
                      <li><a href="#" aria-label="Next"><i class="feather-chevron-right"></i></a></li>
                  </ul>
              </nav>
          </div>
      </div>
*/}
                        </div>
                    </div>
                    <div className="rbt-team-area bg-color-extra2 rbt-section-gap">
                        <div className="container">
                            <div className="row mb--60">
                                <div className="col-lg-12">
                                    <div className="section-title text-center">
                                        <span className="subtitle bg-secondary-opacity">Zobskill</span>
                                        <h2 className="title">Mentors</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-5 justify-content-center mentor">
                                {/* Start Single Team  */}
                                <div className="col-lg-3 col-md-6 col-12">
                                    <div className="rbt-team team-style-default style-three small-layout rbt-hover">
                                        <div className="inner">
                                            <div className="thumbnail">
                                                <img
                                                    src="assets/images/team/team-05.jpg"
                                                    alt="Corporate Template"
                                                />
                                                {/*								<div class="watermark">Mentor</div>*/}
                                                <div className="badgs">
                                                    <img src="assets/images/zob-bad.png" alt="badges" />
                                                </div>
                                            </div>
                                            <div className="content">
                                                <h4 className="title">Gautam Sidarth</h4>
                                                <h6 className="subtitle theme-gradient">
                                                    Senior Software Engineer
                                                </h6>
                                                <span className="team-form">
                                                    <span className="location">
                                                        John has 5 years of experience in software development...
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* End Single Team  */}
                                {/* Start Single Team  */}
                                <div className="col-lg-3 col-md-6 col-12">
                                    <div className="rbt-team team-style-default style-three small-layout rbt-hover">
                                        <div className="inner">
                                            <div className="thumbnail">
                                                <img
                                                    src="assets/images/team/team-06.jpg"
                                                    alt="Corporate Template"
                                                />
                                                {/*								<div class="watermark">Mentor</div>*/}
                                                <div className="badgs">
                                                    <img src="assets/images/zob-bad.png" alt="badges" />
                                                </div>
                                            </div>
                                            <div className="content">
                                                <h2 className="title">Ayush</h2>
                                                <h6 className="subtitle theme-gradient">Project Manager</h6>
                                                <span className="team-form">
                                                    <span className="location">
                                                        Jane is an expert in managing complex projects...
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* End Single Team  */}
                                {/* Start Single Team  */}
                                <div className="col-lg-3 col-md-6 col-12">
                                    <div className="rbt-team team-style-default style-three small-layout rbt-hover">
                                        <div className="inner">
                                            <div className="thumbnail">
                                                <img
                                                    src="assets/images/team/team-08.jpg"
                                                    alt="Corporate Template"
                                                />
                                                {/*								<div class="watermark">Mentor</div>*/}
                                                <div className="badgs">
                                                    <img src="assets/images/zob-bad.png" alt="badges" />
                                                </div>
                                            </div>
                                            <div className="content">
                                                <h2 className="title">R.K. Dhiman</h2>
                                                <h6 className="subtitle theme-gradient">UX Designer</h6>
                                                <span className="team-form">
                                                    <span className="location">
                                                        Alice specializes in creating user friendly designs...{" "}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* End Single Team  */}
                            </div>
                            {/* End Card Area */}
                            <div className="row">
                                <div className="col-lg-12 mt--60">
                                    <nav>
                                        <ul className="rbt-pagination">
                                            <li>
                                                <a href="#" aria-label="Previous">
                                                    <i className="feather-chevron-left" />
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">1</a>
                                            </li>
                                            <li className="active">
                                                <a href="#">2</a>
                                            </li>
                                            <li>
                                                <a href="#">3</a>
                                            </li>
                                            <li>
                                                <a href="#" aria-label="Next">
                                                    <i className="feather-chevron-right" />
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>


                </>



            </>
        );
    }
}

export default withNavigation(Community);