import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
import { loading } from '../loading/loading';
import { popUpPrefab } from '../popUp/popUp';
const { ccclass, property } = _decorator;

@ccclass('gameplay')
export class gameplay extends Component {
    @property({type : Prefab})
    loadingScreenPrefab : Prefab = null; 
    @property ({type : Prefab}) mainGamePlay : Prefab = null;
    @property({type : Prefab}) placeBetPopUp : Prefab = null;
    start() {
        let loadingScreen = instantiate(this.loadingScreenPrefab);
        this.node.addChild(loadingScreen);
        loadingScreen.getComponent(loading).startGame(this.mainScreen);
    }
    mainScreen = (node : Node) =>{
        //console.log(node);
        if(node.active == false){
            //console.log("Button Pressed");
            let mainGamePlay = instantiate(this.mainGamePlay);
            this.node.addChild(mainGamePlay);
            let popUp = instantiate(this.placeBetPopUp);
            mainGamePlay.addChild(popUp);
            popUp.getComponent(popUpPrefab).openPopUp("PLACE YOUR BETS")
            popUp.getComponent(popUpPrefab).closePopUp()
            
        }
        
    }
    update(deltaTime: number) {
        
    }
}

