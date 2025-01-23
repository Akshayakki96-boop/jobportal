import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import withNavigation from '../withNavigation';

class MyProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updatedUserData: { ...this.props.userData },
            responseMessage: '',
            alertVariant: '',

        };

    }
    componentDidMount() {

    }


    render() {
        const {updatedUserData} = this.state;
        return (
            <div className="col-lg-9">
                {/* Start Instructor Profile  */}
                <div className="container mt-5">
                    {/* Render Bootstrap alert if there's a responseMessage */}
                    {this.state.responseMessage && (
                        <Alert variant={this.state.alertVariant} onClose={() => this.setState({ responseMessage: '' })} dismissible>
                            {this.state.responseMessage}
                        </Alert>
                    )}
                </div>
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
                                    <a
                                        href={`/edit-profile?user_Id=${this.state.updatedUserData.user_id}`}
                                        className="rbt-btn btn-sm"
                                    >
                                        <i className="feather-edit pl--0"></i> Edit Profile
                                    </a>


                                </div>
                            </div>
                        </div>
                        {/* Profile Fields */}
                        {[
                            { label: 'First Name', key: 'firstname' },
                            { label: 'Last Name', key: 'lastname' },
                            { label: 'Email', key: 'email' },
                            { label: 'Company Name', key: 'CompanyName' },
                            { label: 'Designation', key: 'designation' }
                        ].map((item, index) => (
                            <div key={index} className="rbt-profile-row row row--15 mt--15">
                                <div className="col-lg-4 col-md-4">
                                    <div className="rbt-profile-content b2">{item.label}</div>
                                </div>
                                <div className="col-lg-8 col-md-8">
                                    <div className="rbt-profile-content b2">{updatedUserData[item.key]}</div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
           
            </div>



        );
    }
}

export default withNavigation(MyProfile);