import React, { Component } from 'react';
import axios from 'axios';

class ActivateProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: false
        };
    }
    componentDidMount() {
        // Get the activation token from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const queryString = window.location.search;
        const queryParams = queryString.substring(1);
        const baseUrl = process.env.REACT_APP_BASEURL;
        const activateUrl = `${baseUrl}/api/Signup/VerifyEmail`;
        var text={
            user_id: queryParams
        }
        axios.post(activateUrl, text, {
            headers: {
                'Content-Type': 'application/json',
                //Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                this.setState({ isActive: true });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (
            <div>
                {this.state.isActive ? (
                    <p className='text-success'>Your profile has been activated successfully! <a href="/Login" style={{ color: 'blue', textDecoration: 'underline' }}>Go to Login</a></p>
                ) : (
                    <p className='text-danger'>An error occurred while activating your profile. Please try again later.</p>
                )}
                <p className='text-success'></p>
                <p className='text-success'></p>
            </div>
        );
    }
}

export default ActivateProfile;