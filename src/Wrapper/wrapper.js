import React from 'react';

class Wrapper  extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          progressOffset: 0,
          isActive: false,
        };
        this.progressBarRef = React.createRef(); // Ref for the progress bar path
        this.progressParentRef = React.createRef();
    }
    componentDidMount() {
      // Set initial state of the progress bar
      this.setUpProgressBar();
  
      // Add scroll event listener
      window.addEventListener('scroll', this.handleScroll);
    }
  
    componentWillUnmount() {
      // Clean up scroll event listener
      window.removeEventListener('scroll', this.handleScroll);
    }

    setUpProgressBar = () => {
      const progressBar = this.progressBarRef.current;
      const progressBarLength = progressBar.getTotalLength();
      
      // Set initial stroke properties
      progressBar.style.transition = progressBar.style.WebkitTransition = 'none';
      progressBar.style.strokeDasharray = `${progressBarLength} ${progressBarLength}`;
      progressBar.style.strokeDashoffset = progressBarLength;
  
      // Trigger the initial stroke animation
      progressBar.getBoundingClientRect();
      progressBar.style.transition = progressBar.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
    };
  
    handleScroll = () => {
      const progressBar = this.progressBarRef.current;
      const progressParent = this.progressParentRef.current;
  
      // Calculate the scroll position
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPercentage = scrollTop / (documentHeight - windowHeight);
  
      const progressBarLength = progressBar.getTotalLength();
      progressBar.style.strokeDashoffset = progressBarLength - scrollTop * progressBarLength / (documentHeight - windowHeight);
  
      // Show or hide the "back to top" button
      if (scrollTop > 50) {
        this.setState({ isActive: true });
      } else {
        this.setState({ isActive: false });
      }
    };
  
    handleSvgClick = (e) => {
      e.preventDefault();
  
      // Smoothly scroll to the top
      window.scrollTo({
        top: 0,
        behavior: 'smooth', // This enables smooth scrolling
      });
    };



   

    render() {
        return (
            <div className={`rbt-progress-parent ${this.state.isActive ? 'rbt-backto-top-active' : ''}`} ref={this.progressParentRef} onClick={this.handleSvgClick}>
            <svg className="rbt-back-circle svg-inner" width="100%" height="100%" viewBox="-1 -1 102 102"  style={{ cursor: 'pointer' }}>
              <path ref={this.progressBarRef} d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
            </svg>
          </div>
          
        
    
        );
    }
}

export default Wrapper ;