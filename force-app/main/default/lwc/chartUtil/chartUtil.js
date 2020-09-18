const getStacked = (stacked) => {
    if (stacked) {
        return {
            xAxes: [
                {
                    stacked: true
                }
            ],
            yAxes: [
                {
                    type: "linear",
                    stacked: true,
                    ticks: {
                        beginAtZero: true
                    }
                }
            ]
        };
    }
    return {
        yAxes: [
            {
                type: "linear",
                ticks: {
                    beginAtZero: true
                }
            }
        ]
    };
};

const getChart = (element, data, type, stacked, options) => {
    const ctx = element.getContext("2d");
    let chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 5,
        scales: getStacked(stacked),
        legend: {
            position: "right",
            labels: {
                boxWidth: 20
            }
        }
    };

    chartOptions = { ...chartOptions, options };
    const chart = new Chart(ctx, {
        type: type ? type : "bar",
        data: data,
        options: chartOptions
    });
    return chart;
};

const updateChart = (chart, data, type, stacked) => {
    if (data) chart.data = data;
    if (type) chart.type = type;
    if (stacked) chart.options.scales = getStacked(stacked);
    chart.update();
};

const getCircleChart = (canvas, data, type, options) => {
    const ctx = canvas.getContext("2d");
    let chartOptions = {
        responsive: true,
        legend: {
            position: "right"
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    };

    chartOptions = { ...chartOptions, options };
    const chart = new Chart(ctx, {
        type: type ? type : "doughnut",
        data: data,
        options: chartOptions
    });
    return chart;
};

const colorPalette = [
    "rgba(254, 164, 127,1.0)",
    "rgba(37, 204, 247,1.0)",
    "rgba(234, 181, 67,1.0)",
    "rgba(85, 230, 193,1.0)",
    "rgba(202, 211, 200,1.0)",
    "rgba(249, 127, 81,1.0)",
    "rgba(27, 156, 252,1.0)",
    "rgba(248, 239, 186,1.0)",
    "rgba(88, 177, 159,1.0)",
    "rgba(44, 58, 71,1.0)",
    "rgba(179, 55, 113,1.0)",
    "rgba(59, 59, 152,1.0)",
    "rgba(253, 114, 114,1.0)",
    "rgba(154, 236, 219,1.0)",
    "rgba(214, 162, 232,1.0)",
    "rgba(109, 33, 79,1.0)",
    "rgba(24, 44, 97,1.0)",
    "rgba(24, 44, 97,1.0)",
    "rgba(252, 66, 123,1.0)",
    "rgba(189, 197, 129,1.0)",
    "rgba(130, 88, 159,1.0)"
];

export { colorPalette, getChart, updateChart, getCircleChart };
