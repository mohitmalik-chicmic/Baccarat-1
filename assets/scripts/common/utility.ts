import { _decorator, Component, Node, tween, Vec3 } from "cc";
const { ccclass, property } = _decorator;

export function playPopUpOpenAnimation(node: Node) {
    node.active = true;
    tween(node)
        .to(0, { scale: new Vec3(0.4, 0.6, 0) })
        .to(0.099, { scale: new Vec3(1.1, 1.15, 1) })
        .to(0.0462, { scale: new Vec3(1.15, 1, 1) })
        .to(0.0462, { scale: new Vec3(1.15, 1.06, 1) })
        .to(0.066, { scale: new Vec3(1, 1, 1) })
        .start();
}

export function playPopUpCloseAnimation(node: Node, callback?: Function) {
    tween(node)
        .to(0.0462, { scale: new Vec3(1.15, 1.06, 1) })
        .to(0.0462, { scale: new Vec3(1.15, 1, 1) })
        .to(0.099, { scale: new Vec3(1.1, 1.15, 1) })
        .to(0, { scale: new Vec3(0.4, 0.6, 0) })
        .to(0.066, { scale: new Vec3(0, 0, 0) })
        .call(() => {
            node.active = false;
            callback && callback();
        })
        .start();
}

