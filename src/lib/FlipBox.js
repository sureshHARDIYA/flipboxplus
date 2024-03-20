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
  }

  render() {
    const wrapper = createElement('div', ['slideshow-container']);

    const slidContainer = createElement('div', ['mySlides', 'fade']);
    const slideIndex = createElement('div', ['numbertext'], {
      innerContent: '1/3',
    });
    const frontText = createElement('div', ['front-content'], {
      innerHTML: 'Something will come up',
    });
    const captionText = createElement('div', ['text']);
    slidContainer.appendChild(slideIndex);
    slidContainer.appendChild(frontText);
    slidContainer.appendChild(captionText);

    wrapper.appendChild(slidContainer);

    const prev = createElement('a', 'pre');
    const next = createElement('a', 'next');
    wrapper.appendChild(prev);
    wrapper.appendChild(next);

    return wrapper;
  }

  save(blockContent) {
    return {
      url: blockContent.value,
    };
  }
}

export default SKMFlipBox;
