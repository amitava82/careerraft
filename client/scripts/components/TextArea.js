/**
 * Created by amitava on 12/02/16.
 */
import React, {Component, PropTypes} from 'react';

export default class Textarea extends Component {
    static propTypes = {
        field: PropTypes.object.isRequired
    };

    shouldComponentUpdate(nextProps) {
        return this.props.field !== nextProps.field;
    }

    render() {
        const {field, label, ...rest} = this.props;
        return (
            <div className="textarea">
                {label && <label>{label}</label>}
                <textarea {...field} value={field && field.value || ''} {...rest} />
                {field && field.touched && field.error && <div className="text-error">{field.error}</div>}
            </div>
        )
    }
}