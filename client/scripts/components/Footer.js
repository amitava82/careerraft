import React from 'react';

export default class Footer extends React.Component {
    render (){
        return (
            <footer className="grid center">
                Copyright &copy; &nbsp; {new Date().getFullYear()} &nbsp; Careerraft
            </footer>
        )
    }
}