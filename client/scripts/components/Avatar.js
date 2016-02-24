/**
 * Created by amitava on 23/02/16.
 */
import React from 'react';

export default class Avatar extends React.Component {

    render(){
        const {name, width=130, height=120} = this.props;
        const parts = name.split(' ');
        let sub = "";
        if(parts.length >1){
            sub = parts[0][0] + parts[1][0];
        }else{
            sub = name.substr(0, 2);
        }

        const idx = Math.min(name.length % 6, 6);
        return (
            <div className="avatar" style={{backgroundColor: colors[idx], width: width, height: height}}>
                {sub.toUpperCase()}
            </div>
        )

    }
}

const colors = [
    '#E05263', '#659157', '#69A2B0', '#DD1C1A', '#086788', '#06AED5', '#F0C808'
];