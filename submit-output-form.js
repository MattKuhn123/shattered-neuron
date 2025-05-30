/**
* Custom form element that ensures all `<output>` elements with a name attribute
* are included in the form submission.
*
* This element extends the standard `<form>` element. On submit, it finds all
* `<output>` elements with a name attribute, creates hidden input fields with
* the same name and value, and appends them to the form so their values are
* submitted along with other form data.
*
* Usage:
* ```html
* <form is="submit-output-form">
*   <!--...-->
*   <output name="result">42</output>
*   <!--...-->
* </form>
* ```
*
*/
class SubmitOutputForm extends HTMLFormElement {
    connectedCallback() { this.addEventListener('submit', this._submitHandler); }

    disconnectedCallback() { this.removeEventListener('submit', this._submitHandler); }

    _submitHandler(event) {
        this.querySelectorAll('output[name]').forEach(output => {
            const hidden = document.createElement('input');
            hidden.type = 'hidden';
            hidden.name = output.getAttribute('name');
            hidden.value = output.value ?? output.textContent;
            this.appendChild(hidden);
        });
    }
}

customElements.define('submit-output-form', SubmitOutputForm, { extends: 'form' });
