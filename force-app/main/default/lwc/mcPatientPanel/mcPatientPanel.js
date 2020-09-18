import { LightningElement, api, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";

const FIELDS = ["Contact.Name", "Contact.Email", "Contact.Phone", "Contact.Birthdate"];

export default class McPatientPanel extends LightningElement {
    @api patientId;

    @wire(getRecord, { recordId: "$patientId", fields: FIELDS })
    contact;

    get name() {
        return this.contact.data.fields.Name.value;
    }

    get email() {
        return this.contact.data.fields.Email.value;
    }

    get phone() {
        return this.contact.data.fields.Phone.value;
    }

    get birthDate() {
        return this.contact.data.fields.Birthdate.value;
    }
}
