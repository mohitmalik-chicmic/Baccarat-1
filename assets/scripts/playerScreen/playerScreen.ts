import { _decorator, Component, Node, Sprite, SpriteFrame, instantiate, Vec3, Label, resources, UITransform, Prefab } from "cc";
import { popUpPrefab } from "../popUp/popUp";
const { ccclass, property } = _decorator;

@ccclass("playerScreen")
export class playerScreen extends Component {
  @property({ type: Node }) playerCardSpace: Node = null;
  @property({ type: Node }) bankerCardSpace: Node = null;
  @property({ type: Node }) cardSpace: Node = null;
  @property({ type: Node }) tableNode: Node = null;
  @property({ type: Label }) bankerScoreCard: Label = null;
  @property({ type: Label }) betAmt: Label = null;
  @property({ type: Label }) playerScoreCard: Label = null;
  @property({type : Prefab}) popUp : Prefab = null;
  betAmount: number = 0;
  playerScore: number = 0;
  bankerScore: number = 0;
  space: number = 0;
  thirdCard: boolean = false;
  bankerWin: boolean = false;
  playerWin: boolean = false;
  gameEnd: boolean = false;
  tie: boolean = false;
  cardsDeckArr: SpriteFrame[] = null;
  selectedBetAmt: Node = null;


