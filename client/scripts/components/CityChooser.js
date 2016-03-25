/**
 * Created by amitava on 23/03/16.
 */
import React from 'react';
import {Modal, ModalHeader} from 'react-bootstrap';

export default class CityChooser extends React.Component{
    render(){
        
        return (
            <Modal>
                <Modal.Header>
                    <Modal.Title>Please select your city</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul className="list-unstyled">
                        <li>Bangalore</li>
                    </ul>
                </Modal.Body>
            </Modal>
        )
    }
}