class FullScreenCtrl
{
    constructor()
    {
        this.isFullScreen = false;
    }

    toggleScreen(){
        this.isFullScreen = ! this.isFullScreen;
    }
}