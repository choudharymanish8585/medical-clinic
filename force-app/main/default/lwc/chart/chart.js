import { LightningElement, api } from "lwc";
import ChartJS from "@salesforce/resourceUrl/ChartJS";
import { loadScript } from "lightning/platformResourceLoader";

export default class Chart extends LightningElement {
    @api chartConfig;

    isChartJsInitialized;
    renderedCallback() {
        if (this.isChartJsInitialized) {
            return;
        }
        // load static resources.
        Promise.all([loadScript(this, ChartJS)])
            .then(() => {
                this.isChartJsInitialized = true;
                const ctx = this.template.querySelector("canvas.barChart").getContext("2d");
                this.chart = new window.Chart(ctx, JSON.parse(JSON.stringify(this.chartConfig)));
                this.chart.canvas.parentNode.style.height = "auto";
                this.chart.canvas.parentNode.style.width = "100%";
            })
            .catch((error) => {
                console.error(error);
            });
    }
}
