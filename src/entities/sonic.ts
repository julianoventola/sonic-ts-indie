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
      ringCollectUI: k.add([k.text("", { font: "mania", size: 96 }),]),
      ringMultiplierCollectUI: k.add([k.text("", { font: "mania", size: 96 }),]),
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
    k.text("", { font: "mania", size: 96 }),
    k.color(255, 255, 0),
    k.anchor("center"),
    k.pos(200, 600)])

  sonic.ringMultiplierCollectUI = k.add([
    k.text("", { font: "mania", size: 96 }),
    k.color(255, 255, 0),
    k.anchor("center"),
    k.pos(350, 700)])


  return sonic
}