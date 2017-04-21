import angular from 'angular';
// Material design css
import 'angular-material/angular-material.css';
// Icons
import 'font-awesome/css/font-awesome.css';
// Animation
import 'angular-animate';
import 'angular-aria';
// Materail Design lib
import 'angular-material';
import '../style/app.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap'

import 'angular-simple-logger';
import 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'ui-leaflet';

let app = () => {
    return {
        template: require('./app.html'),
        controller: 'AppCtrl',
        controllerAs: 'app'
    }
};

class AppCtrl {
    constructor() {
        this.url = 'https://github.com/preboot/angular-webpack';
        this.topDirections = ['left', 'up'];
        this.bottomDirections = ['down', 'right'];

        this.isOpen = false;

        this.availableModes = ['md-fling', 'md-scale'];
        this.selectedMode = 'md-fling';

        this.availableDirections = ['up', 'down', 'left', 'right'];
        this.selectedDirection = 'up';

        this.mainMarker = {
            lat: 12.9260208,
            lng: 77.5470295,
            focus: true,
            message: "Hey, drag me if you want",
            draggable: true,
            icon: {
                iconUrl: '/img/leaf-green.png',
                shadowUrl: '/img/leaf-shadow.png',
                iconSize: [38, 95], // size of the icon
                shadowSize: [50, 64], // size of the shadow
                iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 62],  // the same for the shadow
                popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
            }
        };

        angular.extend(this, {
            london: {
                lat: 51.505,
                lng: -0.09,
                zoom: 8
            },
            markers: {
                mainMarker: angular.copy(this.mainMarker)
            },
            position: {
                lat: 51,
                lng: 0
            }
        });
        /*
         this.$on("leafletDirectiveMarker.dragend", function (event, args) {
         this.position.lat = args.model.lat;
         this.position.lng = args.model.lng;
         });*/
    }
}


const MODULE_NAME = 'app';

angular.module(MODULE_NAME, ['ngMaterial', 'ui-leaflet'])
    .directive('app', app)
    .controller('AppCtrl', AppCtrl);

export default MODULE_NAME;