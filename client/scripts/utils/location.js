/**
 * Created by amitava on 07/02/16.
 */
export default function getUserLocation(callback){
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            callback({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        });
    }else {
        callback({
            lat: 12.9667,
            lng: 77.5667
        });
    }
}