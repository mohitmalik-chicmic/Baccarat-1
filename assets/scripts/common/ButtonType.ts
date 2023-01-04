import { _decorator, Component, Node, Enum, Button } from 'cc';
const { ccclass, property } = _decorator;
import { BUTTON_TYPE } from './constant';
@ccclass('ButtonType')
export class ButtonType extends Component {
    @property({type : Enum(BUTTON_TYPE)})
    buttonType: BUTTON_TYPE = BUTTON_TYPE.NONE;

    button: Button = null;
    start() {

    }

    update(deltaTime: number) {
        
    }
}

