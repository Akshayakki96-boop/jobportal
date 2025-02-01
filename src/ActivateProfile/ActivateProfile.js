import React, { Component } from 'react';
import axios from 'axios';
import HeaderLoginSignUp from '../Header/headerLoginSignUp';

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
                this.setState({ status: response.data.status });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (
            <div>
              <HeaderLoginSignUp />
            {this.state.isActive ? (
                this.state.status == 1 ? (
                <h4 className='text-success'>Your profile has been activated successfully! <a href="/Login" style={{ color: 'blue', textDecoration: 'underline' }}>Go to Login</a></h4>
                ) : this.state.status == 2 ? (
                <h4 className='text-success'>Your profile is already activated! <a href="/Login" style={{ color: 'blue', textDecoration: 'underline' }}>Go to Login</a></h4>
                ) : (
                <h4 className='text-danger'>An error occurred while activating your profile. Please try again later.</h4>
                )
            ) : (
                <h4 className='text-success'>Activating your profile...</h4>
              
            )}
            <p className='text-success'></p>
            <p className='text-success'></p>
            </div>
        );
    }
}

export default ActivateProfile;