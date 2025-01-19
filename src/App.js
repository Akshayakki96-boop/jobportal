import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { connect } from "react-redux";
import Login from './Login/login';
import Header from './Header/header';
import Footer from './Footer/footer';
import Copyright from './Copyright/copyright';
import Home from './Home/home';
import SignUp from './SignUp/signUp';
import Wrapper from './Wrapper/wrapper';
import Dashboard from './Dashboard/Dashboard';
import Jobs from './Jobs/jobs';
import JobDetails from './Jobs/job-detail';
import Community from './Community/Community';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }

    //this.handleNavigation = this.handleNavigation.bind(this);
  }


  componentDidMount() {
 
  }



  componentDidUpdate(previousProps) {
    // if (this.props.authData !== previousProps.authData) {
    //   getMSSalesAccessLevel(this.props.authData.split("@")[0]);
    // }
    // if (this.props.hasMSSalesAccess !== previousProps.hasMSSalesAccess) {
    //   this.setState({ hasMSSalesAccess: this.props.hasMSSalesAccess });
    // }
    // if (this.props.adminStatus !== previousProps.adminStatus) {
    //   this.setState({ userAdminStatus: this.props.adminStatus });
    // }
  }

  handleNavigation = (newPath) => {
    this.props.history.push(`/${newPath}`)
  }

  render() {
    const currentPath = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    // Check if the current path is Login or SignUp (with or without query parameters)
    const hideHeader =
      currentPath === '/Login' ||
      (currentPath.includes('/SignUp'));
    return (
      <div className="App">
        <Router>
        {/* <Breadcumb /> */}
          <div className="wrapper">
            <div id="content">
              <div className="mb-10">
                {/* <CommonError /> */}
              </div>

                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/Jobs" element={<Jobs/>} />
                <Route path="/Job-details" element={<JobDetails/>} />
                <Route path="/Community" element={<Community/>} />
               
                  {/* Other routes can be added here */}
                </Routes>
              {/* {this.state.hasMSSalesAccess === false && (
                <Routes>
                  <Route path="*" element={<UnauthorizedPage />} />
                </Routes>
              )} */}
              {/* {this.state.checkingAccess && <LoadingSpinner msg="Checking your MS Sales access..." />} */}
            </div>
          </div>
          <Footer />
          <Copyright />
          <Wrapper />
        </Router>
      </div>
    );
  }
}


export default App;