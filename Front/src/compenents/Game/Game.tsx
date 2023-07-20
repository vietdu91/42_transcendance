import React, { useRef, useEffect } from 'react'
import p5 from 'p5'
import Ball from "./Ball"
import Bar from "./Bar"

// CSS
import './Game.css'

// COMPONENTS
import '../utils/ReturnButtom/ReturnButtom'
import ReturnButtom from '../utils/ReturnButtom/ReturnButtom'

// IMG
import Chaos from '../../img/backgrounds/backgrounds-game/chaos.jpg'
import CityWok from '../../img/backgrounds/backgrounds-game/city_wok.jpg'
import WallMart from '../../img/backgrounds/backgrounds-game/wallmart.jpg'
import TimmyVSJimmy from '../../img/video/Timmy_Fights_Jimmy.mp4'

export default function Game(): JSX.Element {

    const images = [Chaos, CityWok, WallMart, TimmyVSJimmy];
    const sketchRef = useRef<HTMLDivElement>(null);
    const randomImage = getRandomImage(images);

    function getRandomImage(images: string[]): string {
        const index = Math.floor(Math.random() * images.length);
        return images[index];
    }

    function GetBg({randomImage}) {

        if (randomImage === TimmyVSJimmy)
            return (
                <video autoPlay muted loop className="bg opacity" src={randomImage}></video>
            )
        else
            return (
                <img className="bg" src={randomImage} alt={'bg'}></img>
            )
    }

    function WhatReturnButtom({randomImage}) {

        if (randomImage === CityWok || randomImage === Chaos)
            return (
                <ReturnButtom colorHexa='#FFFFFF' path='/'/>
            )
        else
            return (
                <ReturnButtom colorHexa='#000000' path='/'/>
            )
    }

    useEffect(() => {

        let ball, p1, p2;
        const sketch = new p5((p) => {
            let canvas: p5.Renderer;
            let cDiv, currentWidth, currentHeight;

            p.setup = () => {
                cDiv = sketchRef.current!;
                currentWidth = cDiv.clientWidth;
                currentHeight = cDiv.clientHeight;
                canvas = p.createCanvas(cDiv.clientWidth, cDiv.clientHeight);
                canvas.parent(cDiv);
                const player_width = cDiv.clientWidth / 75;
                const player_height = cDiv.clientHeight / 5;
                const ball_rad = cDiv.clientHeight / 75;
                const ball_speed = cDiv.clientWidth / 150;

                ball = new Ball(cDiv, p, cDiv.clientWidth / 2, cDiv.clientHeight / 2, ball_rad, ball_speed);
                p1 = new Bar(cDiv, p, player_width, cDiv.clientHeight / 2 - (player_height / 2), player_width, player_height);
                p2 = new Bar(cDiv, p, cDiv.clientWidth - (player_width * 2), cDiv.clientHeight / 2 - (player_height / 2), player_width, player_height);
            };

            p.draw = () => {
                p.background(52);
                p1.moveBar("w", "s");

                // jouer contre joueur humain
                // p2.moveBar("up", "down");

                ////////////////////////
                // jouer contre l'IA (impossible) / commenter ligne du dessus

                p2.pos.y = ball.pos.y - p2.h / 2;
                p2.pos.y = p2.p5.constrain(p2.pos.y, p2.cDiv.clientHeight / 150, p2.cDiv.clientHeight - (p2.cDiv.clientHeight / 150) - p2.h);
                ////////////////////////
                if (ball.out(p1, p2)) {
                    p1.reset(cDiv.clientWidth / 75, cDiv.clientHeight /2 - (cDiv.clientHeight / 10));
                    p2.reset(cDiv.clientWidth - (cDiv.clientWidth / 75 * 2), cDiv.clientHeight /2 - (cDiv.clientHeight / 10));
                }
                ball.update();
                ball.hit(p1, p2);
                p1.show();
                p2.show();
                ball.show();
            };

            p.windowResized = () => {
                const oldWidth = currentWidth;
                const oldHeight = currentHeight;
                cDiv = sketchRef.current!;
                currentWidth = cDiv.clientWidth;
                currentHeight = cDiv.clientHeight;
                p.resizeCanvas(cDiv.clientWidth, cDiv.clientHeight);

                const player_width = cDiv.clientWidth / 75;
                const player_height = cDiv.clientHeight / 5;
                const ball_rad = cDiv.clientHeight / 75;
                const ball_speed = cDiv.clientWidth / 150;

                const p1y = (p1.pos.y * cDiv.clientHeight / oldHeight);
                const p2y = (p2.pos.y * cDiv.clientHeight / oldHeight);

                const ballX = (ball.pos.x * cDiv.clientWidth / oldWidth);
                const ballY = (ball.pos.y * cDiv.clientHeight / oldHeight);

                p1 = new Bar(cDiv, p, player_width, p1y, player_width, player_height);
                p2 = new Bar(cDiv, p, cDiv.clientWidth - (player_width * 2), p2y, player_width, player_height);

                p1.setAll(cDiv, player_width, p1y, player_width, player_height);
                p2.setAll(cDiv, cDiv.clientWidth - (player_width * 2), p2y, player_width, player_height);

                ball.setCDiv(cDiv);
                ball.setPos(ballX, ballY);
                ball.setRad(ball_rad);
                ball.setSpeed(ball_speed);
            };
        });
        return () => {
            sketch.remove();
        };
    }, []);

    return (
        <>
            <GetBg randomImage={randomImage}/>
            <div id="game" ref={sketchRef}></div>
            <div id="return">
                <WhatReturnButtom randomImage={randomImage}/>
            </div>
        </>
    );
}
