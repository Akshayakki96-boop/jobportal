import React, { Component } from 'react';
import Header from '../Header/header';
import axios from 'axios';

class CandidateAboutUs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
              dashBoardData: ""
            // initialize your state here
        };
    }
    componentDidMount=()=>{
       // this.getDashboardUser();
    }
    getDashboardUser = () => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Employer/Dashboard`;
        const token = localStorage.getItem('authToken');

        axios.post(url, "", {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('dashboard data', response.data);
                this.getUserProfile(response.data.user_id);
                this.setState({ dashBoardData: response.data.data });

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
    }
    render() {
        return (
            <div>
               <>
                    <Header dashBoardData={this.state.dashBoardData} />
  {/* Start breadcrumb Area */}
  <div className="rbt-breadcrumb-default ptb--100 ptb_md--50 ptb_sm--30 bg-gradient-1">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="breadcrumb-inner text-center">
            <h2 className="title">Candidate</h2>
            <ul className="page-list">
              <li className="rbt-breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li>
                <div className="icon-right">
                  <i className="feather-chevron-right" />
                </div>
              </li>
              <li className="rbt-breadcrumb-item active">Candidate</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* End Breadcrumb Area */}
  <div style={{ textAlign: 'center', fontSize: '1.5em', padding: '20px' }}>
  "Don’t just wait—take the first step towards your dream career. Sign up on Zobskill now and unlock your potential!"
  </div>
  <div className="rbt-about-area about-style-1 bg-color-white rbt-section-gap">
  <div className="container">
    <div className="row g-5 align-items-center">
      <div className="col-lg-6">
        <div className="thumbnail-wrapper">
          <div className="thumbnail image-1">
            <img
              data-parallax='{"x": 0, "y": -20}'
              src="assets/images/about/about-07.jpg"
              alt="Education Images"
            />
          </div>
          <div className="thumbnail image-2 d-none d-xl-block">
            <img
              data-parallax='{"x": 0, "y": 60}'
              src="assets/images/about/about-09.jpg"
              alt="Education Images"
            />
          </div>
          <div className="thumbnail image-3 d-none d-md-block">
            <img
              data-parallax='{"x": 0, "y": 80}'
              src="assets/images/about/about-08.jpg"
              alt="Education Images"
            />
          </div>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="inner pl--50 pl_sm--0 pl_md--0">
          <div className="section-title text-start">
            <span className="subtitle bg-coral-opacity">Candidate</span>
            <h2 className="title">
              Zobskill is a <br />
              one-stop platform
            </h2>
          </div>
          <p className="description mt--30">
            Zobskill is a one-stop platform designed to bridge the gap between
            professional training and job opportunities. From personalized
            training and certifications to global job placements, Zobskill is
            your trusted partner in career success
          </p>
          {/* Start Feature List  */}
          <div className="rbt-feature-wrapper mt--40">
            <div className="rbt-feature feature-style-1">
              <div className="icon bg-pink-opacity">
                <i className="feather-settings" />
              </div>
              <div className="feature-content">
                <h6 className="feature-title">Our Mission</h6>
                <p className="feature-description">
                  To empower individuals worldwide by providing personalized
                  pathways to skills, certifications, and job placements through
                  a seamless and innovative platform.
                </p>
              </div>
            </div>
            <div className="rbt-feature feature-style-1">
              <div className="icon bg-primary-opacity">
                <i className="feather-eye" />
              </div>
              <div className="feature-content">
                <h6 className="feature-title">Our Vision</h6>
                <p className="feature-description">
                  To become the most trusted global marketplace for skills and
                  opportunities, transforming careers across industries.
                </p>
              </div>
            </div>
          </div>
          {/* End Feature List  */}
        </div>
      </div>
    </div>
  </div>
</div>
<div className="rbt-course-area bg-color-extra2 rbt-section-gap">
  <div className="container">
    <div className="row g-5 align-items-center">
      <div className="col-lg-6 order-2 order-lg-1 mt_md--40 mt_sm--40">
        <div className="rbt-accordion-style accordion">
          <div className="section-title text-start">
            <span className="subtitle bg-primary-opacity">
              Key Benefits of Zobskill
            </span>
          </div>
          <h5 className="title">Why Choose Us?</h5>
          <div className="rbt-accordion-style rbt-accordion-02 accordion">
            <div className="accordion" id="accordionExampleb2">
              <div className="accordion-item card">
                <h2 className="accordion-header card-header" id="headingTwo1">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo1"
                    aria-controls="collapseTwo1"
                  >
                    100% Refund on Training Fees:
                  </button>
                </h2>
                <div
                  id="collapseTwo1"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo1"
                  data-bs-parent="#accordionExampleb2"
                >
                  <div className="accordion-body card-body">
                    <ul>
                      <li>
                        Get 50% refunded when you pass your certification exam.
                      </li>
                      <li>
                        Receive the remaining 50% refunded upon securing a job
                        through Zobskill. (T&amp;C Apply)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="accordion-item card">
                <h2 className="accordion-header card-header" id="headingTwo2">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo2"
                    aria-expanded="false"
                    aria-controls="collapseTwo2"
                  >
                    Zobskill Mentor Badge:
                  </button>
                </h2>
                <div
                  id="collapseTwo2"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo2"
                  data-bs-parent="#accordionExampleb2"
                >
                  <div className="accordion-body card-body">
                    <ul>
                      <li>
                        Stand out with the prestigious badge awarded to
                        successful candidates after their first milestone.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="accordion-item card">
                <h2 className="accordion-header card-header" id="headingTwo3">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo3"
                    aria-expanded="false"
                    aria-controls="collapseTwo3"
                  >
                    Trainer Incentives:
                  </button>
                </h2>
                <div
                  id="collapseTwo3"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo3"
                  data-bs-parent="#accordionExampleb2"
                >
                  <div className="accordion-body card-body">
                    Trainers earn incentives for every candidate who passes
                    their exam, ensuring top-quality training.
                  </div>
                </div>
              </div>
              <div className="accordion-item card">
                <h2 className="accordion-header card-header" id="headingTwo4">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo4"
                    aria-expanded="false"
                    aria-controls="collapseTwo4"
                  >
                    Interactive Community:
                  </button>
                </h2>
                <div
                  id="collapseTwo4"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo4"
                  data-bs-parent="#accordionExampleb2"
                >
                  <div className="accordion-body card-body">
                    <ul>
                      <li>
                        Engage with Zobskill Mentors to learn from their
                        experiences.
                      </li>
                      <li>
                        Participate in webinars by trainers and employers to
                        explore job trends and course benefits.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="accordion-item card">
                <h2 className="accordion-header card-header" id="headingTwo5">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo5"
                    aria-expanded="false"
                    aria-controls="collapseTwo5"
                  >
                    End-to-End Support:
                  </button>
                </h2>
                <div
                  id="collapseTwo5"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo5"
                  data-bs-parent="#accordionExampleb2"
                >
                  <div className="accordion-body card-body">
                    <ul>
                      <li>
                        From skill-building to job placement, we provide career
                        counseling, interview preparation, and more.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="accordion-item card">
                <h2 className="accordion-header card-header" id="headingTwo6">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo6"
                    aria-expanded="false"
                    aria-controls="collapseTwo6"
                  >
                    Industry Coverage:
                  </button>
                </h2>
                <div
                  id="collapseTwo6"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo6"
                  data-bs-parent="#accordionExampleb2"
                >
                  <div className="accordion-body card-body">
                    <ul>
                      <li>
                        Opportunities across sectors like IT, finance,
                        healthcare, logistics, manufacturing, and more.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h5 className="title mt-5">Benefits For Employers and Trainers</h5>
          <div className="rbt-accordion-style rbt-accordion-02 accordion">
            <div className="accordion" id="accordionExampleb2">
              <div className="accordion-item card">
                <h2 className="accordion-header card-header" id="headingTwo7">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo7"
                    aria-controls="collapseTwo7"
                  >
                    Empowering Employers
                  </button>
                </h2>
                <div
                  id="collapseTwo7"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo7"
                  data-bs-parent="#accordionExampleb2"
                >
                  <div className="accordion-body card-body">
                    <ul>
                      <li>
                        Access pre-screened, certified talent tailored to your
                        needs.
                      </li>
                      <li>
                        Streamline recruitment with Zobskill’s smart matching
                        tools.
                      </li>
                      <li>
                        Boost your brand visibility with hosted webinars and
                        targeted outreach.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="accordion-item card">
                <h2 className="accordion-header card-header" id="headingTwo2">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo8"
                    aria-expanded="false"
                    aria-controls="collapseTwo8"
                  >
                    Supporting Trainers
                  </button>
                </h2>
                <div
                  id="collapseTwo8"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo8"
                  data-bs-parent="#accordionExampleb8"
                >
                  <div className="accordion-body card-body">
                    <ul>
                      <li>Wider reach to a vast audience of candidates.</li>
                      <li>Incentives for successful candidate outcomes.</li>
                      <li>
                        Tools for hosting webinars and sharing insights to
                        engage and inspire learners.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-6 order-1 order-lg-2">
        <div className="thumbnail rbt-image-gallery-1 mb--80 text-end">
          <img
            className="image-1 rbt-radius"
            data-parallax='{"x": 0, "y": 30}'
            src="assets/images/about/about-01.jpg"
            alt="Education Images"
            style={{
              transform:
                "translate3d(0px, 15.557px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scaleX(1) scaleY(1) scaleZ(1)",
              WebkitTransform:
                "translate3d(0px, 15.557px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scaleX(1) scaleY(1) scaleZ(1)"
            }}
          />
          <img
            className="image-2 rbt-radius"
            data-parallax='{"x": 0, "y": 80}'
            src="assets/images/about/about-10.jpg"
            alt="Education Images"
            style={{
              transform:
                "translate3d(0px, 17.048px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scaleX(1) scaleY(1) scaleZ(1)",
              WebkitTransform:
                "translate3d(0px, 17.048px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scaleX(1) scaleY(1) scaleZ(1)"
            }}
          />
        </div>
      </div>
    </div>
  </div>
</div>


</>

            </div>
        );
    }
}

export default CandidateAboutUs;