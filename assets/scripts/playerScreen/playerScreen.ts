import { _decorator, Component, Node, Sprite, SpriteFrame, ToggleContainer, instantiate, Prefab, JsonAsset, Vec3, UITransform, Label, Button, resources, ImageAsset } from 'cc';
import { bigChipPrefab } from '../bigChipPrefab/bigChipPrefab';
import { cardDistribution } from '../cardDistribution/cardDistribution';
const { ccclass, property } = _decorator;

@ccclass('playerScreen')
export class playerScreen extends Component {
    @property({type: Node}) playerBet : Node = null;
    @property({type : Node}) bankerBet : Node = null;
    @property({type: Node }) playerCardSpace : Node = null;
    @property({type: Node }) bankerCardSpace : Node = null;
    @property({type: Label}) betAmt : Label = null;
    @property({type: Node }) tableNode : Node = null;
    @property({type : Label }) bankerScoreCard : Label = null;
    @property({type : Label}) playerScoreCard : Label = null;
    bigChip : Node = null;
    selectedBetAmt : Node = null;
    selectedSpace : Node = null;
    betAmount : number = 0
    playerBetAmt : number =0
    bankerBetAmt : number = 0;
    tieBetAmt : number = 0;
    // playerScore : number =0;
    // bankerScore : number =0;
    cardsDeckArr : SpriteFrame[] = null;
    start() {
        this.loadCards()
    }
    loadCards() {
        resources.loadDir('cardDeck',SpriteFrame,(err, spriteFrame)=>{
            if(err){
                console.log("ERROR");
                return;
            }
            this.cardsDeckArr = spriteFrame;
        })
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
       // console.log(this.selectedBetAmt);
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
          //  let pos = this.selectedSpace.getPosition();
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
    cardDistribution(){
        let playerScore : number =0;
        let bankerScore : number =0;
        //console.log(this.cardsDeckArr);
        let arraySize = this.cardsDeckArr.length
        let space = 0;
        for(let i =1;i<=4;i++){
            let cardIndex = Math.floor(Math.random()*(arraySize-0)+0);
         //   console.log("cardIndex", cardIndex);
          //  console.log(this.cardsDeckArr[cardIndex]);
         //   console.log("Printing selected card",this.cardsDeckArr[cardIndex].name);
            let cardNode = instantiate(this.selectedBetAmt)
            cardNode.getComponent(Sprite).spriteFrame = this.cardsDeckArr[cardIndex]
            if(i%2!= 0){
                this.playerCardSpace.addChild(cardNode)
               playerScore = playerScore+(parseInt(this.cardsDeckArr[cardIndex].name)%10);
               if(playerScore>9){
                    playerScore = playerScore%10;
               }
                this.playerScoreCard.string = playerScore.toString();
               // let pos = this.playerBet.getPosition();
                cardNode.setPosition(new Vec3(0+space,0,0))
            }
            else{
                this.bankerCardSpace.addChild(cardNode)
               // let pos = this.bankerBet.getPosition();
               bankerScore = bankerScore+(parseInt(this.cardsDeckArr[cardIndex].name)%10);
               if(bankerScore>9){
                    bankerScore = bankerScore%10;
               }
                this.bankerScoreCard.string = bankerScore.toString();
                cardNode.setPosition(new Vec3(0+space,0,0))
            }
            space = i*40;    
        }
        let bankerWin : boolean = false;
        let playerWin : boolean = false
        if(playerScore==8 || playerScore==9){
            playerWin = true;
            console.log("player wins NATURAL");
        }
        if(bankerScore ==8 || bankerScore ==9){
            bankerWin = true
            console.log("banker wins NATURAL");  
        }
        if(playerWin && bankerWin){
            console.log("TIE between Banker and Player");
            
        }
    }
    update(deltaTime: number) {
        
    }
}

