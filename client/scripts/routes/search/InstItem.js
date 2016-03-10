/**
 * Created by amitava on 14/02/16.
 */
import React from 'react';
import {Link} from 'react-router';
import uniq from 'lodash/uniq'
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';

import {removeSavedItem, saveItem} from '../../redux/modules/user';
import formatAddress from '../../utils/format-address';

@connect(state => {
    return {
        user_store: state.user_store
    }
})
export default class InstItem extends React.Component {

    @autobind
    remove(){
        this.props.dispatch(removeSavedItem(this.props.inst._id));
    }

    @autobind
    addToList(){
        this.props.dispatch(saveItem(this.props.inst._id));
    }

    render(){
        const i = this.props.inst;

        const selected = !!this.props.user_store.savedItems[i._id];

        const categories = [], subjects = [], courses = [];
        i.subjects.forEach(i => {
            categories.push(
                i.category
            );
            courses.push(
                i.course
            )
        });

        const desc = i.description.length >= 300 ? i.description.substr(0,300).trim()  : i.description;

        const detailsLink = `/institute/${i.url_slug || i._id}`;

        return (
            <div className="inst-item">
                <h5 className="text-headline">
                    <Link to={detailsLink}>{i.name}</Link>
                    {selected ? (
                        <button onClick={this.remove} className="btn btn-link btn-sm link-save item-list-added"><i className="fa fa-check-circle" /> Saved</button>
                    ) : (
                        <button onClick={this.addToList} className="btn btn-link btn-sm link-save"><i className="fa fa-bookmark" /> Save</button>
                    )}
                </h5>
                <p className="addr text-subhead"><i className="fa fa-map-marker" /> {formatAddress(i.address)}</p>
                <p className="desc">{desc}{i.description.length >= 300 && <Link to={detailsLink}>...more</Link>}</p>
                <div className="m-bm">
                    <h5 className="text-subhead">
                        <span className="strong">Specializes in:</span> {uniq(courses).join(', ')}
                    </h5>
                </div>
                <div className="categories pills">
                    <div><span className="strong">Listed under:</span> {uniq(categories).map(i => {
                        return (
                            <div className="label label-default">
                                {i}
                            </div>
                        )
                    })}</div>

                </div>
            </div>
        )
    }
}