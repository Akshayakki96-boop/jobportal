import React from 'react';
import Swal from "sweetalert2";
import axios from 'axios';
class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }
    componentDidMount() {

    }


    handleSubmit = () => {
        const email = this.state.email;
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Community/AddUpdateBlogs`;
        const token = localStorage.getItem('authToken');
        const blogData = {
            "email": email,
            "id": 0
        }

        axios.post(url, blogData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                this.setState({ keepSpinner: false });
                Swal.fire({
                    title: "Success!",
                    text: "Email sent successfully.",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                // this.props.navigate('/EmployerDashboard?message=profilesuccess');
                //this.props.navigate('/Login'); // Use `navigate`

            })
            .catch((error) => {
                console.error('Signup Error:', error.response?.data || error.message);
                this.setState({ keepSpinner: false });
                Swal.fire({
                    title: "error!",
                    text: "something went wrong, please try again !",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            });
    }

    handleChange = (event) => {
        this.setState({ email: event.target.value });
    };





    render() {
        return (
            <footer className="rbt-footer footer-style-1">
                <div className="footer-top">
                    <div className="container">
                        <div className="row row--15 mt_dec--30">
                            <div style={{ textAlign: "left" }} className="col-lg-4 col-md-6 col-sm-6 col-12 mt--30">
                                <div className="footer-widget">
                                    <h5 className="ft-title">Our Mission</h5>

                                    <p style={{ textAlign: "left" }} className="description mt--20">
                                        Our mission is to empower individuals to reach their full potential through innovative training programs and seamless job placement services. By combining expert-led learning with a comprehensive network of career opportunities, ZobSkill bridges the gap between talent and success, creating pathways for meaningful and rewarding careers.
                                    </p>
                                </div>
                            </div>

                            <div style={{ textAlign: "left" }} className="offset-lg-1 col-lg-2 col-md-6 col-sm-6 col-12 mt--30">
                                <div className="footer-widget">
                                    <h5 className="ft-title">Contact Us</h5>
                                    <ul className="ft-link">
                                        <li>
                                            <a target='_blank' href="mailto:support@zobskill.com">support@zobskill.com</a>
                                        </li>
                                        <li>
                                            <a target='_blank' href="mailto:trainer@zobskill.com">trainer@zobskill.com</a>
                                        </li>
                                        <li>
                                            <a target='_blank' href="mailto:employer@zobskill.com">employer@zobskill.com</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div style={{ textAlign: "left" }} className="col-lg-2 col-md-6 col-sm-6 col-12 mt--30">
                                <div className="footer-widget">
                                    <h5 className="ft-title">Quick Links</h5>

                                    <ul className="ft-link">
                                        <li>
                                            <a href="/Course">Courses</a>
                                        </li>
                                        <li>
                                            <a href="/Jobs">Jobs</a>
                                        </li>
                                        <li>
                                            <a href="/aboutus">About Us</a>
                                        </li>
                                        <li>
                                            <a href="/Login">Candidate Login</a>
                                        </li>
                                        <li>
                                            <a href="/Login">Trainer Login</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div style={{ textAlign: "left" }} className="col-lg-3 col-md-6 col-sm-6 col-12 mt--30">
                                <div className="footer-widget">
                                    <h5 className="ft-title">Subscribe us</h5>
                                    <form className="newsletter-form mt--20" action="#">
                                        <p className="description">
                                            2000+ users subscribed to our page.<br />
                                            Don’t be shy introduce yourself!
                                        </p>

                                        <div className="form-group right-icon icon-email mb--20">
                                            <label htmlFor="email">Enter Your Email Here</label>
                                            <input id="email" type="email" value={this.state.email} onChange={this.handleChange} />
                                        </div>

                                        <div className="form-group mb--0">
                                            <button className="rbt-btn rbt-switch-btn btn-gradient radius-round btn-sm" type="button" onClick={this.handleSubmit}>
                                                <span data-text="Submit Now">Submit Now</span>
                                            </button>
                                        </div>
                                    </form>
                                    {/* Uncomment below block for social icons */}
                                    {/* 
                                <ul className="social-icon social-default icon-naked justify-content-start mt--20">
                                    <li><a href="https://www.facebook.com/">
                                        <i className="feather-facebook"></i>
                                    </a></li>
                                    <li><a href="https://www.twitter.com">
                                        <i className="feather-twitter"></i>
                                    </a></li>
                                    <li><a href="https://www.instagram.com/">
                                        <i className="feather-instagram"></i>
                                    </a></li>
                                    <li><a href="https://www.linkdin.com/">
                                        <i className="feather-linkedin"></i>
                                    </a></li>
                                </ul>
                                */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>


        );
    }
}

export default Footer;