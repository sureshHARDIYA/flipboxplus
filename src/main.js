import EditorJS from '@editorjs/editorjs';

import SKMFlipBox from './lib/FlipBox';
import './style.css';

const data = [
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
    back: "<p>Our latest Campaign E is focused on <b>raising awareness</b> and driving positive change. Through strategic initiatives and community engagement, we aim to make a difference in people's lives. Join us in supporting Campaign E and be part of something meaningful.</p>",
  },
];

const editor = new EditorJS({
  holder: 'editorjs',
  tools: {
    flip: {
      class: SKMFlipBox,
      inlineToolbar: true,
    },
  },
  data: {
    time: 1552744582955,
    blocks: [
      {
        type: 'flip',
        data: data,
      },
    ],
    version: '2.11.10',
  },
});
document.getElementById('saveJi').onclick = async () => {
  const savedData = await editor.save();
  console.log('savedData', savedData);
};
