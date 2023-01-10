import { _decorator, Component, Node } from 'cc';
import { ButtonType } from '../common/ButtonType';
import { BUTTON_TYPE } from '../common/constant';
import { playerScreen } from '../playerScreen/playerScreen';
const { ccclass, property } = _decorator;

@ccclass('buttonCallbacks')
export class buttonCallbacks extends Component {
    // @property({type: Node}) playerScreen : Node = nu;ll
    start() {

    }
    debugCallbacks(event, customCallback){
        let buttonClicked = event.currentTarget
        let buttonNode = event.currentTarget.getComponent(ButtonType)
        //console.log(buttonNode);
        //console.log(buttonClicked);
        
       // this.node.getComponent(playerScreen).selectedChip(buttonClicked, customCallback)
        // switch(buttonNode.buttonType){
        //     case BUTTON_TYPE.CHIP_1:{
        //         //call chip1 component
        //         //console.log("Chip1 pressed");

                
        //     }
        //     break;
        //     case BUTTON_TYPE.CHIP_10:{
        //         //call chip1 component
        //         //console.log("Chip10 pressed");
        //         this.node.getComponent(playerScreen).selectedChip(buttonClikced)
                
        //     }
        //     break;
        //     case BUTTON_TYPE.CHIP_100:{
        //         //call chip1 component
        //         //console.log("Chip100 pressed");
                
        //     }
        //     break;
        //     case BUTTON_TYPE.CHIP_500:{
        //         //call chip1 component
        //         //console.log("Chip500 pressed");
                
        //     }
        //     break;
        //     case BUTTON_TYPE.CHIP_1K:{
        //         //call chip1 component
        //         //console.log("Chip1K pressed");
                
        //     }
        //     break;
            
      //  }
    }
    update(deltaTime: number) {
        
    }
}

