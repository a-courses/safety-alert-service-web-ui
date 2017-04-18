import angular from 'angular';
// Material design css
import 'angular-material/angular-material.css';
// Icons
import 'font-awesome/css/font-awesome.css';
// Animation
import 'angular-animate';
import 'angular-aria';
// Materail Design lib
import ngMaterial from 'angular-material';
import '../style/app.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap'

let app = () => {
    return {
        template: require('./app.html'),
        controller: 'AppCtrl',
        controllerAs: 'app'
    }
};

class AppCtrl {
    constructor() {
        this.url = 'https://github.com/preboot/angular-webpack';
        this.topDirections = ['left', 'up'];
        this.bottomDirections = ['down', 'right'];

        this.isOpen = false;

        this.availableModes = ['md-fling', 'md-scale'];
        this.selectedMode = 'md-fling';

        this.availableDirections = ['up', 'down', 'left', 'right'];
        this.selectedDirection = 'up';
    }
}

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, ['ngMaterial'])
    .directive('app', app)
    .controller('AppCtrl', AppCtrl);

export default MODULE_NAME;