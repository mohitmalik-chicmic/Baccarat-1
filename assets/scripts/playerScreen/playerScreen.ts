import { _decorator, Component, Node, Sprite, SpriteFrame, ToggleContainer, instantiate, Prefab, JsonAsset, Vec3, UITransform, Label, Button } from 'cc';
import { bigChipPrefab } from '../bigChipPrefab/bigChipPrefab';
const { ccclass, property } = _decorator;

@ccclass('playerScreen')
export class playerScreen extends Component {
    @property({type: Node}) playerBet : Node = null;
    @property({type : Node}) bankerBet : Node = null;
    @property({type: Label}) betAmt : Label = null;
    @property({type: Node }) tableNode : Node = null;
    bigChip : Node = null;
    selectedBetAmt : Node = null;
    selectedSpace : Node = null;
    betAmount : number = 0
    playerBetAmt : number =0
    bankerBetAmt : number = 0;
    tieBetAmt : number = 0;
    start() {
        
    }
    selectBetPlace(){
        this.playerBet.on(Node.EventType.MOUSE_DOWN,this.selectedBetSpace, this)
    }
    selectedBetSpace(event){
        //console.log("Player bet selected", event.currentTarget);
       // //console.log(this.playerSelectedSprite);
       // this.betAmount =0
       this.tableNode.getComponent(ToggleContainer).allowSwitchOff = false
       this.selectedSpace = event.currentTarget;
        // switch(event.currentTarget.name){
        //     case "playerBet":{
        //         //console.log("Player space selected");
        //         this.selectedSpace = event.currentTarget
                
        //     }break;
        //     case "bankerBet":{
        //         //console.log("Banker space seleted");
        //         this.selectedSpace = event.currentTarget
                
        //     }break;
        //     case "tieBet": {
        //         //console.log("Tie space selected");
        //         this.selectedSpace = event.currentTarget
                
        //     }

        // }
        
       // event.currentTarget.getComponent(Sprite).spriteFrame = this.playerSelectedSprite
    }
    selectedChip(buttonNode: Node, customCallback){
        this.selectedBetAmt = buttonNode;
        console.log(this.selectedBetAmt);
        if(this.selectedSpace){
            this.betAmount = this.betAmount+parseInt(customCallback)
            this.setBet()
        }
    }
    setBet(){
        this.selectedBetAmt.name = 'bigChip';
            let bigChip = instantiate(this.selectedBetAmt)
           // this.bigChip = instantiate(this.bigChipPrefab);
           bigChip.getComponent(Button).enabled = false
            //console.log((bigChip));
            let spaceName = this.selectedSpace.name
            if(this.selectedSpace.getChildByName('bigChip')!=null)
                this.selectedSpace.getChildByName('bigChip').destroy();
            this.selectedSpace.insertChild(bigChip, this.selectedSpace.children.length)
            let pos = this.selectedSpace.getPosition();
            bigChip.setPosition(new Vec3(0,0,0))
            this.betAmt.string = `${this.betAmount}`
            
            
           switch(spaceName){
            case "playerBet":{
                this.playerBetAmt = this.betAmount;
            }break;
            case "bankerBet":{
                this.bankerBetAmt = this.betAmount;
            }
            case "tieBet":{
                this.bankerBetAmt = this.betAmount
            }
           }
        
    }
    update(deltaTime: number) {
        
    }
}

