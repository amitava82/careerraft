/**
 * Created by amitava on 12/02/16.
 */
import React, {Component, PropTypes} from 'react';

export default class PureInput extends Component {
    static propTypes = {
        field: PropTypes.object.isRequired
    };

    shouldComponentUpdate(nextProps) {
        return this.props.field !== nextProps.field;
    }

    render() {
        const {field, label, ...rest} = this.props;
        return (
            <div className="input">
                {label && <label>{label}</label>}
                <input className="form-control" {...field} {...rest}/>
                {field && field.touched && field.error && <div className="text-error">{field.error}</div>}
            </div>
        )
    }
}