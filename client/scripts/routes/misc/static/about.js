/**
 * Created by amitava on 18/02/16.
 */
import React from 'react';
import Helmet from 'react-helmet';

export default class About extends React.Component {
    render() {
        return (
            <div className="about-page">
                <Helmet title="Careerraft :: About us"/>
                <div className="hero-unit">
                    <div className="page-inner container">
                        <div className="row">
                            <div className="col-xs-10">
                                <h3 className="text-display-2">About Careerraft</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content-body container">
                    <div className="page-inner row">
                        <div className="m-tl col-xs-12">
                            <article>
                                We are the fastest-growing family in the education space. Fed up with endless on-site visits and

                                unavailable informational listings about institutes, we created an institute search system several
                                notches

                                above others. Led by passionate problem-solvers and backed by top minds, we are dedicated towards

                                changing the trends in the field of education.
                            </article>
                            <article>
                                <h5 className="text-headline">What we do?</h5>
                                <p>
                                    Whether you are just starting your research, want to narrow down your options, or have a specific

                                    question, Careerraft can help.
                                </p>
                                <h6 className="text-title">Read advice online and ask the experts</h6>
                                <p>
                                    Get free help and advice from a pool of experts and friends about every aspect of
                                    your education.
                                </p>
                                <h6 className="text-title">Search and compare institutes</h6>
                                <p>
                                    Search detailed, unbiased information about education institutes and resources.
                                    Careerraft aggregates

                                    data from the most trusted sources so you can spend less time digging through websites and more time

                                    focusing on your future.
                                </p>
                            </article>
                            <article>
                                <h5 className="text-headline">How we do it?</h5>
                                <div className="features row">
                                    <div className="col-md-4">
                                        <i className="fa">1</i>
                                        <p className="lead">We Dream (with open eyes)</p>
                                        <p> We see the world differently. We aim higher, dream bigger and explore deeper. We try to make

                                            anything better than anything ever done before.</p>
                                    </div>
                                    <div className="col-md-4">
                                        <i className="fa">2</i>
                                        <p className="lead">We Think (out of box)</p>
                                        <p>We solve problems differently. With knowledge, passion and technology combined together, we drive

                                            innovation and set new benchmarks for excellence.</p>
                                    </div>
                                    <div className="col-md-4">
                                        <i className="fa">3</i>
                                        <p className="lead">We Work (to make the best)</p>
                                        <p>We do things differently. We don’t stop at success, we always ask ‘what next?’ so we can change the

                                            game and keep on winning.</p>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}