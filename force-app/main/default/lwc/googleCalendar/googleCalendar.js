import { LightningElement, api } from "lwc";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import FullCalendarJS from "@salesforce/resourceUrl/FullCalendarJS";

let thisComp;
export default class GoogleCalender extends LightningElement {
    @api calendarEvents = [];
    calendarInitialized = false;

    connectedCallback() {
        thisComp = this;
    }

    /**
     * Load static resources of full Calendar
     */
    renderedCallback() {
        if (this.calendarInitialized) return;
        this.calendarInitialized = true;

        // Executes all loadScript and loadStyle promises
        // and only resolves them once all promises are done
        Promise.all([
            loadScript(this, FullCalendarJS + "/jquery.min.js"),
            loadScript(this, FullCalendarJS + "/moment.min.js"),
            loadScript(this, FullCalendarJS + "/fullcalendar.min.js"),
            loadStyle(this, FullCalendarJS + "/fullcalendar.min.css")
        ])
            .then(() => {
                this.renderCalendar();
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.error({
                    message: "Error occured on FullCalendarJS",
                    error
                });
            });
    }

    /**
     * Initialize and render full calendar
     */
    renderCalendar() {
        const calendarEl = thisComp.template.querySelector(".google-calendar");
        // eslint-disable-next-line no-undef
        $(calendarEl).fullCalendar({
            selectable: true,
            dragScroll: true,
            editable: true,
            eventLimit: true, // allow "more" link when too many events
            defaultView: "agendaWeek",
            header: {
                left: "prev,next today",
                center: "title",
                right: "agendaWeek,agendaDay,month"
            },
            events: thisComp.calendarEvents,
            select: (start, end) => thisComp.handleTimeSelect(start, end),
            eventDrop: (event) => thisComp.handleDrag(event),
            eventClick: (event) => thisComp.handleUpdate(event)
        });
    }

    handleTimeSelect(start, end) {
        const customEvt = new CustomEvent("calendarclick", { detail: { startTime: start.format(), endTime: end.format() } });
        this.dispatchEvent(customEvt);
    }

    handleUpdate(event) {
        // eslint-disable-next-line
        const customEvt = new CustomEvent("eventupdate", {
            detail: { id: event.id, title: event.title, startTime: event.start.format(), endTime: event.end.format() }
        });
        this.dispatchEvent(customEvt);
    }

    handleDrag(event) {
        // eslint-disable-next-line
        const customEvt = new CustomEvent("eventdrag", {
            detail: {
                id: event.id,
                title: event.title,
                startTime: event.start.format(),
                endTime: event.end.format(),
                attendees: event.attendees
            }
        });
        this.dispatchEvent(customEvt);
    }

    requestAccessHandler() {
        //send email to share the calendar
    }
}
