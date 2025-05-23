import React from 'react';
import Breadcumb from '../Breadcumb/breadcumb';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import withNavigation from '../withNavigation';
import Header from '../Header/header';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles
import { Quill } from "react-quill";
import AdvancedBreadcumb from '../Breadcumb/advancebreadcrumb';

const Link = Quill.import('formats/link');
Link.sanitize = function (url) {
    // Add your custom URL validation logic here
    return url;
};
Quill.register(Link, true);
class EditBlog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blogId: "",
            title: "",
            description: "",
            companylogo: "",
            logoPreview: "",
            uploadStatus: null,
            dashBoardData: {},
        };
    }

    componentDidMount() {
        let url = window.location.search;
        var urlParams = new URLSearchParams(url);
        var blogId = urlParams.get('blogId');
        this.blogId = blogId;
        this.fetchIP();
        this.getDashboardUser();

    }

    fetchIP = async () => {
        try {
           let response = await fetch("https://checkip.amazonaws.com");
           let data = await response.text();
            this.setState({ ip: data.trim() });
        } catch (error) {
            this.setState({ ip: "Error fetching IP" });
        }
    };

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
                this.setState({ dashBoardData: response.data.data });
                this.getBlogs(response.data.data);
            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login');
            });
    };

    getBlogs = (role) => {
           this.setState({ keepSpinner: true });
           const baseUrl = process.env.REACT_APP_BASEURL;
           const url = `${baseUrl}/api/Community/GetBlogs`;
           //const token = localStorage.getItem('authToken');
           var request = {
               "id": this.blogId,
               "freesearch": "",
               "role_id": role ? parseInt(role.role_id, 10) : 0
           }
           axios.post(url, request, {
               headers: {
                   'Content-Type': 'application/json',
                   //Authorization: `Bearer ${token}`,
               },
           })
               .then((response) => {
                   console.log('blogdata', response.data.data);
                   this.setState({ blogsList: response.data.data[0] });
                   this.setState({
                       title: response.data.data[0].title,
                          description: response.data.data[0].description,
                          logoPreview: `${process.env.REACT_APP_BASEURL}/Uploads/${response.data.data[0].blogimage}`,
                            fileName: response.data.data[0].blogimage,
                   });
                   this.setState({ keepSpinner: false });
   
               })
               .catch((error) => {
                   //localStorage.removeItem('authToken');
                   //this.props.navigate('/Login'); // Use `navigate`
               });
       }

    handleInputChange = (event) => {
        this.setState({ title: event.target.value });
    };

    handleFileChange = async (event) => {
        const file = event.target.files[0];
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/FileUpload/uploadlogo`;
        const token = localStorage.getItem('authToken');
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (file) {
            if (!validImageTypes.includes(file.type)) {
                this.setState({ uploadStatus: 'Invalid file type! Please upload an image file.' });
                return;
            }

            this.setState({
                logo: file,
                logoPreview: URL.createObjectURL(file),
                uploadStatus: null,
            });

            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });

                this.setState({ fileName: response.data.filePath, uploadStatus: 'File uploaded successfully!' });
            } catch (error) {
                console.error('Error uploading file:', error);
                this.setState({ uploadStatus: 'Error uploading file!' });
            }
        }
    };

    handleDescriptionChange = (description) => {
        this.setState({ description });
    };

     handleSaveBlogs = () => {
          // Add logic to save updated data (e.g., API call)
         // this.setState({ showModal: false });
          const baseUrl = process.env.REACT_APP_BASEURL;
          const url = `${baseUrl}/api/Community/AddUpdateBlogs`;
          const token = localStorage.getItem('authToken');
          const blogData = {
              "id": this.blogId,
              "title": this.state.title,
              "description": this.state.description,
              "blog_image": this.state.fileName,
              //"role_id": 0
            }
  
          axios.post(url, blogData, {
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
              },
          })
              .then((response) => {
                  this.setState({ keepSpinner: false });
                  // this.props.navigate('/EmployerDashboard?message=profilesuccess');
                  //this.props.navigate('/Login'); // Use `navigate`
                  this.setState({
                      responseMessage: "Blogs Updated successfully!",
                      alertVariant: 'success', // Success alert variant
  
                  });
                  window.scrollTo(0, 0); // Scroll to the top of the page
              })
              .catch((error) => {
                  console.error('Signup Error:', error.response?.data || error.message);
                  this.setState({ keepSpinner: false });
                  this.setState({
                      responseMessage: error.response?.data.message,
                      alertVariant: 'danger', // Error alert variant
  
                  });
                  window.scrollTo(0, 0); // Scroll to the top of the page
              });
      };

    modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean'],
        ],
    };

    formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video',
    ];

    render() {
        return (
            <>
                <Header dashBoardData={this.state.dashBoardData} />
                <div className="rbt-breadcrumb-default ptb--100 ptb_md--50 ptb_sm--30 bg-gradient-1">
               <div className="container">
             <div className="row">
               <div className="col-lg-12">
                 <div className="breadcrumb-inner text-center">
                   <h2 className="title">Edit Blog</h2>
                   <ul className="page-list">
                 <li className="rbt-breadcrumb-item">
                   <a href="/community">Community</a>
                 </li>
                 <li>
                   <div className="icon-right">
                     <i className="feather-chevron-right" />
                   </div>
                 </li>
                 <li className="rbt-breadcrumb-item active">Edit Blog</li>
                   </ul>
                 </div>
               </div>
             </div>
               </div>
             </div>
                <div className="rbt-become-area bg-color-white rbt-section-gap">
                    {this.state.responseMessage && (
                        <Alert variant={this.state.alertVariant} onClose={() => this.setState({ responseMessage: '' })} dismissible>
                            {this.state.responseMessage}
                        </Alert>
                    )}
                    <div className="container">
                        <div className="row pt--60 g-5">
                            <div className="col-lg-12">
                                <div className="rbt-contact-form contact-form-style-1 max-width-auto">
                                    <h3 className="title">Edit Blog</h3>
                                    <hr className="mb--30" />
                                    <form onSubmit={(e) => e.preventDefault()} className="row row--15">
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    accept="image/*"
                                                    id="companyLogo"
                                                    onChange={this.handleFileChange}
                                                />
                                                <span className="focus-border" />
                                                {this.state.logoPreview && (
                                                    <div className="mt-3">
                                                        <img
                                                            src={this.state.logoPreview}
                                                            alt="Logo Preview"
                                                            style={{
                                                                width: '100px',
                                                                height: '100px',
                                                                objectFit: 'cover',
                                                                borderRadius: '50px',
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                {this.state.uploadStatus && <small className={this.state.uploadStatus === "File uploaded successfully!" ? "text-success" : "text-danger"}>{this.state.uploadStatus}</small>}
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    name="title"
                                                    className="form-control"
                                                    value={this.state.title}
                                                    onChange={this.handleInputChange}
                                                    id="title"
                                                />
                                                <label htmlFor="title">Title</label>
                                                <span className="focus-border" />
                                            </div>
                                        </div>
                                        <div className='col-lg-12'>
                                            <div className="form-group" style={{ paddingBottom: "50px" }}>
                                                <ReactQuill
                                                    value={this.state.description}
                                                    onChange={this.handleDescriptionChange}
                                                    theme="snow"
                                                    modules={this.modules}
                                                    placeholder="Description"
                                                    formats={this.formats}
                                                    style={{ height: "200px" }}
                                                />
                                            </div>
                                        </div>
                                        {this.state.description && this.state.description.length > 2000 && (
                                            <span style={{ color: "red" }}>
                                                Description cannot exceed 2000 characters.
                                            </span>
                                        )}
                                        <div className="col-lg-12">
                                            <div className="form-submit-group">
                                                <button
                                                    type="button"
                                                    className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                                                    onClick={this.handleSaveBlogs}
                                                >
                                                    <span className="icon-reverse-wrapper">
                                                        <span className="btn-text">Update</span>
                                                        <span className="btn-icon">
                                                            <i className="feather-arrow-right" />
                                                        </span>
                                                        <span className="btn-icon">
                                                            <i className="feather-arrow-right" />
                                                        </span>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default withNavigation(EditBlog);