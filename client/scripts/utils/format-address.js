/**
 * Created by amitava on 12/02/16.
 */
import get from 'lodash/get';

export default function(address){
    if(address){
        return `${get(address, 'line1', '')},
        ${get(address, 'line2', '')},
        ${get(address, 'locality', '')},
        ${get(address, 'city', '')} - ${get(address, 'pincode', '')}`;
    }else return "";
}