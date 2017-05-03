import AlertService from './AlertService';
import controllerModule from '../common/ControllerModule';
import DeepStreamService from '../common/DeepStreamService';
import BindMessages from './BindMessages';

class AlertController {
    constructor(AlertService, CommonService, DeepStreamService, BindMessages) {
        this.alertService = AlertService;
        this.commonService = CommonService;
        this.deepStreamService = DeepStreamService;
        this.bindMessages = BindMessages;
        this.alertMessages = "";
        this.mainMarker = {
            lat: 13.0601709,
            lng: 77.56245290000001,
            focus: true,
            message: "I am draggable",
            draggable: false,
            icon: {
                iconUrl: 'img/location-pointer.png',
                iconSize: [32, 32], // size of the icon
                iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 62],  // the same for the shadow
                popupAnchor: [-7, -90] // point from which the popup should open relative to the iconAnchor
            }
        };
        this.connection = this.deepStreamService.getServerConnection();

        angular.extend(this, {
            london: {
                lat: 13.0601709,
                lng: 77.56245290000001,
                zoom: 15
            },
            markers: {
                mainMarker: angular.copy(this.mainMarker)
            },
            position: {
                lat: 51,
                lng: 0
            }
        });
        this.sendMessage = [];
        this.readMessage = [];
    };

    loadAlertsAsync() {
        console.log("this.alertmessages");
        this.list = this.connection.record.getRecord('safety/messages');
        this.list.subscribe((entries) => {
            console.log(entries);
            this.alertMessages = entries;
        });
        console.log(this.alertMessages);
        /*this.alertService.getAlertDataFromService().then((data) => {
         this.alertMessages = data;
         });*/
    };

    sendMessages(formMessages) {
        console.log(formMessages.userMessage);
    }

    readMessages() {
        this.list = this.connection.record.getRecord('safety/messages');
        this.list.subscribe((entries) => {
            console.log("inside subscribe controller - read");
            console.log(entries);
        });
    };

    deleteMessages() {
        //this.list = this.connection.record.getRecord('safety/messages').delete();
        // console.log(this.list);
        // this.list.discard();
    };
}

AlertController.$inject = ['AlertService', 'CommonService', 'DeepStreamService', 'BindMessages'];
export default controllerModule.controller('AlertController', AlertController).name;