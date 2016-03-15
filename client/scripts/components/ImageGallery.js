/**
 * Created by amitava on 15/03/16.
 */
import React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop'

export default class ImageGallery extends React.Component{

    static propTypes = {
        files: React.PropTypes.array,
        allowDelete: React.PropTypes.bool,
        onDelete: React.PropTypes.func,
        autoSelect: React.PropTypes.bool
    };

    static getDefaultProps = {
        files: [],
        allowDelete: false,
        onDelete: noop,
        autoSelect: true
    };

    constructor(...args){
        super(...args);
        this.state = {
            selected: null
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.files.length !== this.props.files.length && this.props.autoSelect)
            this.setState({selected: nextProps.files[0]});
    }

    select(url){
        this.setState({selected: url});
    }

    render(){
        const {selected} = this.state;
        const {allowDelete, files, onDelete} = this.props;

        const thumbs = files.map(i => {
            return (
                <div key={i.name} onClick={() => this.select(i)}>
                    <img className="img-thumbnail img-responsive" src={i.thumbnailsUrl} alt={i.name} />
                </div>
            )
        });

        return (
            <div className={classNames('image-gallery', this.props.className)}>
                <div className="gallery-img">
                    {selected && allowDelete && <button type="button" onClick={() => onDelete(selected.name)} className="btn btn-primary btn-link pull-right">Delete</button> }
                    {selected ? (
                        <img className="img-thumbnail img-responsive" src={selected.url} alt={selected.name}  />
                    ): (
                        <h5 className="text-muted">Click on a thumbnail for bigger view</h5>
                    )}
                </div>
                <div className="gallery-thumbs">
                    {thumbs}
                </div>
            </div>
        )
    }
}