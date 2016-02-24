/**
 * Created by amitava on 18/02/16.
 */
import React from 'react';
import Helmet from 'react-helmet';

export default class CoreValues extends React.Component {
    render(){
        return (
            <div className="values-page">
                <Helmet title="Careerraft :: Our core values" />
                <div className="hero-unit">
                    <div className="page-inner grid">
                        <div className="cell-span-7">
                            <h3 className="text-display-2">Our core values</h3>
                        </div>
                        <div className="cell-span-3"></div>
                    </div>
                </div>
                <div className="content-body">
                    <div className="page-inner">
                        <article>
                            We take pride in our culture. There are some core values that have been inherent and are an integral

                            part of us. These values are a pure reflection of what is important to us as a Team and Business.
                        </article>
                        <h6 className="text-headline">HERE ARE THE 5 CORE VALUES THAT WE LIVE BY:</h6>

                        <h6 className="text-title">INNOVATION</h6>

                        <p>Creativity is at the core of our business values. The team is given the freedom to take informed,

                            responsible risks.</p>

                        <h6 className="text-title">CHANGE</h6>

                        <p> We are ever evolving and believe in driving change, embracing every opportunity with open arms.</p>

                        <h6 className="text-title">OPENNESS</h6>

                        <p>We encourage every team member to share ideas and feedback openly thereby building strong

                            relationships built on Trust and Faith.</p>

                        <h6 className="text-title">OWNERSHIP</h6>

                        <p>Every member owns the task they take up. We foster collaboration while building individual

                            accountability.</p>

                        <h6 className="text-title">HONESTY</h6>

                        <p>We believe in doing the right thing under all circumstances.</p>
                    </div>
                </div>
            </div>
        )
    }
}