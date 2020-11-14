import React, { Component } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label} : ${payload[0].value}`}</p>
          <p className="desc">Anything you want can be displayed here.</p>
        </div>
      );
    }

    return null;
};

export default class BandwidthGraph extends Component {
    render() {

        let rawData = this.props.data;
        let data = [];
        let label = '';

        for (let i = 0; i < rawData.length; i++) {

            if (this.props.unit === 'day') {
                label = rawData[i].date.day;
            } else if (this.props.unit === 'hour') {
                label = rawData[i].time.hour + ":00";
            }

            data.push({
                label: label,
                rx: (rawData[i].rx / 1024 / 1024 / 1024).toFixed(2),
                tx: (rawData[i].tx / 1024 / 1024 / 1024).toFixed(2),
            });
        }

        return (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    margin={{
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis unit=" GB" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="rx" stackId="a" fill="#4299e1" unit=" GB" name="Rx" />
                    <Bar dataKey="tx" stackId="a" fill="#48bb78" unit=" GB" name="Tx" />
                </BarChart>
            </ResponsiveContainer>
        );
    }
}