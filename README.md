
# https://www.wowza.com/docs/how-to-use-flowplayer-with-wowza-media-server-software
# https://www.wowza.com/docs/how-to-use-jw-player-with-adaptive-bitrate-streaming-from-wowza-streaming-engine
# https://www.similartech.com/compare/flowplayer-vs-jw-player
# https://www.versioneye.com/javascript/incuna:angular-flowplayer/1.2.1
# https://www.wowza.com/docs/how-to-use-flowplayer-with-wowza-media-server-software
# https://deepstream.io/blog/publishing-aws-sns-messages-to-browsers-tutorial/
# http://angular-ui.github.io/ui-leaflet/examples/0000-viewer.html#/basic/first-example
# https://deepstreamhub.com/tutorials/getting-started/angularjs/
# https://www.codementor.io/christiannwamba/building-real-time-chat-angular-deepstream-4miwit44u

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
             });
            */



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