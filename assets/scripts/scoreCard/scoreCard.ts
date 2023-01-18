import { _decorator, Component, Node, Label, director } from 'cc';
const { ccclass, property } = _decorator;

// enum WINNER {
//     PLAYER= "player",
//     BANKER="banker",
//     TIE="tie",
//     PLAYERPAIR="playerPair",
//     BANKERPAIR="bankerPair"
//   }
@ccclass('scoreCard')
export class scoreCard extends Component {
    @property({type : Node}) scoreLabels : Node = null;
    parentFunctionCallback : Function = null;
    start() {

    }
    updateScoreCard(winName){
        let x= winName.toLowerCase()
        let currentScore = parseInt(this.scoreLabels.getChildByName(`${x}`).getComponent(Label).string)
        currentScore++;
        this.scoreLabels.getChildByName(`${x}`).getComponent(Label).string = currentScore.toString();
    }

    reloadScene(){
        setTimeout(()=>{
          director.loadScene("gameplay");
        },1000)
      }
      nextGameCallback(btncallback: Function){
        //call received from gameplay.start()
        this.parentFunctionCallback = btncallback
    }
      nextGameButton(event){
        console.log("Next button clicked");
        this.parentFunctionCallback(true);
      }
    //     switch(winName){
    //         case WINNER.PLAYER:{

    //         }break;
    //         case WINNER.BANKER:{

    //         }break;
    //         case WINNER.TIE:{

    //         }break;
    //         case WINNER.PLAYERPAIR:{

    //         }break;
    //         case WINNER.BANKERPAIR:{

    //         }break;
    //     }
    // }
    update(deltaTime: number) {
        
    }
}

