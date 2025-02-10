import React, { Component } from 'react';
import Header from '../Header/header';

class PrivacyPolicy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dashBoardData: "",

        };

    }
    render() {
        return (
            <div>
            <Header dashBoardData={this.state.dashBoardData} />
            <div className="container mt-5" style={{ fontSize: '1em', textAlign: 'left' }}>
                <h4>Privacy Policy for Zobskill.com</h4>
                <p><strong>Effective Date: 28/11/2024</strong></p>
                <p>At Zobskill.com (owned & operated by Eduglobal Solutions), your privacy is important to us. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our platform.</p>

                <h5>1. Information We Collect</h5>
                <h5>1.1. Information You Provide</h5>
                <ul>
                <li><strong>Account Information:</strong> Name, email, phone number, and other details.</li>
                <li><strong>Profile Data:</strong> Resumes, educational details, certifications, work history.</li>
                <li><strong>Payment Information:</strong> Billing details for transactions.</li>
                </ul>

                <h5>1.2. Automatically Collected Information</h5>
                <ul>
                <li><strong>Usage Data:</strong> Interactions with the platform, pages visited, time spent.</li>
                <li><strong>Device Information:</strong> IP address, browser type, OS details.</li>
                <li><strong>Cookies:</strong> Used for user experience and analytics.</li>
                </ul>

                <h5>2. How We Use Your Information</h5>
                <ul>
                <li>Operate the platform (user registration, course/job listings).</li>
                <li>Personalize user experience and recommendations.</li>
                <li>Ensure security and prevent fraud.</li>
                <li>Improve our services through analytics and research.</li>
                </ul>

                <h5>3. How We Share Your Information</h5>
                <ul>
                <li><strong>With Other Users:</strong> Candidates, trainers, and employers as necessary.</li>
                <li><strong>With Third Parties:</strong> Payment processors, analytics tools, and legal compliance.</li>
                </ul>

                <h5>4. Data Security</h5>
                <p>Data is encrypted and monitored with regular security audits.</p>

                <h5>5. Your Rights</h5>
                <p>Users can access, update, or delete their data by contacting support.</p>

                <h5>6. Contact Us</h5>
                <p>Email: support@zobskill.com | Phone: +91 999 068 2323</p>
            </div>
            </div>
        );
    }
}

export default PrivacyPolicy;