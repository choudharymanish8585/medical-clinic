import { LightningElement, api, wire } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import getCalendarEvents from "@salesforce/apex/GoogleWebService.getCalendarEvents";
import createEvent from "@salesforce/apex/GoogleWebService.createEvent";
import updateEvent from "@salesforce/apex/GoogleWebService.updateEvent";
import deleteEvent from "@salesforce/apex/GoogleWebService.deleteEvent";
import requestCalendarAccess from "@salesforce/apex/GoogleWebService.requestCalendarAccess";

import { ShowToastEvent } from "lightning/platformShowToastEvent";

import NAME_FIELD from "@salesforce/schema/Physician__c.Name";
import EMAIL_FIELD from "@salesforce/schema/Physician__c.Email__c";

export default class PhysicianCalendar extends LightningElement {
    @api
    set physicianId(value) {
        this.isLoading = true;
        this.pvtPhysicianId = value;
    }
    get physicianId() {
        return this.pvtPhysicianId;
    }
    @api patientId;
    physician;
    // flag for user's access to calendar
    hasAccess;
    isLoading = true;
    calendarEvents = [];

    //event modal properties
    isModalOpen = false;
    modalTitle = "";
    calendarEvent = {};
    showCreateButton = false;
    showUpdateButton = false;
    showDeletebutton = false;

    /**
     * Wire adaptor to get physician data
     * @param {*} param0
     */
    @wire(getRecord, { recordId: "$pvtPhysicianId", fields: [NAME_FIELD, EMAIL_FIELD] })
    physicianRecord({ error, data }) {
        if (data) {
            this.physician = { id: this.pvtPhysicianId, name: getFieldValue(data, NAME_FIELD), email: getFieldValue(data, EMAIL_FIELD) };
            this.fetchCalendar();
        } else if (error) {
            this.showToast("ERROR", "Check logs for details", "error");
            console.error(error);
        }
    }

    /**
     * Fetch google calendar
     * Make a call to apex method to retrieve calendar events
     */
    fetchCalendar() {
        if (this.physician.email) {
            getCalendarEvents({ calendarId: this.physician.email })
                .then((resp) => {
                    this.isLoading = false;
                    if (resp === "no_access") {
                        this.hasAccess = false;
                    } else {
                        // feed calendar here
                        this.calendarEvents = this.getGoogleCalendarEvents(JSON.parse(resp));
                        this.hasAccess = true;
                    }
                })
                .catch((error) => {
                    this.isLoading = false;
                    this.showToast("ERROR", "Check logs for details", "error");
                    console.error(error);
                });
        }
    }

    /**
     * Convert google calendar events to full calendar events
     * @param {*} calendar
     */
    getGoogleCalendarEvents(calendar) {
        const events = [];

        if (calendar.items && calendar.items.length) {
            calendar.items.forEach((element) => {
                events.push(this.parseEvent(element));
            });
        }
        return events;
    }

    parseEvent(calEvent) {
        const parsedEvent = {
            id: calEvent.id,
            title: calEvent.summary,
            start: calEvent.start.dateTime,
            end: calEvent.end.dateTime
        };
        if (calEvent.attendees && calEvent.attendees.length) {
            const attendees = [];
            calEvent.attendees.forEach((element) => {
                attendees.push(element.email);
            });
            parsedEvent.attendees = attendees;
        }
        return parsedEvent;
    }

    /**
     * Calendar Click Handler
     * Open new event create form
     * @param {*} event
     */
    calendarClickHandler(event) {
        this.openAppointmentForm(event.detail);
    }

    bookAppointmentHandler() {
        this.openAppointmentForm();
    }

    openAppointmentForm(event) {
        if (!this.patientId) {
            this.showToast("Select a patient", "Please create/select a patient first", "error");
            return;
        }
        this.isModalOpen = true;
        this.modalTitle = "Create Event";
        this.showCreateButton = true;
        this.showUpdateButton = false;
        this.showDeletebutton = false;
        //build event
        if (event) this.calendarEvent = event;
    }

    /**
     * Calendar event drag handler
     * @param {*} event
     */
    calendarEventDragHandler(event) {
        // show spinner
        this.isLoading = true;
        // prepare the payload
        const payload = {
            ...event.detail,
            startTime: new Date(event.detail.startTime).toISOString(),
            endTime: new Date(event.detail.endTime).toISOString(),
            physicianId: this.physicianId,
            patientId: this.patientId
        };
        this.updateAnEvent(payload);
    }

