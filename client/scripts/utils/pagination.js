/**
 * Created by amitava on 25/02/16.
 */

export function next(props){
    const page = props.location.query.page;
    const next = page ? Number(page) +  1 : 2;
    const q = merge({}, {...props.location.query, page: next});
    props.dispatch(push({...props.location, query: q}));
}

export function previous(props){
    const page = props.location.query.page;
    const prev = page ? Number(page) -1 : 1;
    const q = merge({}, {...props.location.query, page: prev});
    props.dispatch(push({...props.location, query: q}));
}

