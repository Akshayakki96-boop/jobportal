import React from 'react';

class SignUp  extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
   
        };

    }
    componentDidMount() {

    }





   

    render() {
        return (
            <div className="rbt-elements-area bg-color-white rbt-section-gap">
            <div className="container">
              <div className="row gy-5 row--30">
                <div className="col-lg-6 mx-auto">
                  <div className="rbt-contact-form contact-form-style-1 max-width-auto">
                    <h3 className="title">Sign Up</h3>
                    <form  className="max-width-auto">
                      <div className="form-group">
                        <input
                          name="email"
                          type="email"
                        />
                        <label>Email address *</label>
                        <span className="focus-border"></span>
                      </div>
      
                      <div className="form-group">
                        <input
                          name="username"
                          type="text"
                        />
                        <label>Username *</label>
                        <span className="focus-border"></span>
                      </div>
      
                      <div className="form-group">
                        <input
                          name="password"
                          type="password"
                        />
                        <label>Password *</label>
                        <span className="focus-border"></span>
                      </div>
      
                      <div className="form-group">
                        <input
                          name="confirmPassword"
                          type="password"
                        />
                        <label>Confirm Password *</label>
                        <span className="focus-border"></span>
                      </div>
      
                      <div className="form-submit-group">
                        <button type="submit" className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100">
                          <span className="icon-reverse-wrapper">
                            <span className="btn-text">Register</span>
                            <span className="btn-icon">
                              <i className="feather-arrow-right"></i>
                            </span>
                            <span className="btn-icon">
                              <i className="feather-arrow-right"></i>
                            </span>
                          </span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
    
        );
    }
}

export default SignUp ;