class OutputForm extends HTMLFormElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.addEventListener('submit', (e) => {
            this.querySelectorAll('output[id]').forEach(output => {
                const hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = output.id;
                hidden.value = output.value || output.textContent;
                this.appendChild(hidden);
            });
        });
    }
}

customElements.define('output-form', OutputForm, { extends: 'form' });