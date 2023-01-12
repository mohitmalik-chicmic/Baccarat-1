import { _decorator, Component, Node, Sprite, SpriteFrame, instantiate, Vec3, Label, resources, UITransform, Prefab, Animation, Button } from "cc";
import { chipClickMouse } from "../chipClickMouse";
import { popUpPrefab } from "../popUp/popUpPrefab";

const { ccclass, property } = _decorator;
enum WINNER {
  PLAYER = "PLAYER WON",
  BANKER = "BANKER WON",
  TIE = "TIE",
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
  betAmount: number = 0;
  walletAmount: number = 0;
  playerScore: number = 0;
  bankerScore: number = 0;
  space: number = -300;
  playerSpaceBet: number = 0;
  bankerSpaceBet: number = 0;
  tieSpaceBet: number = 0;
  thirdCard: boolean = false;
  bankerWin: boolean = false;
  playerWin: boolean = false;
  gameEnd: boolean = false;
  tie: boolean = false;
  cardsDeckArr: SpriteFrame[] = null;
  selectedBetAmt: Node = null;

  start() {
    this.loadCards();
    this.availableChips();
    // this.loadChips();
  }
  loadCards() {
    resources.loadDir("cardDeck", SpriteFrame, (err, spriteFrame) => {
      if (err) {
        console.log("ERROR in loading cards");
        return;
      }
      this.cardsDeckArr = spriteFrame;
    });
  }
  availableChips() {
    let playerWallet = parseInt(this.walletAmt.string);
    for (let i = 0; i < this.chipsNode.children.length; i++) {
      let chipAmt = parseInt(this.chipsNode.children[i].name);
      if (chipAmt > playerWallet) {
        this.chipsNode.children[i].getComponent(Sprite).grayscale = true;
        this.chipsNode.children[i].getComponent(chipClickMouse).enabled = false;
      }
    }
  }
  selectedChip(chipSelected: Node, selectedSpace: Node) {
    console.log("Selected Bet Space", selectedSpace);
    this.selectedBetAmt = chipSelected;
    console.log(this.selectedBetAmt.name);
    let walletMin = parseInt(this.walletAmt.string) - parseInt(this.selectedBetAmt.name);
    if (walletMin >= 0) {
      this.betAmount = this.betAmount + parseInt(this.selectedBetAmt.name);
      this.walletAmt.string = (parseInt(this.walletAmt.string) - parseInt(this.selectedBetAmt.name)).toString();
      this.individualSpaceBet(selectedSpace, this.selectedBetAmt);
      this.setBet(this.betAmount);
      this.availableChips();
    } else {
      console.log("Not sufficient funds");
    }
  }
  individualSpaceBet(selectedSpace, selectedBetAmt) {
    switch (selectedSpace.name) {
      case "playerBet":
        {
          this.playerSpaceBet = this.playerSpaceBet + parseInt(selectedBetAmt.name);
        }
        break;
      case "bankerBet":
        {
          this.bankerSpaceBet = this.bankerSpaceBet + parseInt(selectedBetAmt.name);
        }
        break;
      case "tieBet":
        {
          this.tieSpaceBet = this.tieSpaceBet + parseInt(selectedBetAmt.name);
        }
        break;
    }
  }
  setBet(betAmt: number) {
    this.betAmt.string = `${betAmt}`;
    // if(this.walletAmount>0)
    //   this.walletAmt.string = `${this.walletAmount}`;
  }
  cardDistribution(event) {
    console.log("Button Clicked");
    // this.chipsNode.active = false
    event.currentTarget.getComponent(Button).interactable= false
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
        
        console.log("Printing index", index);
        if (index == 4) this.firstPairWinPopUp(cardNode);
        index++;
      },2,3,0);
  }
  addpopUpPrefab(winName) {
    let addpopUp = instantiate(this.popUp);
    this.node.addChild(addpopUp);
    addpopUp.getComponent(popUpPrefab).openPopUp(`${winName}`);
    addpopUp.getComponent(popUpPrefab).closePopUp();
    this.setBet(0);
  }
  firstPairWinPopUp(cardNode) {
    let winName = this.checkWin();
    if (this.playerWin || this.bankerWin || this.tie) {
      cardNode.getComponent(Animation).on(
        Animation.EventType.FINISHED,
        () => {
          this.addpopUpPrefab(winName);
        },
        this,
        true
      );
      //console.log("Printing score", this.playerSpaceBet, this.bankerSpaceBet, this.tieSpaceBet);
      this.updatePlayerWallet(winName);
    }
    if (!this.playerWin && !this.bankerWin && !this.tie) {
     // console.log("cardSpace component", this.cardSpace.getComponent(Animation));
      cardNode.getComponent(Animation).on(
        Animation.EventType.FINISHED,
        () => {
          console.log("animation finished");
          this.drawThirdCard();
        },this,true);
    }
  }
  updatePlayerWallet(winName: WINNER) {
    console.log("UpdatePlayerWallet", winName);
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
          amount = amount + this.tieSpaceBet * 2;
          this.walletAmt.string = `${amount}`;
        }
        break;
    }
    this.removeBetChips();
  }
  removeBetChips() {
    for (let index = 0; index < this.tableNode.children.length; index++) {
      this.tableNode.children[index].destroyAllChildren();
    }
  }
  addCardToPlayer(cardNode, cardIndex) {
    console.log("Inside addCardToPlayer", cardNode);

    this.playerCardSpace.addChild(cardNode);
    this.playerScore = this.playerScore + (parseInt(this.cardsDeckArr[cardIndex].name) % 10);
    if (this.playerScore > 9) {
      this.playerScore = this.playerScore % 10;
    }
    this.playerScoreCard.string = this.playerScore.toString();
    console.log("PlayerScoreCard", this.playerScoreCard.string);
    this.space = this.space+(this.cardSpace.getComponent(UITransform).width/2)
    console.log("Printing card Space",this.space);
    
    cardNode.getComponent(UITransform).height = 0;
    cardNode.getComponent(UITransform).width = 0;
    
    cardNode.setPosition(new Vec3(0 + this.space, 140, 0));
  }
  addCardToBanker(cardNode, cardIndex) {
    this.bankerCardSpace.addChild(cardNode);
    this.bankerScore = this.bankerScore + (parseInt(this.cardsDeckArr[cardIndex].name) % 10);
    if (this.bankerScore > 9) {
      this.bankerScore = this.bankerScore % 10;
    }
    this.bankerScoreCard.string = this.bankerScore.toString();
    console.log("BankerScoreCard", this.bankerScoreCard.string);
    cardNode.getComponent(UITransform).height = 0;
    cardNode.getComponent(UITransform).width = 0;
    cardNode.setPosition(new Vec3(0 + this.space, 140, 0));
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
    console.log("CHECK WIN CALLED");
    // conditions after 2nd card
    if (this.playerScore == 8 || this.playerScore == 9 || this.bankerScore == 8 || this.bankerScore == 9) {
      if (this.playerScore > this.bankerScore) {
        this.playerWin = true;
        console.log("PLAYER WIN");
        this.tie = false;
        this.bankerWin = false;
        return WINNER.PLAYER;
      } else if (this.playerScore < this.bankerScore) {
        this.bankerWin = true;
        this.tie = false;
        this.playerWin = false;
        console.log("BANKER WIN");
        return WINNER.BANKER;
      } else {
        this.tie = true;
        console.log("TIE");
        this.playerWin = false;
        this.bankerWin = false;
        return WINNER.TIE;
      }
    }
    //third card drawn
    if (this.thirdCard) {
      if (this.playerScore > this.bankerScore) {
        this.playerWin = true;
        console.log("PLAYER WIN");
        this.tie = false;
        this.bankerWin = false;
        return WINNER.PLAYER;
      } else if (this.playerScore < this.bankerScore) {
        this.bankerWin = true;
        this.tie = false;
        this.playerWin = false;
        console.log("BANKER WIN");
        return WINNER.BANKER;
      } else {
        this.tie = true;
        console.log("TIE");
        this.playerWin = false;
        this.bankerWin = false;
        return WINNER.TIE;
      }
    }
  }

  drawThirdCard() {
    console.log("inside 3rd card");
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
      console.log("STAND Score is 6 or 7");
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
      console.log("Player drew 3 card inside switch");
      switch (this.bankerScore) {
        case 0:
        case 1:
        case 2:
          {
            console.log("2");
            if (playerThirdCard != 8 && playerThirdCard != 9) {
              this.addCardToBanker(cardNode, cardIndex);
          }
        }break;
        case 3:
          {
            console.log("3");
            if (this.playerScore != 8 && playerThirdCard != 8) {
              this.addCardToBanker(cardNode, cardIndex);
            }
          }
          break;
        case 4:
          {
            console.log("4");

            if (playerThirdCard >= 2 && playerThirdCard <= 7) {
              this.addCardToBanker(cardNode, cardIndex);
            }
          }
          break;
        case 5:
          {
            console.log("5");

            if (playerThirdCard >= 4 && playerThirdCard <= 7) {
              this.addCardToBanker(cardNode, cardIndex);
            }
          }
          break;
        case 6:
          {
            console.log("6");
            if (playerThirdCard == 6 || playerThirdCard == 7) {
              this.addCardToBanker(cardNode, cardIndex);
            }
          }
          break;
        case 7:
          {
            console.log("7");
            console.log("STAY banker Score = 7");
          }
          break;
      }
}else {
      if (this.bankerScore <= 5) {
          let { cardNode, cardIndex } = this.drawCard();
        this.addCardToBanker(cardNode, cardIndex);
      } else if (this.bankerScore == 6 || this.bankerScore == 7) {
        console.log("BANKER STAND");
        console.log("3rd Card not drawn by player and Banker Score 6 or 7");
      } 
    }
    callback();
  }
  update(deltaTime: number) {}
}
