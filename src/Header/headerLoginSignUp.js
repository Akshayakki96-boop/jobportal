import React from 'react';
import withNavigation from '../withNavigation';
import axios from 'axios';
class HeaderLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSticky: false,
        };
        this.headerRef = React.createRef(); // Reference for the header element
        this.placeholderRef = React.createRef();
    }
    componentDidMount() {
  
        this.handleScroll();

        window.addEventListener('scroll', this.handleScroll);
    }







    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
    handleScroll = () => {
        const headerContainer = this.headerRef.current;
        const placeholder = this.placeholderRef.current;
        const headerContainerHeight = headerContainer ? headerContainer.offsetHeight : 0;
        const topHeaderHeight = document.querySelector('.rbt-header-top') ? document.querySelector('.rbt-header-top').offsetHeight : 0;
        const targetScroll = topHeaderHeight + 200;

        if (window.scrollY > targetScroll) {
            headerContainer.classList.add('rbt-sticky');
            if (placeholder) placeholder.style.height = `${headerContainerHeight}px`;
            this.setState({ isSticky: true });
        } else {
            headerContainer.classList.remove('rbt-sticky');
            if (placeholder) placeholder.style.height = '0';
            this.setState({ isSticky: false });
        }
    };
    handleNavigation = (roleId) => {
        this.props.navigate(`/SignUp?role_id=${roleId}`);
    }



  

  
    render() {
        return (
            <header className="rbt-header rbt-header-10">
                <div ref={this.placeholderRef} className="rbt-sticky-placeholder"></div>

                {/* Start Header Top */}
                <div className="rbt-header-top rbt-header-top-1 header-space-betwween bg-not-transparent bg-color-darker top-expended-activation">
                    <div className="container-fluid">
                        <div className="top-expended-wrapper">
                            <div className="top-expended-inner rbt-header-sec align-items-center">
                                <div className="rbt-header-sec-col rbt-header-left d-none d-xl-block">
                                    <div className="rbt-header-content">
                                        {/* Start Header Information List */}
                                        <div className="header-info">
                                            <ul className="rbt-information-list">
                                                <li>
                                                    <a href="#">
                                                        <i className="fas fa-phone"></i>+1-202-555-0174
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="mailto:support@zobskill.com">
                                                        <i className="fas fa-envelope"></i> support@zobskill.com
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        {/* End Header Information List */}
                                    </div>
                                </div>

                                <div className="rbt-header-sec-col rbt-header-right mt_md--10 mt_sm--10">
                                    <div className="rbt-header-content justify-content-start justify-content-lg-end">
                                        <div className="header-info d-none d-xl-block">
                                            <ul className="social-share-transparent">
                                                <li>
                                                    <a href="#">
                                                        <i className="fab fa-facebook-f"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fab fa-twitter"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fab fa-linkedin-in"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fab fa-instagram"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="header-info">
                                <div className="top-bar-expended d-block d-lg-none">
                                    <button className="topbar-expend-button rbt-round-btn">
                                        <i className="feather-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* admin dashboard */}

                <div ref={this.headerRef} className={`rbt-header-wrapper header-space-betwween ${this.state.isSticky ? 'rbt-sticky' : ''}`}>
                    <div className="container-fluid">
                        <div className="mainbar-row rbt-navigation-center align-items-center">
                            <div className="header-left rbt-header-content">
                                <div className="header-info">
                                    <div className="logo logo-dark">
                                        <a href="/">
                                            <img src="assets/images/Zobskill.gif" alt="Logo Images" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                        

                          
                        </div>
                    </div>

           
                </div>

            </header>

        );
    }
}

export default withNavigation(HeaderLogin);