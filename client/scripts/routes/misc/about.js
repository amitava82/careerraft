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
                <h2 className="text-center">Welcome to CareerRaft</h2>
                <h4>The World of Education</h4>
                <p className="lead">
                    We are the fastest-growing family in the education space. Fed up with endless on-site visits and

                    unavailable informational listings about institutes, we created an institute search system several
                    notches

                    above others. Led by passionate problem-solvers and backed by top minds, we are dedicated towards

                    changing the trends in the field of education.
                </p>
                <h4>What we do?</h4>
                <p className="lead">
                    Whether you are just starting your research, want to narrow down your options, or have a specific

                    question, Careerraft can help.
                </p>

                <h6>Read advice online and ask the experts</h6>

                <p className="lead"> Get free help and advice from a pool of experts and friends about every aspect of
                    your education.</p>

                <h6>Search and compare institutes</h6>

                <p className="lead"> Search detailed, unbiased information about education institutes and resources.
                    Careerraft aggregates

                    data from the most trusted sources so you can spend less time digging through websites and more time

                    focusing on your future.
                </p>
                <h4>How we do it?</h4>

                <h6>We Dream (with open eyes)</h6>
                <p className="lead">

                    We see the world differently. We aim higher, dream bigger and explore deeper. We try to make

                    anything better than anything ever done before.

                </p>
                <h6>We Think (out of box)</h6>
                <p>
                    We solve problems differently. With knowledge, passion and technology combined together, we drive

                    innovation and set new benchmarks for excellence.

                </p>
                <h6>We Work (to make the best)</h6>
                <p>

                    We do things differently. We don’t stop at success, we always ask ‘what next?’ so we can change the

                    game and keep on winning.
                </p>
            </div>
        )
    }
}