    /**
     * Calendar event update handler
     * Open event update/delet form
     * @param {*} event
     */
    calendarEventUpdateHandler(event) {
        this.isModalOpen = true;
        this.modalTitle = "Update/Delete Event";
        this.showCreateButton = false;
        this.showUpdateButton = true;
        this.showDeletebutton = true;
        //update event
        this.calendarEvent = event.detail;
    }

    /**
     * Create event handler
     * @param {*} event
     */
    eventCreateHandler(event) {
        // close the form
        this.closeEventForm();
        // show spinner
        this.isLoading = true;
        // prepare the payload
        const payload = {
            ...event.detail,
            startTime: new Date(event.detail.startTime).toISOString(),
            endTime: new Date(event.detail.endTime).toISOString(),
            physicianId: this.physicianId,
            patientId: this.patientId,
            attendees: [this.physician.email],
            calendarId: this.physician.email
        };
        this.createNewEvent(payload);
    }

    /**
     * Update calendar event handler
     * Make an apex call to update the event
     * Apex internally makes a call to google calendar event api
     * to update the event
     * @param {*} event
     */
    eventUpdateHandler(event) {
        this.closeEventForm();
        // show spinner
        this.isLoading = true;
        // prepare the payload
        const payload = {
            ...event.detail,
            startTime: new Date(event.detail.startTime).toISOString(),
            endTime: new Date(event.detail.endTime).toISOString(),
            physicianId: this.physicianId,
            patientId: this.patientId
        };
        this.updateAnEvent(payload);
    }

    /**
     * Delete calendar event
     * Make an apex call to delete the event
     * Apex internally makes a call to google calendar event api
     * to delete the event
     * @param {*} event
     */
    eventDeleteHandler(event) {
        this.closeEventForm();
    }

    /**
     * Create new calendar event
     * Make an apex call to add new event
     * Apex internally makes a call to google calendar event api
     * to add new event
     * @param {*} payload
     */
    createNewEvent(payload) {
        createEvent({ payload: JSON.stringify(payload) })
            .then((resp) => {
                this.isLoading = false;
                if (resp === "has_conflict") {
                    this.showToast("Error", "Physician has a conflict at this time", "error");
                    return;
                }
                // feed calendar here
                const events = this.calendarEvents;
                events.push(this.parseEvent(JSON.parse(resp)));
                this.calendarEvents = events;
                this.showToast("Confirmed", "Appointment is confirmed with physician", "success");
                this.changeView();
            })
            .catch((error) => {
                this.isLoading = false;
                this.showToast("ERROR", "Check logs for details", "error");
                console.error(error);
            });
    }

    /**
     * Update calendar event
     * Make an apex call to update the event
     * Apex internally makes a call to google calendar event api
     * to update the event
     * @param {*} payload
     */
    updateAnEvent(payload) {
        updateEvent({ payload: JSON.stringify(payload) })
            .then((resp) => {
                this.isLoading = false;
                if (resp === "has_conflict") {
                    this.showToast("Error", "Physician has a conflict at this time", "error");
                    return;
                }
                // feed calendar here
                const event = this.parseEvent(JSON.parse(resp));
                let events = this.calendarEvents;
                events = events.map((element) => {
                    if (element.id === event.id) {
                        element = event;
                    }
                    return element;
                });
                this.calendarEvents = events;
                this.showToast("Confirmed", "Appointment is updated", "success");
            })
            .catch((error) => {
                this.isLoading = false;
                this.showToast("ERROR", "Check logs for details", "error");
                console.error(error);
            });
    }

    deleteAnEvent(payload) {}

    changeView() {
        const payload = { view: "dashboard_view" };
        const viewEvent = new CustomEvent("viewchange", { detail: payload });
        this.dispatchEvent(viewEvent);
    }

    requestAccessHandler() {
        this.isLoading = true;
        requestCalendarAccess({ emailId: this.physician.email, name: this.physician.name })
            .then((resp) => {
                this.isLoading = false;
                if (resp === "success") {
                    this.showToast("Success", "Access request email is sent to physician", "success");
                    this.changeView();
                }
            })
            .catch((error) => {
                this.isLoading = false;
                this.showToast("ERROR", "Check logs for details", "error");
                console.error(error);
            });
    }

    // close event form
    closeEventForm() {
        this.isModalOpen = false;
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
