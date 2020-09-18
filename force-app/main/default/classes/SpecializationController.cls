public with sharing class SpecializationController {
    @AuraEnabled
    public static List<Specialization__c> getSpecializations() {
        return [SELECT Id, Name, Appointment_Price__c, Clinic__c, Diagnosis_Duration_In_minutes__c FROM Specialization__c];
    }

    @AuraEnabled
    public static List<Specialization__c> getSpecializationsByClinic(String clinicId) {
        clinicId = String.escapeSingleQuotes(clinicId);
        return [SELECT Id, Name, Appointment_Price__c, Clinic__c, Diagnosis_Duration_In_minutes__c FROM Specialization__c];
    }
}
