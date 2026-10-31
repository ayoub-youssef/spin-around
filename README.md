# spin-around

A MakeCode Arcade extension that makes one sprite spin around another sprite.

## Blocks

### Spin

* **make [sprite] spin around [center] at distance [distance] speed [speed] degrees per second [direction]**  
  Starts making `sprite` travel in a circle around `center`. Call this block once (for
  example, in **on start**); the sprite keeps spinning until you stop it.
  * `distance` is the radius of the circle, in pixels.
  * `speed` is how many degrees the sprite travels each second.
  * `direction` is **clockwise** or **counter-clockwise**.

* **stop [sprite] from spinning**  
  Stops the sprite where it is.

### Change

While a sprite is spinning, you can change its settings:

* **set [sprite] spin speed to [speed] degrees per second**
* **set [sprite] spin distance to [distance]**
* **set [sprite] spin direction to [direction]**

## Example

```blocks
let player = sprites.create(img`
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . 5 5 . . . . . .
    . . . . . . . 5 5 5 5 . . . . .
    . . . . . . 5 5 5 5 5 5 . . . .
    . . . . . . 5 5 5 5 5 5 . . . .
    . . . . . . . 5 5 5 5 . . . . .
    . . . . . . . . 5 5 . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`, SpriteKind.Player)

let orbiter = sprites.create(img`
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . 2 2 2 2 . . . . .
    . . . . . . 2 2 2 2 2 2 . . . .
    . . . . . . 2 2 2 2 2 2 . . . .
    . . . . . . 2 2 2 2 2 2 . . . .
    . . . . . . 2 2 2 2 2 2 . . . .
    . . . . . . . 2 2 2 2 . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`, SpriteKind.Food)

spinAround.startSpinning(orbiter, player, 40, 120, spinAround.SpinDirection.Clockwise)
```

## Use this extension

This folder is a MakeCode Arcade extension project. To use it in the editor, put it in a
GitHub repository (or use the MakeCode extension development flow), then:

* open [https://arcade.makecode.com/](https://arcade.makecode.com/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* paste the URL of the repository and import it

## How it works

The extension keeps a list of sprites that are spinning. On every game update it moves each
spinning sprite to the next point on a circle around its center sprite. The circle is
recomputed each frame, so the spinning sprite follows the center sprite if it moves.

## Metadata

* for PXT/arcade
