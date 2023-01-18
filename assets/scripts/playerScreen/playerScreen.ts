import { _decorator, Component, Node, Sprite, SpriteFrame, instantiate, Vec3, Label, resources, UITransform, Prefab, Animation, Button, director } from "cc";
import { chipClickMouse } from "../chipClickMouse";
import { gameplay } from "../gameplay/gameplay";
import { popUpPrefab } from "../popUp/popUpPrefab";
import { scoreCard } from "../scoreCard/scoreCard";

const { ccclass, property } = _decorator;
enum WINNER {
  PLAYER = "PLAYER",
  BANKER = "BANKER",
  TIE = "TIE",
  PLAYERPAIR = "PLAYERPAIR",
  BANKERPAIR = 'BANKERPAIR'
}

enum BETSPACE{
  PLAYERBET = "playerBet",
  BANKERBET = "bankerBet",
  TIEBET = "tieBet",
  BANKERPAIRSPACE = "bankerpair",
  PLAYERPAIRSPACE ="playerpair"
 }
@ccclass("playerScreen")
export class playerScreen extends Component {
  @property({ type: Node }) playerCardSpace: Node = null;
  @property({ type: Node }) bankerCardSpace: Node = null;
  @property({ type: Node }) cardSpace: Node = null;
  @property({ type: Node }) tableNode: Node = null;
  @property({ type: Node }) chipsNode: Node = null;
  @property({ type: Label }) bankerScoreCard: Label = null;
  @property({ type: Label }) betAmt: Label = null;
  @property({ type: Label }) walletAmt: Label = null;
  @property({ type: Label }) playerScoreCard: Label = null;
  @property({ type: Prefab }) popUp: Prefab = null;
  @property({type : Prefab}) scoreCardPrefab : Prefab = null;
   @property({type: Node}) undoButton: Node= null;
  betAmount: number = 0;
 // walletAmount: number = 0;
  playerScore: number = 0;
  bankerScore: number = 0;
  space: number = -200;
  playerSpaceBet: number = 0;
  bankerSpaceBet: number = 0;
  tieSpaceBet: number = 0;
  bankerPairSpaceBet : number =0;
  playerPairSpaceBet : number =0;
  thirdCard: boolean = false;
  bankerWin: boolean = false;
  playerWin: boolean = false;
  gameEnd: boolean = false;
  tie: boolean = false;
  bankerPair : boolean = false;
  playerPair : boolean = false;
  cardsDeckArr: SpriteFrame[] = null;
  betChipsArray : Node[] = [];
  selectedBetAmt: Node = null;
  scoreBoard :Node = null;
  dealButton : Node = null;
  start() {
    this.loadCards();
    this.availableChips();
    this.scoreBoard = instantiate(this.scoreCardPrefab);
    this.node.addChild(this.scoreBoard);
    // this.loadChips();
  }
  loadCards() {
    resources.loadDir("cardDeck", SpriteFrame, (err, spriteFrame) => {
      if (err) {
        //console.log("ERROR in loading cards");
        return;
      }
      this.cardsDeckArr = spriteFrame;
    });
  }
  availableChips() {
    console.log("Inside available chips");
    
    let playerWallet = parseInt(this.walletAmt.string);
    for (let i = 0; i < this.chipsNode.children.length; i++) {
      let chipAmt = parseInt(this.chipsNode.children[i].name);
      if (chipAmt > playerWallet) {
        this.chipsNode.children[i].getComponent(Sprite).grayscale = true;
        this.chipsNode.children[i].getComponent(chipClickMouse).enabled = false;
      }
      else{
        this.chipsNode.children[i].getComponent(Sprite).grayscale = false;
        this.chipsNode.children[i].getComponent(chipClickMouse).enabled = true;
      }
    }
  }
  selectedChip(chipSelected: Node, selectedSpace: Node) {
    //console.log("Selected Bet Space", selectedSpace);
    this.selectedBetAmt = chipSelected;
    //console.log(this.selectedBetAmt);
    let walletMin = parseInt(this.walletAmt.string) - parseInt(this.selectedBetAmt.name);
    if (walletMin >= 0) {
      this.betChipsArray.push(this.selectedBetAmt);
      this.betAmount = this.betAmount + parseInt(this.selectedBetAmt.name);
      this.walletAmt.string = (parseInt(this.walletAmt.string) - parseInt(this.selectedBetAmt.name)).toString();
      this.individualSpaceBet(selectedSpace, this.selectedBetAmt);
      this.setBet(this.betAmount);
      this.availableChips();
    } else {
      //console.log("Not sufficient funds");
    }
  }
  individualSpaceBet(selectedSpace, selectedBetAmt) {
    switch (selectedSpace.name) {
      case BETSPACE.PLAYERBET:
        {
          this.playerSpaceBet = this.playerSpaceBet + parseInt(selectedBetAmt.name);
        }
        break;
      case BETSPACE.BANKERBET:
        {
          this.bankerSpaceBet = this.bankerSpaceBet + parseInt(selectedBetAmt.name);
        }
        break;
      case BETSPACE.TIEBET:
        {
          this.tieSpaceBet = this.tieSpaceBet + parseInt(selectedBetAmt.name);
        }
        break;
      case BETSPACE.BANKERPAIRSPACE:
          {
            this.bankerPairSpaceBet = this.bankerPairSpaceBet + parseInt(selectedBetAmt.name);
          }
          break;
      case BETSPACE.PLAYERPAIRSPACE:
          {
            this.playerPairSpaceBet = this.playerPairSpaceBet + parseInt(selectedBetAmt.name);
          }
          break;
    }
  }

