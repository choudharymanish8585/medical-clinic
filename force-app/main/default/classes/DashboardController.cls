public with sharing class DashboardController {
    @AuraEnabled
    public static List<GraphData> getAppointmentByPhysician() {
        List<GraphData> graphData = new List<GraphData>();
        for (AggregateResult result : [
            SELECT Physician__c, Physician__r.Name name, Count(id) total
            FROM Appointment__c
            GROUP BY Physician__c, Physician__r.Name
        ]) {
            GraphData data = new GraphData();
            data.id = String.valueOf(result.get('Physician__c'));
            data.name = String.valueOf(result.get('name'));
            data.count = Integer.valueOf(result.get('total'));
            graphData.add(data);
        }
        return graphData;
    }

    @AuraEnabled
    public static List<GraphData> getAppointmentBySpecialization() {
        List<GraphData> graphData = new List<GraphData>();
        for (AggregateResult result : [
            SELECT Physician__r.Specialization__c specialization, Physician__r.Specialization__r.Name specializationName, Count(id) total
            FROM Appointment__c
            GROUP BY Physician__r.Specialization__c, Physician__r.Specialization__r.Name
        ]) {
            GraphData data = new GraphData();
            data.id = String.valueOf(result.get('specialization'));
            data.name = String.valueOf(result.get('specializationName'));
            data.count = Integer.valueOf(result.get('total'));
            graphData.add(data);
        }
        return graphData;
    }

    public class GraphData {
        @AuraEnabled
        public String id;
        @AuraEnabled
        public String name;
        @AuraEnabled
        public Integer count;
    }
}
