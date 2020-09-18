public with sharing class GoogleWebService {
    public static Http http = new Http();
    public static HTTPResponse response;
    public static HttpRequest request;

    @AuraEnabled
    public static String getCalendarEvents(String calendarId) {
        request = new HttpRequest();
        request.setMethod('GET');
        request.setEndpoint('callout:Google_Api/calendar/v3/calendars/' + calendarId + '/events');

        response = http.send(request);
        if (response.getStatusCode() == 404) {
            return 'no_access';
        }

        return response.getBody();
    }

    @AuraEnabled
    public static String createEvent(String payload) {
        MedicalClinicUtil.CalendarEvent calEvent = (MedicalClinicUtil.CalendarEvent) JSON.deserialize(
            payload,
            MedicalClinicUtil.CalendarEvent.class
        );

        DateTime startTime = (DateTime) JSON.deserialize('"' + calEvent.startTime + '"', DateTime.class);
        DateTime endTime = (DateTime) JSON.deserialize('"' + calEvent.endTime + '"', DateTime.class);

        if (MedicalClinicUtil.hasConflict(startTime, endTime, calEvent.physicianId)) {
            return 'has_conflict';
        }

        request = new HttpRequest();
        request.setMethod('POST');
        request.setEndpoint('callout:Google_Api/calendar/v3/calendars/choudharymanish85@gmail.com/events?sendUpdates=all');

        String body = MedicalClinicUtil.getRequestBody(calEvent);
        request.setBody(body);
        System.debug('Body:' + body);
        response = http.send(request);
        if (response.getStatusCode() != 200) {
            return response.getBody();
        }
        String calendarEventId = MedicalClinicUtil.getCalendarEventId(response.getBody());
        // insert appointment recodrd
        Appointment__c appointment = new Appointment__c(
            Physician__c = calEvent.physicianId,
            Patient__c = calEvent.patientId,
            Start_Time__c = startTime,
            End_Time__c = endTime,
            Confirmed__c = true,
            Calendar_Event_Id__c = calendarEventId
        );
        insert appointment;

        Contact patient = PatientController.getPatientDetails(calEvent.patientId);
        String emailSubject = 'Physician Appointment Confirmation';
        String emailHtmlBody =
            'Hello ' +
            patient.Name +
            ', <br/><br/> Your appointment is confirmed for ' +
            calEvent.startTime +
            '.<br/><br/>Medical App Team';
        EmailService.sendEmail(patient.Email, 'choudharymanish85@gmail.com', emailHtmlBody, emailSubject);

        return response.getBody();
    }

    @AuraEnabled
    public static String updateEvent(String payload) {
        MedicalClinicUtil.CalendarEvent calEvent = (MedicalClinicUtil.CalendarEvent) JSON.deserialize(
            payload,
            MedicalClinicUtil.CalendarEvent.class
        );

        if (String.isBlank(calEvent.id)) {
            CalloutException invalidData = new CalloutException();
            invalidData.setMessage('Event id is blank');
            throw invalidData;
        }
        DateTime startTime = (DateTime) JSON.deserialize('"' + calEvent.startTime + '"', DateTime.class);
        DateTime endTime = (DateTime) JSON.deserialize('"' + calEvent.endTime + '"', DateTime.class);

        if (MedicalClinicUtil.hasConflict(startTime, endTime, calEvent.physicianId)) {
            return 'has_conflict';
        }

        request = new HttpRequest();
        request.setMethod('PUT');
        request.setEndpoint(
            'callout:Google_Api/calendar/v3/calendars/choudharymanish85@gmail.com/events/' +
            calEvent.id +
            '?sendUpdates=all'
        );

        String body = MedicalClinicUtil.getRequestBody(calEvent);
        request.setBody(body);
        System.debug('Body:' + body);
        response = http.send(request);
        if (response.getStatusCode() != 200) {
            return response.getBody();
        }
        String calendarEventId = MedicalClinicUtil.getCalendarEventId(response.getBody());
        // Update appointment record
        List<Appointment__c> appointments = [
            SELECT Id, Start_Time__c, End_Time__c
            FROM Appointment__c
            WHERE Calendar_Event_Id__c = :calendarEventId
        ];
        if (appointments != null && appointments.size() > 0) {
            Appointment__c appointment = appointments[0];
            appointment.Start_Time__c = startTime;
            appointment.End_Time__c = endTime;
            Database.update(appointment);
        }

        Contact patient = PatientController.getPatientDetails(calEvent.patientId);
        String emailSubject = 'Update in your upcoming appointment';
        String emailHtmlBody =
            'Hello ' +
            patient.Name +
            ', <br/><br/> Your upcoming appointment has moved to ' +
            calEvent.startTime +
            '.<br/><br/>Medical App Team';
        EmailService.sendEmail(patient.Email, 'choudharymanish85@gmail.com', emailHtmlBody, emailSubject);

        return response.getBody();
    }

    @AuraEnabled
    public static String deleteEvent(String calendarId) {
        request = new HttpRequest();
        request.setMethod('GET');
        request.setEndpoint('callout:Google_Api/calendar/v3/calendars/' + calendarId + '/events');

        response = http.send(request);
        if (response.getStatusCode() == 404) {
            return 'no_access';
        }

        return response.getBody();
    }

    @AuraEnabled
    public static string requestCalendarAccess(String emailId, String name) {
        String emailSubject = 'Google Calendar Access Request';
        String emailHtmlBody =
            'Hello ' +
            name +
            ', <br/><br/> Medical Clinic App has request access to your google calendar to manager your appointments. <br/>Please share your google calendar with below steps: <br/><br/> ' +
            'On your computer, open Google Calendar. You can\'t share calendars from the Google Calendar app.<br/>' +
            'On the left, find the "My calendars" section. You might need to click it to expand it. <br/>' +
            'Hover over the calendar you want to share, click More More and then Settings and sharing.<br/>' +
            'To broadly share it: Under "Access permissions," check the boxes of the ways you want to share and choose your options in the drop-down menu. Learn more about these options below.<br/>' +
            'To share with individuals: Under "Share with specific people," click Add people.<br/>' +
            'Add the person or Google group email address. Use the dropdown menu to adjust their permission settings.<br/>' +
            'Click Send.<br/><br/> Medical App Team';
        EmailService.sendEmail(emailId, 'choudharymanish85@gmail.com', emailHtmlBody, emailSubject);
        return 'success';
    }
}
