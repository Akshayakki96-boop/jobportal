import React, { Component } from 'react';
import Header from '../Header/header';

class ClaimRefund extends Component {
    constructor(props) {
        super(props);
        this.state = {
              dashBoardData: ""
        };
    }

    render() {
        return (
            <div>
            <Header dashBoardData={this.state.dashBoardData} />
                <p>Claim your Refund</p>
            </div>
        );
    }
}

export default ClaimRefund;