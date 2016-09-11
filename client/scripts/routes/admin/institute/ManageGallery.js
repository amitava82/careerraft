/**
 * Created by amitava on 15/03/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import autobind from 'autobind-decorator';
import Dropzone from 'react-dropzone';
import without from 'lodash/without';
import reject from 'lodash/reject';

import ImageGallery from '../../../components/ImageGallery';

import {updateProvider} from '../../../redux/modules/provider';
import {upload, loadGallery, deleteImage} from '../../../redux/modules/gallery';
import {createToast} from '../../../redux/modules/toast';

function replacer(key, value) {
    if (value instanceof FileList) {
        return Array.from(value).map(file => file.name).join(', ') || 'No Files Selected';
    }
    return value;
}

function stringify(values) {
    return JSON.stringify(values, replacer, 2);
}

@reduxForm({
    form: 'upload_gallery',
    fields: ['images']
}, state => state)
export default class ManageGallery extends React.Component{

    constructor(...args){
        super(...args);
        this.state = {
            images: []
        }
    }

    componentDidMount(){
        this.props.dispatch(loadGallery(this.props.params.id)).then(
            r => this.setState({images: r.files}),
            e => {
                if(e.status != 404)
                    this.props.dispatch(createToast(e))
            }
        )
    }

    @autobind
    onImageDelete(name){
        this.props.dispatch(deleteImage(this.props.params.id, name)).then(
            r => {
                const files = reject(this.state.images, {name: name});
                this.setState({images: files});
            },
            e => {
                this.props.dispatch(createToast(e));
            }
        )
    }

    @autobind
    onImageSelect(file){
        this.setState({selected: file});
    }

    @autobind
    submit(data){
        if(data.images && data.images.length){
            var body = new FormData();
            Object.keys(data.images).forEach(( key ) => {
                body.append(key, data.images[ key ]);
            });

            return this.props.dispatch(upload(this.props.params.id, body)).then(
                r => {
                    if(r.files.length){
                        r.files.reduce((memo, f) => {
                            if(f.error){
                                this.props.dispatch(createToast(new Error(`${f.name} - ${f.error}`)));
                            }else{
                                memo.push(f);
                            }
                            return memo;
                        }, this.state.images);
                    }
                    this.setState({images: this.state.images});
                    this.props.resetForm();
                },
                e => this.props.dispatch(createToast(e))
            )
        }
    }

    remove(file){
        const files = without(this.props.fields.images.value, file);
        this.props.initializeForm({images: files})
    }

    @autobind
    setLogo(){
        const url = this.state.selected.url;
        this.props.dispatch(update(this.props.params.id, {
            logo: url
        })).then(null, e => this.props.dispatch(createToast(e)));
    }

    render(){
        const {
            fields: {images},
            handleSubmit,
            resetForm,
            submitting
            } = this.props;

        const hasFiles = images.value && images.value.length;
        return (
            <div>
                <form onSubmit={handleSubmit(this.submit)} className="m-bl">
                    <h4>Upload Images : </h4>
                    <Dropzone multiple={true} className="col-xs-12 drop-zone m-bl" { ...images }
                        onDrop={( filesToUpload, e) => images.onChange(filesToUpload) }>
                        <div>Try dropping some files here, or click to select files to upload. Supported formats: jpeg, jpg, bmp, gif no more than 2MB each</div>
                    </Dropzone>
                    {hasFiles ?
                    <div className="m-bl">
                        <h4>Dropped files: </h4>
                        <ul className="list-unstyled">
                            {
                                images.value && images.value.map((file, idx) => {
                                    return (
                                        <li key={idx}>
                                            <img src={file.preview} width={100}/>
                                            <div>{file.name + ' : ' + (file.size/1024).toFixed(2) + ' KB'}
                                                <button type="button" onClick={() => this.remove(file)} className="btn btn-link btn-sm">Remove</button>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    : null}
                    <div className="form-group">
                        <button className="btn btn-primary m-rm" type="submit" disabled={submitting || !hasFiles}>
                            {submitting ? <i className="fa fa-spinner fa-pulse" /> : <i/>} Submit
                        </button>
                        <button className="btn btn-default" type="button" disabled={submitting || hasFiles} onClick={resetForm}>
                            Clear Selection
                        </button>
                    </div>
                </form>
                <h3>Uploaded Photos</h3>
                {this.state.selected ?
                    <div>
                        <button onClick={this.setLogo} className="btn btn-link" type="button">Use this image as logo</button>
                        <span className="sm"><i className="fa fa-info-circle" /> Recommended dimension for logo is 130px width and 120px height</span>
                    </div>
                    : null
                }
                <ImageGallery
                    files={this.state.images}
                    onDelete={this.onImageDelete}
                    onSelect={this.onImageSelect}
                    autoSelect={true}
                    allowDelete={true} />
            </div>
        )
    }
}