  start() {
    this.loadCards();
  }
  loadCards() {
    resources.loadDir("cardDeck", SpriteFrame, (err, spriteFrame) => {
      if (err) {
        console.log("ERROR");
        return;
      }
      this.cardsDeckArr = spriteFrame;
    });
  }
  selectedChip(chipSelected: Node) {
    this.selectedBetAmt = chipSelected;
    console.log(this.selectedBetAmt.name);
    this.betAmount = this.betAmount + parseInt(this.selectedBetAmt.name);
    this.setBet();
  }
  setBet() {
    this.betAmt.string = `${this.betAmount}`;
  }
  cardDistribution() {
    this.playerScore = 0;
    this.bankerScore = 0;
    this.space = 0;
    let index = 1;
    this.schedule( () => {
        let { cardNode, cardIndex } = this.drawCard();
        if (index % 2 != 0) {
          this.addCardToPlayer(cardNode, cardIndex);
        } else {
          this.addCardToBanker(cardNode, cardIndex);
        }
        this.space = index * 40;
        console.log("Printing index", index);
        if(index==4)
          this.func();
        index++;
      },2,3,0);
  }
  func() {
      let win = this.checkWin();
      if(this.playerWin || this.bankerWin || this.tie){
        let addpopUp = instantiate(this.popUp);
        this.node.addChild(addpopUp);
        addpopUp.getComponent(popUpPrefab).openPopUp(`${win}`);
        addpopUp.getComponent(popUpPrefab).closePopUp();
      }
      console.log("Printing winning", win, this.playerWin, this.bankerWin, this.tie);
      if (!this.playerWin && !this.bankerWin && !this.tie) {
        this.drawThirdCard();
      }
    
  }
  addCardToPlayer(cardNode, cardIndex) {
    this.playerCardSpace.addChild(cardNode);
    this.playerScore = this.playerScore + (parseInt(this.cardsDeckArr[cardIndex].name) % 10);
    if (this.playerScore > 9) {
      this.playerScore = this.playerScore % 10;
    }
    this.playerScoreCard.string = this.playerScore.toString();
    console.log("PlayerScoreCard", this.playerScoreCard.string);
    cardNode.getComponent(UITransform).height = 0;
    cardNode.getComponent(UITransform).width = 0;
    cardNode.setPosition(new Vec3(0 + this.space, 0, 0));
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
    cardNode.setPosition(new Vec3(0 + this.space, 0, 0));
  }
  drawCard() {
    let arraySize = this.cardsDeckArr.length;
    let cardIndex = Math.floor(Math.random() * (arraySize - 0) + 0);
    let cardNode = instantiate(this.cardSpace);
    cardNode.getComponent(Sprite).spriteFrame = this.cardsDeckArr[cardIndex];
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
        return "playerWin";
      } else if (this.playerScore < this.bankerScore) {
        this.bankerWin = true;
        this.tie = false;
        this.playerWin = false;
        console.log("BANKER WIN");
        return "bankerWin";
      } else {
        this.tie = true;
        console.log("TIE");
        this.playerWin = false;
        this.bankerWin = false;
        return "tie";
      }
    }
    //third card drawn
    if (this.thirdCard) {
      if (this.playerScore > this.bankerScore) {
        this.playerWin = true;
        console.log("PLAYER WIN");
        this.tie = false;
        this.bankerWin = false;
        return "playerWin";
      } else if (this.playerScore < this.bankerScore) {
        this.bankerWin = true;
        this.tie = false;
        this.playerWin = false;
        console.log("BANKER WIN");
        return "bankerWin";
      } else {
        this.tie = true;
        console.log("TIE");
        this.playerWin = false;
        this.bankerWin = false;
        return "tie";
      }
    }
  }

  drawThirdCard() {
    //if this.playerScore 6 or 7 player stand
    let playerThirdCard: number = 0;
    let pThirdCard: boolean = false;
    this.thirdCard = true;
    setTimeout(()=>{
    if (this.playerScore <= 5) {
      pThirdCard = true;
      console.log("Draw third card");
      let { cardNode, cardIndex } = this.drawCard();
      playerThirdCard = parseInt(this.cardsDeckArr[cardIndex].name) % 10;

      this.playerCardSpace.addChild(cardNode);
      cardNode.setPosition(new Vec3(0 + this.space, 0, 0));
      this.playerScore = this.playerScore + (parseInt(this.cardsDeckArr[cardIndex].name) % 10);
      if (this.playerScore > 9) {
        this.playerScore = this.playerScore % 10;
      }
      this.playerScoreCard.string = this.playerScore.toString();
      console.log("player score", this.playerScoreCard.string);
    } else {
      console.log("STAND Score is 6 or 7");
    }
  },2000);
  setTimeout(()=>{
    if (pThirdCard) {
      console.log("Player drew 3 card inside switch");
     
        switch (this.bankerScore) {
          case 0:
          case 1:
          case 2:
            {
              console.log("2");
  
              if (playerThirdCard == 8 || playerThirdCard == 9) {
                return;
              } else {
                let { cardNode, cardIndex } = this.drawCard();
                this.addCardToBanker(cardNode, cardIndex);
              }
            }
            break;
          case 3:
            {
              console.log("3");
  
              if (playerThirdCard == 8) return;
              if (this.playerScore != 8) {
                let { cardNode, cardIndex } = this.drawCard();
                this.addCardToBanker(cardNode, cardIndex);
              }
            }
            break;
          case 4:
            {
              console.log("4");
  
              if (playerThirdCard >= 2 && playerThirdCard <= 7) {
                let { cardNode, cardIndex } = this.drawCard();
                this.addCardToBanker(cardNode, cardIndex);
              }
            }
            break;
          case 5:
            {
              console.log("5");
  
              if (playerThirdCard >= 4 && playerThirdCard <= 7) {
                let { cardNode, cardIndex } = this.drawCard();
                this.addCardToBanker(cardNode, cardIndex);
              }
            }
            break;
          case 6:
            {
              console.log("6");
  
              if (playerThirdCard == 6 || playerThirdCard == 7) {
                let { cardNode, cardIndex } = this.drawCard();
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
     
       //end of switch
    } else {
      if (this.bankerScore <= 5) {
        let { cardNode, cardIndex } = this.drawCard();
        this.addCardToBanker(cardNode, cardIndex);
      } else if (this.bankerScore == 6 || this.bankerScore == 7) {
        console.log("BANKER STAND");
        console.log("3rd Card not drawn by player and Banker Score 6 or 7");
      }
    }
  
    let win = this.checkWin();
    if(this.playerWin || this.bankerWin || this.tie){
      let addpopUp = instantiate(this.popUp);
      this.node.addChild(addpopUp);
      addpopUp.getComponent(popUpPrefab).openPopUp(`${win}`);
      addpopUp.getComponent(popUpPrefab).closePopUp();
    }
    console.log("Printing winning", win, this.playerWin, this.bankerWin, this.tie);
  },4000)
  }
  update(deltaTime: number) {}
}
