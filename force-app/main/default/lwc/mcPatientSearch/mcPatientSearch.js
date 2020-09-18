import { LightningElement, track } from "lwc";
import searchPatient from "@salesforce/apex/PatientController.searchPatient";

export default class McPatientSearch extends LightningElement {
    @track patients = [];

    error = "";

    patientSearchHandler(event) {
        const isEnterKey = event.keyCode === 13;
        const queryTerm = event.target.value;
        if (isEnterKey && queryTerm && queryTerm.length > 3) {
            this.fetchPatients(queryTerm);
        }
    }

    fetchPatients(searchTerm) {
        searchPatient({ searchTerm })
            .then((resp) => {
                if (resp) {
                    this.patients = resp;
                } else {
                    this.error = "No data found";
                }
            })
            .catch((error) => {
                this.error = error;
            });
    }

    patientSelectHandler(event) {
        const selectedRow = event.detail.selectedRows ? event.detail.selectedRows[0].Id : undefined;
        if (selectedRow) {
            const successEvt = new CustomEvent("selection", { detail: selectedRow });
            this.dispatchEvent(successEvt);
        }
    }

    get hasPatients() {
        return this.patients && this.patients.length;
    }

    get columns() {
        return [
            { label: "Name", fieldName: "Name" },
            { label: "Phone", fieldName: "Phone", type: "phone" },
            { label: "Email", fieldName: "Email", type: "email" },
            { label: "BirthDate", fieldName: "Birthdate", type: "date" }
        ];
    }
}
