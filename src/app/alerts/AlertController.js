import AlertService from './AlertService';
import controllerModule from '../common/ControllerModule';

class AlertController {
    constructor(AlertService, CommonService) {
        this.alertService = AlertService;
        this.commonService = CommonService;
        this.message = "";
        this.mainMarker = {
            lat: 13.0601709,
            lng: 77.56245290000001,
            focus: true,
            message: "Hey, drag me if you want",
            draggable: true,
            icon: {
                iconUrl: 'img/location-pointer.png',
                iconSize: [32, 32], // size of the icon
                iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 62],  // the same for the shadow
                popupAnchor: [-7, -90] // point from which the popup should open relative to the iconAnchor
            }
        };

        angular.extend(this, {
            london: {
                lat: 13.0601709,
                lng: 77.56245290000001,
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

    };

    loadAlertsAsync() {
        console.log("called");
        // console.log(this.commonService.getData("data/alerts.json", "Error while fetching data"));
        /*this.commonService.getData("data/alerts.json", "Error while fetching data").then((data)=>{
            console.log(data);
        });*/
        this.alertService.getAlertDataFromService().then((data) => {
            console.log("data");
            console.log(data);
            this.message = data;
        });
    };
}

AlertController.$inject = ['AlertService', 'CommonService'];
export default controllerModule.controller('AlertController', AlertController).name;