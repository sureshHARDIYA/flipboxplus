import Slide from './Slide';
import Button from './Button';
import SlideContainer from './SlideContainer';
import { createElement } from '../helpers/createElement';

import './style.css';

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
      rows: data?.rows ?? [],
    };
    this.widgetWrapper = undefined;
    this.editing = false;
    this.currentSlideIndex = 0;
  }

  setEditing(value) {
    this.editing = value;
  }

  render() {
    this.widgetWrapper = createElement('div', ['outer-container']);
    const slideContainer = new SlideContainer(
      {
        slides: this.data.rows,
        currentSlideIndex: this.currentSlideIndex,
      },
      this,
    ).render();

    const paginationWrapper = this.renderPagination();
    const buttonWrapper = this.renderActions();

    this.widgetWrapper.appendChild(slideContainer);
    this.widgetWrapper.appendChild(paginationWrapper);
    this.widgetWrapper.appendChild(buttonWrapper);

    return this.widgetWrapper;
  }

  renderPagination() {
    const paginationWrapper = createElement('div', ['holder'], {
      id: 'skm-pagination',
    });
    this.data.rows.forEach((_, index) => {
      const dotClass =
        index === this.currentSlideIndex ? ['dot', 'active'] : ['dot'];
      const dot = createElement('span', dotClass, {
        onclick: () => {
          this.currentSlideIndex = index;
          this.showSlide(index);
        },
      });
      paginationWrapper.appendChild(dot);
    });
    return paginationWrapper;
  }

  renderActions() {
    const addButton = new Button({
      text: 'Add',
      classList: ['action', 'addButton'],
      onClick: () => {
        this.addSlide();
      },
    }).render();

    const editButton = new Button({
      text: 'Edit',
      disabled: this.editing || this.data.rows.length === 0,
      classList: ['action', 'editIcon'],
      onClick: () => {
        this.editSlide();
      },
    }).render();

    const saveButton = new Button({
      text: 'Save',
      disabled: !this.editing,
      classList: ['action', 'saveButton'],
      onClick: () => {
        this.saveSlide();
      },
    }).render();

    const deleteButton = new Button({
      text: 'Delete',
      disabled: this.editing || this.data.rows.length === 0,
      classList: ['action', 'deleteButton'],
      onClick: () => {
        this.deleteSlide();
      },
    }).render();

    const buttonWrapper = createElement('div', ['button-wrapper']);
    buttonWrapper.appendChild(addButton);
    buttonWrapper.appendChild(editButton);
    buttonWrapper.appendChild(saveButton);
    buttonWrapper.appendChild(deleteButton);

    return buttonWrapper;
  }

  addSlide() {
    this.setEditing(false);
    const newSlideIndex = this.data.rows.length;

    // Remove empty slide if it exists
    const emptySlide = document.getElementById('skm-empty-slide');
    if (emptySlide) {
      emptySlide.remove();
    }

    // Create a new slide object
    const newSlide = new Slide(
      {
        front: `<h3>New Slide title ${newSlideIndex + 1}</h3>`,
        back: `<div>New Slide Content ${newSlideIndex + 1}</div>`,
      },
      newSlideIndex,
      this.data.rows.length,
      this,
    );

    // Add the new slide to the data
    const rowsCopy = [...this.data.rows];
    rowsCopy[newSlideIndex] = {
      front: newSlide.front,
      back: newSlide.back,
    };
    this.data.rows = rowsCopy;

    // Render the new slide and append it to the slider container
    const sliderContainer = document.getElementById('skm-slider');
    const newSlideElement = newSlide.render(newSlideIndex, true);
    sliderContainer.appendChild(newSlideElement);

    // Create a new pagination dot and append it to the pagination holder
    const paginationHolder = document.getElementById('skm-pagination');
    const newDot = createElement('span', ['dot'], {
      onclick: () => this.showSlide(newSlideIndex),
    });
    paginationHolder.appendChild(newDot);

    // Show the new slide and update button state
    this.showSlide(newSlideIndex);
    this.updateButtonState();

    // Update slide indexes
    this.updateIndex();
  }

  updateIndex() {
    const slides = document.getElementsByClassName('mySlides');
    for (let i = 0; i < slides.length; i++) {
      const slideIndex = slides[i].querySelector('.slideIndex');
      if (slideIndex) {
        slideIndex.innerHTML = `${i + 1}/${this.data.rows.length}`;
      }
    }
  }

  deleteSlide() {
    const index = this.currentSlideIndex;

    if (confirm(`Are you sure you want to delete slide ${index + 1}?`)) {
      this.data.rows.splice(index, 1);

      const slides = document.getElementsByClassName('mySlides');
      const dots = document.getElementsByClassName('dot');

      slides[index].remove();
      dots[index].remove();

      // Update slide indexes
      this.updateIndex();

      // Update currentSlideIndex if needed
      if (index === this.currentSlideIndex) {
        if (this.currentSlideIndex >= slides.length) {
          this.currentSlideIndex = slides.length - 1;
        }
      } else if (index < this.currentSlideIndex) {
        this.currentSlideIndex--;
      }

      // Update pagination dots
      for (let i = 0; i < dots.length; i++) {
        dots[i].onclick = () => this.showSlide(i);
      }

      // Show the updated current slide
      this.showSlide(this.currentSlideIndex);

      this.updateButtonState();
    }
  }

  editSlide() {
    this.setEditing(true);

    const slides = document.getElementsByClassName('mySlides');
    const currentSlide = slides[this.currentSlideIndex];
    this.setEditable(currentSlide, true);

    // Place cursor at the end of the contenteditable element
    const editableFront = currentSlide.querySelector('.front-content');
    const editableBack = currentSlide.querySelector('.back-content');

    if (currentSlide.classList.contains('reveal')) {
      editableBack.focus();
    } else {
      editableFront.focus();
    }

    // Place cursor at the end of the contenteditable element for both front and back content
    // const selection = window.getSelection();
    // const anchorNode = selection.anchorNode;
    // if (editableFront.contains(anchorNode)) {
    //   this.setCursorToEnd(editableFront);
    // } else if (editableBack.contains(anchorNode)) {
    //   this.setCursorToEnd(editableBack);
    // }
    this.updateButtonState();
  }

  // setCursorToEnd(editableArea) {
  //   const range = document.createRange();
  //   const sel = window.getSelection();
  //   range.selectNodeContents(editableArea);
  //   range.collapse(false); // Place cursor at the end
  //   sel.removeAllRanges();
  //   sel.addRange(range);
  // }

  setEditable(slide, value) {
    slide.querySelector('.front-content').contentEditable = value;
    slide.querySelector('.back-content').contentEditable = value;

    const editableArea = slide.querySelector('.editable');
    if (value) {
      editableArea.classList.add('focus-visible');
      editableArea.focus();
      editableArea.style.caretColor = 'black';
    }

    if (!value) {
      editableArea.classList.remove('focus-visible');
    }
  }

  saveSlide() {
    this.setEditing(false);
    const slides = document.getElementsByClassName('mySlides');
    const currentSlide = slides[this.currentSlideIndex];
    this.setEditable(currentSlide, false);

    const frontContent = currentSlide.querySelector('.front-content');
    const backContent = currentSlide.querySelector('.back-content');

    const rowsCopy = [...this.data.rows];
    rowsCopy[this.currentSlideIndex] = {
      front: frontContent.innerHTML,
      back: backContent.innerHTML,
    };
    this.data.rows = rowsCopy;

    document
      .getElementsByClassName('mySlides')
      [this.currentSlideIndex].classList.remove('isEditing');

    this.updateButtonState();
  }

  updateButtonState() {
    const editIcon = this.widgetWrapper.querySelector('.editIcon');
    const saveButton = this.widgetWrapper.querySelector('.saveButton');
    const deleteButton = this.widgetWrapper.querySelector('.deleteButton');

    if (this.editing) {
      editIcon.disabled = true;
      saveButton.disabled = false;
    } else {
      editIcon.disabled = false;
      saveButton.disabled = true;
    }

    if (this.data.rows.length) {
      deleteButton.disabled = false;
      editIcon.disabled = false;
    } else {
      deleteButton.disabled = true;
      editIcon.disabled = true;
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
