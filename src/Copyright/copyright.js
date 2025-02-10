import React from 'react';

class Copyright  extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
   
        };

    }
    componentDidMount() {

    }





   

    render() {
        return (
            <div>
            {/* Separator */}
            <div className="rbt-separator-mid">
              <div className="container">
                <hr className="rbt-separator m-0" />
              </div>
            </div>
      
            {/* Copyright Area */}
            <div className="copyright-area copyright-style-1 ptb--20">
              <div className="container">
                <div className="row align-items-center">
                  {/* Left Column (Copyright Text) */}
                  <div  className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-12">
                    <p style={{textAlign:"left"}} className="rbt-link-hover text-lg-start">
                      Copyright © 2024 ZobSkill. All Rights Reserved.
                    </p>
                  </div>
      
                  {/* Right Column (Links) */}
                  <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-12">
                    <ul className="copyright-link rbt-link-hover justify-content-center justify-content-lg-end mt_sm--10 mt_md--10">
                      <li><a href="/termsconditions">Terms of service</a></li>
                      <li><a href="/privacypolicy">Privacy policy</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* End Copyright Area */}
          </div>
        
    
        );
    }
}

export default Copyright ;