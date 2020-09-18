public with sharing class EmailService {
    public static void sendEmail(String toMail, String ccMail, String htmlBody, String subject) {
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        string[] to = new List<string>{ toMail };
        string[] cc = new List<string>{ ccMail };

        email.setToAddresses(to);
        if (ccMail != null && ccMail != '')
            email.setCcAddresses(cc);

        //email.setSubject('Physician Appointment Confirmation');
        email.setSubject(subject);
        email.setHtmlBody(htmlBody);
        try {
            Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{ email });
        } catch (exception e) {
            //apexpages.addmessage(new apexpages.message(apexpages.severity.error, e.getMessage()));
        }
    }
}
