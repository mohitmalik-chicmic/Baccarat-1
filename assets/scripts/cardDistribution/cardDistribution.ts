import { _decorator, Component, Node, resources, ImageAsset } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('cardDistribution')
export class cardDistribution extends Component {
    parentFunctionCallback : Function = null;

    callbackLoading(func : Function){
        this.parentFunctionCallback = func;
        console.log("inside callbackLoading func");
        this.loadCards()
    }
    loadCards() {
        resources.loadDir('cardDeck', ImageAsset,(err, imageAsset)=>{
            if(err){
                return
            }
            else{
                this.parentFunctionCallback(imageAsset)
                console.log("Printing cardDeck folder in cardDistribution", imageAsset);
            }
        })
    }

    update(deltaTime: number) {
        
    }
}

