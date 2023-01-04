import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
import { loading } from '../loading/loading';
const { ccclass, property } = _decorator;

@ccclass('gameplay')
export class gameplay extends Component {
    @property({type : Prefab})
    loadingScreenPrefab : Prefab = null; 
    start() {
        let loadingScreen = instantiate(this.loadingScreenPrefab);
        this.node.addChild(loadingScreen);
        loadingScreen.getComponent(loading).startGame(this.mainScreen);
    }
    mainScreen = (node : Node) =>{
        console.log(node);
        if(node.active == false){
            console.log("Button Pressed");
            
        }
        
    }
    update(deltaTime: number) {
        
    }
}

