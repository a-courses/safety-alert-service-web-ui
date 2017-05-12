import AlertService from './AlertService';
import controllerModule from '../common/ControllerModule';
import DeepStreamService from '../common/DeepStreamService';
import BindMessages from './BindMessages';

class AlertController {
    constructor(AlertService, CommonService, DeepStreamService) {
        this.alertService = AlertService;
        this.commonService = CommonService;
        this.deepStreamService = DeepStreamService;
        this.alertMessages = [];
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
        this.messagelist = this.connection.record.getList('safety/alerts');
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
        this.loadAlertsAsync();
        this.loadAsyncMobileVideos();
    };

    loadAlertsAsync() {

        this.messagelist.subscribe((entries)=> {
            function scopeApply() {
            }

            this.alertMessages = entries.map((entry)=> {
                var list = this.connection.record.getRecord(entry);
                list.subscribe(scopeApply);
                return list;
            });
        });
        console.log(this.alertMessages);
        /*this.alertService.getAlertDataFromService().then((data) => {
         this.alertMessages = data;
         });*/
    };

    deleteRecordFromList(recordName) {
        this.messagelist.removeEntry(recordName);
        this.connection.record.getRecord(recordName).delete();
    }

    addRecordToList(alertRecord) {

    }

    loadAsyncMobileVideos() {
        console.log("flowplayer");
        jwplayer("stream1").setup({
            autostart: 'true',
            primary: 'html5',
            file: "rtmp://192.168.1.103:1935/Sandeep-live-demo/myStream",
            image: "img/location-pointer.png",
            height: 250,
            width: 230
        });

        jwplayer("stream2").setup({
            autostart: 'true',
            primary: 'html5',
            file: "rtmp://192.168.1.103:1935/Sandeep-live-demo/myStream",
            image: "img/location-pointer.png",
            height: 250,
            width: 230
        });
        // jwplayer().play();

        // --------------
       /* flowplayer("#live", "http://releases.flowplayer.org/swf/flowplayer-3.2.18.swf", {
            clip: {
                url: 'myStream',
                live: true,
                provider: 'rtmp'
            },

            // streaming plugins are configured under the plugins node
            plugins: {
                rtmp: {
                    url: "video/flowplayer.rtmp-3.2.13.swf",
                    netConnectionUrl: 'rtmp://192.168.1.103:1935/Sandeep-live-demo'
                }
            }
        });*/
       this.url = "rtmp://192.168.1.103:1935/Sandeep-live-demo";
        this.file ="myStream";
        $("#flowplayer123").flowplayer({
            live: true,
            swf: "video/flowplayer.swf",
            rtmp: this.url,
            playlist: [[{
                flash: this.file
            }]]
        });

    };
}

AlertController.$inject = ['AlertService', 'CommonService', 'DeepStreamService'];
export default controllerModule.controller('AlertController', AlertController).name;