  setBet(betAmt: number) {
    this.betAmt.string = `${betAmt}`;
    // if(this.walletAmount>0)
    //   this.walletAmt.string = `${this.walletAmount}`;
  }
  disableChips(makeAvailable: boolean){
    for(let index =0;index<this.chipsNode.children.length;index++){
      if(makeAvailable){
      this.chipsNode.children[index].getComponent(Sprite).grayscale = true;
      }else{
      this.chipsNode.children[index].getComponent(Sprite).grayscale = false;
      }
    }
  }
  cardDistribution(event) {
    //console.log("Button Clicked");
    this.undoButton.getComponent(Button).interactable = false
    this.undoButton.getComponent(Sprite).grayscale = true
    // this.chipsNode.active = false
    this.disableChips(true)
    this.dealButton = event.currentTarget
    event.currentTarget.getComponent(Button).interactable= false
    event.currentTarget.getComponent(Sprite).grayscale = true
    this.playerScore = 0;
    this.bankerScore = 0;
    let index = 1;
    this.schedule(
      () => {
        let { cardNode, cardIndex } = this.drawCard();
        if (index % 2 != 0) {
          this.addCardToPlayer(cardNode, cardIndex);

        } else {
          this.addCardToBanker(cardNode, cardIndex);
        }
        
        //console.log("Printing index", index);
        if (index == 4) this.firstPairWinPopUp(cardNode);
        index++;
      },2,3,0);
  }
  addpopUpPrefab(winName) {
    let addpopUp = instantiate(this.popUp);
    this.node.addChild(addpopUp);
    addpopUp.getComponent(popUpPrefab).openPopUp(`${winName}`+" WON");
    addpopUp.getComponent(popUpPrefab).closePopUp();
    this.setBet(0);
  }
  pairCardCheck(){
   // //console.log("PlayerCardSpace children",this.playerCardSpace.children)
    let index = this.playerCardSpace.children.length-1;
    if(this.playerCardSpace.children[index].name ==this.playerCardSpace.children[index-1].name ){
      this.playerPair = true;
    //  //console.log(this.playerPair);
    }
    index =this.bankerCardSpace.children.length-1;
    if(this.bankerCardSpace.children[index].name ==this.bankerCardSpace.children[index-1].name ){
      this.bankerPair = true;
   //   //console.log(this.bankerPair);
    }
   // //console.log('BankerCardSpace children', this.bankerCardSpace.children);
   this.updatePairBetAmount();
  }
  updatePairBetAmount(){
    if(this.bankerPair){
      let amount = parseInt(this.walletAmt.string);
      //console.log("amount CHECK1",amount);
      //console.log(this.bankerPairSpaceBet);
      
      amount = amount + this.bankerPairSpaceBet*11
      //console.log("amount CHECK2",amount);
      this.walletAmt.string = `${amount}`;
      //console.log(this.walletAmt.string);
    }
    if(this.playerPair){
      let amount = parseInt(this.walletAmt.string);
      amount = amount + this.playerPairSpaceBet*11
      this.walletAmt.string = `${amount}`;
      //console.log(this.walletAmt.string);
    }
  }
  firstPairWinPopUp(cardNode) {
    let winName = this.checkWin();
    if (this.playerWin || this.bankerWin || this.tie) {
      cardNode.getComponent(Animation).on(
        Animation.EventType.FINISHED,
        () => {
          this.addpopUpPrefab(winName);
          this.updatePlayerWallet(winName);
          this.pairCardCheck()
        },
        this,
        true
      );
      ////console.log("Printing score", this.playerSpaceBet, this.bankerSpaceBet, this.tieSpaceBet);
     
    }
    if (!this.playerWin && !this.bankerWin && !this.tie) {
     // //console.log("cardSpace component", this.cardSpace.getComponent(Animation));
      cardNode.getComponent(Animation).on(
        Animation.EventType.FINISHED,
        () => {
          //console.log("animation finished");
          this.drawThirdCard();
        },this,true);
    }
  }
  undoBetChips() {
    //console.log(this.betChipsArray);
    if(this.betChipsArray.length>0){
      let popNode = this.betChipsArray.pop();
      //console.log("PopNode parent Name",popNode.parent.name)
      if(popNode.parent.name == "bankerBet"){
        this.bankerSpaceBet = this.bankerSpaceBet -parseInt(popNode.name)
      }
      else if(popNode.parent.name == "playerBet"){
        this.playerSpaceBet = this.playerSpaceBet - parseInt(popNode.name)
      }
      else if(popNode.parent.name == "tieBet"){
        this.tieSpaceBet =  this.tieSpaceBet - parseInt(popNode.name)
      }
      this.betAmount = this.betAmount - parseInt(popNode.name);
      this.betAmt.string = (parseInt(this.betAmt.string) - parseInt(popNode.name)).toString();
      this.walletAmt.string = (parseInt(this.walletAmt.string) + parseInt(popNode.name)).toString();
      popNode.removeFromParent();
      this.availableChips();
    }
  }
  clearAllBets(){
    // //console.log(this.betChipsArray);
    this.tableNode.getChildByName
    for (let index = 0; index < this.tableNode.children.length; index++) {
      
     this.tableNode.children[index].children[0].destroyAllChildren();
    } 
  }
 
