import AlertService from './AlertService';
import controllerModule from '../common/ControllerModule';
import DeepStreamService from '../common/DeepStreamService';
import _ from 'underscore';

class AlertController {
    constructor(AlertService, CommonService, DeepStreamService, toaster) {
        this.toaster = toaster;
        this.alertService = AlertService;
        this.commonService = CommonService;
        this.deepStreamService = DeepStreamService;
        this.alertMessages = [];
        this.availableColors = ['1', '2', '3', '4', '5', '6', '7', '8'];
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
            center: {
                lat: 12.97,
                lng: 77.56,
                zoom: 10
            },
            markers: this.mapDetails,
            layers: {
                baselayers: {
                    googleTerrain: {
                        name: 'Google Terrain',
                        layerType: 'TERRAIN',
                        type: 'google'
                    },
                    googleHybrid: {
                        name: 'Google Hybrid',
                        layerType: 'HYBRID',
                        type: 'google'
                    },
                    googleRoadmap: {
                        name: 'Google Streets',
                        layerType: 'ROADMAP',
                        type: 'google'
                    }
                },
                overlays: {
                    Fire: {
                        name: 'Fire',
                        type: 'group',
                        visible: true
                    },
                    Police: {
                        name: 'Police',
                        type: 'group',
                        visible: true
                    },
                    Medical: {
                        name: 'Medical',
                        type: 'group',
                        visible: true
                    },
                    Hazard: {
                        name: 'Hazard',
                        type: 'group',
                        visible: true
                    },
                    Accident: {
                        name: 'Accident',
                        type: 'group',
                        visible: true
                    }
                }
            }
        });
        this.loadAlertsAsync();
        this.loadAsyncMobileVideos();
    };

    loadAlertsAsync() {
        this.mapDetails = {};
        this.messagelist.subscribe((entries)=> {
            this.alertMessages = entries.map((entry)=> {
                var list = this.connection.record.getRecord(entry);
                list.subscribe((data) => {
                    console.log(data.type);
                    var incidentType = data.incidentType;
                    if (data.type !== 'incident') {
                        if (this.mapDetails[incidentType] === undefined) {
                            this.mapDetails[incidentType] = {};
                        }
                        this.mapDetails[incidentType][data.incidentId] = {
                            lat: data.location.latitude,
                            lng: data.location.longitude,
                            message: data.location.latitude + "," + data.location.longitude,
                            draggable: false,
                            icon: {
                                iconUrl: "",
                            }
                        };

                        this.mapDetails[incidentType][data.incidentId].draggable = false;
                        this.mapDetails[incidentType][data.incidentId].icon.iconUrl = 'img/location-pointer.png';
                        this.mapDetails[incidentType][data.incidentId].icon.iconSize = [24, 24];
                        console.log(incidentType);
                        if (incidentType === 'Hazard') {
                            this.mapDetails[incidentType][data.incidentId].icon.iconUrl = 'img/hazard-location.png';
                        }
                        if (incidentType === 'Accident') {
                            this.mapDetails[incidentType][data.incidentId].icon.iconUrl = 'img/location-pointer.png';
                        }
                        if (incidentType === 'Fire') {
                            this.mapDetails[incidentType][data.incidentId].icon.iconUrl = 'img/fire-location.png';
                        }
                        if (incidentType === 'Police') {
                            this.mapDetails[incidentType][data.incidentId].icon.iconUrl = 'img/police-location.png';
                        }
                        if (incidentType === 'Medical') {
                            this.mapDetails[incidentType][data.incidentId].icon.iconUrl = 'img/medical-location.png';
                        }
                        console.log(this.mapDetails);
                    }
                    else {
                        console.log(this.mapDetails);
                        if (this.mapDetails[incidentType][data.incidentId] !== undefined) {
                            delete this.mapDetails[incidentType][data.incidentId];
                        }
                    }
                });
                return list;
            });

            angular.extend(this, {
                center: {
                    lat: 12.97,
                    lng: 77.56,
                    zoom: 10
                },
                markers: this.mapDetails,
                layers: {
                    baselayers: {
                        googleTerrain: {
                            name: 'Google Terrain',
                            layerType: 'TERRAIN',
                            type: 'google'
                        },
                        googleHybrid: {
                            name: 'Google Hybrid',
                            layerType: 'HYBRID',
                            type: 'google'
                        },
                        googleRoadmap: {
                            name: 'Google Streets',
                            layerType: 'ROADMAP',
                            type: 'google'
                        }
                    },
                    overlays: {
                        Fire: {
                            name: 'Fire',
                            type: 'group',
                            visible: true
                        },
                        Police: {
                            name: 'Police',
                            type: 'group',
                            visible: true
                        },
                        Medical: {
                            name: 'Medical',
                            type: 'group',
                            visible: true
                        },
                        Hazard: {
                            name: 'Hazard',
                            type: 'group',
                            visible: true
                        },
                        Accident: {
                            name: 'Accident',
                            type: 'group',
                            visible: true
                        }
                    }
                }
            });
        });
    };

    deleteRecordFromList(recordName, incidentId) {
        console.log(incidentId);
        console.log(i);
        delete this.mapDetails[incidentId];
         console.log(this.mapDetails);
         console.log("recordName : " + recordName);
         this.connection.record.getRecord(recordName).delete();
         this.messagelist.removeEntry(recordName);

         //this.alertService.deleteRecordFromDB({incidentId : incidentId});
        this.toaster.pop('success', "Delete Incident", "Incident id :" + incidentId + " deleted.");
    }

    setIncidentId(incidentId) {
        this.selectIncidentId = incidentId;
    }

    loadAsyncMobileVideos() {
        this.url = "rtmp://192.168.1.101:1935/Sandeep-live-demo";
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

        $("#flowplayer4").flowplayer({
            live: true,
            swf: "video/flowplayer.swf",
            rtmp: this.url,
            playlist: [[{
                flash: this.file
            }]]
        });

        // Surv--Camera
        $("#surveillanceCamera1").flowplayer({
            live: true,
            swf: "video/flowplayer.swf",
            rtmp: this.url,
            playlist: [[{
                flash: this.file
            }]]
        });

        $("#surveillanceCamera2").flowplayer({
            live: true,
            swf: "video/flowplayer.swf",
            rtmp: this.url,
            playlist: [[{
                flash: this.file
            }]]
        });

        $("#surveillanceCamera3").flowplayer({
            live: true,
            swf: "video/flowplayer.swf",
            rtmp: this.url,
            playlist: [[{
                flash: this.file
            }]]
        });
        $("#surveillanceCamera4").flowplayer({
            live: true,
            swf: "video/flowplayer.swf",
            rtmp: this.url,
            playlist: [[{
                flash: this.file
            }]]
        });
    };
}

AlertController.$inject = ['AlertService', 'CommonService', 'DeepStreamService', 'toaster'];
export default controllerModule.controller('AlertController', AlertController).name;