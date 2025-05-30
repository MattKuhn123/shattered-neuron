// formula-output.js
/**
* Custom output element that displays a computed value.
*
* This element extends the standard `<output>` element and allows for dynamic calculation
* of its value based on the values of referenced input elements. The formula for calculation
* can be specified using the `formula` attribute, using variable names `a`, `b`, `c`, etc.
*
* Dependencies:
* - Requires math.js to be loaded globally as `math`.
*
* Attributes:
* - for: Space-separated list of input element IDs to use as variables.
* - formula: A math.js-compatible expression using variables `a`, `b`, `c`, etc.
*
* Example usage in HTML:
* ``` html
* <output is="formula-output" for="input1 input2" formula="a * b + (a - 2)"></output>
* ```
*/
class FormulaOutput extends HTMLOutputElement {
    static observedAttributes = ['for'];

    connectedCallback() {
        if (typeof math === 'undefined')
            throw new Error('math.js is not loaded. Please include math.js before this script.');

        this._inputHandler = () => this.updateTextContent();

        this.addEventListeners();
        this.updateTextContent();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name.toLowerCase() === 'for' && oldValue !== newValue && oldValue) {
            oldValue.split(/\s+/).map(id => document.getElementById(id))
                .filter(el => el)
                .forEach(x => x.removeEventListener('input', this._inputHandler));
        }

        this.addEventListeners();
    }

    addEventListeners() {
        this.inputs.forEach(x => x.addEventListener('input', this._inputHandler));
    }

    updateTextContent() {
        const evaluation = this.evaluateFormula();
        this.textContent = evaluation;
        this.setAttribute('value', `${evaluation}`);
    }

    evaluateFormula() {
        this.inputs.forEach(input => {
            if (input.tagName !== 'INPUT' || input.type !== 'number')
                console.warn(`[formula-output] #'${input.id}' is not an 'input' of type 'number'.`);
        });

        const formula = this.getAttribute('formula');
        if (!formula) {
            console.warn('[formula-output] No formula provided for calculation.');
            return '';
        }

        const values = this.inputs.map(i => Number(i.value) || 0);
        const varMatches = formula.match(/\b[a-z]\b/g) || [];
        const uniqueVars = Array.from(new Set(varMatches));

        const context = {};
        uniqueVars.forEach((v, i) => {
            if (values[i] !== undefined) {
                context[v] = values[i];
            } else {
                console.warn(`[formula-output] Unmatched variable: [${v}], defaulting to 0.`);
                context[v] = 0;
            }
        });

        try {
            return math.evaluate(formula, context);
        } catch (e) {
            console.warn(`[formula-output] Could not parse formula: [${formula}].`, e);
            return 'NaN';
        }
    }

    get inputIds() {
        const forAttr = this.getAttribute('for');
        if (!forAttr) {
            return [];
        }

        return forAttr.split(/\s+/);
    }

    get inputs() {
        return this.inputIds.map(id => document.getElementById(id)).filter(el => el);
    }
}

customElements.define('formula-output', FormulaOutput, { extends: 'output' });
