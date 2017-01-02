/**
 * Created by amitava on 18/02/16.
 */
import React from 'react';
import Helmet from 'react-helmet';
import {Link} from 'react-router';

export default class Educator extends React.Component {
    render(){
        return (
            <div className="educator-page">
                <Helmet title="Education Alley :: Learn how Education Alley can help you." />
                <div className="hero-unit">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12">
                                <h3 className="text-display-2">For Educators and Professional Institutes</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content-body container">
                    <div className="page-inner m-tl col-xs-12">
                        <h5 className="text-headline">Create your Education Alley profile and reach more students</h5>
                        <article>
                            A modern Institute needs a modern online presence to reach maximum students. Move beyond your

                            Facebook page or basic website to create your own customized institute profile on Education Alley,

                            exclusively designed for educational institutes like yours. Showcase your courses, your outstanding

                            faculty and your world-class facilities. Highlight the achievement of your students or upload videos of

                            your classes. Let the world know about your specialized courses. Market your courses on our platform

                            and be discovered by students in your area. We handle payments and bookings so that your classes will

                            fill up quickly and you can focus on what you do best - teaching
                        </article>
                        <div className="features row">
                            <div className="col-md-4">
                                <i className="fa fa-file-text" />
                                <p className="lead">Create Institute Profile</p>
                                <p>Get ready to be discovered and enhance your enrollment through your institute profile on Education Alley.</p>
                            </div>
                            <div className="col-md-4">
                                <i className="fa fa-users" />
                                <p className="lead">Connect with students and Parents</p>
                                <p>We help you fill seats in your class with new students and help you generate additional revenue.</p>
                            </div>
                            <div className="col-md-4">
                                <i className="fa fa-certificate" />
                                <p className="lead">Get Featured</p>
                                <p>Get featured on Education Alley and be visible to all those potential students looking for your expertise.</p>
                            </div>
                        </div>
                        <div className="ft-list">
                            <div>
                                <h6 className="text-title">Increase Enrollments and Sales</h6>
                                <p>
                                    We help you fill seats in your class with new students and help you generate additional revenue.

                                    Through Education Alley you can reach to a wider market, which traditional marketing methods fall short of

                                    reaching.
                                </p>
                            </div>
                            <div>
                                <h6 className="text-title">Book Demo Class</h6>
                                <p>
                                    Our research has shown that those students who book the demo class are more likely to join the classes.
                                    Hence we provide the facility of booking demo class through Education Alley.
                                </p>
                            </div>
                            <div>
                                <h6 className="text-title">Get Featured</h6>
                                <p>
                                    Thousands of students visit Education Alley every day in search of the quality classes going on in their

                                    surroundings. It’s your chance to get featured on the home page of Education Alley and be visible to all those

                                    potential students looking for your expertise.
                                </p>
                            </div>
                            <div>
                                <h6 className="text-title">Online Payment and Booking</h6>
                                <p>
                                    Education Alley promotes online admission and online fees payment facility for booking of your classes

                                    through all major payment methods (Net Banking, Credit/Debit Cards, PayU Money). We transfer the

                                    fees within 48 hours into your account with a minimum internet handling charges at Education Alley’s side.
                                </p>
                            </div>
                        </div>
                        <h6 className="text-title">Ready to partner with us?</h6>
                        <p>Please <Link to="/contact-us">contact us</Link> and we'll help you get started.</p>
                    </div>
                </div>
            </div>
        )
    }
}