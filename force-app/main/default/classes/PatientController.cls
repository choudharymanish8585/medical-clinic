public with sharing class PatientController {
    @AuraEnabled
    public static List<Contact> searchPatient(String searchTerm) {
        searchTerm = String.escapeSingleQuotes(searchTerm) + '%';

        return [
            SELECT Id, Name, Phone, Email, Birthdate
            FROM Contact
            WHERE RecordType.Name = 'Patient' AND (Name LIKE :searchTerm OR Phone LIKE :searchTerm OR Email LIKE :searchTerm)
            ORDER BY Name
            LIMIT 50000
        ];
    }

    @AuraEnabled
    public static Contact getPatientDetails(String patientId) {
        List<Contact> patients = [
            SELECT
                Id,
                Name,
                Phone,
                Email,
                Birthdate,
                (SELECT Id, Confirmed__c, Patient__c, Physician__c, Start_Time__c, End_Time__c FROM Appointment__r)
            FROM Contact
            WHERE Id = :patientId AND RecordType.Name = 'Patient'
        ];
        if (patients != null && patients.size() > 0) {
            return patients[0];
        }
        return null;
    }
}
