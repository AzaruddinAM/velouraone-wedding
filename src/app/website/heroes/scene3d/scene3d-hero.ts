import { Component, computed } from '@angular/core';
import { Countdown } from '../../../shared/countdown/countdown';
import { ThreeScene } from '../../three/three-scene';
import { WebsitePartBase } from '../../website-part.base';

/**
 * Nikah 3D collection – a real-time WebGL scene (mosque, lanterns, rings,
 * geometric stars or crescent) with the couple's details layered on top.
 * Live and interactive on the website; a still snapshot in gallery thumbnails.
 */
@Component({
  selector: 'app-scene3d-hero',
  imports: [ThreeScene, Countdown],
  templateUrl: './scene3d-hero.html',
  styleUrl: './scene3d-hero.scss',
})
export class Scene3dHero extends WebsitePartBase {
  protected readonly sceneKind = computed(() => this.template().scene3d ?? 'mosque');
}
