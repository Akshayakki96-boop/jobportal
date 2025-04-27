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
import Select from 'react-select';

const Link = Quill.import('formats/link');
Link.sanitize = function (url) {
    // Add your custom URL validation logic here
    return url;
};
Quill.register(Link, true);
class CreateEvent extends React.Component {
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
                console.log('dashboard data', response.data);
                this.setState({ dashBoardData: response.data.data });

            })
            .catch((error) => {
                localStorage.removeItem('authToken');
                this.props.navigate('/Login'); // Use `navigate`
            });
    }




    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleDescriptionChange = (value) => {
        this.setState({ description: value });
    };

    handleSelectChange = (name, selectedOption) => {
        this.setState({ [name]: selectedOption });
    };

    handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.setState({ [field]: file, logoPreview: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    handleSaveEvent = () => {
        // Your submit logic here
        console.log(this.state);
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
        const eventTypeOptions = [
            { value: 'Webinar', label: 'Webinar' },
            { value: 'Workshop', label: 'Workshop' },
            { value: 'Job Fair', label: 'Job Fair' },
            { value: 'Networking Event', label: 'Networking Event' },
            { value: 'Training', label: 'Training' }
        ];
        const eventCategoryOptions = [
            { value: 'IT', label: 'IT' },
            { value: 'Healthcare', label: 'Healthcare' },
            { value: 'Marketing', label: 'Marketing' },
            { value: 'Finance', label: 'Finance' }
        ];
        const timeZoneOptions = [
            { value: 'EST', label: 'EST' },
            { value: 'PST', label: 'PST' },
            { value: 'IST', label: 'IST' },
            { value: 'GMT', label: 'GMT' }
        ];
        const eventFormatOptions = [
            { value: 'Online', label: 'Online' },
            { value: 'Offline', label: 'Offline' },
            { value: 'Hybrid', label: 'Hybrid' }
        ];
        const yesNoOptions = [
            { value: 'Yes', label: 'Yes' },
            { value: 'No', label: 'No' }
        ];
        const feeTypeOptions = [
            { value: 'Free', label: 'Free' },
            { value: 'Paid', label: 'Paid' }
        ];
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
                                    <h2 className="title">Create New Event</h2>
                                    <ul className="page-list">
                                        <li className="rbt-breadcrumb-item">
                                            <a href="/community">Community</a>
                                        </li>
                                        <li>
                                            <div className="icon-right">
                                                <i className="feather-chevron-right" />
                                            </div>
                                        </li>
                                        <li className="rbt-breadcrumb-item active">Create New Event</li>
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
                                <h3 className="title">Create New Event</h3>
                                <hr className="mb--30" />
                                <form onSubmit={(e) => e.preventDefault()} className="row row--15">
                                    {/* Event Name */}
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                name="eventName"
                                                className="form-control"
                                                value={this.state.eventName}
                                                onChange={this.handleInputChange}
                                                id="eventName"
                                            />
                                            <label htmlFor="eventName">Event Name*</label>
                                            <span className="focus-border" />
                                        </div>
                                    </div>

                                    {/* Organizer Name */}
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                name="organizerName"
                                                className="form-control"
                                                value={this.state.organizerName}
                                                onChange={this.handleInputChange}
                                                id="organizerName"
                                            />
                                            <label htmlFor="organizerName">Organizer Name*</label>
                                            <span className="focus-border" />
                                        </div>
                                    </div>

                                    {/* Dropdowns */}
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Event Type*</label>
                                            <Select
                                                options={eventTypeOptions}
                                                isClearable={true}
                                                value={this.state.eventType}
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                                onChange={(option) => this.handleSelectChange('eventType', option)}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Event Category</label>
                                            <Select
                                                options={eventCategoryOptions}
                                                isClearable={true}
                                                value={this.state.eventCategory}
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                                onChange={(option) => this.handleSelectChange('eventCategory', option)}
                                            />
                                        </div>
                                    </div>

                                    {/* Date & Time */}
                                    <div className="col-lg-4">
                                        <div className="form-group">
                                            <label>Event Date*</label>
                                            <input
                                                type="date"
                                                name="eventDate"
                                                className="form-control"
                                                value={this.state.eventDate}
                                                onChange={this.handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="form-group">
                                            <label>Start Time*</label>
                                            <input
                                                type="time"
                                                name="startTime"
                                                className="form-control"
                                                value={this.state.startTime}
                                                onChange={this.handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="form-group">
                                            <label>End Time*</label>
                                            <input
                                                type="time"
                                                name="endTime"
                                                className="form-control"
                                                value={this.state.endTime}
                                                onChange={this.handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Timezone */}
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Time Zone</label>
                                            <Select
                                                options={timeZoneOptions}
                                                isClearable={true}
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                                value={this.state.timeZone}
                                                onChange={(option) => this.handleSelectChange('timeZone', option)}
                                            />
                                        </div>
                                    </div>

                                    {/* Format */}
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Event Format*</label>
                                            <Select
                                                options={eventFormatOptions}
                                                isClearable={true}
                                                value={this.state.eventFormat}
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                                onChange={(option) => this.handleSelectChange('eventFormat', option)}
                                            />
                                        </div>
                                    </div>

                                    {/* Platform / Venue */}
                                    {this.state.eventFormat?.value === 'Online' && (
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    name="eventPlatform"
                                                    className="form-control"
                                                    placeholder="Event Platform (If Online)"
                                                    value={this.state.eventPlatform}
                                                    onChange={this.handleInputChange}
                                                />
                                                <span className="focus-border" />
                                            </div>
                                        </div>
                                    )}

                                    {this.state.eventFormat?.value === 'Offline' && (<div className="col-lg-6">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                name="physicalVenue"
                                                className="form-control"
                                                placeholder="Physical Venue (If Offline)"
                                                value={this.state.physicalVenue}
                                                onChange={this.handleInputChange}
                                            />
                                            <span className="focus-border" />
                                        </div>
                                    </div>
                                    )}

                                    {/* Description */}
                                    <div className="col-lg-12">
                                        <div className="form-group" style={{ paddingBottom: "50px" }}>
                                            <ReactQuill
                                                value={this.state.description}
                                                onChange={this.handleDescriptionChange}
                                                theme="snow"
                                                placeholder="About the Event*"
                                                style={{ height: "200px" }}
                                            />
                                        </div>
                                    </div>

                                    {/* More text fields */}
                                    {/* Target Audience, Key Topics, Speakers */}
                                    {['targetAudience', 'keyTopics', 'speakers', 'registrationLink', 'contactPerson', 'contactEmail', 'contactPhone', 'socialLinks'].map((field, idx) => (
                                        <div className="col-lg-12" key={idx}>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    name={field}
                                                    className="form-control"
                                                    placeholder={field.split(/(?=[A-Z])/).join(' ')}
                                                    value={this.state[field]}
                                                    onChange={this.handleInputChange}
                                                />
                                                <span className="focus-border" />
                                            </div>
                                        </div>
                                    ))}

                                    {/* Fee Type and Amount */}
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Fee Type*</label>
                                            <Select
                                                isClearable={true}
                                                options={feeTypeOptions}
                                                value={this.state.feeType}
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                                onChange={(option) => this.handleSelectChange('feeType', option)}
                                            />
                                        </div>
                                    </div>

                                    {this.state.feeType?.value === 'Paid' && (
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <input
                                                    type="number"
                                                    name="feeAmount"
                                                    className="form-control"
                                                    placeholder="Enter Fee Amount"
                                                    value={this.state.feeAmount}
                                                    onChange={this.handleInputChange}
                                                />
                                                <span className="focus-border" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Upload banner and logo */}
                                    {['bannerImage', 'companyLogo'].map((field, idx) => (
                                        <div className="col-lg-12" key={idx}>
                                            <div className="form-group">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="form-control"
                                                    id={field}
                                                    onChange={(e) => this.handleFileChange(e, field)}
                                                />
                                                <label htmlFor={field}>
                                                    {field === 'bannerImage' ? 'Event Banner Image' : 'Company Logo'}
                                                </label>
                                            </div>
                                        </div>
                                    ))}


                                    {/* Yes/No Options */}
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Allow Questions Before Event?</label>
                                            <Select
                                                options={yesNoOptions}
                                                isClearable={true}
                                                value={this.state.allowQuestions}
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                                onChange={(option) => this.handleSelectChange('allowQuestions', option)}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Promote Event by Zobskill?</label>
                                            <Select
                                                options={yesNoOptions}
                                                isClearable={true}
                                                value={this.state.promoteEvent}
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                                onChange={(option) => this.handleSelectChange('promoteEvent', option)}
                                            />
                                        </div>
                                    </div>

                                    {/* Save button */}
                                    <div className="col-lg-12">
                                        <div className="form-submit-group">
                                            <button
                                                type="button"
                                                className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                                                onClick={this.handleSaveEvent}
                                            >
                                                <span className="icon-reverse-wrapper">
                                                    <span className="btn-text">Save</span>
                                                    <span className="btn-icon"><i className="feather-arrow-right" /></span>
                                                    <span className="btn-icon"><i className="feather-arrow-right" /></span>
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

export default withNavigation(CreateEvent);