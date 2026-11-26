import { Component, computed } from '@angular/core';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/**
 * Photo gallery. With several photos each tile shows its own photo (all of them are shown);
 * with one photo it is shown in different crops & tones.
 */
@Component({
  selector: 'app-gallery-section',
  imports: [Motif],
  templateUrl: './gallery-section.html',
  styleUrl: './gallery-section.scss',
})
export class GallerySection extends WebsitePartBase {
  private readonly looks = [
    { id: 1, shape: 'tall', focus: '50% 30%', filter: 'none', opacity: 0.55 },
    { id: 2, shape: '', focus: '20% 50%', filter: 'grayscale(1)', opacity: 0.35 },
    { id: 3, shape: '', focus: '80% 40%', filter: 'sepia(0.4)', opacity: 0.45 },
    { id: 4, shape: 'wide', focus: '50% 70%', filter: 'saturate(1.2)', opacity: 0.3 },
    { id: 5, shape: '', focus: '30% 20%', filter: 'contrast(1.1)', opacity: 0.5 },
  ];

  protected readonly tiles = computed(() => {
    const photos = this.vm().photos;
    if (photos.length <= 1) return this.looks.map((look) => ({ ...look, src: photos[0] ?? null }));
    // Own photos: natural colours and centred crops; big/wide shapes repeat in a pleasing rhythm.
    const shapes = ['tall', '', '', 'wide', '', ''];
    return photos.map((src, i) => ({ id: i + 1, shape: shapes[i % shapes.length], focus: '50% 40%', filter: 'none', opacity: 1, src }));
  });
}
