import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // AG Grid core styles
import "ag-grid-community/styles/ag-theme-alpine.css"; // Theme styles
import HeaderLoginSignUp from '../Header/headerLoginSignUp';
import axios from 'axios';

class SignUpAccounts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [
            { field: "UserName", headerName: "UserName", sortable: true, filter: true },
            { field: "Email", headerName: "Email", sortable: true, filter: true,width:213 },
            { field: "mobile_no", headerName: "Mobile No", sortable: true, filter: true,width:213 },
            { field: "user_role", headerName: "Role", sortable: true, filter: true },
            { field: "EmailStatus", headerName: "EmailStatus", sortable: true, filter: true },
            { field: "status", headerName: "Status", sortable: true, filter: true, width: 100 },
            { 
                field: "CreatedAt", 
                headerName: "CreatedAt", 
                sortable: true, 
                filter: true,
                valueFormatter: (params) => {
                const date = new Date(params.value);
                return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
                }
            },
            ],

            rowData: [],
            defaultColumnDefs: {
            flex: 1,
            sortable: true,
            filter: true,
            resizable: true,
            },

        };
    }

    componentDidMount() {
        // Perform any necessary data fetching or setup here
        this.getAllAccounts();
    }

    getAllAccounts = () => {
        this.setState({ keepSpinner: true });
        const baseUrl = process.env.REACT_APP_BASEURL;
        const Url = `${baseUrl}/api/Admin/GetUserList`;


        axios.post(Url, "", {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                console.log('accounts data:', response.data);
                this.setState({ rowData: response.data.data });
                this.setState({ keepSpinner: false });


            })
            .catch((error) => {
                console.error('Signup Error:', error.response?.data || error.message);
                this.setState({ keepSpinner: false });
                window.scrollTo(0, 0);
            });
    }

    render() {
        const paginationPageSize = [10, 20, 30,50,100];
        return (
            <div>
                <>
                    <HeaderLoginSignUp />
                    {/* Start breadcrumb Area */}
                    <div className="rbt-breadcrumb-default ptb--100 ptb_md--50 ptb_sm--30 bg-gradient-1">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="breadcrumb-inner text-center">
                                        <h2 className="title">SignUp Accounts</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* End Breadcrumb Area */}
                    <div className="rbt-about-area about-style-1 bg-color-white rbt-section-gap">
                        <div className="container">
                            <div className="ag-theme-alpine" style={{ height: "100%", width: "100%" }}>
                                <AgGridReact
                                    columnDefs={this.state.columnDefs}
                                    rowData={this.state.rowData}
                                    pagination={true}
                                    paginationPageSize={10}
                                    paginationPageSizeSelector={paginationPageSize}
                                    defaultColDef={this.state.defaultColumnDefs}
                                    domLayout="autoHeight"
                                />
                            </div>
                        </div>
                    </div>



                </>

            </div>
        );
    }
}

export default SignUpAccounts;