import { createElement } from '../helpers/createElement';

class SKMFlipBox {
  static get toolbox() {
    return {
      title: 'Flipbox',
      icon: 'FB',
    };
  }

   static get enableLineBreaks() {
    return true;
  }


  constructor({ data, config, api, readOnly }) {
    this.api = api;
    this.data = {
      rows: [
        {
          front: '<h3>Product A</h3>',
          back: '<p>This is a description of Product A. It is a high-quality product designed to meet the needs of our customers. With its sleek design and advanced features, Product A is the perfect solution for your everyday needs.</p>',
        },
        {
          front: '<h3>Service B</h3>',
          back: '<p>Service B offers comprehensive solutions tailored to your specific requirements. Our team of experts is dedicated to providing top-notch service and ensuring your satisfaction. From consultation to implementation, Service B is here to help you achieve your goals.</p>',
        },
        {
          front: '<h3>Event C</h3>',
          back: "<p>Join us for Event C, an exciting opportunity to network with industry leaders and gain valuable insights. With engaging presentations and interactive workshops, Event C promises to be an enriching experience for all attendees. Don't miss out on this chance to connect and learn!</p>",
        },
        {
          front: '<h3>Project D</h3>',
          back: '<p>Project D is a collaborative effort aimed at driving innovation and fostering growth. With a diverse team and cutting-edge technology, we are poised to make a meaningful impact in our industry. Join us on this journey as we work towards a brighter future.</p>',
        },
        {
          front: '<h3>Campaign E</h3>',
          back: "<p>Our latest Campaign E is focused on raising awareness and driving positive change. Through strategic initiatives and community engagement, we aim to make a difference in people's lives. Join us in supporting Campaign E and be part of something meaningful.</p>",
        },
      ],
    };
    this.config = {
      type: 'CAROUSEL',
      ...config
    };
    this.widgetWrapper = undefined;
    this.editing = false;
    this.currentSlideIndex = 0;
  }

  render() {
    this.widgetWrapper = createElement('div', ['outer-container']);
    const slideWrapper = createElement('div', ['slideshow-container'], {
      id: 'skm-slider'
    });
    const paginationWrapper = createElement('div', ['holder'], { id: 'skm-pagination'});

    // Create slides
    this.renderSlide(slideWrapper);
    const holderWrapper = this.renderPagination(paginationWrapper);
    const buttonWrapper = this.renderActions(this.currentSlideIndex);

    this.widgetWrapper.appendChild(slideWrapper);  
    this.widgetWrapper.appendChild(holderWrapper);
    this.widgetWrapper.appendChild(buttonWrapper);

   return this.widgetWrapper;
}

renderPagination(element) {
  this.data.rows.forEach((_, index) => {
    const dotClass = index === 0 ?  ['dot', 'active'] : ['dot'];
    const dot = createElement('span', dotClass, {
      onclick: () => {
        this.currentSlideIndex = index;
        this.showSlide(index)
      },
    });
    element.appendChild(dot);
  });

  return element;
}

  renderActions(currentSlideIndex) {
    const editButton = createElement('button', ['editIcon'], {
      innerHTML: `Edit`,
      disabled: this.editing, // Disable the Edit button when editing is in progress
    });
    editButton.addEventListener('click', () => this.editSlide(currentSlideIndex));

    const saveButton = createElement('button', ['saveButton'], {
      innerHTML: `Save`,
      disabled: !this.editing,
    });
    saveButton.addEventListener('click', () => this.saveSlide(currentSlideIndex));

    const addButton = createElement('button', ['addButton'], {
      innerHTML: `Add`,
    });
    addButton.addEventListener('click', () => this.addSlide());

    const deleteButton = createElement('button', ['deleteButton'], {
      innerHTML: `Delete`,
    });
    deleteButton.addEventListener('click', () => this.deleteSlide(currentSlideIndex));

    const buttonWrapper = createElement('div', ['button-wrapper']);
    buttonWrapper.appendChild(addButton);
    buttonWrapper.appendChild(deleteButton);
    buttonWrapper.appendChild(editButton);
    buttonWrapper.appendChild(saveButton);

    return buttonWrapper;
  }

  renderSlide(wrapper) {
    this.data.rows.forEach((row, index) => {
      const slideContainer = createElement('div', ['mySlides', 'fade', 'cdx-resource']);
      const slideIndex = createElement('div', ['numbertext'], {
        innerHTML: `${index + 1}/${this.data.rows.length}`,
      });
      const frontText = createElement('div', ['front-content', 'cdx-resource__message'], {
        innerHTML: row.front,
        contentEditable: true,
      });
      const captionText = createElement('div', ['back-content', 'caption', 'cdx-resource__message'], {
        innerHTML: row.back,
        contentEditable: true,
      });


      slideContainer.appendChild(slideIndex);

      slideContainer.appendChild(frontText);
      slideContainer.appendChild(captionText);

      slideContainer.addEventListener('click', () => this.revealSlide(index));


      if (index !== 0) {
        slideContainer.style.display = 'none';
      }

      wrapper.appendChild(slideContainer);
    });
  }

addSlide() {
  this.data.rows.push({
      front: 'NEW',
      back: 'Add Content',
  });
  this.renderSlide(document.getElementById('skm-slider'));

  const dot = createElement('span', ['dot'], {
    onclick: () => {
      this.currentSlideIndex = this.currentSlideIndex + 1;
      this.showSlide(this.currentSlideIndex + 1)
    },
  });

  document.getElementById('skm-pagination').appendChild(dot);
}

deleteSlide(index) {
  this.data.rows.splice(index, 1);
  this.updateSlides();
}

updateSlides() {
  this.data.rows.forEach((row, index) => {
      const frontContent = row.front;
      const backContent = row.back;
      const blockIndex = index + 1; // Assuming block indices start from 1

      // Find the block with the matching ID
      const block = this.api.blocks.getBlockByIndex(0);

      // Update the block content if found
      if (block) {
          this.api.blocks.update(block.id, { data: { frontContent, backContent } });
      } else {
          console.error(`Block with index ${blockIndex} not found.`);
      }
  });
}



editSlide(index) {
  this.editing = true; 
  const slides = document.getElementsByClassName('mySlides');
  slides[index].classList.add('isEditing');
  this.updateButtonState();
}


saveSlide(index) {
  console.log('Save clicked', index); 
  this.editing = false; 
  document.getElementsByClassName('mySlides')[index].classList.remove('isEditing');
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
  console.log('DING DING DING', this.editing);
  if (!this.editing) {
      const slides = document.getElementsByClassName('mySlides');
      const currentSlide = slides[index];
      currentSlide.classList.toggle('reveal');
  }
}

showSlide(index) {
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


  save(blockContent) {
    return {
      url: blockContent.value,
    };
  }
}

export default SKMFlipBox;
