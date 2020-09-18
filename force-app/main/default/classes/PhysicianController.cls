public with sharing class PhysicianController {
    @AuraEnabled
    public static List<Physician__c> getPhysicians() {
        return [SELECT Id, Name, Email__c, Phone__c, Specialization__c FROM Physician__c ORDER BY Name LIMIT 50000];
    }

    @AuraEnabled
    public static List<Physician__c> getPhysiciansBySpecialization(String specializationId) {
        specializationId = String.escapeSingleQuotes(specializationId);
        return [
            SELECT Id, Name, Email__c, Phone__c, Specialization__c
            FROM Physician__c
            WHERE Specialization__c = :specializationId
            ORDER BY Name
            LIMIT 50000
        ];
    }
}
