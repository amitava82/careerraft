/**
 * Created by amitava on 12/02/16.
 */
import React, {Component, PropTypes} from 'react';
import sortBy from 'lodash/sortBy';

export default class Select extends Component {
    static propTypes = {
        field: PropTypes.object.isRequired,
        options: PropTypes.array.isRequired
    };

    //shouldComponentUpdate(nextProps) {
    //    return this.props.field !== nextProps.field;
    //}

    render() {
        const {field, options, label, ...rest} = this.props;

        const optionsList = sortBy(options, 'label').map(i => {
            return <option key={i.value} value={i.value}>{i.label}</option>
        });

        return (
            <div className="select">
                {label && <label>{label}</label>}
                <select {...field} {...rest}>
                    <option value="">Select</option>
                    {optionsList}
                </select>
                {field && field.touched && field.error && <div className="text-error">{field.error}</div>}
            </div>
        );
    }
}