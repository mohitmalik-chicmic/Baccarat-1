import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('loading')
export class loading extends Component {
    parentFunctionCallback : Function = null;
    start() {

    }
    startGame(btncallback: Function){
        //call received from gameplay.start()
        this.parentFunctionCallback = btncallback
    }
    startClicked(event){
        this.node.active = false;
        this.parentFunctionCallback(this.node) //current node returned to gameplay.mainScreen()
        
    }
    update(deltaTime: number) {
        
    }
}

