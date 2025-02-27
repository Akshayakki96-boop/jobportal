import React, { Component } from 'react';
import Header from '../Header/header';
import axios from 'axios';
import parse from 'html-react-parser';

class CommunityDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Initialize your state here
            dashBoardData: {}
        };
    }
componentDidMount()
{
    const token = localStorage.getItem('authToken');
    if (token) {
        this.getDashboardUser();
    }
    else {
        this.setState({ dashBoardData: "" });
    }
    let url = window.location.search;
    var urlParams = new URLSearchParams(url);
    var blogId = urlParams.get('blogId');
    this.getBlogs(blogId);
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
            this.setState({ keepSpinner: false });

        })
        .catch((error) => {
            localStorage.removeItem('authToken');
            this.props.navigate('/Login'); // Use `navigate`
        });
}

getUserProfile = (userId) => {
    const baseUrl = process.env.REACT_APP_BASEURL;
    const url = `${baseUrl}/api/Employer/GetProfile`;
    const token = localStorage.getItem('authToken');
    const userData = {
        "Id": userId,
    };
    axios.post(url, userData, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            console.log('user data', response.data);
            this.setState({ userData: response.data.data })
            this.setState({ keepSpinner: false });

        })
        .catch((error) => {
            localStorage.removeItem('authToken');
            this.props.navigate('/Login'); // Use `navigate`
        });
}

getBlogs = (blogId) => {
    this.setState({ keepSpinner: true });
    const baseUrl = process.env.REACT_APP_BASEURL;
    const url = `${baseUrl}/api/Community/GetBlogs`;
    //const token = localStorage.getItem('authToken');
    var request = {
        "courseId": 0,
        "coursetitle": "",
        "isactive": false,
        "user_id": 0,
        "pageIndex": 0,
        "pagesize": 10
    }
    axios.post(url, request, {
        headers: {
            'Content-Type': 'application/json',
            //Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            console.log('dashboard data', response.data);
            this.setState({ blogsList: response.data.data.filter(x=>x.blog_id==blogId)[0] });
            this.setState({ keepSpinner: false });

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
                   <h2 className="title">Details</h2>
                   <ul className="page-list">
                 <li className="rbt-breadcrumb-item">
                   <a href="/community">Community</a>
                 </li>
                 <li>
                   <div className="icon-right">
                     <i className="feather-chevron-right" />
                   </div>
                 </li>
                 <li className="rbt-breadcrumb-item active">Community Details</li>
                   </ul>
                 </div>
               </div>
             </div>
               </div>
             </div>
             {/* End Breadcrumb Area */}
             <div className="rbt-about-area about-style-1 bg-color-white rbt-section-gap">
             <div className="container">
               <div className="row g-5 align-items-center">
               <div className="col-lg-12">
              <div className="inner pl--50 pl_sm--0 pl_md--0">

                <h4 className="text-start mt--30"> {this.state.blogsList?.title}</h4>
                <p className="description mt--10" style={{ textAlign: 'left' }}>
                {parse(this.state.blogsList?.description || '')}
                </p>

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

export default CommunityDetails;