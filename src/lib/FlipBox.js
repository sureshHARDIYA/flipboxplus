import { createElement } from '../helpers/createElement';

class SKMFlipBox {
  static get toolbox() {
    return {
      title: 'Flipbox',
      icon: 'FB',
    };
  }

  constructor({ data, config, api, readOnly }) {
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
    this.wrapper = undefined;
    this.settings = [
      {
        name: 'FlipBox',
        icon: `F`,
        type: 'FLIP'
      },
      {
        name: 'Carousel',
        icon: `C`,
        type: 'CAROUSEL'
      },
      {
        name: 'Carousel FlipBox',
        icon: `CF`,
        type: 'CAROUSEL_FLIPBOX'
      }
    ];
  }

  renderSettings(){
    const wrapper = document.createElement('div');

    this.settings.forEach( tune => {
      let button = document.createElement('div');

      button.classList.add('cdx-settings-button');
      button.innerHTML = tune.icon;
      wrapper.appendChild(button);

      button.addEventListener('click', () => {
        this.config['type'] = tune.type;
        button.classList.toggle('cdx-settings-button--active');
      });
    });

    return wrapper;
  }

  render() {
    this.widgetWrapper = createElement('div', ['outer-container']);
    const wrapper = createElement('div', ['slideshow-container']);

    // Create slides
    this.data.rows.forEach((row, index) => {
        const slideContainer = createElement('div', ['mySlides', 'fade']);
        const slideIndex = createElement('div', ['numbertext'], {
            innerHTML: `${index + 1}/${this.data.rows.length}`,
        });
        const frontText = createElement('div', ['front-content'], {
            innerHTML: row.front,
        });
        const captionText = createElement('div', ['back-content', 'caption'], {
            innerHTML: row.back,
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

    this.widgetWrapper.appendChild(wrapper);

    // Create slider holder
    const holder = createElement('div', ['holder']);
    this.data.rows.forEach((_, index) => {
        const dotClass = index === 0 ?  ['dot', 'active'] : ['dot'];
        const dot = createElement('span', dotClass, {
            onclick: () => this.showSlide(index),
        });
        holder.appendChild(dot);
    });

    this.widgetWrapper.appendChild(holder);

    return this.widgetWrapper;
}

revealSlide(index) {
  const slides = document.getElementsByClassName('mySlides');
  const currentSlide = slides[index];

  currentSlide.classList.toggle('reveal');
}

showSlide(index) {
  const slides = document.getElementsByClassName('mySlides');
  const dots = document.getElementsByClassName('dot');

  for (let i = 0; i < slides.length; i++) {
      if (i === index) {
          slides[i].style.display = 'block';
          slides[i].classList.add('fade'); 
          slides[i].classList.add('active'); 
      } else {
          slides[i].style.display = 'none';
          slides[i].classList.remove('fade'); 
          slides[i].classList.remove('active');
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
