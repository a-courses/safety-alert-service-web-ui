import controllerModule from '../common/ControllerModule';

class ModalController {
    constructor(close){
        this.close = close;
    }
    closeModal(result) {
        this.close(result, 500); // close, but give 500ms for bootstrap to animate
    };
}

ModalController.$inject = ['close'];
export default controllerModule.controller('ModalController', ModalController).name;