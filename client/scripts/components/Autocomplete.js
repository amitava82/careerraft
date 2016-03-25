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
export default class Autocomplete extends React.Component{

    static propTypes = {
        items: React.PropTypes.array.required,
        loading: React.PropTypes.bool,
        onSelect: React.PropTypes.func
    };

    constructor(props){
        super(props);

        this.state = {
            visible: !!this.props.show
        }
    }

    @autobind
    select(item){
        this.props.onSelect(item);
        this.handleClickOutside();
    }

    componentWillReceiveProps(){
        if(!this.state.visible){
            this.setState({visible: true});
        }
    }

    componentDidMount(){
        //TODO handle keyboard arrow
    }

    handleClickOutside(e){
        this.setState({visible: false});
    }

    handleKeyPress(e){

    }

    render(){

        if(!this.state.visible) return null;

        const items = map(this.props.items, i => {
            return (
                <div key={i._id} className="dd-item ignore-react-onclickoutside" onClick={() => this.select(i)}>
                    <div>
                        {i.displayname}
                    </div>
                </div>
            )
        });

        return (
            <div className={classNames('autocomplete', {show: this.state.visible}, this.props.className)}>
                {items}
            </div>
        )
    }
}