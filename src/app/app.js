import angular from 'angular';
import 'angular-route';
import 'angular-sanitize';
import 'angular-messages';
// Material design css
import 'angular-material/angular-material.css';
// Icons
import 'font-awesome/css/font-awesome.css';
// Animation
import 'angular-animate';
import 'angular-aria';
// Materail Design lib
import 'angular-material';
import '../style/app.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap'

import 'angular-simple-logger';
import 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'ui-leaflet';

import './common/ControllerModule';
import './common/ServiceModule';
import './alerts/AlertController';
import deepstream from 'deepstream.io-client-js';
const MODULE_NAME = 'SafetyServiceModule';

angular.module(MODULE_NAME, ['ngMaterial', 'ui-leaflet', 'ngRoute', 'ngMessages', 'ngSanitize', 'ControllerModule','ServiceModule'])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/partials/Alerts.html',
                controller: 'AlertController as ac'
            })
            .otherwise("/");
        $locationProvider.html5Mode(true);
    }]);

export default MODULE_NAME;