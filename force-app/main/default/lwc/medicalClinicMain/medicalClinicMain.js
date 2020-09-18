import { LightningElement, track } from "lwc";

export default class MedicalClinicMain extends LightningElement {
    @track clinicInfo = { name: "SFDCFacts Clinic", id: "a011y000001baOFAAY", address: "sample-address" };

    selectedView = "appointment_view";
    selectedPatientId = "";
    selectedPhysicianId = "";

    /**
     * Change view
     * @param {*} event
     */
    viewChangeHandler(event) {
        this.selectedView = event.detail.view;
    }

    patientSelectHandler(event) {
        this.selectedPatientId = event.detail;
    }

    physicianSelectHandler(event) {
        this.selectedPhysicianId = event.detail;
    }

    get views() {
        return [
            { label: "Appointment", id: "appointment_view" },
            { label: "Dashboard", id: "dashboard_view" }
        ];
    }

    get isDashboardView() {
        return this.selectedView === "dashboard_view";
    }

    get isAppointmentView() {
        return this.selectedView === "appointment_view";
    }
}
