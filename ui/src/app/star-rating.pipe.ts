import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'starRating',
  standalone: true,
})
export class StarRatingPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(rate: number): SafeHtml {
    const fullStars = Math.floor(rate);
    const halfStar = rate % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    const fullStarIcon = `<i class="ri-star-fill" style="color: rgb(255, 123, 0)" ></i>`;
    const halfStarIcon = `<i class="ri-star-half-fill" style="color: rgb(255, 123, 0)"></i>`;
    const emptyStarIcon = `<i class="ri-star-line" style="color: rgb(200, 200, 200)"></i>`;

    // Generate the HTML string
    const starsHtml = 
      fullStarIcon.repeat(fullStars) + 
      (halfStar ? halfStarIcon : '') + 
      emptyStarIcon.repeat(emptyStars);

    // Sanitize the HTML to avoid Angular security issues
    return this.sanitizer.bypassSecurityTrustHtml(starsHtml);
  }
}
