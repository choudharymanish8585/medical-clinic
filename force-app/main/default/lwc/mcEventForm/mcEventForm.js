import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class McEventForm extends LightningElement {
    @api showCreate = false;
    @api showUpdate = false;
    @api showDelete = false;
    @api eventId;
    @api
    set title(value) {
        this.pvtTitle = value;
    }
    get title() {
        return this.pvtTitle;
    }

    @api
    set startTime(value) {
        this.pvtStartTime = value ? value : new Date();
    }
    get startTime() {
        return this.pvtStartTime;
    }
    @api
    set endTime(value) {
        this.pvtEndTime = value ? value : new Date(new Date().getTime() + 30 * 60000);
    }
    get endTime() {
        return this.pvtEndTime;
    }
    //private properties
    pvtStartTime;
    pvtEndTime;
    pvtTitle;

    startTimeChangeHandler(event) {
        this.pvtStartTime = event.target.value;
    }

    endTimeChangeHandler(event) {
        this.pvtEndTime = event.target.value;
    }

    titleChangeHandler(event) {
        this.pvtTitle = event.target.value;
    }

    createHandler() {
        if (this.isInvalid()) {
            this.showToast("Error", "Please select valid date and time range", "error");
            return;
        }
        const customEvt = new CustomEvent("create", {
            detail: { title: this.title, startTime: this.startTime, endTime: this.endTime }
        });
        this.dispatchEvent(customEvt);
    }

    updateHandler() {
        if (this.isInvalid()) {
            this.showToast("Invalid Data", "Please select valid title and datetime range", "error");
            return;
        }
        const customEvt = new CustomEvent("update", {
            detail: { id: this.eventId, title: this.title, startTime: this.startTime, endTime: this.endTime }
        });
        this.dispatchEvent(customEvt);
    }

    deleteHandler() {
        const customEvt = new CustomEvent("delete", {
            detail: { id: this.eventId }
        });
        this.dispatchEvent(customEvt);
    }

    cancelHandler() {
        const customEvt = new CustomEvent("cancel");
        this.dispatchEvent(customEvt);
    }

    isInvalid() {
        const startTime = new Date(this.pvtStartTime).getTime(),
            endTime = new Date(this.pvtEndTime).getTime();
        return startTime >= endTime || startTime < new Date().getTime() || !this.pvtTitle;
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }
}
