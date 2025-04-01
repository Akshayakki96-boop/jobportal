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
class CreateBlog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            companylogo: "",
            logoPreview: "",
            dashBoardData: {},
        };

    }
    componentDidMount() {
        this.fetchIP();
        this.getDashboardUser();

    }

    fetchIP = async () => {
        try {
            const response = await fetch("https://api64.ipify.org?format=json");
            const data = await response.json();
            this.setState({ ip: data.ip });
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
                console.log('dashboard data', response.data);
                this.setState({ dashBoardData: response.data.data });

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
    }




    handleInputChange = (event) => {
        this.setState({ title: event.target.value });
    }

    handleFileChange = async (event) => {
        const file = event.target.files[0];
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/FileUpload/UploadBlogImage`;
        const token = localStorage.getItem('authToken');
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (file) {
            if (!validImageTypes.includes(file.type)) {
                // Set an error message if the file type is not valid
                this.setState({ uploadStatus: 'Invalid file type! Please upload an image file.' });
                return;
            }
            this.setState({
                logo: file,
                logoPreview: URL.createObjectURL(file), // Preview the uploaded file
                uploadStatus: null,
                // Clear any previous error
            }, this.validateForm);

            // Create FormData and append the file
            const formData = new FormData();
            formData.append('file', file);

            try {
                // Call the API to upload the file
                const response = await axios.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log('File uploaded successfully:', response.data);
                this.setState({ fileName: response.data.filePath })
                this.setState({ uploadStatus: 'File uploaded successfully!' });
            } catch (error) {
                console.error('Error uploading file:', error);
                this.setState({ uploadStatus: 'Error uploading file!' });
            }
        }
    };

    // Save profile changes
    handleSaveBlogs = () => {
        // Add logic to save updated data (e.g., API call)
       // this.setState({ showModal: false });
        const baseUrl = process.env.REACT_APP_BASEURL;
        const url = `${baseUrl}/api/Community/AddUpdateBlogs`;
        const token = localStorage.getItem('authToken');
        const blogData = {
            "id": 0,
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
                    responseMessage: "Blogs Added successfully!",
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


    handleDescriptionChange = (description) => {
        this.setState({ description });
    };

    modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean'],
            ['pdf', 'doc'] // Custom buttons for PDF and DOC
        ],
    };

    formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video', 'pdf', 'doc'
    ];


    render() {

        return (
            <><Header dashBoardData={this.state.dashBoardData} />
                    {this.state.responseMessage && (
                        <Alert variant={this.state.alertVariant} onClose={() => this.setState({ responseMessage: '' })} dismissible>
                            {this.state.responseMessage}
                        </Alert>
                    )}
                      <div className="rbt-breadcrumb-default ptb--100 ptb_md--50 ptb_sm--30 bg-gradient-1">
               <div className="container">
             <div className="row">
               <div className="col-lg-12">
                 <div className="breadcrumb-inner text-center">
                   <h2 className="title">Create Blog</h2>
                   <ul className="page-list">
                 <li className="rbt-breadcrumb-item">
                   <a href="/community">Community</a>
                 </li>
                 <li>
                   <div className="icon-right">
                     <i className="feather-chevron-right" />
                   </div>
                 </li>
                 <li className="rbt-breadcrumb-item active">Create Blog</li>
                   </ul>
                 </div>
               </div>
             </div>
               </div>
             </div>
                    <div className="container">
                        <div className="row pt--60 g-5">
                            <div className="col-lg-12">
                                <div className="rbt-contact-form contact-form-style-1 max-width-auto">
                                    <h3 className="title">Create Blog</h3>
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
                                                {this.state.uploadStatus && <small className={this.state.uploadStatus == "File uploaded successfully!" ? "text-success" : "text-danger"}>{this.state.uploadStatus}</small>}
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    name="firstname"
                                                    className="form-control"
                                                    value={this.state.title}
                                                    onChange={this.handleInputChange}
                                                    id="firstname"
                                                />
                                                <label htmlFor="firstname">Title</label>
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
                                                        <span className="btn-text">Save</span>
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
                </>


        );
    }
}

export default withNavigation(CreateBlog);