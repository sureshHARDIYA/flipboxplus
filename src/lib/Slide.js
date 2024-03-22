import { createElement } from '../helpers/createElement';

class Slide {
    constructor({ front, back },  index, total, editing) {
      this.front = front;
      this.back = back;
      this.index = index;
      this.totalSlides = total;
      this.editing = editing;
    }

    flipSlide(index) {
      console.log('IS EDITING', this.editing);
      if (!this.editing) {
        const slides = document.getElementsByClassName('mySlides');
        const currentSlide = slides[index];
        currentSlide.classList.toggle('reveal');
      }
    }
  
    render() {
      const slideContainer = createElement('div', ['mySlides', 'fade']);
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
  
      slideContainer.appendChild(slideIndex);
      slideContainer.appendChild(frontText);
      slideContainer.appendChild(captionText);
      slideContainer.addEventListener('click', () => this.flipSlide(this.index));
  
      if (this.index !== 0) {
        slideContainer.style.display = 'none';
      }
      return slideContainer;
    }
  }

  export default Slide;