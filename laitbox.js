/**
 * LaitBox - A Custom Lightbox Library for Bootstrap 5
 * 
 * @version 1.0.0
 * @license MIT
 * @author EENDA
 * @website https://www.eenda.com
 * @repository https://github.com/eenda
 * 
 * Description:
 * This library provides a custom implementation of modal-based lightbox functionality for Bootstrap 5,
 * enabling dynamic content loading and display in a modal. It offers flexible configuration options
 * that can be set globally or via data attributes.
 * 
 * Features:
 * - Load dynamic content into a Bootstrap 5 modal.
 * - Configurable modal size, keyboard interactions, backdrop behavior, header, footer, and fade effect.
 * - Optional vertical centering and scrollable content within the modal.
 * - Special handling for images to ensure they are centered properly within the modal body.
 * 
 * Example Usage:
 * ```javascript
 * const options = {
 *     keyboard: true,
 *     size: 'lg',
 *     staticBackdrop: true,  // Optional: use a static backdrop that doesn't close the modal on background click
 *     header: true,          // Optional: include a modal header
 *     footer: false,         // Optional: include a modal footer
 *     fade: true,            // Optional: enable fade effect
 *     centered: true,        // Optional: center modal vertically
 *     scrollable: false      // Optional: make modal scrollable
 * };
 * 
 * document.querySelectorAll('[data-bs-toggle="laitbox"]').forEach((el) => {
 *     el.addEventListener('click', (e) => {
 *         e.preventDefault();
 *         const laitBox = new LaitBox(el, options);
 *         laitBox.show();
 *     });
 * });
 * ```
 */

class LaitBox {
    /**
     * Constructs an instance of LaitBox.
     * @param {HTMLElement} triggerElement - The element that triggers the lightbox.
     * @param {Object} options - Configuration options for the lightbox.
     */
    constructor(triggerElement, options = {}) {
        this.triggerElement = triggerElement;
        this.options = Object.assign({
            size: 'lg',
            keyboard: true,
            staticBackdrop: false,
            header: true,
            footer: false,
            fade: true,
            centered: true,
            scrollable: false
        }, this.parseDataAttributes(), options);
        this.initModal();
    }

    /**
     * Parses data attributes from the trigger element to configure options.
     * @returns {Object} An object with configuration options based on data attributes.
     */
    parseDataAttributes() {
        return {
            size: this.triggerElement.getAttribute('data-bs-size') || 'lg',
            keyboard: this.triggerElement.getAttribute('data-bs-keyboard') !== 'false',
            staticBackdrop: this.triggerElement.getAttribute('data-bs-static-backdrop') === 'true',
            header: this.triggerElement.getAttribute('data-bs-header') !== 'false',
            footer: this.triggerElement.getAttribute('data-bs-footer') === 'true',
            fade: this.triggerElement.getAttribute('data-bs-fade') !== 'false',
            centered: this.triggerElement.getAttribute('data-bs-centered') !== 'false',
            scrollable: this.triggerElement.getAttribute('data-bs-scrollable') === 'true'
        };
    }

    /**
     * Initializes the modal by creating the DOM structure and applying configurations.
     */
    initModal() {
        const targetId = this.triggerElement.getAttribute('data-bs-target') || this.randomId();
        const url = this.triggerElement.href || this.triggerElement.src;

        let modal = document.getElementById(targetId);
        if (!modal) {
            modal = document.createElement('div');
            modal.id = targetId;
            modal.className = `modal ${this.options.fade ? 'fade' : ''}`;
            modal.tabIndex = -1;
            modal.setAttribute('aria-labelledby', `${targetId}Label`);
            modal.innerHTML = `
                <div class="modal-dialog modal-${this.options.size} ${this.options.centered ? 'modal-dialog-centered' : ''} ${this.options.scrollable ? 'modal-dialog-scrollable' : ''}">
                    <div class="modal-content">
                        ${this.options.header ? '<div class="modal-header"><button type of button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>' : ''}
                        <div class="modal-body"></div>
                        ${this.options.footer ? '<div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button></div>' : ''}
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            this.modal = new bootstrap.Modal(modal, {
                keyboard: this.options.keyboard
            });
        } else {
            this.modal = bootstrap.Modal.getInstance(modal);
        }

        this.modalElement = modal;
        this.loadContent(url);
    }

    /**
     * Loads content into the modal body. If the content is an image, it centers the image within the modal body.
     * @param {string} url - The URL to load into the modal body.
     */
    loadContent(url) {
        const body = this.modalElement.querySelector('.modal-body');
        body.innerHTML = ''; // Clear any existing content

        // Check if the URL is an image
        if (url.match(/\.(jpeg|jpg|gif|png|svg)$/i)) {
            const img = document.createElement('img');
            img.src = url;
            img.style.maxWidth = '100%'; // Ensure the image is responsive
            img.style.maxHeight = '100vh'; // Limit height to viewport
            img.style.display = 'block'; // Use block display type
            img.style.margin = 'auto'; // Auto margins for horizontal centering
            img.onload = () => { // Ensure modal is shown after image is loaded
                this.modal.show();
            };
            body.style.display = 'flex'; // Flex display to center vertically
            body.style.alignItems = 'center'; // Center vertically
            body.style.justifyContent = 'center'; // Center horizontally
            body.appendChild(img);
        } else {
            // Assume the URL is for HTML content
            fetch(url)
                .then(response => response.text())
                .then(html => {
                    body.innerHTML = html;
                    this.modal.show();
                })
                .catch(error => {
                    console.error('Error fetching the content:', error);
                    body.innerHTML = '<p>Error loading the content.</p>';
                    this.modal.show();
                });
        }
    }

    /**
     * Shows the modal.
     */
    show() {
        this.modal.show();
    }

    /**
     * Generates a random ID for the modal if none is provided.
     * @returns {string} A unique ID.
     */
    randomId() {
        return `laitbox-${Math.random().toString(36).substr(2, 9)}`;
    }
}