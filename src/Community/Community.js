import React from 'react';
import axios from 'axios';
import withNavigation from '../withNavigation';
import Header from '../Header/header';
import parse from 'html-react-parser';
import { Alert, Button } from 'react-bootstrap';

class Community extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUserDashboard: true,
            dashBoardData: {}
        };

    }
    componentDidMount() {
        const token = localStorage.getItem('authToken');
        if (token) {
            this.getDashboardUser();
        }
        else {
            this.setState({ dashBoardData: "" });
            this.getBlogs();
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
                this.getUserProfile(response.data.user_id);
                this.getBlogs(response.data.data);
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

    getBlogs = (role) => {
        this.setState({ keepSpinner: true });
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Community/GetBlogs`;
        //const token = localStorage.getItem('authToken');
        var request = {
            "id": 0,
            "user_id": role?parseInt(role.user_id, 10):0,
            "freesearch": "",
            "role_id": role ? parseInt(role.role_id, 10) : 0
        }
        axios.post(url, request, {
            headers: {
                'Content-Type': 'application/json',
                //Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('blogdata', response.data.data);
                this.setState({ blogsList: response.data.data });
                this.setState({ keepSpinner: false });

            })
            .catch((error) => {
                //localStorage.removeItem('authToken');
                //this.props.navigate('/Login'); // Use `navigate`
            });
    }


    handleDeleteBlogs = (blogId) => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Community/RemoveBlog`;
        const token = localStorage.getItem('authToken');
        const blogData = {
            
                "id": blogId,
                "title": "string",
                "description": "string",
                "blog_image": "string",
                "role_id": this.state.dashBoardData.role_id,
              
        };
        axios.post(url, blogData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('delete blog data', response.data);

                this.setState({
                    responseMessage: "Blogs Deleted successfully!",
                    alertVariant: 'success', // Success alert variant

                });
                window.scrollTo(0, 0); // Scroll to the top of the page
                this.getBlogs(this.state.dashBoardData);

                this.setState({ keepSpinner: false });
            })
            .catch((error) => {
                this.setState({
                    responseMessage: error.response?.data.message,
                    alertVariant: 'danger', // Error alert variant


                });
                window.scrollTo(0, 0); // Scroll to the top of the page
            });
    }




    render() {

        return (
            <><>
                <Header dashBoardData={this.state.dashBoardData} />
                {this.state.responseMessage && (
                    <Alert variant={this.state.alertVariant} onClose={() => this.setState({ responseMessage: '' })} dismissible>
                        {this.state.responseMessage}
                    </Alert>
                )}
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
                                        <p style={{ textAlign: "left" }} className="description">
                                            Connect, Learn, and Grow – Engage with mentors, trainers, and recruiters in the Zobskill Community!
                                        </p>
                                        <div style={{ textAlign: "left" }} className=" title-wrapper">
                                            <h1 className="title mb--0">Latest Blogs</h1>
                                            <div style={{ marginLeft: "721px" }}>
                                                {localStorage.getItem('authToken') && this.state.dashBoardData?.role_id != 1 && <a className="rbt-btn btn-md hover-icon-reverse" href={`/CreateBlogs`}>
                                                    <span className="icon-reverse-wrapper">
                                                        <span className="btn-text">Add Blogs</span>
                                                        <span className="btn-icon">
                                                            <i className="feather-arrow-right"></i>
                                                        </span>
                                                        <span className="btn-icon">
                                                            <i className="feather-arrow-right"></i>
                                                        </span>
                                                    </span>
                                                </a>}
                                            </div>
                                            {/*
<a href="#" class="rbt-badge-2">
<div class="image">🎉</div> 50 Articles
</a>
*/}
                                        </div>

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
                                {this.state.keepSpinner && <div class="custom-loader">
                                    <div class="loader-spinner"></div>
                                    <p class="loader-text">Please Wait while Blogs  are loading...</p>
                                </div>}
                                {/* Start Card Area */}
                                <div className="row g-5">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                        {this.state.blogsList && this.state.blogsList.map((blog, index) => (
                                            <div key={blog.blog_id} className={`blglst rbt-card card-list variation-02 rbt-hover mt--30 ${index % 2 === 0 ? 'image-left' : 'image-right'}`}>
                                                <div className="rbt-card-img">
                                                    {/* Generating dynamic images */}
                                                    <a href="#">
                                                        <img
                                                            src={`${process.env.REACT_APP_BASEURL}/Uploads/${blog.blogimage}`}
                                                            alt="Card image" />
                                                    </a>
                                                </div>
                                                <div style={{ textAlign: "left" }} className="rbt-card-body">
                                                    <h6 style={{ fontSize: '18px' }} className="rbt-card-title">
                                                        <a href={`/community-details?blogId=${blog.blog_id}`}>{blog.title}</a>
                                                    </h6>
                                                    {/* <p style={{ fontSize: '12px' }} className="rbt-card-text"> */}
                                                    {parse(blog.description.length > 50 ? `${blog.description.substring(0, 300)}...` : blog.description)}
                                                    {/* </p> */}
                                                    {/* <ul className="rbt-meta">


                                                        {localStorage.getItem('authToken') && <li>
                                                            <a style={{ marginBottom: "10px", color: "blue", cursor: 'pointer' }} className="rbt-btn-link" href={`/edit-blogs?blogId=${blog.blog_id}`}>
                                                                <i
                                                                    style={{ color: "blue" }}
                                                                    //onClick={() => this.handleDeleteCourse()}
                                                                    className="fas fa-edit" />
                                                            </a>
                                                        </li>}
                                                        {localStorage.getItem('authToken') && <li>
                                                            <i
                                                                className="fas fa-trash-alt"
                                                                title='Edit blogs'
                                                                style={{ color: "red", cursor: "pointer" }}
                                                                onClick={() => this.handleDeleteCourse()}
                                                            />
                                                        </li>}
                                                        <li textAlign="right">
                                                          
                                                        </li>

                                                    </ul> */}
                                                    <div className="rbt-card-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        {/* Icons Section */}
                                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                            {localStorage.getItem('authToken') && this.state.dashBoardData?.role_id != 1 && (
                                                                <a style={{ color: "blue", cursor: "pointer" }} className="rbt-btn-link" href={`/edit-blogs?blogId=${blog.blog_id}`}>
                                                                    <i className="fas fa-edit" style={{ color: "blue", fontSize: "16px" }} />
                                                                </a>
                                                            )}

                                                            {localStorage.getItem('authToken') && this.state.dashBoardData?.role_id != 1 && (
                                                                <i className="fas fa-trash-alt" title="Delete blog" style={{ color: "red", cursor: "pointer", fontSize: "16px" }} onClick={() => this.handleDeleteBlogs(blog.blog_id)} />
                                                            )}
                                                        </div>

                                                        {/* Read More Section */}
                                                        <a className="transparent-button" href={`/community-details?blogId=${blog.blog_id}`} style={{ display: "flex", alignItems: "center", gap: "5px", textDecoration: "none" }}>
                                                            Read More
                                                            <svg width={17} height={12} xmlns="http://www.w3.org/2000/svg">
                                                                <g stroke="#27374D" fill="none" fillRule="evenodd">
                                                                    <path d="M10.614 0l5.629 5.629-5.63 5.629" />
                                                                    <path strokeLinecap="square" d="M.663 5.572h14.594" />
                                                                </g>
                                                            </svg>
                                                        </a>
                                                    </div>


                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End Card Area */}
                    </>
                </>
                {/* End Card Style */}
            </><div className="rbt-counterup-area  rbt-section-gap">
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
                                                alt="Card image" />
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
                                                href="#"
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
                                                alt="Card image" />
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
                                                href="#"
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
                                                alt="Card image" />
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
                                                href="#"
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
                </div><div className="rbt-team-area bg-color-extra2 rbt-section-gap">
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
                                                alt="Corporate Template" />
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
                                                    Gautam has 5 years of experience in software development...
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
                                                alt="Corporate Template" />
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
                                                    Ayush is an expert in managing complex projects...
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
                                                alt="Corporate Template" />
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
                                                    R.K. Dhiman specializes in creating user friendly designs...{" "}
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
                </div></>

        );
    }
}

export default withNavigation(Community);