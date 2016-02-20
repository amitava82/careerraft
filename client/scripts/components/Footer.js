import React from 'react';
import {Link} from 'react-router';

export default class Footer extends React.Component {
    render (){
        return (
            <footer className="">
                <div className="">
                    <p className="links">
                        <Link to="/about">ABOUT</Link>
                        <Link to="/core-values">CORE VALUES</Link>
                        <Link to="/team">TEAM</Link>
                        <Link to="/contact-us">GET IN TOUCH</Link>
                    </p>
                    <p>Copyright &copy; {new Date().getFullYear()} Careerraft</p>
                </div>
                <div>
                    
                </div>
                <div className="social">
                    <a href="https://www.facebook.com/careerraft" target="_blank"><i className="fa fa-facebook" /></a>
                    <a href="https://www.twitter.com/careerraft" target="_blank"><i className="fa fa-twitter" /></a>
                    <a href="https://www.linkedin.com/company/7588602" target="_blank"><i className="fa fa-linkedin" /></a>
                </div>
            </footer>
        )
    }
}