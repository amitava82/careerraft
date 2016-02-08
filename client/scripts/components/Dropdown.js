/**
 * Created by amitava on 07/02/16.
 */
import React from 'react';
import {Link} from 'react-router';
import autobind from 'autobind-decorator';
import map from 'lodash/map';
import listensToClickOutside from 'react-onclickoutside/decorator';
import classNames from 'classnames';

@listensToClickOutside()
export default class Dropdown extends React.Component{

    static propTypes = {
        items: React.PropTypes.array.required
    };

    constructor(props){
        super(props);

        this.state = {
            visible: false
        }
    }

    @autobind
    select(item){
        this.props.onSelect(item);
    }

    componentWillReceiveProps(){
        if(!this.state.visible){
            this.setState({visible: true});
        }
    }

    handleClickOutside(){
        console.log('hide')
        this.setState({visible: false})
    }

    render(){

        if(!this.state.visible) return null;
        
        const items = map(this.props.items, i => {
            return (
                <div key={i.id} className="dd-item">
                    <Link to={`/${i.model}/search/${i.id}`}>
                        {i.label}
                    </Link>
                </div>
            )
        });

        return (
            <div className={classNames('dropdown', {show: this.state.visible})}>
                {items}
            </div>
        )
    }
}