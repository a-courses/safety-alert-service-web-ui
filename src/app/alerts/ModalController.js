import controllerModule from '../common/ControllerModule';

class ModalController {
    constructor(close , alertMessageList, selectedImage){
        this.close = close;
        this.alertMessageListModal = alertMessageList ;
        this.selectedImage = selectedImage ;
    }
    closeModal(result) {
        this.close(result, 500); // close, but give 500ms for bootstrap to animate
    };
}

ModalController.$inject = ['close','alertMessageList', 'selectedImage'];
export default controllerModule.controller('ModalController', ModalController).name;