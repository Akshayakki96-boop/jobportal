import React from 'react';

class Footer  extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
   
        };

    }
    componentDidMount() {

    }





   

    render() {
        return (
            <footer className="rbt-footer footer-style-1">
            <div className="footer-top">
                <div className="container">
                    <div className="row row--15 mt_dec--30">
                        <div className="col-lg-4 col-md-6 col-sm-6 col-12 mt--30">
                            <div className="footer-widget">
                                <h5 className="ft-title">Our Mission</h5>
        
                                <p className="description mt--20">
                                    We’re always in search for talented
                                    Our mission is to empower individuals to reach their full potential through innovative training programs and seamless job placement services. By combining expert-led learning with a comprehensive network of career opportunities, ZobSkill bridges the gap between talent and success, creating pathways for meaningful and rewarding careers. 
                                </p>
                            </div>
                        </div>
        
                        <div className="offset-lg-1 col-lg-2 col-md-6 col-sm-6 col-12 mt--30">
                            <div className="footer-widget">
                                <h5 className="ft-title">Contact Us</h5>
                                <ul className="ft-link">
                                    <li>
                                        <a href="#">support@zobskill.com</a>
                                    </li>
                                    <li>
                                        <a href="#">trainer@zobskill.com</a>
                                    </li>
                                    <li>
                                        <a href="#">employer@zobskill.com</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
        
                        <div className="col-lg-2 col-md-6 col-sm-6 col-12 mt--30">
                            <div className="footer-widget">
                                <h5 className="ft-title">Quick Links</h5>
        
                                <ul className="ft-link">
                                    <li>
                                        <a href="#">Courses</a>
                                    </li>
                                    <li>
                                        <a href="#">Jobs</a>
                                    </li>
                                    <li>
                                        <a href="#">About Us</a>
                                    </li>
                                    <li>
                                        <a href="#">Candidate Login</a>
                                    </li>
                                    <li>
                                        <a href="#">Trainer Login</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
        
                        <div className="col-lg-3 col-md-6 col-sm-6 col-12 mt--30">
                            <div className="footer-widget">
                                <h5 className="ft-title">Subscribe us</h5>
                                <form className="newsletter-form mt--20" action="#">
                                    <p className="description">
                                        2000+ Our students are subscribe Around the World.<br /> 
                                        Don’t be shy introduce yourself!
                                    </p>
        
                                    <div className="form-group right-icon icon-email mb--20">
                                        <label htmlFor="email">Enter Your Email Here</label>
                                        <input id="email" type="email" />
                                    </div>
        
                                    <div className="form-group mb--0">
                                        <button className="rbt-btn rbt-switch-btn btn-gradient radius-round btn-sm" type="submit">
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

export default Footer ;