// import ServiceModule from '../common/ServiceModule';
// import AlertService from './AlertService';
import controllerModule from '../common/ControllerModule';
import DeepStreamService from '../common/DeepStreamService';

class AlertController {
    constructor(DeepStreamService) {
        // this.alertService = AlertService;
        this.message = "";
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
        console.log(DeepStreamService.getServerConnection());
        /*
         this.$on("leafletDirectiveMarker.dragend", function (event, args) {
         this.position.lat = args.model.lat;
         this.position.lng = args.model.lng;
         });*/
    };

    getDataFromService() {
        return "Some text";
    };
}

AlertController.$inject = [DeepStreamService];
export default controllerModule.controller('AlertController', AlertController).name;