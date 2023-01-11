import { _decorator, Component, Node, Label } from 'cc';
import { playPopUpCloseAnimation, playPopUpOpenAnimation } from '../common/utility';
const { ccclass, property } = _decorator;

@ccclass('popUpPrefab')
export class popUpPrefab extends Component {
    @property({type : Label}) text : Label = null;
    start() {
        
    }
    openPopUp(value : string){
        this.text.string = value
        playPopUpOpenAnimation(this.node)
    }
    closePopUp(){
        setTimeout(()=>{
            playPopUpCloseAnimation(this.node);
        },3000)
        console.log("Inside popUpPrefab");
        
    }
    update(deltaTime: number) {
        
    }
}

