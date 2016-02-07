import React from 'react';

export default function (Component) {

    return class GooglePlaceAPI extends React.Component {

        componentDidMount(){
            const autocomplete = new google.maps.places.Autocomplete({

            })

            autocomplete.addListener('place_changed', () => this.placeChanged(autocomplete));
        }

        placeChanged(autocomplete){
            console.log(autocomplete.getPlace());
        }

        render() {
            return (
                <Component {...this.props} />
            );
        }
    }

}