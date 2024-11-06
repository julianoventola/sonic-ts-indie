import { Vec2 } from "kaplay";
import k from "../kaplayCtx";

export function makeSonic(pos: Vec2) {
  const sonic = k.add([
    k.sprite("sonic", { anim: "run" }),
    k.scale(4),
    k.area(),
    k.anchor("center"),
    k.pos(pos),
    k.body({ jumpForce: 1700 }),
    {
      ringCollectUI: k.add([k.text("", { font: "mania", size: 24 }),]),
      setControls() {
        k.onButtonPress("jump", () => {
          if (sonic.isGrounded()) {
            sonic.play("jump") // animation
            sonic.jump()
            k.play("jump", { volume: 0.3 }) // sound
          }
        })
      },
      setEvents() {
        sonic.onGround(() => {
          sonic.play("run")
        })
      }
    }
  ])

  sonic.ringCollectUI = k.add([
    k.text("", { font: "mania", size: 24 }),
    k.color(255, 255, 0),
    k.anchor("center"),
    k.pos(30, -10)])

  return sonic
}