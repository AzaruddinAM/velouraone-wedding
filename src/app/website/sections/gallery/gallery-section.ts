import { Component } from '@angular/core';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Photo gallery – shows the couple photo in different crops & tones. */
@Component({
  selector: 'app-gallery-section',
  imports: [Motif],
  templateUrl: './gallery-section.html',
  styleUrl: './gallery-section.scss',
})
export class GallerySection extends WebsitePartBase {
  protected readonly tiles = [
    { id: 1, shape: 'tall', focus: '50% 30%', filter: 'none', opacity: 0.55 },
    { id: 2, shape: '', focus: '20% 50%', filter: 'grayscale(1)', opacity: 0.35 },
    { id: 3, shape: '', focus: '80% 40%', filter: 'sepia(0.4)', opacity: 0.45 },
    { id: 4, shape: 'wide', focus: '50% 70%', filter: 'saturate(1.2)', opacity: 0.3 },
    { id: 5, shape: '', focus: '30% 20%', filter: 'contrast(1.1)', opacity: 0.5 },
  ];
}
