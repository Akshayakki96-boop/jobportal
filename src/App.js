import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { connect } from "react-redux";
import Login from './Login/login';
import Header from './Header/header';
import Footer from './Footer/footer';
import Copyright from './Copyright/copyright';
import Breadcumb from './Breadcumb/breadcumb';
import SignUp from './SignUp/signUp';



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
    return (
      <div className="App">
        <Router>
        <Header />
        <Breadcumb />
          <div className="wrapper">
            <div id="content">
              <div className="mb-10">
                {/* <CommonError /> */}
              </div>

                <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/SignUp" element={<SignUp />} />
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
        </Router>
      </div>
    );
  }
}


export default App;