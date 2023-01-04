import { _decorator, Component, Node } from 'cc';
import { ButtonType } from '../common/ButtonType';
import { BUTTON_TYPE } from '../common/constant';
const { ccclass, property } = _decorator;

@ccclass('buttonCallbacks')
export class buttonCallbacks extends Component {
    start() {

    }
    debugCallbacks(event){
        let buttonNode = event.currentTarget.getComponent(ButtonType)

        switch(buttonNode.ButtonType){
            case BUTTON_TYPE.CHIP_1:{
                //call chip1 component
            }
            break;
        }
    }
    update(deltaTime: number) {
        
    }
}

