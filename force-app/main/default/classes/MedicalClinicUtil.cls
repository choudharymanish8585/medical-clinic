public with sharing class MedicalClinicUtil {
    public static Boolean hasConflict(Datetime startTime, Datetime endTime, String physicianId) {
        // check for exiting appointment
        List<Appointment__c> existingAppointments = [
            SELECT Id, Confirmed__c, Patient__c, Physician__c, Start_Time__c, End_Time__c
            FROM Appointment__c
            WHERE Start_Time__c >= :startTime AND Start_Time__c < :endTime AND Physician__c = :physicianId
        ];

        if (existingAppointments != null && existingAppointments.size() > 0) {
            return true;
        }
        return false;
    }

    public static String getRequestBody(CalendarEvent calEvent) {
        String body = '';
        if (String.isNotBlank(calEvent.endTime)) {
            body += '{"end":{"dateTime":"' + calEvent.endTime + '"}';
        }
        if (String.isNotBlank(calEvent.startTime)) {
            if (String.isNotBlank(body)) {
                body += ',';
            } else {
                body += '{';
            }
            body += '"start":{"dateTime":"' + calEvent.startTime + '"}';
        }
        if (String.isNotBlank(calEvent.title)) {
            if (String.isNotBlank(body)) {
                body += ',';
            } else {
                body += '{';
            }
            body += '"summary":"' + calEvent.title + '"';
        }
        if (calEvent.attendees != null && calEvent.attendees.size() > 0) {
            if (String.isNotBlank(body)) {
                body += ',"attendees":[';
            } else {
                body += '{"attendees":[';
            }
            for (String emailId : calEvent.attendees) {
                body += '{"email":"' + emailId + '"},';
            }
            body = body.removeEnd(',');
            body += ']';
        }
        if (String.isNotBlank(body)) {
            body += '}';
        } else {
            body += '{}';
        }

        return body;
    }

    public static String getCalendarEventId(String response) {
        JSONParser parser = JSON.createParser(response);
        while (parser.nextToken() != null) {
            if ((parser.getCurrentToken() == JSONToken.FIELD_NAME) && (parser.getText() == 'id')) {
                // Get the value.
                parser.nextToken();
                // Compute the grand total price for all invoices.
                return parser.getText();
            }
        }
        return '';
    }

    public class CalendarEvent {
        @AuraEnabled
        public String startTime;
        @AuraEnabled
        public String endTime;
        @AuraEnabled
        public String title;
        @AuraEnabled
        public String id;
        @AuraEnabled
        public String physicianId;
        @AuraEnabled
        public String patientId;
        @AuraEnabled
        public String salesforceId;
        @AuraEnabled
        public List<String> attendees;
    }
}
