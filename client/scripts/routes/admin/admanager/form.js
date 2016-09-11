/**
 * Created by amitava on 15/04/16.
 */
import React from 'react';
import {reduxForm} from 'redux-form'
import autobind from 'autobind-decorator';

import Input from '../../../components/PureInput';
import Select from '../../../components/Select';
import Checkbox from '../../../components/Checkbox';

import {upload} from '../../../redux/modules/gallery';

@reduxForm({
    form: 'create_ad',
    fields: ['_id', 'client_id', 'name', 'keywords', 'banner', 'banner_url', 'target', 'expires_on', 'stop_rules', 'active', 'target_cities', 'position', 'ad_type']
})
export default class AdForm extends React.Component{

    constructor(...args){
        super(...args);

        this.state = {
            banner: this.props.ad && this.props.ad.banner_url
        }
    }

    componentDidMount(){
        const ad = this.props.ad;
        ad && this.props.initializeForm({
            _id: ad._id,
            client_id: ad.client_id,
            name: ad.name,
            keywords: ad.keywords.join(', '),
            banner_url: ad.banner_url,
            target: ad.target_url,
            expires_on: ad.expires_on,
            active: ad.active,
            target_cities: ad.target_cities.join(', '),
            position: ad.position,
            ad_type: ad.ad_type
        });
    }

    @autobind
    handleFile(onChange){
        return e => {
            onChange(e);
            if(e.target.files.length){
                var body = new FormData();
                body.append('banner', e.target.files[0]);
                this.props.dispatch(upload('ads_banners', body)).then(
                    r => {
                        const url = r.files[0].url;
                        this.setState({banner: url});
                        this.props.fields.banner_url.onChange(url);
                    },
                    e => console.log(e)
                )
            }
        }
    }

    render(){

        const {fields: {client_id, name, keywords, banner, target, expires_on, stop_rules, active, target_cities, ad_type, position}, submitting} = this.props;

        const _ad_types = [{value: 'text', label: 'Text ad'},{value: 'image', label: 'Image ad'}];
        const _positions = [{value: 'top', label: 'Top'},{value: 'right', label: 'Right'},{value: 'between', label: 'Between'}];

        return (
            <form>
                <Input label="Client ID" field={client_id}/>
                <Input label="Campaign name" field={name}/>
                <Select label="Ad type" field={ad_type} options={_ad_types}></Select>
                <Select label="Position" field={position} options={_positions}></Select>
                <Input label="Comma separated target keywords" field={keywords}/>
                <Input label="Target cities, comma separated values" field={target_cities} />
                <Input label="Target URL" field={target} />
                <input type="file" {...banner} value={ null } className="form-control" onChange={this.handleFile(banner.onChange)}/>
                { this.state.banner && <img src={this.state.banner} alt="ad banner" className="img-responsive" /> }
                <Input label="Expiry date" field={expires_on} type="string" />
                <Checkbox label="Active" field={active} />
            </form>
        )
    }
}