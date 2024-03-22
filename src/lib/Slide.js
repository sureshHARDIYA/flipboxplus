import { createElement } from '../helpers/createElement';

class Slide {
  constructor({ front, back }, index, total, flipBoxInstance) {
    this.front = front;
    this.back = back;
    this.index = index;
    this.totalSlides = total;
    this.flipBoxInstance = flipBoxInstance;
    this.slideContainer = undefined;
  }

  flipSlide() {
    if (!this.flipBoxInstance?.editing) {
      const currentSlide = this.slideContainer;
      currentSlide.classList.toggle('reveal');
    }
  }

  render() {
    this.slideContainer = createElement('div', ['mySlides', 'fade']);
    const slideIndex = createElement('div', ['slideIndex'], {
      innerHTML: `${this.index + 1}/${this.totalSlides}`,
    });
    const frontText = createElement('div', ['front-content', 'editable'], {
      innerHTML: `<div>${this.front}</div>`,
      contentEditable: false,
    });
    const captionText = createElement('div', ['back-content', 'editable'], {
      innerHTML: `<div>${this.back}</div>`,
      contentEditable: false,
    });

    this.slideContainer.appendChild(slideIndex);
    this.slideContainer.appendChild(frontText);
    this.slideContainer.appendChild(captionText);
    this.slideContainer.addEventListener('click', () => this.flipSlide());

    if (this.index !== 0) {
      this.slideContainer.style.display = 'none';
    }
    return this.slideContainer;
  }
}

export default Slide;