  addCardToPlayer(cardNode, cardIndex) {
    //console.log("Inside addCardToPlayer", cardNode);

    this.playerCardSpace.addChild(cardNode);
    this,cardNode.name = this.cardsDeckArr[cardIndex].name
    this.playerScore = this.playerScore + (parseInt(this.cardsDeckArr[cardIndex].name) % 10);
    if (this.playerScore > 9) {
      this.playerScore = this.playerScore % 10;
    }
    this.playerScoreCard.string = this.playerScore.toString();
    //console.log("PlayerScoreCard", this.playerScoreCard.string);
    this.space = this.space+(this.cardSpace.getComponent(UITransform).width/2)
    //console.log("Printing card Space",this.space);
    
    cardNode.getComponent(UITransform).height = 0;
    cardNode.getComponent(UITransform).width = 0;
    
    cardNode.setPosition(new Vec3(0 + this.space, 0, 0));
  }
  addCardToBanker(cardNode, cardIndex) {
    this.bankerCardSpace.addChild(cardNode);
    this,cardNode.name = this.cardsDeckArr[cardIndex].name
    this.bankerScore = this.bankerScore + (parseInt(this.cardsDeckArr[cardIndex].name) % 10);
    if (this.bankerScore > 9) {
      this.bankerScore = this.bankerScore % 10;
    }
    this.bankerScoreCard.string = this.bankerScore.toString();
    //console.log("BankerScoreCard", this.bankerScoreCard.string);
    cardNode.getComponent(UITransform).height = 0;
    cardNode.getComponent(UITransform).width = 0;
    cardNode.setPosition(new Vec3(0 + this.space, 0, 0));
  }
  drawCard() {
    let arraySize = this.cardsDeckArr.length;
    let cardIndex = Math.floor(Math.random() * (arraySize - 0) + 0);
    let cardNode = instantiate(this.cardSpace);
    cardNode.getComponent(Sprite).spriteFrame = this.cardsDeckArr[cardIndex];
    cardNode.getComponent(UITransform).height = 0;
    cardNode.getComponent(UITransform).width = 0;
    return { cardNode, cardIndex };
  }
  checkWin() {
    //console.log("CHECK WIN CALLED");
    // conditions after 2nd card
    if (this.playerScore == 8 || this.playerScore == 9 || this.bankerScore == 8 || this.bankerScore == 9) {
      if (this.playerScore > this.bankerScore) {
        this.playerWin = true;
        //console.log("PLAYER WIN");
        this.tie = false;
        this.bankerWin = false;
        return WINNER.PLAYER;
      } else if (this.playerScore < this.bankerScore) {
        this.bankerWin = true;
        this.tie = false;
        this.playerWin = false;
        //console.log("BANKER WIN");
        return WINNER.BANKER;
      } else {
        this.tie = true;
        //console.log("TIE");
        this.playerWin = false;
        this.bankerWin = false;
        return WINNER.TIE;
      }
    }
    //third card drawn
    if (this.thirdCard) {
      if (this.playerScore > this.bankerScore) {
        this.playerWin = true;
        //console.log("PLAYER WIN");
        this.tie = false;
        this.bankerWin = false;
        return WINNER.PLAYER;
      } else if (this.playerScore < this.bankerScore) {
        this.bankerWin = true;
        this.tie = false;
        this.playerWin = false;
        //console.log("BANKER WIN");
        return WINNER.BANKER;
      } else {
        this.tie = true;
        //console.log("TIE");
        this.playerWin = false;
        this.bankerWin = false;
        return WINNER.TIE;
      }
    }
  }

