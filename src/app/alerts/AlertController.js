import AlertService from './AlertService';
import controllerModule from '../common/ControllerModule';
import DeepStreamService from '../common/DeepStreamService';
import BindMessages from './BindMessages';
import _ from 'underscore';

class AlertController {
    constructor(AlertService, CommonService, DeepStreamService, $scope) {
        this.alertService = AlertService;
        this.commonService = CommonService;
        this.deepStreamService = DeepStreamService;
        this.alertMessages = [];
        this.mapDetails = {};
        this.mainMarker = {
            lat: 13.0601709,
            lang: 77.56245290000001,
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
                lat: 12.972169,
                lng: 77.590606,
                zoom: 11
            },
            markers: this.mapDetails
        });
        this.loadAlertsAsync();
        this.loadAsyncMobileVideos();
        console.log();
    };

    loadAlertsAsync() {


        this.messagelist.subscribe((entries)=> {
            /*scopeApply((data) => {
             console.log(data);
             this.mapDetails[data.incidentId] = {
             lat: data.location.latitude,
             lng: data.location.longitude,
             message: "I am : " + data.id,
             draggable: true,
             icon: {
             iconUrl: 'img/location-pointer.png',
             }
             }

             });
             */
            this.mapDetails = {};
            this.alertMessages = entries.map((entry)=> {
                var list = this.connection.record.getRecord(entry);
                /*list.whenReady((record) => {
                 console.log("updated");
                 this.mapDetails[record.get('incidentId')] = {
                 lat: record.get('location.latitude'),
                 lng: record.get('location.longitude'),
                 message: "I am : " + record.get('id'),
                 draggable: true,
                 icon: {
                 iconUrl: 'img/location-pointer.png',
                 }
                 };
                 console.log(this.mapDetails);
                 });*/

                list.subscribe((data) => {
                    console.log(data);
                    this.mapDetails[data.incidentId] = {
                        lat: data.location.latitude,
                        lng: data.location.longitude,
                        message: "I am : " + data.id,
                        draggable: true,
                        icon: {
                            iconUrl: 'img/location-pointer.png',
                        }
                    };
                    console.log(this.mapDetails[data.incidentId]);

                });
                return list;
            });


            angular.extend(this, {
                london: {
                    lat: 12.972169,
                    lng: 77.590606,
                    zoom: 11
                },
                markers: this.mapDetails
            });
            /*
             console.log(this.alertMessages);
             _.each(this.alertMessages, (i) => {
             console.log(i);
             });
             this.mapDetails = {};
             this.mapData = _.groupBy(this.alertMessages, "incidentId");
             _.each(this.mapData, (item, key) => {
             this.mapDetails[key] = {
             lat: item[0].location.latitude,
             lng: item[0].location.longitude,
             message: "I am : " + key,
             draggable: true,
             icon: {
             iconUrl: 'img/location-pointer.png',
             }
             };
             });*/

        });
    };

    deleteRecordFromList(recordName) {
        this.messagelist.removeEntry(recordName);
        this.connection.record.getRecord(recordName).delete();
    }

    addRecordToList(alertRecord) {

    }

    loadAsyncMobileVideos() {
        console.log("flowplayer");

        this.url = "rtmp://192.168.1.103:1935/Sandeep-live-demo";
        this.file = "myStream";
        $("#flowplayer1").flowplayer({
            live: true,
            swf: "video/flowplayer.swf",
            rtmp: this.url,
            playlist: [[{
                flash: this.file
            }]]
        });

        $("#flowplayer2").flowplayer({
            live: true,
            swf: "video/flowplayer.swf",
            rtmp: this.url,
            playlist: [[{
                flash: this.file
            }]]
        });

        $("#flowplayer3").flowplayer({
            live: true,
            swf: "video/flowplayer.swf",
            rtmp: this.url,
            playlist: [[{
                flash: this.file
            }]]
        });

        /*jwplayer("stream1").setup({
         autostart: 'true',
         primary: 'html5',
         file: "rtmp://192.168.1.102:1935/Sandeep-live-demo/myStream",
         image: "img/location-pointer.png",
         height: 250,
         width: 230
         });

         jwplayer("stream2").setup({
         autostart: 'true',
         primary: 'html5',
         file: "rtmp://192.168.1.102:1935/Sandeep-live-demo/myStream",
         image: "img/location-pointer.png",
         height: 250,
         width: 230
         });*/
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
         netConnectionUrl: 'rtmp://192.168.1.102:1935/Sandeep-live-demo'
         }
         }
         });*/
    };
}

AlertController.$inject = ['AlertService', 'CommonService', 'DeepStreamService', '$scope'];
export default controllerModule.controller('AlertController', AlertController).name;