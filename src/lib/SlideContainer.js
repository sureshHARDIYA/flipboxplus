import Slide from './Slide';
import { createElement } from '../helpers/createElement';

class SlideContainer {
  constructor({ slides, currentSlideIndex }, flipBoxInstance) {
    this.slides = slides;
    this.currentSlideIndex = currentSlideIndex;
    this.flipBoxInstance = flipBoxInstance;
  }

  renderEmptySlide() {
    const emptySlide = createElement('div', ['empty-slide'], {
      id: 'skm-empty-slide',
    });
    emptySlide.innerText = 'No slide yet';
    return emptySlide;
  }

  render() {
    const slideWrapper = createElement('div', ['slideshow-container'], {
      id: 'skm-slider',
    });

    const totalSlides = this.slides.length;

    if (totalSlides > 0) {
      this.slides.forEach((slide, index) => {
        const slideComponent = new Slide(
          slide,
          index,
          totalSlides,
          this.flipBoxInstance,
        );
        const slideElement = slideComponent.render();
        slideWrapper.appendChild(slideElement);
      });
    }

    if (!totalSlides) {
      const emptyPage = this.renderEmptySlide();
      slideWrapper.appendChild(emptyPage);
    }

    return slideWrapper;
  }
}

export default SlideContainer;
