import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('bigChipPrefab')
export class bigChipPrefab extends Component {
    @property({type: Label}) betAmt : Label = null;
    start() {

    }
    setLabelValue(value){
        this.betAmt.getComponent(Label).string = value.toString();
        //console.log("Inside bigChipPrefab", this.betAmt.getComponent(Label).string);
        
    }
    update(deltaTime: number) {
        
    }
}

