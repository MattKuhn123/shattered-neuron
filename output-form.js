/**
 * Includes <output> elements in a form submission.
 * the output's id and textContent are included in the form data as hidden inputs.
 * Usage:
 * ```html
 * <form is="output-form">
 *   <output id="result">42</output>
*    <button type="submit">Submit</button>
 * </form>
 * 
 */
class OutputForm extends HTMLFormElement {
    connectedCallback() {
        this.addEventListener('submit', (e) => {
            this.querySelectorAll('output[id]').forEach(output => {
                const hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = output.id;
                hidden.value = output.textContent;
                this.appendChild(hidden);
            });
        });
    }
}

customElements.define('output-form', OutputForm, { extends: 'form' });