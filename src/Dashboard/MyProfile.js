import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import withNavigation from '../withNavigation';

class MyProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }
    componentDidMount() {

    }



    render() {

        return (
            <div className="col-lg-9">
                {/* Start Instructor Profile  */}
                <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
                    <div className="content">
                    <div className="row align-items-end mb--60">
                        <div className="col-lg-6 col-md-6">
                            <div className="section-title text-start">
                                <h4 className="rbt-title-style-3 mb-0 pb-0">My Profile</h4>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="expend-button text-start text-md-end">
                                <a className="rbt-btn btn-sm" href="#"><i className="feather-edit pl--0"></i> Edit Profile</a>
                            </div>
                        </div>
                    </div>
                    {/* Start Profile Row */}
                    <div className="rbt-profile-row row row--15">
                        {/* Registration Date Label */}
                        <div className="col-lg-4 col-md-4">
                            <div className="rbt-profile-content b2">Registration Date</div>
                        </div>
                        {/* Registration Date Value */}
                        <div className="col-lg-8 col-md-8">
                            <div className="rbt-profile-content b2">February 25, 2025 6:01 am</div>
                        </div>
                    </div>
                    {/* End Profile Row */}
                    {/* Start Profile Row: First Name*/}
                    <div className="rbt-profile-row row row--15 mt--15">
                        {/* First Name Label */}
                        <div className="col-lg-4 col-md-4">
                            <div className="rbt-profile-content b2">First Name</div>
                        </div>
                        {/* First Name Value */}
                        <div className="col-lg-8 col-md-8">
                            <div className="rbt-profile-content b2">John</div>
                        </div>
                    </div>
                    {/* End Profile Row */}

                    {/* Start Profile Row: Last Name */}
                    <div className="rbt-profile-row row row--15 mt--15">
                        {/* Last Name Label */}
                        <div className="col-lg-4 col-md-4">
                            <div className="rbt-profile-content b2">Last Name</div>
                        </div>
                        {/* Last Name Value */}
                        <div className="col-lg-8 col-md-8">
                            <div className="rbt-profile-content b2">Doe</div>
                        </div>
                    </div>
                    {/* End Profile Row  */}

                    {/* Start Profile Row: Username  */}
                    <div className="rbt-profile-row row row--15 mt--15">
                        {/* Username Label */}
                        <div className="col-lg-4 col-md-4">
                            <div className="rbt-profile-content b2">Username</div>
                        </div>
                        {/* Username Value */}
                        <div className="col-lg-8 col-md-8">
                            <div className="rbt-profile-content b2">instructor</div>
                        </div>
                    </div>
                    {/* End Profile Row */}

                    {/* Start Profile Row: Email */}
                    <div className="rbt-profile-row row row--15 mt--15">
                        {/* Email Label */}
                        <div className="col-lg-4 col-md-4">
                            <div className="rbt-profile-content b2">Email</div>
                        </div>
                        {/* Email Value */}
                        <div className="col-lg-8 col-md-8">
                            <div className="rbt-profile-content b2">example@gmail.com</div>
                        </div>
                    </div>
                    {/* End Profile Row */}

                    {/* Start Profile Row: Phone Number*/}
                    <div className="rbt-profile-row row row--15 mt--15">
                        {/* Phone Number Label */}
                        <div className="col-lg-4 col-md-4">
                            <div className="rbt-profile-content b2">Phone Number</div>
                        </div>
                        {/* Phone Number Value */}
                        <div className="col-lg-8 col-md-8">
                            <div className="rbt-profile-content b2">+1-202-555-0174</div>
                        </div>
                    </div>
                    {/* End Profile Row */}

                    {/*  Start Profile Row: Skill/Occupation */}
                    <div className="rbt-profile-row row row--15 mt--15">
                        {/* Skill/Occupation Label */}
                        <div className="col-lg-4 col-md-4">
                            <div className="rbt-profile-content b2">Skill/Occupation</div>
                        </div>
                        {/* Skill/Occupation Value */}
                        <div className="col-lg-8 col-md-8">
                            <div className="rbt-profile-content b2">Application Developer</div>
                        </div>
                    </div>
                    {/*  End Profile Row */}

                    {/*  Start Profile Row: Biography */}
                    <div className="rbt-profile-row row row--15 mt--15">
                        {/* Biography Label */}
                        <div className="col-lg-4 col-md-4">
                            <div className="rbt-profile-content b2">Biography</div>
                        </div>
                        {/* Biography Value */}
                        <div className="col-lg-8 col-md-8">
                            <div className="rbt-profile-content b2">
                                I'm the Front-End Developer for #Rainbow IT in Bangladesh, OR. I have serious passion for UI effects, animations, and creating intuitive, dynamic user experiences.
                            </div>
                        </div>
                    </div>
                    {/* End Profile Row  */}
                </div>
            </div>
             {/*End Instructor Profile   */}
</div >



    );
    }
}

export default withNavigation(MyProfile);