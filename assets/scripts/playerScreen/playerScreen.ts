import { _decorator, Component, Node, Sprite, SpriteFrame, ToggleContainer, instantiate, Prefab, JsonAsset, Vec3, UITransform, Label, Button, resources, ImageAsset, EventTouch } from 'cc';
import { bigChipPrefab } from '../bigChipPrefab/bigChipPrefab';
import { cardDistribution } from '../cardDistribution/cardDistribution';
import { chipClickMouse } from '../chipClickMouse';
const { ccclass, property } = _decorator;

@ccclass('playerScreen')
export class playerScreen extends Component {
  //  @property({type: Node}) playerBet : Node = null;
 //   @property({type : Node}) bankerBet : Node = null;
    @property({type: Node }) playerCardSpace : Node = null;
    @property({type: Node }) bankerCardSpace : Node = null;
    @property({type: Label}) betAmt : Label = null;
    @property({type: Node }) tableNode : Node = null;
    @property({type : Label }) bankerScoreCard : Label = null;
    @property({type : Label}) playerScoreCard : Label = null;
  //  @property({type: Node}) chipsNode : Node = null;
    @property({type : Node}) cardSpace : Node = null;
    playerScore : number =0;
    bankerScore : number =0;
    space : number = 0;
    thirdCard : boolean = false;
  //  bigChip : Node = null;
    selectedBetAmt : Node = null;
  //  selectedSpace : Node = null;
    betAmount : number = 0
 //   playerBetAmt : number =0
 //   bankerBetAmt : number = 0;
  //  tieBetAmt : number = 0;
    bankerWin : boolean = false;
    playerWin : boolean = false;
    gameEnd : boolean = false;
    tie : boolean = false;
    cardsDeckArr : SpriteFrame[] = null;
  //  mousePos: Vec3;
  //  rect: Vec3;
  //  pos: Vec3;
 //   selectImgPos: Vec3;
    static loadCards: any;
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
    selectedChip(chipSelected : Node){
        this.selectedBetAmt = chipSelected
        console.log(this.selectedBetAmt.name);
        this.betAmount = this.betAmount+parseInt(this.selectedBetAmt.name)
        this.setBet()
    }
    setBet(){
            this.betAmt.string = `${this.betAmount}`
           }
    cardDistribution(){
        this.playerScore = 0;
        this.bankerScore = 0;
        this.space = 0;
        for(let i =1;i<=4;i++){
            let {cardNode,cardIndex} = this.drawCard();
            if(i%2!= 0){
                this.addCardToPlayer(cardNode , cardIndex)
            }
            else{
                this.addCardToBanker(cardNode, cardIndex)
            }
            this.space = i*40;    
        }
        let win = this.checkWin()
         console.log("Printing winning", win, this.playerWin, this.bankerWin, this.tie);
        if(!this.playerWin && !this.bankerWin && !this.tie){
            this.drawThirdCard()
        }

            
        
    }
    addCardToPlayer(cardNode, cardIndex){
        this.playerCardSpace.addChild(cardNode)
        this.playerScore = this.playerScore+(parseInt(this.cardsDeckArr[cardIndex].name)%10);
        if(this.playerScore>9){
             this.playerScore = this.playerScore%10;
        }
         this.playerScoreCard.string = this.playerScore.toString();
         cardNode.setPosition(new Vec3(0+this.space,0,0))
    }
    addCardToBanker(cardNode , cardIndex){
        this.bankerCardSpace.addChild(cardNode)
               this.bankerScore = this.bankerScore+(parseInt(this.cardsDeckArr[cardIndex].name)%10);
               if(this.bankerScore>9){
                    this.bankerScore = this.bankerScore%10;
               }
                this.bankerScoreCard.string = this.bankerScore.toString();
                cardNode.setPosition(new Vec3(0+this.space,0,0))
    }
    drawCard(){
        let arraySize = this.cardsDeckArr.length
        let cardIndex = Math.floor(Math.random()*(arraySize-0)+0);
        let cardNode = instantiate(this.cardSpace)
        cardNode.getComponent(Sprite).spriteFrame = this.cardsDeckArr[cardIndex]
        return {cardNode,cardIndex};
    }
    checkWin(){
        console.log("CHECK WIN CALLED");
        // conditions after 2nd card
        if(this.playerScore ==8 || this.playerScore ==9 && this.bankerScore ==8 || this.bankerScore ==9){
            if(this.playerScore>this.bankerScore){
                this.playerWin = true
                console.log("PLAYER WIN");
                this.tie = false;
                this.bankerWin = false
                return "playerWin"
            }
            else if(this.playerScore<this.bankerScore){
                this.bankerWin= true;
                this.tie = false
                this.playerWin = false
                console.log('BANKER WIN');
                return "bankerWin"
            }
            else{
                this.tie = true
                console.log("TIE");
                this.playerWin = false;
                this.bankerWin = false
                return  "tie"
            }

        }
        //third card drawn
        if(this.thirdCard){
            if(this.playerScore>this.bankerScore){
                this.playerWin = true
                console.log("PLAYER WIN");
                this.tie = false;
                this.bankerWin = false
                return "playerWin"
            }
        else{
            this.bankerWin= true;
                this.tie = false
                this.playerWin = false
                console.log('BANKER WIN');
                return "bankerWin"
            }
        }
    }
    
    drawThirdCard(){
        //if this.playerScore 6 or 7 player stand
        let playerThirdCard : number = 0;
        this.thirdCard = true;
        if(this.playerScore<=5){
            console.log("Draw third card");
            let{cardNode , cardIndex} = this.drawCard();
            playerThirdCard = parseInt(this.cardsDeckArr[cardIndex].name);
            this.playerCardSpace.addChild(cardNode)
            cardNode.setPosition(new Vec3(0+this.space,0,0))
            this.playerScore = this.playerScore+(parseInt(this.cardsDeckArr[cardIndex].name)%10);
            if(this.playerScore>9){
                 this.playerScore = this.playerScore%10;
            }
             this.playerScoreCard.string = this.playerScore.toString();

        }
        else{
            console.log("STAND Score is 6 or 7");
            
        }
        switch(this.bankerScore){
                case 0:
                case 1:
                case 2:{
                    if(playerThirdCard == 8 || playerThirdCard ==9){
                        return
                    }else{  
                        let {cardNode, cardIndex} = this.drawCard()
                        this.addCardToBanker(cardNode, cardIndex);
                    }
                }break;
                case 3:{
                    if(playerThirdCard == 8)
                        return;
                    if(this.playerScore!=8){
                        let {cardNode, cardIndex} = this.drawCard()
                        this.addCardToBanker(cardNode, cardIndex);
                    }
                }break;
                case 4:{
                    if(playerThirdCard>=2 && playerThirdCard<=7){
                        let {cardNode, cardIndex} = this.drawCard()
                        this.addCardToBanker(cardNode, cardIndex);
                    }
                }break;
                case 5:{
                    if(playerThirdCard>=4 && playerThirdCard<=7){
                        let {cardNode, cardIndex} = this.drawCard()
                        this.addCardToBanker(cardNode, cardIndex);
                    }
                }break;
                case 6:{
                    if(playerThirdCard == 6 || playerThirdCard ==7){
                        let {cardNode, cardIndex} = this.drawCard()
                        this.addCardToBanker(cardNode, cardIndex);
                    }
                }break;
                case 7:{
                    console.log("STAY banker Score = 7");
                    
                }break;
            }
        let win = this.checkWin()
        console.log("Printing winning", win, this.playerWin, this.bankerWin, this.tie);
    }
    update(deltaTime: number) {
        
    }
}
  