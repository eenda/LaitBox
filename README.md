
# LaitBox - lightbox for Bootstrap 5

LaitBox is a custom implementation of a modal-based lightbox library that enhances the modal functionality of Bootstrap 5. It is designed to load and display dynamic content within modals, offering extensive customization options to fit various requirements.

## Features

- **Dynamic Content Loading**: Load content dynamically into a Bootstrap 5 modal.
- **Configurable Options**: Customize modal size, keyboard interactions, backdrop behavior, and more.
- **Vertical Centering**: Option to vertically center modals.
- **Scrollable Modals**: Support for scrollable modals.
- **Header and Footer**: Options to include or exclude header and footer in the modal.
- **Fade Effect**: Control the fade animation of modal appearance.

## Installation

To use LaitBox in your project, include the following scripts in your HTML file. Make sure to have Bootstrap 5 CSS and JS already included.

```html
<!-- Include Bootstrap CSS -->
<link rel="stylesheet" href="path_to_bootstrap/bootstrap.min.css">

<!-- Include Bootstrap JS and its dependencies -->
<script src="path_to_bootstrap/bootstrap.bundle.min.js"></script>

<!-- Include LaitBox JS -->
<script src="path_to_your_scripts/laitbox.js"></script>
```

## Usage

Here is a simple example to demonstrate how to initialize and use LaitBox on elements with specific data attributes.

### HTML

```html
<a href="url_to_load_content.html" data-bs-toggle="laitbox" data-bs-target="#exampleModal">Open LaitBox</a>
```

### JavaScript

```javascript
// Initialize LaitBox with options
const options = {
    keyboard: true,
    size: 'lg',
    staticBackdrop: true,
    header: true,
    footer: true,
    fade: false,
    centered: true,
    scrollable: true
};

// Attach LaitBox to elements
document.querySelectorAll('[data-bs-toggle="laitbox"]').forEach((el) => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        const laitBox = new LaitBox(el, options);
        laitBox.show();
    });
});
```

## Options

The following options can be set either globally via JavaScript or per element via data attributes:

- `size` (default: 'lg'): Modal size ('sm', 'lg', 'xl').
- `keyboard` (default: true): Close the modal when escape key is pressed.
- `staticBackdrop` (default: false): Set to `true` to disable closing the modal by clicking the backdrop.
- `header` (default: true): Include a header in the modal.
- `footer` (default: false): Include a footer in the modal.
- `fade` (default: true): Enable/disable fade animation.
- `centered` (default: true): Vertically center the modal.
- `scrollable` (default: false): Make the modal content scrollable.

## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.

## License

LaitBox is open-sourced software licensed under the [MIT license](LICENSE).
