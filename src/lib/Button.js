import { createElement } from '../helpers/createElement';

class Button {
  constructor({ text, onClick, classList, disabled = false }) {
    this.text = text;
    this.onClick = onClick;
    this.classList = classList;
    this.disabled = disabled;
  }

  render() {
    const button = createElement('button', this.classList, {
      innerHTML: this.text,
      disabled: this.disabled,
    });
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.onClick();
    });
    return button;
  }
}

export default Button;
