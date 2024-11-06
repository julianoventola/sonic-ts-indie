import { Vec2 } from "kaplay";
import k from "../kaplayCtx";
export function makeSonic(pos: Vec2) {
  const sonic = k.add([
    k.sprite("sonic", { anim: "run" }),
    k.scale(4),
    k.area(),
    k.anchor("center"),
    k.pos(pos)
  ])
}