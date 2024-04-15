/**
 * LaitBox - A Custom laitbox Library for Bootstrap 5
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
 * 
 * Example Usage:
 * 
 * ```javascript
 * // Initialize LaitBox with options
 * const options = {
 *     keyboard: true,
 *     size: 'lg',
 *     staticBackdrop: true,  // Optional: use a static backdrop that doesn't close the modal on background click
 *     header: true,          // Optional: include a modal header
 *     footer: true,          // Optional: include a modal footer
 *     fade: false,           // Optional: disable the fade effect
 *     centered: true,        // Optional: center modal vertically (default true)
 *     scrollable: true       // Optional: make modal scrollable
 * };
 * 
 * // Attach LaitBox to elements
 * document.querySelectorAll('[data-bs-toggle="laitbox"]').forEach((el) => {
 *     el.addEventListener('click', (e) => {
 *         e.preventDefault();
 *         const laitBox = new LaitBox(el, options);
 *         laitBox.show();
 *     });
 * });
 * ```
 * 
 * This example demonstrates how to initialize and use LaitBox on elements with specific data attributes.
 */

class LaitBox {
    constructor(triggerElement, options = {}) {
        this.triggerElement = triggerElement;
        // Combine default options, data attribute options, and custom options
        this.options = Object.assign({
            size: 'lg', // Default modal size
            keyboard: true, // Use keyboard (Esc key to close)
            staticBackdrop: false, // Click outside modal does not close it
            header: true, // Include modal header
            footer: false, // Include modal footer
            fade: true, // Modal fade effect
            centered: true, // Center modal vertically by default
            scrollable: false // Make modal scrollable
        }, this.parseDataAttributes(), options);
        this.initModal();
    }

    parseDataAttributes() {
        return {
            size: this.triggerElement.getAttribute('data-bs-size') || 'lg',
            keyboard: this.triggerElement.getAttribute('data-bs-keyboard') !== 'false',
            staticBackdrop: this.triggerElement.getAttribute('data-bs-static-backdrop') === 'true',
            header: this.triggerElement.getAttribute('data-bs-header') !== 'false',
            footer: this.triggerElement.getAttribute('data-bs-footer') === 'true',
            fade: this.triggerElement.getAttribute('data-bs-fade') !== 'false',
            centered: this.triggerElement.getAttribute('data-bs-centered') !== 'false', // Reads attribute, defaults to true
            scrollable: this.triggerElement.getAttribute('data-bs-scrollable') === 'true'
        };
    }

    initModal() {
        const targetId = this.triggerElement.getAttribute('data-bs-target') || this.randomId();
        const url = this.triggerElement.getAttribute('href');

        let modal = document.getElementById(targetId);
        if (!modal) {
            modal = document.createElement('div');
            modal.id = targetId;
            modal.className = `modal ${this.options.fade ? 'fade' : ''}`;
            modal.tabIndex = -1;
            modal.setAttribute('aria-labelledby', `${targetId}Label`);

            const modalDialogClasses = [
                `modal-dialog`,
                `modal-${this.options.size}`,
                this.options.centered ? 'modal-dialog-centered' : '',
                this.options.scrollable ? 'modal-dialog-scrollable' : ''
            ].join(' ');

            const headerHtml = this.options.header ? `
                <div class="modal-header">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>` : '';

            const footerHtml = this.options.footer ? `
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>` : '';

            modal.innerHTML = `
                <div class="${modalDialogClasses}">
                    <div class="modal-content">
                        ${headerHtml}
                        <div class="modal-body">Cargando contenido...</div>
                        ${footerHtml}
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            if (this.options.staticBackdrop) {
                modal.setAttribute('data-bs-backdrop', 'static');
                modal.setAttribute('data-bs-keyboard', 'false');
            }

            this.modal = new bootstrap.Modal(modal, {
                keyboard: this.options.keyboard
            });
        } else {
            this.modal = bootstrap.Modal.getInstance(modal);
        }

        this.modalElement = modal;

        fetch(url)
            .then(response => response.text())
            .then(html => {
                this.modalElement.querySelector('.modal-body').innerHTML = html;
                this.modal.show();
            })
            .catch(error => {
                console.error('Error fetching the content:', error);
                this.modalElement.querySelector('.modal-body').innerHTML = '<p>Error loading the content.</p>';
            });
    }

    show() {
        this.modal.show();
    }

    randomId() {
        return `laitbox-${Math.random().toString(36).substr(2, 9)}`;
    }
}
