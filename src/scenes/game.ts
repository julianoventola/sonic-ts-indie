import { GameObj, OpacityComp, PosComp, ScaleComp, SpriteComp, AreaComp } from "kaplay";
import k from "../kaplayCtx";
import { makeSonic } from "../entities/sonic";
import { makeMotoBug } from "../entities/motobug";
import { makeRing } from "../entities/ring";

type Piece = GameObj<SpriteComp | PosComp | ScaleComp | OpacityComp | AreaComp>

export default function game() {
  k.setGravity(3100)
  const citySfx = k.play("city", { volume: 0.1, loop: true })

  const bgPieceWidth = 1920;
  const bgScale = 2
  const bgPieces = [
    k.add([
      k.sprite("chemical-bg"),
      k.pos(0, 0),
      k.scale(bgScale),
      k.opacity(0.8),
    ]),
    k.add([
      k.sprite("chemical-bg"),
      k.pos(bgPieceWidth * 2, 0),
      k.scale(bgScale),
      k.opacity(0.8),
    ])
  ]

  const platformWidth = 1280
  const platformScale = 4
  const platforms = [
    k.add([
      k.sprite("platforms"),
      k.pos(0, 450),
      k.scale(platformScale),
    ]),
    k.add([
      k.sprite("platforms"),
      k.pos(platformWidth * platformScale, 450),
      k.scale(platformScale),
    ])
  ]

  let score = 0;
  let scoreMultiplier = 0

  const scoreText = k.add([
    k.text("SCORE: 0", { font: "mania", size: 72 }),
    k.pos(20, 20)
  ])

  const sonic = makeSonic(k.vec2(200, 745))
  sonic.setControls()
  sonic.setEvents()
  sonic.onCollide("enemy", (enemy) => {
    if (!sonic.isGrounded()) {
      k.play("destroy", { volume: 0.3 })
      k.play("hyper-ring", { volume: 0.3 })
      k.destroy(enemy)
      sonic.play("jump")
      sonic.jump()
      scoreMultiplier += 1
      score += 10 * scoreMultiplier
      scoreText.text = `SCORE: ${score}`
      if (scoreMultiplier === 1) {
        sonic.ringCollectUI.text = "+10"
      }
      if (scoreMultiplier > 1) {
        sonic.ringCollectUI.text = `x${scoreMultiplier * 10} `
      }
      k.wait(1, () => {
        sonic.ringCollectUI.text = ""
      })
      return
    }
    k.play("hurt", { volume: 0.3 })
    k.setData("current-score", score)
    k.go("game-over", citySfx)
  })

  sonic.onCollide("ring", (ring) => {
    k.play("ring", { volume: 0.3 })
    k.destroy(ring)
    score += 1
    scoreText.text = `SCORE: ${score}`
    sonic.ringCollectUI.text = "+1"
    k.wait(1, () => sonic.ringCollectUI.text = "")
  })

  let gameSpeed = 300;
  k.loop(1, () => {
    gameSpeed += 200;
  })

  const spawnRing = () => {
    const ring = makeRing(k.vec2(1950, 745))

    ring.onUpdate(() => {
      ring.move(-gameSpeed, 0)
    })

    ring.onExitScreen(() => {
      if (ring.pos.x < 0) {
        k.destroy(ring)
      }
    })
    const waitTime = k.rand(0.1, 0.3)
    k.wait(waitTime, spawnRing)
  }
  spawnRing()

  const spawnMotobug = () => {
    const motobug = makeMotoBug(k.vec2(1950, 773))

    motobug.onUpdate(() => {
      if (gameSpeed > 2000) {
        motobug.move(-(gameSpeed + 500), 0)
        return
      }
      motobug.move(-gameSpeed, 0)
    })

    motobug.onExitScreen(() => {
      if (motobug.pos.x < 0) {
        k.destroy(motobug)
      }
    })

    const waitTime = k.rand(0.5, 4)
    k.wait(waitTime, spawnMotobug)
  }

  spawnMotobug()


  k.add([
    k.rect(bgPieceWidth, 300),
    k.opacity(0),
    k.area(),
    k.pos(0, 832),
    k.body({ isStatic: true })
  ])

  k.onUpdate(() => {
    if (sonic.isGrounded()) {
      scoreMultiplier = 0
    }

    bgPieces[0].moveTo(bgPieces[0].pos.x, -sonic.pos.y / 10 - 50)
    bgPieces[1].moveTo(bgPieces[1].pos.x, -sonic.pos.y / 10 - 50)

    if (bgPieces[1].pos.x < 0) {
      bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * bgScale, 0)
      const piece = bgPieces.shift() as Piece
      bgPieces.push(piece)
    }

    bgPieces[0].move(-100, 0)
    bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * bgScale, 0)

    if (platforms[1].pos.x < 0) {
      platforms[0].moveTo(platforms[1].pos.x + platformWidth * platformScale, 450)
      const piece = platforms.shift() as Piece
      platforms.push(piece)
    }

    platforms[0].move(-gameSpeed, 0)
    platforms[1].moveTo(platforms[0].pos.x + platformWidth * platformScale, 450)
  })
}