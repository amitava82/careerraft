/**
 * Created by amitava on 15/03/16.
 */
import reject from 'lodash/reject';
import merge from 'lodash/merge';
import union from 'lodash/union';
import extend from 'lodash/extend';
import { resolve, reject as _reject } from '../middleware/simple-promise';
import Schemas from '../../helpers/schema';
import createAction from '../createActions';

const [LOAD_GALLERY, UPLOAD, DELETE] = createAction('gallery', ['LOAD_GALLERY', 'UPLOAD', 'DELETE']);

export function loadGallery(org){
    return {
        type: LOAD_GALLERY,
        payload: {
            promise: api => api.get(`gallery/${org}`)
        }
    }
}

export function upload(org, files){
    return {
        type: UPLOAD,
        payload: {
            promise: api => api.post(`gallery/${org}`, {data: files})
        }
    }
}

export function deleteImage(org, filename){
    return {
        type: DELETE,
        payload: {
            promise: api => api.del(`gallery/${org}/${filename}`)
        }
    }
}