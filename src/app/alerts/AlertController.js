import AlertService from './AlertService';
import controllerModule from '../common/ControllerModule';
import DeepStreamService from '../common/DeepStreamService';
import _ from 'underscore';
import moment from 'moment';

class AlertController {
    constructor(AlertService, CommonService, DeepStreamService, toaster) {
        this.toaster = toaster;
        this.alertService = AlertService;
        this.commonService = CommonService;
        this.deepStreamService = DeepStreamService;
        this.alertMessages = [];
        this.mappingIncidentIds = [];
        this.mapDetails = {};
        this.imageURL = [];
        this.uploadStreamList = [];
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
    };

    loadAlertsAsync() {
        console.log("date  :");
        var offset = moment().utcOffset();
        console.log(offset);
        this.alertMessageList = [];
        this.mapDetails = {};
        this.messagelist.subscribe((entries) => {
            this.alertMessages = entries.map((entry) => {
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
                                time: moment.utc(data.time).utcOffset(offset).format('YYYY-MM-DDTHH:mm:ss'),
                                modifiedTime: moment.utc(data.modifiedTime).utcOffset(offset).format('YYYY-MM-DDTHH:mm:ss'),
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
                                time: moment.utc(data.time).utcOffset(offset).format('YYYY-MM-DDTHH:mm:ss'),
                                modifiedTime: moment.utc(data.modifiedTime).utcOffset(offset).format('YYYY-MM-DDTHH:mm:ss'),
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
                                time: moment.utc(data.time).utcOffset(offset).format('YYYY-MM-DDTHH:mm:ss'),
                                modifiedTime: moment.utc(data.modifiedTime).utcOffset(offset).format('YYYY-MM-DDTHH:mm:ss'),
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
                    this.alertMessageList = _.sortBy(this.alertMessageList, 'modifiedTime').reverse();
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
        this.alertService.deleteRecordFromDB(alertData).then((result) => {
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
                time: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
                modifiedTime: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
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
                time: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
                modifiedTime: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
                parentAlert: [
                    {
                        alertType: 'file',
                        alertId: id
                    }
                ]
            }
        }
        console.log("Link alerts request body : ", alert);
        this.alertService.saveMappedIncidents(alert).then((result) => {
            console.log("Link alerts response body : ", result);
            if (result.data.message === 'success') {
                this.connection.record.getRecord(recordName).delete();
                this.messagelist.removeEntry(recordName);
                this.alertMessageList = _.reject(this.alertMessageList, function (currentItem) {
                    if (currentItem.id === id) {
                        console.log("Delete Linked alert : recordName : " + recordName);
                    }
                    return currentItem.id === id;
                });
                this.toaster.pop("success", "Incident created")
            } else {
                this.toaster.pop("error", "Error while creating incident created : " + id);
            }
        })
    }

    loadAsyncMobileVideos() {
        this.messagelist.subscribe((entries) => {
            var messages = entries.map((entry) => {
                var list = this.connection.record.getRecord(entry);
                list.subscribe((data) => {
                    console.log("-----------------------------------------------------------------");
                    console.log("UPLOAD STREAM LIST : notificationType :" + data.notificationType + " | id :" + data.id);
                    var incidentType = data.incidentType;
                    var recordName = list.name;
                    if (data.id) {
                        this.uploadStreamList = _.reject(this.uploadStreamList, function (currentItem) {
                            if (currentItem.id === data.id) {
                                console.log("UPLOAD STREAM LIST : remove record message list : " + recordName);
                            }
                            return currentItem.id === data.id;
                        });
                        if (data.notificationType === 'upload' || data.notificationType === 'stream') {
                            console.log("UPLOAD STREAM LIST : Create UPLOAD/STREAM : " + data.notificationType + " | record name :" + recordName);
                            if (data.mediaType.indexOf("image") !== -1 || data.mediaType.indexOf("jpeg") !== -1
                                || data.mediaType.indexOf("video") !== -1 || data.mediaType.indexOf("streaming") !== -1
                                && data.modifiedTime !== undefined) {
                                var uploadData = {
                                    id: data.id,
                                    url: data.url,
                                    fileName: data.fileName,
                                    phoneNumber: data.user.phoneNumber,
                                    mediaType: data.mediaType,
                                    incidentType: data.incidentType,
                                    time: data.time,
                                    modifiedTime: data.modifiedTime
                                };
                                this.uploadStreamList.push(uploadData);
                                console.log("UPLOAD STREAM added");
                            }
                        }
                    }

                    this.uploadStreamList = _.sortBy(this.uploadStreamList, 'modifiedTime').reverse();
                    console.log("=================================================================");
                    console.log("this.uploadStreamList");
                    console.log(this.uploadStreamList);
                    this.imageURL = [];
                    _.each(this.uploadStreamList, (value, id) => {
                        if (id == 0) {
                            var elementById = document.getElementById("flowplayer" + id);
                            if (elementById) {
                                document.getElementById("mbVideosOne").removeChild(elementById);
                            }
                            var loadingTextIdOne = document.getElementById("loadingTextIdOne");
                            if (loadingTextIdOne) {
                                document.getElementById("mbVideosOne").removeChild(loadingTextIdOne);
                            }
                        } else {
                            var elementById = document.getElementById("flowplayer" + id);
                            if (elementById) {
                                document.getElementById("mbVideos").removeChild(elementById);
                            }
                            var loadingTextId = document.getElementById("loadingTextId");
                            if (loadingTextId) {
                                document.getElementById("mbVideos").removeChild(loadingTextId);
                            }
                        }

                    });
                    var urlArray = [];
                    _.each(this.uploadStreamList, (value, id) => {
                        if (id == 0) {
                            console.log("LOOPING : ", id);
                            if (value.mediaType.indexOf("streaming") !== -1 || value.mediaType.indexOf("video") !== -1) {
                                var URL = value.url.replace("rtsp", "rtmp"); //rtmp://54.169.237.13:1935/live/
                                console.log(URL, value.fileName);
                                if (!_.contains(urlArray, URL)) {
                                    var vidDiv = document.createElement('div');
                                    vidDiv.setAttribute("id", "flowplayer" + id);
                                    vidDiv.setAttribute("style", "padding: 0px!important");
                                    vidDiv.className = 'col-md-12';
                                    console.log("element : ", vidDiv);
                                    document.getElementById('mbVideosOne').appendChild(vidDiv);
                                    if (value.mediaType.indexOf("streaming") !== -1) {
                                        flowplayer(vidDiv, {
                                            hlsjs: true,
                                            live: true,
                                            autoplay: true,
                                            ratio: 9 / 16,
                                            swf: "video/flowplayer.swf",
                                            rtmp: URL,
                                            playlist: [[{
                                                flash: value.fileName
                                            }]]
                                        });
                                    }
                                    if (value.mediaType.indexOf("video") !== -1) {
                                        console.log("----------------------------", value.url);
                                        flowplayer(vidDiv, {
                                            swf: "video/flowplayer.swf",
                                            autoplay: true,
                                            ratio: 9 / 16,
                                            volume: 0.0,
                                            clip: {
                                                sources: [
                                                    {
                                                        type: "video/mp4", src: value.url
                                                    }
                                                ]
                                            }
                                        });
                                    }
                                    urlArray.push(URL);
                                }
                                // type: "video/mp4", src: "video/sanmay.mp4"}
                            } else {
                                var imgDiv = document.createElement('div');
                                imgDiv.setAttribute("id", "flowplayer" + id);
                                imgDiv.setAttribute("style", "padding: 0px!important");
                                imgDiv.className = 'col-md-12';
                                var imgTag = document.createElement('img');
                                imgTag.setAttribute('src', value.url);
                                imgTag.setAttribute("style", "width: inherit;height: inherit");
                                imgDiv.appendChild(imgTag);
                                console.log("element : ", imgDiv);
                                document.getElementById('mbVideosOne').appendChild(imgDiv);
                            }
                        }
                        if (id >= 1 && id <= 4) {
                            console.log("LOOPING : ", id);
                            if (value.mediaType.indexOf("streaming") !== -1 || value.mediaType.indexOf("video") !== -1) {
                                var URL = value.url.replace("rtsp", "rtmp"); //rtmp://54.169.237.13:1935/live/
                                console.log(URL, value.fileName);
                                if (!_.contains(urlArray, URL)) {
                                    var vidDiv = document.createElement('div');
                                    vidDiv.setAttribute("id", "flowplayer" + id);
                                    vidDiv.setAttribute("style", "padding: 0px!important");
                                    vidDiv.className = 'col-md-6 channel1';
                                    console.log("element : ", vidDiv);
                                    document.getElementById('mbVideos').appendChild(vidDiv);
                                    if (value.mediaType.indexOf("streaming") !== -1) {
                                        flowplayer(vidDiv, {
                                            hlsjs: true,
                                            live: true,
                                            autoplay: true,
                                            ratio: 9 / 16,
                                            swf: "video/flowplayer.swf",
                                            rtmp: URL,
                                            playlist: [[{
                                                flash: value.fileName
                                            }]]
                                        });
                                    }
                                    if (value.mediaType.indexOf("video") !== -1) {
                                        console.log("----------------------------", value.url);
                                        flowplayer(vidDiv, {
                                            swf: "video/flowplayer.swf",
                                            autoplay: true,
                                            ratio: 9 / 16,
                                            volume: 0.0,
                                            clip: {
                                                sources: [
                                                    {
                                                        type: "video/mp4", src: value.url
                                                    }
                                                ]
                                            }
                                        });
                                    }
                                    urlArray.push(URL);
                                }
                                // type: "video/mp4", src: "video/sanmay.mp4"}
                            } else {
                                var imgDiv = document.createElement('div');
                                imgDiv.setAttribute("id", "flowplayer" + id);
                                imgDiv.setAttribute("style", "padding: 0px!important");
                                imgDiv.className = 'col-md-6 channel1';
                                var imgTag = document.createElement('img');
                                imgTag.setAttribute('src', value.url);
                                imgTag.setAttribute("style", "width: inherit;height: inherit");
                                imgDiv.appendChild(imgTag);
                                console.log("element : ", imgDiv);
                                document.getElementById('mbVideos').appendChild(imgDiv);
                            }
                        }
                    })
                });
                return list;
            });
        });

        flowplayer("#CameraFeed1", {
            swf: "video/flowplayer.swf",
            autoplay: true,
            ratio: 9 / 16,
            volume: 0.0,
            clip: {
                sources: [
                    {
                        type: "video/mp4", src: "video/Camera Feed 1 - Liverpool  Shopping.mp4"
                    }
                ]
            }
        });

        flowplayer("#CameraFeed2", {
            swf: "video/flowplayer.swf",
            autoplay: true,
            ratio: 9 / 16,
            volume: 0.0,
            clip: {
                sources: [
                    {
                        type: "video/mp4", src: "video/Camera Feed 2 - Highway Car Video.mp4"
                    }
                ]
            }
        });

        flowplayer("#CameraFeed3", {
            swf: "video/flowplayer.swf",
            autoplay: true,
            ratio: 9 / 16,
            volume: 0.0,
            clip: {
                sources: [
                    {
                        type: "video/mp4", src: "video/Camera Feed 3 - Drone  Forest Fire.mp4"
                    }
                ]
            }
        });

        flowplayer("#CameraFeed4", {
            swf: "video/flowplayer.swf",
            autoplay: true,
            ratio: 9 / 16,
            volume: 0.0,
            clip: {
                sources: [
                    {
                        type: "video/mp4", src: "video/Camera Feed 4 - News Video.mp4"
                    }
                ]
            }
        });

        flowplayer("#socialFeed1", {
            swf: "video/flowplayer.swf",
            autoplay: true,
            ratio: 9 / 16,
            volume: 0.0,
            clip: {
                sources: [
                    {
                        type: "video/mp4", src: "video/Camera Feed 1 - Liverpool  Shopping.mp4"
                    }
                ]
            }
        });
        flowplayer("#socialFeed3", {
            swf: "video/flowplayer.swf",
            autoplay: true,
            ratio: 9 / 16,
            volume: 0.0,
            clip: {
                sources: [
                    {
                        type: "video/mp4", src: "video/Social Feed 3 - YouTube Screen Video.mp4"
                    }
                ]
            }
        });
        flowplayer("#VideoCamera1", {
            swf: "video/flowplayer.swf",
            autoplay: true,
            ratio: 9 / 16,
            volume: 0.0,
            clip: {
                sources: [
                    {
                        type: "video/mp4", src: "video/Meeting Video Feed.mp4"
                    }
                ]
            }
        });
        flowplayer("#sharing1", {
            swf: "video/flowplayer.swf",
            autoplay: true,
            ratio: 9 / 16,
            volume: 0.0,
            clip: {
                sources: [
                    {
                        type: "video/mp4", src: "video/Mobile Feed - Bus Stop.mp4"
                    }
                ]
            }
        });
        flowplayer("#sharing2", {
            swf: "video/flowplayer.swf",
            autoplay: true,
            ratio: 9 / 16,
            volume: 0.0,
            clip: {
                sources: [
                    {
                        type: "video/mp4", src: "video/Mobile Feed - Car Theft.mp4"
                    }
                ]
            }
        });
        flowplayer("#sharing3", {
            swf: "video/flowplayer.swf",
            autoplay: true,
            ratio: 9 / 16,
            volume: 0.0,
            clip: {
                sources: [
                    {
                        type: "video/mp4", src: "video/Social Feed 1 - Facebook Screen Video.mp4"
                    }
                ]
            }
        });
        flowplayer("#sharing4", {
            swf: "video/flowplayer.swf",
            autoplay: true,
            ratio: 9 / 16,
            volume: 0.0,
            clip: {
                sources: [
                    {
                        type: "video/mp4", src: "video/Camera Feed 3 - Drone  Forest Fire.mp4"
                    }
                ]
            }
        });
    };

    playVideo(streamList, index) {
        console.log(streamList);
        if (streamList.mediaType.indexOf("streaming") !== -1 || streamList.mediaType.indexOf("video") !== -1) {
            var URL = streamList.url.replace("rtsp", "rtmp");
            //rtmp://54.169.237.13:1935/live/
            console.log(URL);
            $("#flowplayer" + index).flowplayer({
                live: true,
                swf: "video/flowplayer.swf",
                rtmp: URL,
                playlist: [[{
                    flash: streamList.fileName
                }]]
            });
        } else {
            this.imageURL.push(streamList.url);
        }
        console.log(this.imageURL);
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

    deleteAbsoluteRecords() {
        /*   var incId = id.replace(/[^a-zA-Z0-9]/g, "");
         delete this.mapDetails[incId];
         console.log(this.mapDetails);
         console.log("recordName : " + recordName);
         this.connection.record.getRecord(recordName).delete();
         this.messagelist.removeEntry(recordName);
         this.toaster.pop("success", id + " deleted");*/

        var oldRecords = [
            'alerts/j38pqt3f-1c555dc4ttu',
            'alerts/ j38pqt3f-1c555dc4ttu'
        ];
        for (var i in oldRecords) {
            console.log(oldRecords[i]);
            this.connection.record.getRecord(oldRecords[i]).delete();
            // this.messagelist.removeEntry(oldRecords[i]);
        }
    }
}

AlertController.$inject = ['AlertService', 'CommonService', 'DeepStreamService', 'toaster'];
export default controllerModule.controller('AlertController', AlertController).name;