import { createElement } from '../helpers/createElement';

class SKMFlipBox {
  static get toolbox() {
    return {
      title: 'FlipBox',
      icon: 'FB',
    };
  }

  static get enableLineBreaks() {
    return true;
  }

  static get sanitize() {
    return {
      rows: true,
    };
  }

  constructor({ data, api }) {
    this.api = api;
    this.data = {
      rows: data,
    };
    this.widgetWrapper = undefined;
    this.editing = false;
    this.currentSlideIndex = 0;
  }

  render() {
    this.widgetWrapper = createElement('div', ['outer-container']);
    const slideWrapper = createElement('div', ['slideshow-container'], {
      id: 'skm-slider',
    });
    const paginationWrapper = createElement('div', ['holder'], {
      id: 'skm-pagination',
    });

    this.renderSlider(slideWrapper);
    const holderWrapper = this.renderPagination(paginationWrapper);
    const buttonWrapper = this.renderActions(this.currentSlideIndex);

    this.widgetWrapper.appendChild(slideWrapper);
    this.widgetWrapper.appendChild(holderWrapper);
    this.widgetWrapper.appendChild(buttonWrapper);

    return this.widgetWrapper;
  }

  renderPagination(element) {
    this.data.rows.forEach((_, index) => {
      const dotClass = index === 0 ? ['dot', 'active'] : ['dot'];
      const dot = createElement('span', dotClass, {
        onclick: () => {
          this.currentSlideIndex = index;
          this.showSlide(index);
        },
      });
      element.appendChild(dot);
    });

    return element;
  }

  renderActions(currentSlideIndex) {
    const editButton = createElement('button', ['action', 'editIcon'], {
      innerHTML: `Edit`,
      disabled: this.editing,
    });
    editButton.addEventListener('click', () => this.editSlide());

    const saveButton = createElement('button', ['action', 'saveButton'], {
      innerHTML: `Save`,
      disabled: !this.editing,
    });
    saveButton.addEventListener('click', () => this.saveSlide());

    const addButton = createElement('button', ['action', 'addButton'], {
      innerHTML: `Add`,
    });
    addButton.addEventListener('click', () => this.addSlide());

    const deleteButton = createElement('button', ['action', 'deleteButton'], {
      innerHTML: `Delete`,
    });
    deleteButton.addEventListener('click', () => this.deleteSlide());

    const buttonWrapper = createElement('div', ['button-wrapper']);
    buttonWrapper.appendChild(addButton);
    buttonWrapper.appendChild(deleteButton);
    buttonWrapper.appendChild(editButton);
    buttonWrapper.appendChild(saveButton);

    return buttonWrapper;
  }

  /**
   * Renders the entire slider container
   * @param {wrapper} wrapper
   */
  renderSlider(wrapper) {
    this.data.rows.forEach((row, index) => {
      const slideContainer = this.renderSlide(index, row);
      wrapper.appendChild(slideContainer);
    });
  }

  /**
   * Renders one slide
   * @param {int} index
   * @param {object} row
   * @returns
   */
  renderSlide(index, row) {
    const slideContainer = createElement('div', [
      'mySlides',
      'fade',
      'cdx-resource',
    ]);
    const slideIndex = createElement('div', ['slideIndex'], {
      innerHTML: `${index + 1}/${this.data.rows.length}`,
    });
    const frontText = createElement(
      'div',
      ['front-content', 'cdx-resource__message'],
      {
        innerHTML: row.front,
        contentEditable: false,
      },
    );
    const captionText = createElement(
      'div',
      ['back-content', 'caption', 'cdx-resource__message'],
      {
        innerHTML: row.back,
        contentEditable: false,
      },
    );

    slideContainer.appendChild(slideIndex);
    slideContainer.appendChild(frontText);
    slideContainer.appendChild(captionText);
    slideContainer.addEventListener('click', () => this.revealSlide(index));

    if (index !== 0) {
      slideContainer.style.display = 'none';
    }
    return slideContainer;
  }

  addSlide() {
    const newSlideIndex = this.data.rows.length;
    const row = {
      front: `<h3>New Slide title ${newSlideIndex + 1}</h3>`,
      back: `New Slide Content ${newSlideIndex + 1}`,
    };
    this.data.rows.push(row);

    document
      .getElementById('skm-slider')
      .appendChild(this.renderSlide(newSlideIndex, row));

    const dot = createElement('span', ['dot'], {
      onclick: () => {
        this.showSlide(newSlideIndex);
      },
    });

    document.getElementById('skm-pagination').appendChild(dot);
    this.showSlide(newSlideIndex);
  }

  deleteSlide() {
    const index = this.currentSlideIndex;

    if (confirm(`Are you sure you want to delete slide ${index + 1}?`)) {
      console.log('Delete slide', index);
      this.data.rows.splice(index, 1);

      const slides = document.getElementsByClassName('mySlides');
      const dots = document.getElementsByClassName('dot');
      slides[index].remove();
      dots[index].remove();

      if (index === this.currentSlideIndex) {
        if (this.currentSlideIndex >= slides.length) {
          this.currentSlideIndex = slides.length - 1;
        }
      } else if (index < this.currentSlideIndex) {
        this.currentSlideIndex--;
      }
      this.showSlide(this.currentSlideIndex);
    }
  }

  editSlide() {
    this.editing = true;

    const slides = document.getElementsByClassName('mySlides');
    this.setEditable(slides[this.currentSlideIndex], true);
    this.updateButtonState();
  }

  setEditable(slide, value) {
    slide.querySelector('.front-content').contentEditable = value;
    slide.querySelector('.back-content').contentEditable = value;
  }

  saveSlide() {
    this.editing = false;
    const slides = document.getElementsByClassName('mySlides');
    const currentSlide = slides[this.currentSlideIndex];
    this.setEditable(currentSlide, false);

    const frontContent = currentSlide.querySelector('.front-content');
    const backContent = currentSlide.querySelector('.back-content');
    this.data.rows[this.currentSlideIndex] = {
      front: frontContent.innerHTML,
      back: backContent.innerHTML,
    };

    document
      .getElementsByClassName('mySlides')
      [this.currentSlideIndex].classList.remove('isEditing');

    this.updateButtonState();
  }

  updateButtonState() {
    const editIcon = this.widgetWrapper.querySelector('.editIcon');
    const saveButton = this.widgetWrapper.querySelector('.saveButton');

    if (this.editing) {
      editIcon.disabled = true;
      saveButton.disabled = false;
    } else {
      editIcon.disabled = false;
      saveButton.disabled = true;
    }
  }

  revealSlide(index) {
    if (!this.editing) {
      const slides = document.getElementsByClassName('mySlides');
      const currentSlide = slides[index];
      currentSlide.classList.toggle('reveal');
    }
  }

  showSlide(index) {
    this.currentSlideIndex = index;
    const slides = document.getElementsByClassName('mySlides');
    const dots = document.getElementsByClassName('dot');

    for (let i = 0; i < slides.length; i++) {
      if (i === index) {
        slides[i].style.display = 'block';
        slides[i].classList.add('fade');
      } else {
        slides[i].style.display = 'none';
        slides[i].classList.remove('fade');
      }
    }

    for (let i = 0; i < dots.length; i++) {
      if (i === index) {
        dots[i].classList.add('active');
      } else {
        dots[i].classList.remove('active');
      }
    }
  }

  save(_blockContent) {
    return {
      rows: this.data.rows,
    };
  }
}

export default SKMFlipBox;
