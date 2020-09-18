import { LightningElement, api, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";

const FIELDS = [
    "Physician__c.Name",
    "Physician__c.Email__c",
    "Physician__c.Phone__c",
    "Physician__c.Specialization__r.Name",
    "Physician__c.Specialization__r.Appointment_Price__c"
];
export default class McPhysicianPanel extends LightningElement {
    @api physicianId;
    @api showPricePanel = false;

    @wire(getRecord, { recordId: "$physicianId", fields: FIELDS })
    physician;

    get name() {
        return this.physician.data.fields.Name.value;
    }

    get email() {
        return this.physician.data.fields.Email__c.value;
    }

    get phone() {
        return this.physician.data.fields.Phone__c.value;
    }

    get specialization() {
        return this.physician.data.fields.Specialization__r.value.fields.Name.value;
    }

    get price() {
        return this.physician.data.fields.Specialization__r.value.fields.Appointment_Price__c.value;
    }
}
