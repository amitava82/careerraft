/**
 * Created by amitava on 10/02/16.
 */
import { createAction } from 'redux-actions';

import { meta } from './misc';

export const STORE_SESSION = createAction('STORE_SESSION', (data) => {
    return data;
});