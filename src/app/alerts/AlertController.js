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
        this.connection = this.deepStreamService.getServerConnection();

        /*this.list = this.connection.record.getRecord('safety/messages');
         this.fields = ['firstname', 'lastname'];
         this.sendMessage = [{'firstname': 'sandeep-name', 'lastname': 'M'},
         {'firstname': 'raghu', 'lastname': 'k'},
         {'firstname': 'sanmay', 'lastname': 'M'}];
         this.list.set(this.sendMessage);
         this.bindMessages.getField(this, this.list, this.fields);


         this.messages = [];
         this.list.subscribe((entries) => {
         console.log("inside subscribe controller");
         console.log(entries);
         this.messages = entries;
         entries.map((entry)=> {
         var record = this.connection.record.getRecord(entry);
         // record.subscribe(scopeApply);
         // return record;
         this.messages.push(record);
         });
         console.log(this.messages);
         // scopeApply();

         });

         */
        this.messages = [];
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
        this.sendMessage = [];
        this.readMessage = [];
    };

    loadAlertsAsync() {
        console.log("this.messages");
        console.log(this.messages);
        this.alertService.getAlertDataFromService().then((data) => {
            this.alertMessages = data;
        });
    };

    sendMessages(formMessages) {
        this.list = this.connection.record.getRecord('safety/messages');
        console.log(formMessages.userMessage);
        /*this.list.subscribe((entries) => {
            console.log("inside subscribe controller -send");
            console.log(entries);
            count = entries.length;
            /!*angular.forEach(entries, (entry) => {
             this.sendMessage.push(entry);
             });*!/

        });*/
        this.sendMessage.push({'message': formMessages.userMessage});
        this.list.set(this.sendMessage);
    }

    readMessages() {
        this.list = this.connection.record.getRecord('safety/messages');
        this.list.subscribe((entries) => {
            console.log(entries);
            this.readMessage = entries;
            console.log("inside subscribe controller - read");
            /*angular.forEach(entries, (entry) => {
             this.readMessage.push(entry);
             });*/

        });
        console.log(this.readMessage);
    };

    deleteMessages() {
        this.list = this.connection.record.getRecord('safety/messages').delete();
        console.log(this.list);
        // this.list.discard();
    };
}

AlertController.$inject = ['AlertService', 'CommonService', 'DeepStreamService', 'BindMessages'];
export default controllerModule.controller('AlertController', AlertController).name;