import './styles/app.css';
import { lineChart } from './line-chart';

document.addEventListener('DOMContentLoaded', () => {

    const jsonData = [
        {
            "Month": "2019/06",
            "Billable Hits": 1860321
        },
        {
            "Month": "2019/07",
            "Billable Hits": 2425754
        },
        {
            "Month": "2019/08",
            "Billable Hits": 2295600
        },
        {
            "Month": "2019/09",
            "Billable Hits": 2174621
        },
        {
            "Month": "2019/10",
            "Billable Hits": 2603090
        },
        {
            "Month": "2019/11",
            "Billable Hits": 2589120
        },
        {
            "Month": "2019/12",
            "Billable Hits": 2863220
        },
        {
            "Month": "2020/01",
            "Billable Hits": 2774168
        },
        {
            "Month": "2020/02",
            "Billable Hits": 2613543
        },
        {
            "Month": "2020/03",
            "Billable Hits": 2225322
        },
        {
            "Month": "2020/04",
            "Billable Hits": 1046884
        },
        {
            "Month": "2020/05",
            "Billable Hits": 1864608
        },
        {
            "Month": "2020/06",
            "Billable Hits": 3099153
        },
        {
            "Month": "2020/07",
            "Billable Hits": 3470386
        },
        {
            "Month": "2020/08",
            "Billable Hits": 3687080
        },
        {
            "Month": "2020/09",
            "Billable Hits": 3692696
        },
        {
            "Month": "2020/10",
            "Billable Hits": 23491461
        },
        {
            "Month": "2020/11",
            "Billable Hits": 32090988
        },
        {
            "Month": "2020/12",
            "Billable Hits": 43037196
        },
        {
            "Month": "2021/01",
            "Billable Hits": 55292948
        },
        {
            "Month": "2021/02",
            "Billable Hits": 75285265
        },
        {
            "Month": "2021/03",
            "Billable Hits": 93208139
        },
        {
            "Month": "2021/04",
            "Billable Hits": 107742620
        },
        {
            "Month": "2021/05",
            "Billable Hits": 147072670
        },
        {
            "Month": "2021/06",
            "Billable Hits": 131446718
        },
        {
            "Month": "2021/07",
            "Billable Hits": 142037986
        },
        {
            "Month": "2021/08",
            "Billable Hits": 174570288
        },
        {
            "Month": "2021/09",
            "Billable Hits": 423755910
        },
        {
            "Month": "2021/10",
            "Billable Hits": 777374274
        },
        {
            "Month": "2021/11",
            "Billable Hits": 996851773
        },
        {
            "Month": "2021/12",
            "Billable Hits": 1038078585
        },
        {
            "Month": "2022/01",
            "Billable Hits": 1011909637
        },
        {
            "Month": "2022/02",
            "Billable Hits": 843696654
        },
        {
            "Month": "2022/03",
            "Billable Hits": 1028649405
        },
        {
            "Month": "2022/04",
            "Billable Hits": 1155749768
        }
    ];

    // Creating a new LineChart instance and rendering it
    const line_chart = new lineChart();
    const chartNode = line_chart.render(JSON.stringify(jsonData));

    // Appending the chart SVG node to the 'chart' element
    document.getElementById('chart').appendChild(chartNode);
});