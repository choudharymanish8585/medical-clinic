import { LightningElement, api } from "lwc";

export default class CreateSprintForm extends LightningElement {
    @api objectApiName;
    @api layoutType = "Full";
    @api density = "comfy";
    @api recordTypeId;
    @api fields;

    handleSuccess(event) {
        //fire success event
        const successEvt = new CustomEvent("success", { detail: event.detail });
        this.dispatchEvent(successEvt);
    }

    handleCancel() {
        //fire cancel event
        const cancelEvt = new CustomEvent("cancel");
        this.dispatchEvent(cancelEvt);
    }

    get showFields() {
        return this.fields && this.fields.length;
    }
}
