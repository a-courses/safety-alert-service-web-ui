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
                zoom: 12
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
        this.alertMessageList = [];
        this.mapDetails = {};
        this.messagelist.subscribe((entries)=> {
            this.alertMessages = entries.map((entry)=> {
                var list = this.connection.record.getRecord(entry);
                list.subscribe((data) => {
                    console.log("-----------------------------------------------------------------");
                    console.log("Load alerts : notificationType :" + data.notificationType + " | id :" + data.id);
                    var incidentType = data.incidentType;
                    var recordName = list.name;
                    if (data.id) {
                        this.alertMessageList = _.reject(this.alertMessageList, function (currentItem) {
                            if (currentItem.id === data.id && currentItem.modifiedTime !== data.modifiedTime) {
                                console.log("Load alerts : remove record message list : " + recordName);
                            }
                            return currentItem.id === data.id && currentItem.modifiedTime !== data.modifiedTime;
                        });
                        var incId = data.id.replace(/[^a-zA-Z0-9]/g, "");
                        if (data.notificationType !== 'incident') {
                            if (this.mapDetails[incidentType] === undefined) {
                                this.mapDetails[incidentType] = {};
                            }
                            this.mapDetails[incidentType][incId] = {
                                lat: data.location.latitude,
                                lng: data.location.longitude,
                                message: data.location.latitude + "," + data.location.longitude,
                                draggable: false,
                                icon: {
                                    iconUrl: '',
                                }
                            };
                            if (_.indexOf(this.mappingIncidentIds, incId) === -1) {
                                this.mappingIncidentIds.push(incId);
                            }
                            this.mapDetails[incidentType][incId].draggable = false;
                            this.mapDetails[incidentType][incId].icon.iconUrl = 'img/location-pointer.png';
                            this.mapDetails[incidentType][incId].icon.iconSize = [24, 24];
                            if (incidentType === 'Hazard') {
                                this.mapDetails[incidentType][incId].icon.iconUrl = 'img/hazard-location.png';
                            }
                            if (incidentType === 'Accident') {
                                this.mapDetails[incidentType][incId].icon.iconUrl = 'img/location-pointer.png';
                            }
                            if (incidentType === 'Fire') {
                                this.mapDetails[incidentType][incId].icon.iconUrl = 'img/fire-location.png';
                            }
                            if (incidentType === 'Police') {
                                this.mapDetails[incidentType][incId].icon.iconUrl = 'img/police-location.png';
                            }
                            if (incidentType === 'Medical') {
                                this.mapDetails[incidentType][incId].icon.iconUrl = 'img/medical-location.png';
                            }
                        }
                        else {
                            if (data.notificationType !== 'incident' && this.mapDetails[incidentType][incId] !== undefined) {
                                delete this.mapDetails[incidentType][incId];
                            }
                        }

                        if (data.notificationType === 'upload' || data.notificationType === 'stream') {
                            console.log("Load alerts : Create UPLOAD/STREAM : " + data.notificationType + " | record name :" + recordName);
                            var uploadData = {
                                name: recordName,
                                notificationType: data.notificationType,
                                id: data.id,
                                url: data.url,
                                fileName: data.fileName,
                                user: {
                                    phoneNumber: data.user.phoneNumber,
                                    emailId: data.user.emailId,
                                    userName: data.user.userName
                                },
                                location: {
                                    latitude: data.location.latitude,
                                    longitude: data.location.longitude
                                },
                                status: data.status,
                                mediaType: data.mediaType,
                                incidentType: data.incidentType,
                                time: data.time,
                                modifiedTime: data.modifiedTime,
                                incidentId: data.incidentId
                            };
                            this.alertMessageList.push(uploadData);
                            console.log("UPLOAD/STREAM alert added");
                        }
                        if (data.notificationType === 'call') {
                            console.log("Load alerts : Create CALL :" + data.notificationType + " | record name :" + recordName);
                            var callData = {
                                name: recordName,
                                notificationType: data.notificationType,
                                id: data.id,
                                caller: {
                                    phoneNumber: data.caller.phoneNumber,
                                    emailId: data.caller.emailId,
                                    userName: data.caller.userName
                                },
                                callee: {
                                    phoneNumber: data.callee.phoneNumber,
                                    emailId: data.callee.emailId,
                                    userName: data.callee.userName
                                },
                                location: {
                                    latitude: data.location.latitude,
                                    longitude: data.location.longitude
                                },
                                status: data.status,
                                mediaType: data.mediaType,
                                incidentType: data.incidentType,
                                time: data.time,
                                modifiedTime: data.modifiedTime,
                                incidentId: data.incidentId
                            };
                            this.alertMessageList.push(callData);
                            console.log("CALL alert added");
                        }
                    }
                    if (data.notificationType === 'incident') {
                        console.log("Load alerts : Create incident " + data.notificationType + " | record name :" + recordName);
                        var parentAlerts = [];
                        var assignedToList = [];
                        var alertUsersList = [];
                        var mappedAlertList = [];
                        if (data.alert.parentAlert) {
                            for (var i in data.alert.parentAlert) {
                                console.log(data.alert.parentAlert[i].alertType);
                                var singleAlert = {};
                                if (data.alert.parentAlert[i].alertType === 'call') {
                                    singleAlert = {
                                        alertId: data.alert.parentAlert[i].alertId,
                                        alertType: 'call',
                                        caller: {
                                            phoneNumber: data.alert.parentAlert[i].caller.phoneNumber,
                                            emailId: data.alert.parentAlert[i].caller.emailId,
                                            userName: data.alert.parentAlert[i].caller.userName
                                        },
                                        callee: {
                                            phoneNumber: data.alert.parentAlert[i].callee.phoneNumber,
                                            emailId: data.alert.parentAlert[i].callee.emailId,
                                            userName: data.alert.parentAlert[i].callee.userName
                                        },
                                        location: {
                                            latitude: data.alert.parentAlert[i].location.latitude,
                                            longitude: data.alert.parentAlert[i].location.longitude
                                        }
                                    };
                                } else {
                                    singleAlert = {
                                        alertId: data.alert.parentAlert[i].alertId,
                                        alertType: 'file',
                                        user: {
                                            phoneNumber: data.alert.parentAlert[i].user.phoneNumber,
                                            emailId: data.alert.parentAlert[i].user.emailId,
                                            userName: data.alert.parentAlert[i].user.userName
                                        },
                                        location: {
                                            latitude: data.alert.parentAlert[i].location.latitude,
                                            longitude: data.alert.parentAlert[i].location.longitude
                                        }
                                    };
                                }
                                parentAlerts.push(singleAlert);
                            }
                        }
                        if (data.alert.mappedAlerts) {
                            for (var i in data.alert.mappedAlerts) {
                                var singleAlert = {};
                                if (data.alert.parentAlert[i].alertType === 'call') {
                                    singleAlert = {
                                        alertId: data.alert.parentAlert[i].alertId,
                                        alertType: 'call',
                                        caller: {
                                            phoneNumber: data.alert.parentAlert[i].caller.phoneNumber,
                                            emailId: data.alert.parentAlert[i].caller.emailId,
                                            userName: data.alert.parentAlert[i].caller.userName
                                        },
                                        callee: {
                                            phoneNumber: data.alert.parentAlert[i].callee.phoneNumber,
                                            emailId: data.alert.parentAlert[i].callee.emailId,
                                            userName: data.alert.parentAlert[i].callee.userName
                                        },
                                        location: {
                                            latitude: data.alert.parentAlert[i].location.latitude,
                                            longitude: data.alert.parentAlert[i].location.longitude
                                        }
                                    };
                                } else {
                                    singleAlert = {
                                        alertId: data.alert.parentAlert[i].alertId,
                                        alertType: 'file',
                                        user: {
                                            phoneNumber: data.alert.parentAlert[i].user.phoneNumber,
                                            emailId: data.alert.parentAlert[i].user.emailId,
                                            userName: data.alert.parentAlert[i].user.userName
                                        },
                                        location: {
                                            latitude: data.alert.parentAlert[i].location.latitude,
                                            longitude: data.alert.parentAlert[i].location.longitude
                                        }
                                    };
                                }
                                mappedAlertList.push(singleAlert);
                            }
                        }
                        if (data.alert.assignedTo) {
                            for (var i in data.alert.assignedTo) {
                                var assign = {
                                    phoneNumber: data.alert.assignedTo[i].phoneNumber,
                                    emailId: data.alert.assignedTo[i].emailId,
                                    userName: data.alert.assignedTo[i].userName
                                };
                                assignedToList.push(assign);
                            }
                        }
                        if (data.alert.alertUsers) {
                            for (var i in data.alert.alertUsers) {
                                var user = {
                                    phoneNumber: data.alert.alertUsers[i].phoneNumber,
                                    emailId: data.alert.alertUsers[i].emailId,
                                    userName: data.alert.alertUsers[i].userName
                                };
                                alertUsersList.push(user);
                            }
                        }
                        var incidentData = {
                            notificationType: data.notificationType,
                            alert: {
                                id: data.alert.id,
                                time: data.alert.time,
                                modifiedTime: data.alert.modifiedTime,
                                name: data.alert.name,
                                parentAlert: parentAlerts,
                                mappedAlerts: data.alert.mappedAlerts,
                                createdBy: data.alert.createdBy,
                                description: data.alert.description,
                                status: data.alert.status,
                                assignedTo: assignedToList,
                                alertUsers: alertUsersList
                            }
                        };
                        this.alertMessageList.push(incidentData);
                        console.log("INCIDENT alert added");
                    }
                    console.log("=================================================================");
                });
                return list;
            });

            angular.extend(this, {
                center: {
                    lat: 12.97,
                    lng: 77.56,
                    zoom: 12
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
        console.log("Alert Delete service request body : ", alertData);
        this.alertService.deleteRecordFromDB(alertData).then((result)=> {
            console.log("Alert Delete service response body : ", result.data.message);
            if (result.data.message === "success") {
                var incId = id.replace(/[^a-zA-Z0-9]/g, "");
                delete this.mapDetails[incId];
                console.log("Delete alert : mapDetails marker details :", this.mapDetails);
                this.connection.record.getRecord(recordName).delete();
                this.messagelist.removeEntry(recordName);
                this.alertMessageList = _.reject(this.alertMessageList, function (currentItem) {
                    if (currentItem.id === id) {
                        console.log("Delete alert : recordName : " + recordName);
                    }
                    return currentItem.id === id;
                });
                this.toaster.pop("success", id + " : Record Removed!");
            } else {
                this.toaster.pop("error", "Error while delete : " + id);
            }

        });

        // this.deleteAbsoluteRecords();
    }

    saveMappedIncidents(recordName, incidentId, id, notificationType) {
        console.log("Link incident : " + id + " type:" + notificationType + " and recordName :" + recordName);
        var alert = {};
        if (notificationType === 'call') {
            alert = {
                id: '',
                time: new Date(),
                modifiedTime: new Date(),
                parentAlert: [
                    {
                        alertType: 'call',
                        alertId: id
                    }
                ]
            }
        } else {
            alert = {
                id: '',
                time: new Date(),
                modifiedTime: new Date(),
                parentAlert: [
                    {
                        alertType: 'file',
                        alertId: id
                    }
                ]
            }
        }
        console.log("Link alerts request body : ", alert);
        this.alertService.saveMappedIncidents(alert).then((result)=> {
            console.log("Link alerts response body : ", result);
            if (result.data.message === 'success') {
                this.connection.record.getRecord(recordName).delete();
                this.messagelist.removeEntry(recordName);
                this.toaster.pop("success", "Incident created")
            } else {
                this.toaster.pop("error", "Error while creating incident created : " + id);
            }
        })
    }

    loadAsyncMobileVideos() {
        this.alertService.getRTMPip().then((data)=> {
            console.log("RTMP IP address : " +data.rtmpIp);
            this.url = "rtmp://" + data.rtmpIp + ":1935/live";

            console.log("RTMP url : " +this.url);
            // this.url = "rtmp://54.169.237.13:1935/live/919845145035";
            // this.url = "rtmp://192.168.1.101:1935/Sandeep-live-demo";

            this.mobileVideoFileOne = "919845145035";
            this.mobileVideoFileTwo = "919845145035";
            this.mobileVideoFileThree = "919845145035";
            this.mobileVideoFileFour = "919845145035";
            /* $("#flowplayer1").flowplayer({
             live: true,
             swf: "video/flowplayer.swf",
             rtmp: this.url,
             playlist: [[{
             flash: this.file
             }]]
             });*/

            $("#flowplayer2").flowplayer({
                live: true,
                swf: "video/flowplayer.swf",
                rtmp: this.url,
                playlist: [[{
                    flash: this.mobileVideoFileOne
                }]]
            });

            $("#flowplayer3").flowplayer({
                live: true,
                swf: "video/flowplayer.swf",
                rtmp: this.url,
                playlist: [[{
                    flash: this.mobileVideoFileTwo
                }]]
            });

            $("#flowplayer4").flowplayer({
                live: true,
                swf: "video/flowplayer.swf",
                rtmp: this.url,
                playlist: [[{
                    flash: this.mobileVideoFileThree
                }]]
            });

            // Surv--Camera
            $("#surveillanceCamera1").flowplayer({
                live: true,
                swf: "video/flowplayer.swf",
                rtmp: this.url,
                playlist: [[{
                    flash: this.mobileVideoFileFour
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
        });
    };

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

    deleteAbsoluteRecords() {
        /*   var incId = id.replace(/[^a-zA-Z0-9]/g, "");
         delete this.mapDetails[incId];
         console.log(this.mapDetails);
         console.log("recordName : " + recordName);
         this.connection.record.getRecord(recordName).delete();
         this.messagelist.removeEntry(recordName);
         this.toaster.pop("success", id + " deleted");*/

        var oldRecords = ['alerts/j38pqt3f-1c555dc4ttu',
            'alerts/j3i5iv30-2fv5vt08ey6',
            'alerts/j4imwhz8-27zc0zotrb3',
            'alerts/j4l7sgsr-1nyvux57jvt9',
            'alerts/j4l7sx1w-5plz21yrq3mi',
            'alerts/j4l7tdbc-1yxrn1tyiax',
            'alerts/j4l7ttna-1ooouo1irkm',
            'alerts/j4l7zpon-tnlrtbxxee',
            'alerts/j4l805zh-snognwdjq5i',
            'alerts/j4l80lh0-1rhnir45sq5',
            'alerts/j4l811qh-2jmo33hhtpk',
            'alerts/j4l89gz7-np908jor3ei',
            'alerts/j4l89wiq-hg2rp7wx9x',
            'alerts/j4l8ae15-1y6sw003ukb',
            'alerts/j4l8au6f-1028rrygr2g',
            'alerts/j4l8mo9g-76c0hp23m5i',
            'alerts/j4l8mo9y-l7x81b7s45i',
            'alerts/j4lb6rlv-1yr0bu4vg2e',
            'alerts/j4lb7826-yy30gjuq5h',
            'alerts/j4lb7obq-bt7v4rknyni',
            'alerts/j4lb84mr-257yllls3r4'
        ];
        for (var i in oldRecords) {
            console.log(oldRecords[i]);
            this.connection.record.getRecord(oldRecords[i]).delete();
        }
    }
}

AlertController.$inject = ['AlertService', 'CommonService', 'DeepStreamService', 'toaster'];
export default controllerModule.controller('AlertController', AlertController).name;