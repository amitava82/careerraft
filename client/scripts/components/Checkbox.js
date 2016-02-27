/**
 * Created by amitava on 12/02/16.
 */
import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

export default class Checkbox extends Component {

    render() {
        const {field, label, className, key, ...rest} = this.props;
        const classes = classNames('checkbox', className);

        return (
            <div className={classes} key={key}>
                <label className="input-group center">
                    <input type="checkbox" className="form-control" {...field} {...rest}/>
                    {label}
                </label>
                {field && field.touched && field.error && <div className="text-error">{field.error}</div>}
            </div>
        )
    }
}