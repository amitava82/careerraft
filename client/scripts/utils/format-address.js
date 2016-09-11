/**
 * Created by amitava on 12/02/16.
 */
import get from 'lodash/get';

export function formatAddress(address){
    if(address){
        return `${get(address, 'line1', '')}
        ${get(address, 'line2', '')}
        ${get(address, 'locality', '')}
        ${get(address, 'city', '')} - ${get(address, 'pincode', '')}`;
    }else return "";
};

export function parseAddress(address_components) {
    var r = {};
    for (var ac = 0; ac < address_components.length; ac++) {
        var component = address_components[ac];

        switch(component.types[0]) {
            case 'sublocality_level_1':
                r.locality = component.long_name;
                break;
            case 'locality':
                r.city = component.long_name;
                break;
            case 'administrative_area_level_1':
                r.state = component.short_name;
                r.state_long = component.long_name;
                break;
            case 'postal_code':
                r.postal_code = component.long_name;
                break;
            case 'country':
                r.country = component.long_name;
                r.country_iso = component.short_name;
                break;
        }
    }
    return r;
}
