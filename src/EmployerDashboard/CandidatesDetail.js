import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import withNavigation from '../withNavigation';
import Header from '../Header/header';
import AdvancedBreadcumb from '../Breadcumb/advancebreadcrumb';
import Swal from "sweetalert2";

class CandidatesDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keepSpinner: true,
            candidateListing: [],
            currentPage: 1, // Tracks the current page
            pageSize: 4, // Number of records per page
            totalPages: 1,
            totalRecords: 0, // Total number of records
            searchQuery: "", // State to store the search input
            error: "",
        };

    }
    componentDidMount() {
        let url = window.location.search;
        var urlParams = new URLSearchParams(url);
        var jobId = urlParams.get('jobId');
        this.jobId = jobId;
        this.user = urlParams.get('user');
        this.getDashboardUser();
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
                this.setState({ dashBoardData: response.data.data }, () => {
                    setTimeout(() => {
                        this.getCandidates(0, this.state.pageSize);
                    }, 1000);
                });

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
    }

    getCandidates = (pageIndex, pageSize) => {
        this.setState({ keepSpinner: true });
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Employer/AppliedCandidate`;
        const token = localStorage.getItem('authToken');
        var request = {
            "jobId": this.jobId,
            "jobtitle": "string",
            "experienceFrom": 0,
            "experienceTo": 0,
            "packageId": 0,
            "roleId": 0,
            "emptypeId": 0,
            "deptId": 0,
            "industryId": 0,
            "keyskillIds": "string",
            "educationId": "string",
            "active": true,
            "user_id": 0,
            "cityIds": "string",
            "pageIndex": pageIndex,
            "pagesize": pageSize,
            "candidate_user_id": this.state.dashBoardData.user_id
        }

        axios.post(url, request, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('candidatelisting', response.data);
                if (response.data.data && response.data.data.length > 0) {
                    const totalCount = response.data.data[0].total_records;
                    this.setState({ candidateListing: response.data.data, totalRecords: totalCount, keepSpinner: false, errorMessage: "" });
                }
                else {
                    this.setState({ keepSpinner: false, errorMessage: "No Candidate Found" });
                }


            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });

    }
    handleSearchChange = (e) => {
        this.setState({ searchQuery: e.target.value.toLowerCase() }); // Normalize to lowercase for case-insensitive search
      };

  handlePayment = async (candidate) => {
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Payment/CreateResumeViewOrder`;
        const token = localStorage.getItem('authToken');
        // const result = await Swal.fire({
        //     title: 'Are you sure?',
        //     text: "For Viewing the candidate Profile, you need to pay",
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonText: 'Yes, continue!',
        //     cancelButtonText: 'No, cancel!',
        // });

        // if (!result.isConfirmed) {
        //     return; // Exit the function if the user cancels
        // }
        // Call C# backend to create an order
        var req =
        {
            "view_id": 0,
            "employer_user_id": this.state.dashBoardData.user_id,
            "candidate_user_id": candidate.user_id,
        }

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(req),
        });

        const order = await response.json();
        console.log("Order Response:", order);

        const options = {
            key: process.env.RAZOR_PAY_KEY, // Replace with your Razorpay Key ID
            amount: order.amountInPaisa,
            currency: order.currencyCode,
            name: "Zobskill",
            description: "Test Transaction",
            order_id: order.order_id, // Order ID from backend
            handler: async (response) => {
                console.log("Payment Response:", response);
                var verifyRequest = {
                    "orderId": order.order_id,
                    "paymentId": response.razorpay_payment_id,
                    "signature": response.razorpay_signature,
                    "rzrpay_request": "",
                    "rzrpay_response": JSON.stringify(response)
                }
                // Verify payment with C# backend
                const verifyRes = await fetch(`${baseUrl}/api/Payment/VerifyViewResumePayment`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify(verifyRequest),
                });

                const data = await verifyRes.json();
                if (data.success) {
                    //alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
                    Swal.fire({
                        title: "Success!",
                        text: "Payment Successful! Payment ID: " + response.razorpay_payment_id,
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    const { currentPage, pageSize } = this.state;
                    this.setState({ currentPage }, () => {
                        this.getCandidates(this.state.currentPage - 1, pageSize); // Maintain the current page after refresh
                    });
                } else {
                    //alert("Payment verification failed!");
                    Swal.fire({
                        title: "error!",
                        text: "Payment Failed !",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            },
            prefill: {
                //name: this.state.dashBoardData.username,
                //email: this.state.dashBoardData.email,
                //contact: "8318461873",
            },
            theme: { color: "#3399cc" },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    };

    render() {
        const maskMobileNumber = (number) => {
            return number.replace(/\d(?=\d{4})/g, 'X');
        };
        const maskEmail = (email) => {
            return email.replace(/.(?=.*@)/g, "*");

        };
        const maskName = (name) => {
            return name.replace(/.(?=.*\s)/g, "*");
        };
        const { candidateListing, currentPage, pageSize, totalRecords, searchQuery } = this.state;
        const startIndex = (currentPage - 1) * pageSize + 1;
        const endIndex = Math.min(currentPage * pageSize, totalRecords);

        const filteredJobs = candidateListing?.filter((job) => {
            // const email = job.Email?.toString().toLowerCase() || ""; // Ensure it's a string
            // const fullname = job.fullname?.toLowerCase() || "";
            // const mobile_no = job.mobile_no?.toLowerCase() || "";
            const designation = job.designation?.toLowerCase() || "";
            const prefer_location = job.prefer_location?.toLowerCase() || "";
            const experience = job.experience?.toString().toLowerCase() || ""; // Ensure it's a string
            const keyskill = job.keyskill?.toLowerCase() || "";

            return (
               designation.includes(searchQuery) ||
                prefer_location.includes(searchQuery) ||
                experience.includes(searchQuery) ||
                keyskill.includes(searchQuery) 
            );
        });
        return (
            <>
                <Header dashBoardData={this.state.dashBoardData} />
                <AdvancedBreadcumb componentName="CandidateDetails" ComponentValue="CandidateDetails" redirectURL="/EmployerDashboard" />
                <div className="rbt-page-banner-wrapper">
                    {/* Start Banner BG Image  */}
                    <div className="rbt-banner-image" />
                    {/* End Banner BG Image  */}
                    <div className="rbt-banner-content">
                        {/* Start Banner Content Top  */}
                        <div className="rbt-banner-content-top">
                            <div className="container">
                                {this.state.keepSpinner && <div class="custom-loader">
                                    <div class="loader-spinner"></div>
                                    <p class="loader-text">Please Wait while data is loading...</p>
                                </div>}
                          
                            </div>
                        </div>
                        {/* End Banner Content Top  */}
                        {/* Start Course Top  */}
                        <div className="rbt-course-top-wrapper mt--40">
                            <div className="container">
                                <div className="row g-5 align-items-center">
                                    <div className="col-lg-5 col-md-12">
                                        <div className="rbt-sorting-list d-flex flex-wrap align-items-center">
                                            {!this.state.errorMessage && <div className="rbt-short-item">
                                                <span className="course-index">Showing {startIndex} - {endIndex} of {totalRecords} results</span>
                                            </div>}
                                        </div>
                                    </div>
                                    <div className="col-lg-7 col-md-12">
                                        <div className="rbt-sorting-list d-flex flex-wrap align-items-center justify-content-start justify-content-lg-end">
                                            <div className="rbt-short-item mt-5">
                                                <form action="#" className="rbt-search-style me-0">
                                                    <input type="text" placeholder="location,role,exp,skill.." value={this.state.searchQuery}
                                                        onChange={this.handleSearchChange} />
                                                    <button
                                                        type="button"
                                                        className="rbt-search-btn rbt-round-btn"
                                                        onClick={(e) => e.preventDefault()} // Prevent default form submission
                                                    >
                                                        <i className="feather-search" />
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End Course Top  */}
                    </div>
                </div>
                <div>&nbsp;</div>
                <div className="rbt-section-overlayping-top rbt-section-gapBottom">
                    <div className="container">
                        <div className="row row--30 gy-5">

                            {!this.state.errorMessage ? <div className="col-lg-9 order-1 order-lg-2">
                                <div className="rbt-course-grid-column jobs-lst active-list-view">
                                    {/* Start Single Card  */}
                                    {/* Start Single Card  */}
                                    {filteredJobs?.map((job) => (
                                        <div key={job.jobid} className="course-grid-3">

                                            <div className="rbt-card variation-01 rbt-hover card-list-2">
                                                <div className="rbt-card-img">
                                                    <a href="#">
                                                        <img
                                                            style={{
                                                                width: '100px',
                                                                height: '100px',
                                                                objectFit: 'cover',
                                                                borderRadius: '50px',
                                                            }}
                                                            src={job.profile_image ? `${process.env.REACT_APP_BASEURL}/Uploads/${job.profile_image}` : "assets/images/job-zob-img.jpg"}// Use a default image if companylogo is missing
                                                            alt="Card image"
                                                        />
                                                    </a>
                                                </div>
                                                <div className="rbt-card-body">
                                                    <h4 className="rbt-card-title">
                                                        <a href="#">
                                                            {job.fee_paid_status==0 ? maskName(job.fullname) : job.fullname}
                                                        </a>
                                                    </h4>
                                                    <ul className="rbt-meta">
                                                        <li>
                                                       
                                                            <i className="fas fa-phone" />  {job.fee_paid_status==0 ? maskMobileNumber(job.mobile_no) : job.mobile_no}
                                                        </li>
                                                        <li>
                                                            <i className="fas fa-id-badge" /> {job.designation || "NA"}
                                                        </li>
                                                        <li>
                                                            <i className="fas fa-map-marker-alt" /> {job.prefer_location || "NA"}
                                                        </li>
                                                        <li>
                                                            <i className="fas fa-envelope" /> {job.fee_paid_status==0 ? maskEmail(job.Email) : job.Email}
                                                        </li>
                                                        <li>
                                                            <i className="fas fa-briefcase" /> {job.experience || "NA"} years
                                                        </li>
                                                        <li>
                                                            <i className="fas fa-money-bill-wave" /> {job.CTC || "NA"}
                                                        </li>

                                                        <li>
                                                            <i className="fas fa-chart-line" /> {job.ExpectedCTC || "NA"}
                                                        </li>

                                                        <li>
                                                            <i className="fas fa-user-cog"/> {job.keyskill || "NA"}
                                                        </li>
                                                    </ul>

                                                    <div className="rbt-card-bottom">
                                                        <div className="rbt-price">
                                                            <span className="current-price">Notice Period -

                                                                {job.notice_periods}
                                                            </span>
                                                        </div>
                                                      
                                                    {job.fee_paid_status==1 && <a className="rbt-btn-link" target='_blank' href={`${process.env.REACT_APP_BASEURL}/Uploads/${job.resumefile}`}>
                                                            View Profile
                                                            <i className="feather-arrow-right" />
                                                        </a>}
                                                        {job.fee_paid_status==0 && <a className="rbt-btn-link" href="#" onClick={() => this.handlePayment(job)}>
                                                        View Profile
                                                        <i className="feather-arrow-right" />
                                                    </a>}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                    {/* End Single Card  */}
                                    {/* End Single Card  */}


                                </div>
                                <div className="row">
                                    <div className="col-lg-12 mt--60">
                                        <nav>
                                            <ul className="rbt-pagination">
                                                {/* Previous Button */}
                                                <li>
                                                    <a
                                                        href="#"
                                                        aria-label="Previous"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            if (currentPage > 1) this.handlePageChange(currentPage - 1);
                                                        }}
                                                    >
                                                        <i className="feather-chevron-left" />
                                                    </a>
                                                </li>

                                                {/* Page Numbers */}
                                                {Array.from({ length: Math.ceil(totalRecords / pageSize) }, (_, index) => (
                                                    <li key={index} className={currentPage === index + 1 ? "active" : ""}>
                                                        <a
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                this.handlePageChange(index + 1); // 1-based index
                                                            }}
                                                        >
                                                            {index + 1}
                                                        </a>
                                                    </li>
                                                ))}

                                                {/* Next Button */}
                                                <li>
                                                    <a
                                                        href="#"
                                                        aria-label="Next"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            if (currentPage < Math.ceil(totalRecords / pageSize)) this.handlePageChange(currentPage + 1);
                                                        }}
                                                    >
                                                        <i className="feather-chevron-right" />
                                                    </a>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div> : <h2>{this.state.errorMessage}</h2>}
                        </div>
                    </div>
                </div>
                {/* End Card Style */}

            </>

        );
    }
}

export default withNavigation(CandidatesDetail);