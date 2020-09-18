import { LightningElement, api } from "lwc";

export default class Spinner extends LightningElement {
    @api title = "Loading...";
    @api altText = "Loading...";
    @api size = "medium";
    @api variant = "base";
    @api helpText;

    get showHelpText() {
        return this.helpText && this.helpText.length > 0;
    }
}
