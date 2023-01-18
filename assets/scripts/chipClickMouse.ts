import { _decorator, Component, Node, UITransform, Vec3, Rect, instantiate, CCClass, Sprite, Vec2, director, Button } from "cc";
import { playerScreen } from "./playerScreen/playerScreen";
const { ccclass, property } = _decorator;
@ccclass("chipClickMouse")
export class chipClickMouse extends Component {
  @property({ type: Node }) tableNode: Node = null;
  @property({ type: playerScreen }) playerScreenRef: playerScreen = null;
  mousePos: import("cc").math.Vec3;
  chipInitialPos: Vec3;
  newChip: Node = null;

  start() {
    //var manager = director.getCollisionManager();
    this.mouseEventsFunc();
  }

  mouseEventsFunc() {
    this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
    this.node.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
    this.node.on(Node.EventType.TOUCH_END, this.touchEnd, this);
    this.node.on(Node.EventType.TOUCH_CANCEL, this.touchMove, this);
  }
  touchStart(event) {
    if (!this.node.getComponent(Sprite).grayscale) {
      this.newChip = instantiate(this.node);
      this.node.parent.addChild(this.newChip);
      this.mousePos = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
      //initial position of selected Chip
      //  console.log(this.mousePos);

      this.chipInitialPos = this.node.getPosition();
      // //console.log("Printing position", this.chipPos);
      this.mousePos.x = this.mousePos.x - this.chipInitialPos.x;
      this.mousePos.y = this.mousePos.y - this.chipInitialPos.y;
    }
  }
  touchMove(event) {
    // console.log(this.node.getPosition());

    if (!this.node.getComponent(Sprite).grayscale) {
      event.target.position = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x - this.mousePos.x, event.getUILocation().y - this.mousePos.y, 0));
      var pos = this.node.getPosition();
      this.node.setPosition(pos);
      
      // let chip = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
      // let chipContextSize = this.node.getComponent(UITransform);
      // let chipRect = new Rect(chip.x, chip.y, chipContextSize.width, chipContextSize.height);
      // // let chipRect2 = new Vec2(chip.x, chip.y)
      // for (let index = 0; index < this.tableNode.children.length; index++) {
      //   let child = this.tableNode.children[index].children[0];
      //   let selectedSpacePos = child.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
      //   let selectedSpaceSize = child.getComponent(UITransform);
      //   let selectedSpaceRect = new Rect(selectedSpacePos.x, selectedSpacePos.y, selectedSpaceSize.width, selectedSpaceSize.height);
      //   // //console.log(rect2);
      //   if (selectedSpaceRect.containsRect(chipRect) || selectedSpaceRect.intersects(chipRect)) {
      //     console.log("INTERSECTS");
      //     child.parent.getComponent(Sprite).grayscale = false
      //     //  //console.log(this.node.getPosition());
      //   }
      //   else{
      //     child.parent.getComponent(Sprite).grayscale = true
      //   }
      // }
    }
  }
  touchEnd(event) {
    if (!this.node.getComponent(Sprite).grayscale) {
      console.log("TOUCH END");
      let chip = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
      let chipContextSize = this.node.getComponent(UITransform);
      let chipRect = new Rect(chip.x, chip.y, chipContextSize.width, chipContextSize.height);
      // let chipRect2 = new Vec2(chip.x, chip.y)
      for (let index = 0; index < this.tableNode.children.length; index++) {
        let child = this.tableNode.children[index].children[0];
        let selectedSpacePos = child.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
        let selectedSpaceSize = child.getComponent(UITransform);
        let selectedSpaceRect = new Rect(selectedSpacePos.x, selectedSpacePos.y, selectedSpaceSize.width/2, selectedSpaceSize.height/2);
        // //console.log(rect2);
        if (selectedSpaceRect.containsRect(chipRect) || selectedSpaceRect.intersects(chipRect)) {
          //
          console.log("INTERSECTS");
          console.log(child, this.tableNode.children[index]);
          this.tableNode.children[index].children[0].addChild(this.node);
          this.node.getComponent(chipClickMouse).destroy();
          event.currentTarget.setPosition(new Vec3(0, 0, 0));
          this.playerScreenRef.selectedChip(event.currentTarget, this.tableNode.children[index]);
          break;
        } else {
          event.currentTarget.setPosition(new Vec3(this.chipInitialPos.x, this.chipInitialPos.y, 0));
        }
      }
    }
   // this.highlightEvent();
  }
  highlightEvent(){
    for(let index = 0;index<this.tableNode.children.length;index++){
      this.tableNode.children[index].getComponent(Button).enabled = false
    }
  }

  update(deltaTime: number) {}
}
