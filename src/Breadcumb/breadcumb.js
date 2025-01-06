import React from 'react';

class Breadcumb extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
   
        };

    }
    componentDidMount() {}

    render() {
        return (
            <div className="rbt-breadcrumb-default ptb--100 ptb_md--50 ptb_sm--30 bg-gradient-1">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="breadcrumb-inner text-center">
                    <h2 className="title">{this.props.componentName}</h2>
                    <ul className="page-list">
                      <li className="rbt-breadcrumb-item">
                        <a href="/">Home</a>
                      </li>
                      <li>
                        <div className="icon-right">
                          <i className="feather-chevron-right"></i>
                        </div>
                      </li>
                      <li className="rbt-breadcrumb-item active">{this.props.ComponentValue}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
    
        );
    }
}

export default Breadcumb