import { LightningElement, track } from "lwc";
import getAppointmentByPhysician from "@salesforce/apex/DashboardController.getAppointmentByPhysician";
import getAppointmentBySpecialization from "@salesforce/apex/DashboardController.getAppointmentBySpecialization";

export default class McDashboardPage extends LightningElement {
    @track physicianChartConfig;
    @track specializationChartConfig;

    connectedCallback() {
        this.fetchAppointmentsByPhysician();
        this.fetchAppointmentBySpecialization();
    }

    fetchAppointmentsByPhysician() {
        getAppointmentByPhysician()
            .then((resp) => {
                if (resp && resp.length) {
                    const chartData = [];
                    const chartLabels = [];
                    resp.forEach((element) => {
                        chartData.push(element.count);
                        chartLabels.push(element.name);
                    });

                    this.physicianChartConfig = {
                        type: "bar",
                        data: {
                            labels: chartLabels,
                            datasets: [
                                {
                                    label: "Appointment By Physician",
                                    barPercentage: 0.5,
                                    barThickness: 6,
                                    maxBarThickness: 8,
                                    minBarLength: 2,
                                    backgroundColor: "green",
                                    data: chartData
                                }
                            ]
                        },
                        options: {}
                    };
                    console.log("data => ", resp);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    fetchAppointmentBySpecialization() {
        getAppointmentBySpecialization()
            .then((resp) => {
                if (resp && resp.length) {
                    const chartData = [];
                    const chartLabels = [];
                    resp.forEach((element) => {
                        chartData.push(element.count);
                        chartLabels.push(element.name);
                    });

                    this.specializationChartConfig = {
                        type: "bar",
                        data: {
                            labels: chartLabels,
                            datasets: [
                                {
                                    label: "Appointment By Physician",
                                    barPercentage: 0.5,
                                    barThickness: 6,
                                    maxBarThickness: 8,
                                    minBarLength: 2,
                                    backgroundColor: "green",
                                    data: chartData
                                }
                            ]
                        },
                        options: {}
                    };
                    console.log("data => ", resp);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
}
