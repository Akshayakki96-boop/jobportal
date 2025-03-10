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
import Course from './Courses/Course';
import CourseDetail from './Courses/CourseDetail';
import EmployerDashboard from './EmployerDashboard/EmployerDashboard';
import CreateJob from './EmployerDashboard/CreateJob';
import CandidateDashboard from './CandidateDashboard/CandidateDashboard';
import EditProfile from './EmployerDashboard/EditProfile';
import JobDetailsOutside from './Jobs/jobDetails-outside';
import EditProfileCandidate from './CandidateDashboard/EditProfile';
import ActivateProfile from './ActivateProfile/ActivateProfile';
import EditProfileTrainer from './Dashboard/EditProfile';
import CreateCourse from './Dashboard/CreateCourse';
import AboutUs from './AboutUs/AboutUs';
import TrainerAboutUs from './AboutUs/TrainerAboutUs';
import EmployerAboutUs from './AboutUs/EmployerAboutUs';
import CandidateAboutUs from './AboutUs/CandidateAboutUs';
import HeaderLoginSignUp from './Header/headerLoginSignUp';
import PrivacyPolicy from './PrivacyPolicy/PrivacyPolicy';
import TermsCondition from './TermsCondition/TermsCondition';
import ClaimRefund from './ClaimRefund/ClaimRefund';
import CommunityDetails from './Community/CommunityDetails';
import ForgotPassword from './ForgotPassword/ForgotPassword';
import CandidatesDetail from './EmployerDashboard/CandidatesDetail';
const NotFound = () => {
  return (
    <div>
      <HeaderLoginSignUp/>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};


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
          <Route path="/TrainerDashboard" element={<Dashboard />} />
          <Route path="/Jobs" element={<Jobs/>} />
          <Route path="/Job-details" element={<JobDetails/>} />
          <Route path="/Community" element={<Community/>} />
          <Route path="/Course" element={<Course/>} />
          <Route path="/Course-Details" element={<CourseDetail/>} />
          <Route path="/EmployerDashboard" element={<EmployerDashboard/>} />
          <Route path="/createnew" element={<CreateJob/>} />
          <Route path="/CandidateDashboard" element={<CandidateDashboard/>} />
          <Route path="/edit-profile" element={<EditProfile/>} />
          <Route path="/job-decription" element={<JobDetailsOutside/>} />
          <Route path="/edit-profile-candidate" element={<EditProfileCandidate/>} />
          <Route path="/Activate_Profile" element={<ActivateProfile/>} />
          <Route path="/edit-profile-trainer" element={<EditProfileTrainer/>} />
          <Route path="/create-new" element={<CreateCourse/>} />
          <Route path="/aboutus" element={<AboutUs/>} />
          <Route path="/trainer" element={<TrainerAboutUs/>} />
          <Route path="/employer" element={<EmployerAboutUs/>} />
          <Route path="/candidate" element={<CandidateAboutUs/>} />
          <Route path="/privacypolicy" element={<PrivacyPolicy/>} />
          <Route path="/termsconditions" element={<TermsCondition/>} />
          <Route path="/claimrefund" element={<ClaimRefund/>} />
          <Route path="/community-details" element={<CommunityDetails/>} />
          <Route path="/forgotpassword" element={<ForgotPassword/>} />
          <Route path="/CandidatesDetails" element={<CandidatesDetail/>} />
          <Route path="*" element={<NotFound />} />
          {/* Other routes can be added here */}
          </Routes>
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