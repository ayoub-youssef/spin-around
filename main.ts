/**
 * Blocks for making a sprite spin around another sprite.
 */
//% color="#7C4DFF" icon="\uf01e"
//% groups='["Spin", "Change"]'
namespace spinAround {
    export enum SpinDirection {
        //% block="clockwise"
        Clockwise = 1,
        //% block="counter-clockwise"
        CounterClockwise = -1
    }

    class Orbit {
        angle: number;

        constructor(
            public sprite: Sprite,
            public center: Sprite,
            public distance: number,
            public speed: number,
            public direction: number
        ) {
            // Start from wherever the sprite currently is, so it does not jump
            // to a different side of the center sprite.
            const dx = sprite.x - center.x;
            const dy = sprite.y - center.y;
            this.angle = (dx === 0 && dy === 0) ? -90 : Math.atan2(dy, dx) * 180 / Math.PI;
        }
    }

    function orbitsFor(sc: scene.Scene, create = false): Orbit[] {
        let orbits = (sc as any).__spinAroundOrbits as Orbit[];
        if (!orbits && create) {
            orbits = [];
            (sc as any).__spinAroundOrbits = orbits;
        }
        return orbits;
    }

    function startUpdating(sc: scene.Scene) {
        if ((sc as any).__spinAroundUpdating) return;
        (sc as any).__spinAroundUpdating = true;
        sc.eventContext.registerFrameHandler(scene.UPDATE_PRIORITY, () => updateOrbits(sc));
    }

    function updateOrbits(sc: scene.Scene) {
        const orbits = orbitsFor(sc);
        if (!orbits || !orbits.length) return;

        // Cap the time step so the sprite does not jump a long way after a pause.
        const dt = Math.min(game.eventContext().deltaTime, 0.1);
        const keep: Orbit[] = [];

        for (let i = 0; i < orbits.length; i++) {
            const orbit = orbits[i];

            // Stop if either sprite has been removed from the game.
            if ((orbit.sprite.flags | orbit.center.flags) & sprites.Flag.Destroyed) {
                continue;
            }

            orbit.angle = (orbit.angle + orbit.speed * orbit.direction * dt) % 360;
            const radians = orbit.angle * Math.PI / 180;

            orbit.sprite.setPosition(
                orbit.center.x + Math.cos(radians) * orbit.distance,
                orbit.center.y + Math.sin(radians) * orbit.distance
            );

            keep.push(orbit);
        }

        if (keep.length !== orbits.length) {
            (sc as any).__spinAroundOrbits = keep;
        }
    }

    function findOrbit(sprite: Sprite): Orbit {
        const orbits = orbitsFor(game.currentScene());
        if (!orbits) return undefined;
        for (let i = 0; i < orbits.length; i++) {
            if (orbits[i].sprite === sprite) return orbits[i];
        }
        return undefined;
    }

    /**
     * Makes a sprite spin around another sprite.
     * @param sprite the sprite that will spin
     * @param center the sprite to spin around
     * @param distance how far from the center sprite to spin, eg: 40
     * @param speed how fast to spin, in degrees per second, eg: 90
     * @param direction the direction to spin
     */
    //% blockId=spinAroundStart
    //% block="make $sprite=variables_get spin around $center=variables_get | at distance $distance speed $speed degrees per second $direction"
    //% distance.defl=40 distance.min=0
    //% speed.defl=90 speed.min=0
    //% direction.defl=SpinDirection.Clockwise
    //% group="Spin"
    //% weight=100
    //% blockGap=8
    export function startSpinning(sprite: Sprite, center: Sprite, distance: number, speed: number, direction: SpinDirection) {
        if (!sprite || !center || sprite === center) return;

        const sc = game.currentScene();
        startUpdating(sc);

        const orbits = orbitsFor(sc, true);
        for (let i = 0; i < orbits.length; i++) {
            if (orbits[i].sprite === sprite) {
                orbits.splice(i, 1);
                break;
            }
        }

        orbits.push(new Orbit(
            sprite,
            center,
            Math.max(0, distance || 0),
            Math.max(0, speed || 0),
            direction === SpinDirection.CounterClockwise ? -1 : 1
        ));
    }

    /**
     * Stops a sprite from spinning around another sprite.
     * @param sprite the sprite to stop
     */
    //% blockId=spinAroundStop
    //% block="stop $sprite=variables_get from spinning"
    //% group="Spin"
    //% weight=90
    export function stopSpinning(sprite: Sprite) {
        if (!sprite) return;

        const orbits = orbitsFor(game.currentScene());
        if (!orbits) return;

        const keep: Orbit[] = [];
        for (let i = 0; i < orbits.length; i++) {
            if (orbits[i].sprite !== sprite) {
                keep.push(orbits[i]);
            }
        }
        (game.currentScene() as any).__spinAroundOrbits = keep;
    }

    /**
     * Changes how fast a sprite spins.
     * @param sprite the spinning sprite
     * @param speed the new speed, in degrees per second
     */
    //% blockId=spinAroundSetSpeed
    //% block="set $sprite=variables_get spin speed to $speed degrees per second"
    //% speed.defl=90 speed.min=0
    //% group="Change"
    //% weight=80
    export function setSpinSpeed(sprite: Sprite, speed: number) {
        const orbit = findOrbit(sprite);
        if (orbit) orbit.speed = Math.max(0, speed || 0);
    }

    /**
     * Changes how far from the center sprite a sprite spins.
     * @param sprite the spinning sprite
     * @param distance the new distance from the center sprite
     */
    //% blockId=spinAroundSetDistance
    //% block="set $sprite=variables_get spin distance to $distance"
    //% distance.defl=40 distance.min=0
    //% group="Change"
    //% weight=70
    export function setSpinDistance(sprite: Sprite, distance: number) {
        const orbit = findOrbit(sprite);
        if (orbit) orbit.distance = Math.max(0, distance || 0);
    }

    /**
     * Changes the direction a sprite spins.
     * @param sprite the spinning sprite
     * @param direction the new direction
     */
    //% blockId=spinAroundSetDirection
    //% block="set $sprite=variables_get spin direction to $direction"
    //% direction.defl=SpinDirection.Clockwise
    //% group="Change"
    //% weight=60
    export function setSpinDirection(sprite: Sprite, direction: SpinDirection) {
        const orbit = findOrbit(sprite);
        if (orbit) {
            orbit.direction = direction === SpinDirection.CounterClockwise ? -1 : 1;
        }
    }
}
