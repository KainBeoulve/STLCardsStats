import moment from "moment";
import Constants from "src/js/utils/Constants";

export default class GraphFunctions {
    /**
     * This function adjusts the data range of the given chart. It is meant to "focus" the data in situations where
     * outliers that would cause poor visualization should be omitted.
     */
    static adjustAxisRange = (chart, boundingAxisValues, ticks) => {
        let maxIndex, minIndex;
        for (let i = ticks.length-1; i > 0; i--) {
            if ( ticks[i] > boundingAxisValues.maxValue ) {
                minIndex = i;
                break;
            }
        }
        for (let i = 0; i < ticks.length-1 ; i++) {
            if ( ticks[i] < boundingAxisValues.minValue ) {
                maxIndex = i;
                break;
            }
        }

        chart.options.scales.yAxes[0].ticks.min = ticks[maxIndex];
        chart.options.scales.yAxes[0].ticks.max = ticks[minIndex];
        chart.update();
    };

    /**
     * This function adjusts the maximum and minimum yAxis grid values to the values provided. It further
     * focuses data by omitting extraneous ticks if no data is present within the top and bottom intervals.
     */
    static adjustAxisTickExtremes = (chart, ticks) => {
        if (chart.data.datasets[0].data.length > Constants.AXIS_TICK_ADJUSTMENT_CUTOFF) {
            const interval = ticks[1] - ticks[2];

            chart.options.scales.yAxes[0].ticks.min = chart.data.datasets[0].data.some(
                entry => entry.y >= ticks[ticks.length - 2] - interval &&
                    entry.y <= ticks[ticks.length - 2]) ? ticks[ticks.length - 2] - interval : ticks[ticks.length - 2];
            chart.options.scales.yAxes[0].ticks.max = chart.data.datasets[0].data.some(
                entry => entry.y <= ticks[1] + interval &&
                    entry.y >= ticks[1]) ? ticks[1] + interval : ticks[1];
            chart.options.scales.yAxes[0].ticks.stepSize = interval;
            chart.update();
        }
    };

    /**
     * This function returns the data array in point format corresponding to a specific requested statistic specified
     * as the "dataArrayString" parameter.
     */
    static generateChartData = (dataObject, dataArrayString) => {
        const chartData = [];
        if (dataObject.gameDates) {
            for (let i = 0; i < dataObject.gameDates.length; i++) {
                chartData.push({
                    x: moment(dataObject.gameDates[i].toString()).toDate(),
                    y: dataObject[dataArrayString][i]
                });
            }
        }
        return chartData;
    };

    /**
     * This function calculates the maximum and minimum values of the y axis of the graph where "percentOfDataRequired"
     * percent of the data is shown. It is meant to prevent huge outlier data from ruining the visualization of trends
     * in the data.
     */
    static getBoundingAxisValues = (data, percentOfDataRequired, intervalPercent, absoluteMax, absoluteMin) => {
        let numerator = 0;
        let dataLength = data.length;
        data.forEach(entry => {
            numerator = numerator + entry.y;
        });
        const average = numerator/dataLength;
        let maxAxisValue = average;
        let minAxisValue = average;

        while (true) {
            let shownMax = 0;
            let shownMin = 0;
            data.forEach(entry => {
                if (entry.y <= maxAxisValue){
                    shownMax++;
                }
                if (entry.y >= minAxisValue){
                    shownMin++;
                }
            });

            const isMaxValueLargeEnough = shownMax/dataLength >= percentOfDataRequired;
            const isMinValueSmallEnough = shownMin/dataLength >= percentOfDataRequired;

            if (isMaxValueLargeEnough && isMinValueSmallEnough) {
                break;
            } else if (!isMaxValueLargeEnough && !isMinValueSmallEnough) {
                maxAxisValue = maxAxisValue + intervalPercent*average;
                minAxisValue = minAxisValue - intervalPercent*average;
            } else if (!isMaxValueLargeEnough) {
                maxAxisValue = maxAxisValue + intervalPercent*average;
            } else {
                minAxisValue = minAxisValue - intervalPercent*average;
            }
        }

        return {maxValue: Math.min(maxAxisValue, absoluteMax), minValue: Math.max(minAxisValue, absoluteMin)};
    };
}