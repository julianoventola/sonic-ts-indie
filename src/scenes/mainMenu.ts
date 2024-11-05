import { GameObj, OpacityComp, PosComp, ScaleComp, SpriteComp, AreaComp } from "kaplay";
import k from "../kaplayCtx";

type Piece = GameObj<SpriteComp | PosComp | ScaleComp | OpacityComp | AreaComp>

export default function mainMenu(): void {
  if (!k.getData("best-score")) {
    k.setData("best-score", 0)
  }
  k.onButtonPress("jump", () => {
    k.go("game")
  })

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

  k.onUpdate(() => {
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

    platforms[0].move(-600, 0)
    platforms[1].moveTo(platforms[0].pos.x + platformWidth * platformScale, 450)
  })
}