  drawThirdCard() {
    //console.log("inside 3rd card");
    //if this.playerScore 6 or 7 player stand
    let playerThirdCard: number = 0;
    let pThirdCard: boolean = false;
    this.thirdCard = true;
    let animationNode: Node = null;
    if (this.playerScore <= 5) {
      pThirdCard = true;
      let { cardNode, cardIndex } = this.drawCard();
      playerThirdCard = parseInt(this.cardsDeckArr[cardIndex].name) % 10;
      this.addCardToPlayer(cardNode, cardIndex);
      animationNode = cardNode;
    } else {
      //console.log("STAND Score is 6 or 7");
    }
    if(!animationNode){
      this.bankerThirdCard(playerThirdCard, pThirdCard,this.secondPairWin)
    }
    else{
      animationNode.getComponent(Animation).on(
      Animation.EventType.FINISHED,
      () => {
        this.bankerThirdCard(playerThirdCard, pThirdCard, this.secondPairWin)
      },
      this,true) 
    }
  }
  secondPairWin =() =>{
    let winName = this.checkWin();
    setTimeout(()=>{
    if (this.playerWin || this.bankerWin || this.tie) {
      this.addpopUpPrefab(winName);
      this.updatePlayerWallet(winName);
    }
  },2000)
  }
  bankerThirdCard(playerThirdCard, pThirdCard,callback){
    if (pThirdCard) {
      let { cardNode, cardIndex } = this.drawCard();
          // this.cardSpace.active = false;
    //  //console.log("Player drew 3 card inside switch");
      switch (this.bankerScore) {
        case 0:
        case 1:
        case 2:
          {
         //   //console.log("2");
            if (playerThirdCard != 8 && playerThirdCard != 9) {
              this.addCardToBanker(cardNode, cardIndex);
          }
        }break;
        case 3:
          {
         //   //console.log("3");
            if (this.playerScore != 8 && playerThirdCard != 8) {
              this.addCardToBanker(cardNode, cardIndex);
            }
          }
          break;
        case 4:
          {
       //     //console.log("4");

            if (playerThirdCard >= 2 && playerThirdCard <= 7) {
              this.addCardToBanker(cardNode, cardIndex);
            }
          }
          break;
        case 5:
          {
////console.log("5");

            if (playerThirdCard >= 4 && playerThirdCard <= 7) {
              this.addCardToBanker(cardNode, cardIndex);
            }
          }
          break;
        case 6:
          {
         //   //console.log("6");
            if (playerThirdCard == 6 || playerThirdCard == 7) {
              this.addCardToBanker(cardNode, cardIndex);
            }
          }
          break;
        case 7:
          {
         //   //console.log("7");
            //console.log("STAY banker Score = 7");
          }
          break;
      }
}else {
      if (this.bankerScore <= 5) {
        this.space = this.space+100;
          let { cardNode, cardIndex } = this.drawCard();
          cardNode.setPosition(new Vec3(0 + this.space, 0, 0));
        this.addCardToBanker(cardNode, cardIndex);
      } else if (this.bankerScore == 6 || this.bankerScore == 7) {
        //console.log("BANKER STAND");
        //console.log("3rd Card not drawn by player and Banker Score 6 or 7");
      } 
    }
    callback();
  }
  updatePlayerWallet(winName: WINNER) {
    //console.log("UpdatePlayerWallet", winName);
    let amount = parseInt(this.walletAmt.string);
    switch (winName) {
      case WINNER.PLAYER:
        {
          amount = amount + this.playerSpaceBet * 2;
          this.walletAmt.string = `${amount}`;
        }
        break;
      case WINNER.BANKER:
        {
          amount = amount + this.bankerSpaceBet * 2;
          this.walletAmt.string = `${amount}`;
        }
        break;
      case WINNER.TIE:
        {
          //console.log(this.tieSpaceBet);
          
          amount = amount + this.tieSpaceBet * 8;
          this.walletAmt.string = `${amount}`;
          //console.log(this.walletAmt.string);
          
        }
        break;
    }
    this.availableChips();
    setTimeout(()=>{
      this.showScoreCard(winName);
    },3000)
  }
  showScoreCard(winName){
    this.scoreBoard.active  = true
    this.scoreBoard.getComponent(scoreCard).updateScoreCard(winName)
    this.scoreBoard.getComponent(scoreCard).nextGameCallback(this.closeScoreBoard)
  }
  closeScoreBoard(score:boolean){
    console.log(score,this.scoreBoard);
    this.node.active = false
    this.node.parent.getComponent(playerScreen).resetTable();
  }
  resetTable(){
    this.availableChips();
    this.clearAllBets();
    this.undoButton.getComponent(Button).interactable = true
    this.undoButton.getComponent(Sprite).grayscale = false
    this.dealButton.getComponent(Button).interactable= true
    this.dealButton.getComponent(Sprite).grayscale = false
    this.bankerCardSpace.destroyAllChildren();
    this.playerCardSpace.destroyAllChildren();
    //this.betAmount: number = 0;
 // walletAmount: number = 0;
  this.playerScore = 0;
  this.bankerScore = 0;
  this.space = -200;
  this.playerSpaceBet= 0;
  this.bankerSpaceBet= 0;
  this.tieSpaceBet = 0;
  this.bankerPairSpaceBet =0;
  this.playerPairSpaceBet =0;
  this.thirdCard = false;
  this.bankerWin = false;
  this.playerWin=  false;
  this.gameEnd = false;
  this.tie = false;
  this.bankerPair  = false;
  this.playerPair = false;
  this.playerScoreCard.string = "0"
  this.bankerScoreCard.string = "0"
  this.betAmt.string ="0"
  this.betAmount =0;
  }
  
  update(deltaTime: number) {}
}
