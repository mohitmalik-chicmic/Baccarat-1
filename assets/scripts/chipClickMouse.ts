import { _decorator, Component, Node, UITransform, Vec3, Rect, instantiate, CCClass } from "cc";
import { playerScreen } from "./playerScreen/playerScreen";
const { ccclass, property } = _decorator;
@ccclass("chipClickMouse")
export class chipClickMouse extends Component {
  @property({ type: Node }) tableNode: Node = null;
  @property({ type: playerScreen }) playerScreenRef: playerScreen = null;
  rect: import("cc").math.Vec3;
  chipPos: Vec3;
  newChip: Node = null;

  start() {
    this.mouseEventsFunc();
  }

  mouseEventsFunc() {
    this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
    this.node.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
    this.node.on(Node.EventType.TOUCH_END, this.touchEnd, this);
    this.node.on(Node.EventType.TOUCH_CANCEL, this.touchMove, this);
  }
  touchStart(event) {
    this.newChip = instantiate(this.node);
    this.node.parent.addChild(this.newChip);
    this.rect = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
    //initial position of selected Chip
    this.chipPos = this.node.getPosition();
    // console.log("Printing position", this.chipPos);
    this.rect.x = this.rect.x - this.chipPos.x;
    this.rect.y = this.rect.y - this.chipPos.y;
  }
  touchMove(event) {
    event.target.position = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x - this.rect.x, event.getUILocation().y - this.rect.y, 0));
    var pos = this.node.getPosition();
    this.node.setPosition(pos);
    //  console.log(this.node.getPosition());
  }
  touchEnd(event) {
    console.log("TOUCH END");

    let chip = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
    //let chip = this.node.getPosition();
    console.log(chip);

    let size1 = this.node.getComponent(UITransform);
    let rect1 = new Rect(chip.x, chip.y, size1.width, size1.height);
    // console.log(rect1);

    for (let index = 0; index < this.tableNode.children.length; index++) {
      //   console.log(this.tableNode.children[index].children);

      let child = this.tableNode.children[index].children[0];
      let p = child.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
      let pos1 = this.tableNode.children[index].getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
      let size2 = child.getComponent(UITransform);
      let rect2 = new Rect(pos1.x, pos1.y, size2.width, size2.height);
      // console.log(rect2);
      if (rect2.containsRect(rect1) || rect2.intersects(rect1)) {
        console.log(true);
        //   console.log(this.tableNode.children[index]);
        console.log(this.tableNode.children[index]);

        this.tableNode.children[index].addChild(this.node);
        this.node.getComponent(chipClickMouse).destroy();
        event.currentTarget.setPosition(new Vec3(0, 0, 0));
        this.playerScreenRef.selectedChip(event.currentTarget);
        break;
      } else {
        event.currentTarget.setPosition(new Vec3(this.chipPos.x, this.chipPos.y, 0));
      }
    }
  }

  update(deltaTime: number) {}
}
