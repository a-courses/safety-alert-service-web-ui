import controllerModule from '../common/ControllerModule';

class ModalController {
    constructor(close , alertMessageList){
        this.close = close;
        this.alertMessageListModal = alertMessageList ;
    }
    closeModal(result) {
        this.close(result, 500); // close, but give 500ms for bootstrap to animate
    };
}

ModalController.$inject = ['close','alertMessageList'];
export default controllerModule.controller('ModalController', ModalController).name;