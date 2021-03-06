/**
 * Created by amitava on 18/02/16.
 */
import React from 'react';
import Helmet from 'react-helmet';

export default class Team extends React.Component {
    render(){
        return (
            <div className="team-page">
                <Helmet title="Education Alley :: Team" />
                <div className="hero-unit">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12">
                                <h3 className="text-display-2">Meet the Leadership</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content-body container">
                    <div className="page-inner">
                        <div className="row">
                            <div className="col-md-3">
                                <img src="/images/atul.jpg"/>
                            </div>
                            <div className="col-md-9">
                                <h4 className="text-headline">Atul Tiwari</h4>
                                <article>
                                    Atul is the founder of Education Alley. His dream is to re-imagine education in a truly ‘student-first’ way and

                                    unlock the true potential of student.
                                    <br />

                                    Atul holds an Integrated Master’s Degree in Applied Geology from Indian School of Mines, Dhanbad.

                                    An avid fan of cricket, Atul is a fitness enthusiast and his routine alternates between a long walk

                                    outdoors and a trip around the less crowded parts of the city.

                                    <br />

                                    His leadership translation is simple - the essence of leadership is not only to have a vision but also what

                                    it takes to translate it into action.
                                    &nbsp;<a href="https://www.linkedin.com/in/atultiwari89">LinkedIn</a>
                                </article>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-3">
                                <img src="/images/amit.jpg"/>
                            </div>
                            <div className="col-md-9">
                                <h4 className="text-headline">Amitava Saha</h4>
                                <article>
                                    Amitava is the Co-Founder and CTO at Education Alley. He oversees all things tech,

                                    including infrastructure, application management, and IT. Before Education Alley, Amitava has worked with several startups
                                    in medical, IT, SaaS domain and has expertise in both frontend and backend technologies.
                                    <br />

                                    Fascinated by small ideas that turned into global powerhouses, and innovation, simplicity, and the

                                    potential of technology have always been his passions. Education Alley is a both a passion and a dream come

                                    true for him.

                                    <br />

                                    Amitava has Master’s degree in business from Indiana University of Pennsylvania and Bachelor’s degree from the PES Institute of Applied Science.

                                    Amitava’s passion for technology does not stop at work and is always on the look-out for ways that he

                                    can use it to make his life easier.
                                    &nbsp;<a href="https://in.linkedin.com/in/amitavaksaha">LinkedIn</a>
                                </article>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-3">
                                <img src="/images/abh.jpg"/>
                            </div>
                            <div className="col-md-9">
                                <h4 className="text-headline">Abhishek Kundan</h4>
                                <article>
                                    Abhishek is the Co-Founder and Chief Financial Officer at Education Alley. In addition to taking care of the

                                    company’s financial and legal side, he is also involved in General Management and Leadership

                                    Development. Abhishek also spearheads all Education Alley Joint Venture and M&A processes.

                                    <br />

                                    Before Education Alley, Abhishek worked with IBM and Fintellix (earlier iCreate Softwares), handling many

                                    portfolios clients in Banking sector.

                                    <br />

                                    Abhishek has an MBA from the Indian Institute of Management (IIM), Bangalore and Bachelor’s in

                                    Mineral Engineering from Indian School of Mines, Dhanbad.

                                    <br />

                                    Abhishek believes in working hard, working smart, and living a balanced life. When he isn’t being a

                                    super-hero at work, he indulges in pencil sketching and creating art.
                                    &nbsp;<a href="https://www.linkedin.com/in/abhishek-kundan-frm-a771931b">LinkedIn</a>
                                </article>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}