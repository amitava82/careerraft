/**
 * Created by amitava on 15/03/16.
 */
import React from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import noop from 'lodash/noop'

export default class ImageGallery extends React.Component{

    static propTypes = {
        files: React.PropTypes.array,
        allowDelete: React.PropTypes.bool,
        onDelete: React.PropTypes.func,
        autoSelect: React.PropTypes.bool,
        onSelect: React.PropTypes.func
    };

    static defaultProps = {
        files: [],
        allowDelete: false,
        onDelete: noop,
        autoSelect: false,
        onSelect: noop
    };

    constructor(...args){
        super(...args);
        this.state = {
            selected: null
        }
    }

    componentDidMount(){
        if(this.props.autoSelect && this.props.files.lenght)
            this.setState({selected: this.props.files[0]})
    }

    componentWillReceiveProps(nextProps){
        if(this.props.autoSelect && nextProps.files.length !== this.props.files.length)
            this.setState({selected: nextProps.files[0]});
        else if(nextProps.files.length === 0)
            this.setState({selected: null});
    }

    select(file){
        this.setState({selected: file});
        this.props.onSelect(file);
    }

    @autobind
    close(){
        this.setState({selected: null})
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
                    {selected ? (
                        <div>
                            <button onClick={this.close} type="button" className="btn btn-link">close</button>
                            {allowDelete && <button type="button" onClick={() => onDelete(selected.name)} className="btn btn-primary btn-link pull-right">Delete</button> }
                        </div>
                    ) : null}
                    {selected ? (
                        <div>
                            <img className="img-thumbnail img-responsive" src={selected.url} alt={selected.name}  />
                        </div>
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