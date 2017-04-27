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

        var list = this.connection.record.getRecord('alertMessages');
        var fields = ['firstname', 'lastname'];
        list.set({'firstname': 'sandeep', 'lastname': 'M'});
        this.bindMessages.getField(this, list, fields);
        this.messages = [];
        console.log("list");
        console.log(list);
        list.subscribe(function (entries) {
            console.log("inside subscribe controller");
            function scopeApply() {
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }

            this.messages = entries.map(function (entry) {
                var record = this.connection.record.getRecord(entry);
                record.subscribe(scopeApply);
                return record;
            });

            scopeApply();
        });

        console.log(this.messages);

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
        this.alertService.getAlertDataFromService().then((data) => {
            this.alertMessages = data;
        });
    };


}

AlertController.$inject = ['AlertService', 'CommonService', 'DeepStreamService', 'BindMessages'];
export default controllerModule.controller('AlertController', AlertController).name;