/**
 * Created by amitava on 01/04/16.
 * This function parse url param into locality and subject
 * example:
 *  1. iit-classes-in-btm-layout => {sub: iit-classes, loc: btn-layout}
 *  2. iit-classes => {sub: iit-classes}
 *  3. btm-layout => {loc: btm-layout}
 */

export default function parse(str){
    var m = str.split('-in-');
    if(m.length > 1){
        return {
            sub: m[0],
            loc: m[1]
        }
    }else if(str.match(/-classes/i)){
        return {sub: str}
    }else{
        return {loc: str}
    }
}