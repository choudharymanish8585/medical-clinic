import { LightningElement, track, api } from "lwc";
import getSpecializations from "@salesforce/apex/SpecializationController.getSpecializationsByClinic";
import getPhysicians from "@salesforce/apex/PhysicianController.getPhysiciansBySpecialization";

export default class McLeftPanel extends LightningElement {
    @api clinicName;
    @api clinicId;
    @api selectedView;
    @api views;

    @track specializations = [];
    @track physicians = [];

    selectedSpecilization = {};
    selectedPhysician = {};
    selectedPatient = "";
    error = "";
    isNewPatientModalOpen = false;
    isPatientSearchModalOpen = false;
    tentativeSelectedPatient = "";

    connectedCallback() {
        this.fetchSpecialization(this.clinicId);
    }

    /**
     * Fetch all specializations
     */
    fetchSpecialization(clinicId) {
        this.specializations = [];
        getSpecializations({ clinicId })
            .then((resp) => {
                if (resp) {
                    const specializations = [];
                    resp.forEach((element) => {
                        specializations.push({ ...element, value: element.Id, label: element.Name });
                    });
                    this.specializations = specializations;
                }
            })
            .catch((error) => {
                this.error = error;
            });
    }

    /**
     * Fetch physicians for selected specialization
     * @param {*} specializationId
     */
    fetchPhysicians(specializationId) {
        this.physicians = [];
        getPhysicians({ specializationId })
            .then((resp) => {
                if (resp) {
                    const physicians = [];
                    resp.forEach((element) => {
                        physicians.push({ ...element, value: element.Id, label: element.Name });
                    });
                    this.physicians = physicians;
                }
            })
            .catch((error) => {
                this.error = error;
            });
    }

    newPatientHandler() {
        this.isNewPatientModalOpen = true;
    }
    closeNewPatientModal() {
        this.isNewPatientModalOpen = false;
    }
    newPatientSuccessHandler(event) {
        this.selectedPatient = event.detail.id;
        this.isNewPatientModalOpen = false;
        this.fireEvent("patientselect", this.selectedPatient);
    }

    searchPatientHandler() {
        this.isPatientSearchModalOpen = true;
    }
    patientSelectionHandler(event) {
        // selecting the patient tentatively
        this.tentativeSelectedPatient = event.detail;
    }
    closePatientSearchModal() {
        this.isPatientSearchModalOpen = false;
        this.tentativeSelectedPatient = "";
    }
    patientSearchSuccessHandler() {
        this.selectedPatient = this.tentativeSelectedPatient;
        this.isPatientSearchModalOpen = false;
        this.tentativeSelectedPatient = "";
        this.fireEvent("patientselect", this.selectedPatient);
    }

    viewSelectHandler(event) {
        const selection = event.detail.name;
        if (selection !== this.selectedView) {
            const payload = { view: selection };
            const viewEvent = new CustomEvent("viewchange", { detail: payload });
            this.dispatchEvent(viewEvent);
        }
    }

    /**
     * Specialization change handler
     * @param {*} event
     */
    specializationChangeHandler(event) {
        this.selectedSpecilization = event.detail.value;
        this.fetchPhysicians(this.selectedSpecilization);
    }

    /**
     * Physician change handler
     * @param {*} event
     */
    physiciansChangeHandler(event) {
        this.selectedPhysician = event.detail.value;
        this.fireEvent("physicianselect", this.selectedPhysician);
    }

    fireEvent(eventName, payload) {
        const customEvt = new CustomEvent(eventName, { detail: payload });
        this.dispatchEvent(customEvt);
    }

    get filterPanelClasses() {
        return this.selectedView === "appointment_view" ? "show" : "hide";
    }

    get patientFields() {
        return ["Name", "Phone", "Email", "Birthdate"];
    }
}
