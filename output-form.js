/**
 * Includes <output> elements in a form submission.
 * the output's id and textContent are included in the form data as hidden inputs.
 * Usage:
 * ```html
 * <form is="output-form">
 *   <output id="result">42</output>
*    <button type="submit">Submit</button>
 * </form>
 * ```
 */
class OutputForm extends HTMLFormElement {
    connectedCallback() {
        document.addEventListener("DOMContentLoaded", () =>
            new URLSearchParams(window.location.search).forEach((value, key) => this.val(key, value))
        );

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

    elt(id) {
        return this.querySelector(`#${id}`);
    }

    val(id, value) {
        const x = this.elt(id);
        if (value !== undefined) {
            if (x.tagName.toLowerCase() === "input") {
                x.value = value.toString();
            } else {
                x.textContent = value.toString();
            }
        } else {
            if (x.tagName.toLowerCase() === "input") {
                return Number(x.value);
            } else {
                return Number(x.textContent);
            }
        }

    }
}

customElements.define('output-form', OutputForm, { extends: 'form' });