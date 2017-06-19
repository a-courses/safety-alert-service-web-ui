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
        this.mappingIncidentIds = [];
        this.mapDetails = {};
        this.multiple = {
            incidents: []
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
                    console.log(data.notificationType);
                    var incidentType = data.incidentType;
                    if (data.notificationType !== 'incident') {
                        if (this.mapDetails[incidentType] === undefined) {
                            this.mapDetails[incidentType] = {};
                        }
                        this.mapDetails[incidentType][data.incidentId] = {
                            lat: data.location.latitude,
                            lng: data.location.longitude,
                            message: data.location.latitude + "," + data.location.longitude,
                            draggable: false,
                            icon: {
                                iconUrl: '',
                            }
                        };
                        if (_.indexOf(this.mappingIncidentIds, data.incidentId) === -1) {
                            this.mappingIncidentIds.push(data.incidentId);
                        }
                        this.mapDetails[incidentType][data.incidentId].draggable = false;
                        this.mapDetails[incidentType][data.incidentId].icon.iconUrl = 'img/location-pointer.png';
                        this.mapDetails[incidentType][data.incidentId].icon.iconSize = [24, 24];
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
                    }
                    else {
                        if (data.notificationType !== 'incident' && this.mapDetails[incidentType][data.incidentId] !== undefined) {
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

    deleteRecordFromList(recordName, id, alertType) {
        var alertData = {};
        if (alertType === 'upload' || alertType === 'stream') {
            alertData = {
                notificationType: alertType,
                id: id,
                url: '',
                fileName: '',
                user: {
                    phoneNumber: '',
                    emailId: '',
                    userName: ''
                },
                location: {
                    latitude: '',
                    longitude: ''
                },
                status: 'read',
                mediaType: '',
                incidentType: '',
                time: '',
                incidentId: ''
            }
        }
        if (alertType === 'call') {
            alertData = {
                notificationType: alertType,
                id: id,
                caller: {
                    phoneNumber: '',
                    emailId: '',
                    userName: ''
                },
                callee: {
                    phoneNumber: '',
                    emailId: '',
                    userName: ''
                },
                location: {
                    latitude: '',
                    longitude: ''
                },
                status: "read",
                mediaType: '',
                incidentType: '',
                time: '',
                incidentId: ''
            }
        }
        console.log(id);
        this.alertService.deleteRecordFromDB(alertData).then((result)=> {
            console.log("result");
            console.log(result.data.message);
            if (result.data.message === "success") {
                delete this.mapDetails[id];
                console.log(this.mapDetails);
                console.log("recordName : " + recordName);
                this.connection.record.getRecord(recordName).delete();
                this.messagelist.removeEntry(recordName);
                this.toaster.pop("success", id + " deleted")
            } else {
                this.toaster.pop("error", "Error while delete")
            }

        });
        // this.toaster.pop('success', "Delete Incident", "Incident id :" + incidentId + " deleted.");
    }

    setIncidentId(incidentId, id, notificationType) {
        this.selectIncidentId = incidentId;
        this.selectNotificationType = notificationType;
        console.log(this.selectIncidentId);
        console.log(this.selectNotificationType);
        this.mappingIncidentIdsWithoutParent = _.without(this.mappingIncidentIds, incidentId);
        this.multiple = {
            incidents: []
        };
    }

    saveMappedIncidents(id, notificationType) {
        // console.log(id);
        // console.log(notificationType);
        var alert
        if (notificationType === 'call') {
            alert = {
                id: '',
                time: new Date().getDate(),
                name: "testIncident",
                parentAlert: [
                    {
                        notificationType: notificationType,
                        alert: {
                            id: id,
                            caller: {},
                            callee: {},
                            location: {},
                            status: '',
                            mediaType: '',
                            incidentType: '',
                            time: '',
                            incidentId: ''
                        }
                    }
                ],
                mappedAlerts: [],
                createdBy: '',
                description: '',
                status: '',
                assignedTo: [],
                alertUsers: []
            }
        } else {
            alert = {
                id: '',
                time: new Date().getDate(),
                name: "testIncident",
                parentAlert: [
                    {
                        notificationType: notificationType,
                        alert: {
                            id: id,
                            user: {},
                            status: '',
                            mediaType: '',
                            incidentType: '',
                            time: '',
                            incidentId: ''
                        }
                    }
                ],
                mappedAlerts: [],
                createdBy: '',
                description: '',
                status: '',
                assignedTo: [],
                alertUsers: []
            }
        }
        console.log(alert);
        this.alertService.saveMappedIncidents(alert).then((result)=> {
            console.log(result.data.message);
        })
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