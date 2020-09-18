import { LightningElement, api } from "lwc";

export default class McAppointmentPage extends LightningElement {
    @api patientId;
    @api physicianId;

    changeViewHandler(event) {
        const viewEvent = new CustomEvent("viewchange", { detail: event.detail });
        this.dispatchEvent(viewEvent);
    }

    get hasPatientId() {
        return this.patientId !== undefined;
    }

    get message() {
        if (!this.patientId && !this.physicianId) return "SELECT A PHYSICIAN AND A PATIENT TO BOOK APPOINTMENT";
        else if (!this.patientId) return "NOW SELECT A PATIENT";
        else if (!this.physicianId) return "NOW SELECT A PHYSICIAN";
        return "";
    }

    get invalidForm() {
        return !this.patientId || !this.physicianId;
    }
}
