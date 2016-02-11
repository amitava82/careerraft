/**
 * Created by amitava on 10/02/16.
 */
import React from 'react';

export default class InstituteDetails extends React.Component {

    render(){
        return (
            <div className="inst grid column">
                <div className="header grid row">
                    <div className="cell-2">
                        <h3>Some center</h3>
                        <address>
                            <i className="fa fa-map-marker" />
                            Some street, some area, some city, some locality
                        </address>
                        <h5>Courses</h5>
                        <div className="pills">
                            <span className="pill pill-success">IIT JEE</span>
                            <span className="pill pill-success">AIEE</span>
                            <span className="pill pill-success">XYZ</span>
                        </div>
                        <h5>Board</h5>
                        <div className="pills">
                            <span className="pill">WBSC</span>
                            <span className="pill">JSKG</span>
                        </div>
                    </div>
                    <div className="cell-1 grid row">
                        <div>
                            123 ratings
                        </div>
                        <div>
                            Visit us at:
                            <a href="">Google.com</a>
                        </div>
                        <div>
                            Social
                        </div>
                    </div>
                </div>
                <div className="content">
                    <div className="box">
                        <div className="box-header">
                            <h5>About XYZ center</h5>
                        </div>
                        <div className="box-content">
                            <p>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}