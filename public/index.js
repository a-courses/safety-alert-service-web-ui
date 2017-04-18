// Import angular
import 'angular';
// Material design css
import 'angular-material/angular-material.css';
// Icons
import 'font-awesome/css/font-awesome.css';
// Animation
import angularAnimate from 'angular-animate';
// Materail Design lib
import angularMaterial from 'angular-material';
// Router
import angularUIRouter from 'angular-ui-router';
// Our modules
import home from './home/home.module';
import sidenav from './sidenav/sidenav.module';

// Project specific style
import './scss/bootstrap.scss'

// Create our demo module
export const demoModule = angular.module('demo', [
    angularMaterial,
    angularAnimate,
    angularUIRouter,
    home,
    sidenav
]);

demoModule.config(($stateProvider) => {
    $stateProvider.state('public', {
        url: "/public",
        abstract: true,
        views: {
            'sidenav': {
                templateUrl: require("./sidenav/sidenav.html"),
                controller: "SidenavController as sidenav"
            }
        }
    });
});

demoModule.controller('MainController', function($mdSidenav) {
    let vm = this;
    vm.toggleSidenav = () => {
        $mdSidenav('left').toggle();
    };
    vm.closeSidenav = () => {
        $mdSidenav('left').close();
    };
});
