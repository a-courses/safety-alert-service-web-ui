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
                    if (data.incidentId) {
                        var incId = data.incidentId.replace(/[^a-zA-Z0-9]/g, "");
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

        /*var oldRecords = ['alerts/j38pqt3f-1c555dc4ttu',
            'alerts/j3i7okbp-13n43kwr9toi',
            'alerts/j3i7sn5o-h9gkd8zsz3i',
            'alerts/j3i9w9h3-2n3hjucia6g',
            'alerts/j3ia2cao-2kst1jgduua',
            'alerts/j3ianfh9-zfyjuk7lfxi',
            'alerts/j3iapixk-jfhiz7f20o9',
            'alerts/j3iaqfuq-2bnqrs3swhl',
            'alerts/j3iart99-2n1v9zxe54s',
            'alerts/j3ib06f8-21tr1qj2qkc',
            'alerts/j3ib1egf-bqepzm4o6d9',
            'alerts/j3ib3go6-9zd2gtqiqdmi',
            'alerts/j3ibwp1e-6b6ib36cwf4i',
            'alerts/j3ih16y8-di00l2jnwl',
            'alerts/j428unk7-2b762fg3gzr',
            'alerts/j428wrwh-2ndeq8u0xla',
            'alerts/j4imwo0g-249cv9hptxx',
            'alerts/j4imwxhy-s0ss59y409',
            'alerts/j4imx3p4-13hbsmd1fvs',
            'alerts/j4imxebu-1kom4os6rxn',
            'alerts/j4imxk0g-14eppnnx9v3',
            'alerts/j4imxunn-13m1qq3gil2i',
            'alerts/j4imy0a3-1hp5xrenft3',
            'alerts/j4imy3ml-2zwrg8zh6tr',
            'alerts/j4imyjyx-mnwgnivts5cdi',
            'alerts/j4imyzgw-rrj50axnpli',
            'alerts/j4imzfkc-2dmw8vgsyg0',
            'alerts/j4imzfrl-2cwp6na1m8h',
            'alerts/j4imzlp6-2dgfi1qzxn3',
            'alerts/j4imzvys-rvtkk4hhrs',
            'alerts/j4in0c9u-bf7bxj8yv7r',
            'alerts/j4in0sk2-1e60ywd1asj',
            'alerts/j4in2n7v-f61i02c54x9',
            'alerts/j4in33u0-18scybf3kx0',
            'alerts/j4in3ins-vd12dhbp1ni',
            'alerts/j4in3k3l-1e76me91it1',
            'alerts/j4in3znr-2p7b7i1h9oc',
            'alerts/j4in40lb-47u6pcwue9k9',
            'alerts/j4in4fye-1fer8h6iyjd',
            'alerts/j4in4wr0-1sh691vobgp',
            'alerts/j4in7egq-168cgj6msrhi',
            'alerts/j4in7uqx-8rdam6bf48mi',
            'alerts/j4in7xt2-4ca7i6p5vu9',
            'alerts/j4in8b1g-a9w0hnd1ogr',
            'alerts/j4in8e34-1aj527ytrmt',
            'alerts/j4in8ql9-1yqt3bijna4',
            'alerts/j4in8rft-kwdj7o72u4r',
            'alerts/j4in8tl0-5zf5vujp9fdi',
            'alerts/j4in96xw-1k54d2jq3td',
            'alerts/j4in99xj-r2yn68kqaqi',
            'alerts/j4in9i6t-1sembg7khpc',
            'alerts/j4in9n84-16bcjjodkfxi',
            'alerts/j4in9yke-1hrjlkfoyq4',
            'alerts/j4ina3j7-e39fvua5hai',
            'alerts/j4inaetw-ihlbcfuoxb9',
            'alerts/j4inapfx-xlyy9k6kg3',
            'alerts/j4inauc4-12z5194ql32',
            'alerts/j4inb5qx-2edemrx5ee5',
            'alerts/j4inbm35-2o26tddy48u',
            'alerts/j4inc2io-5hpudhflqi4i',
            'alerts/j4inf060-28gzrc9awg5',
            'alerts/j4infggv-vn6b0ie4zqi',
            'alerts/j4infwqc-rjfvt8o6zx',
            'alerts/j4ingczw-2mxdtrfbvnk',
            'alerts/j4inunui-2n1isiozw8e',
            'alerts/j4inymiv-14fu5ggy5odi',
            'alerts/j4inysbd-s90mqnyd3d',
            'alerts/j4inz248-bo4mmwoalp9',
            'alerts/j4inzii8-2h2qjvr10zw',
            'alerts/j4inzysa-2a0hov1bkul',
            'alerts/j4ioitt9-1zs7uf58hv6',
        ];
        for(var i in oldRecords){
            console.log(oldRecords[i]);
            this.connection.record.getRecord(oldRecords[i]).delete();
        }*/
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

    saveMappedIncidents(recordName, incidentId, id, notificationType) {
        console.log(id);
        console.log(notificationType);
        var alert = {};
        if (notificationType === 'call') {
            alert = {
                id: '',
                time: '2017-06-19T22:40:02.486Z',
                name: '',
                parentAlert: [
                    {
                        alertType: 'call',
                        alertId: id,
                        caller: {},
                        callee: {},
                        location: {},
                        status: '',
                        mediaType: '',
                        incidentType: '',
                        time: '',
                        incidentId: ''
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
                time: '2017-06-19T22:40:02.486Z',
                name: '',
                parentAlert: [
                    {
                        alertType: 'file',
                        alertId: id,
                        user: {},
                        status: '',
                        mediaType: '',
                        incidentType: '',
                        time: '',
                        incidentId: ''
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
            console.log(result);
            if (result.data.message === 'success') {
                console.log("recordName : " + recordName);
                this.connection.record.getRecord(recordName).delete();
                this.messagelist.removeEntry(recordName);
                this.toaster.pop("success", "Incident created")
            } else {
                this.toaster.pop("error", "Error while creating incident created");
            }
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