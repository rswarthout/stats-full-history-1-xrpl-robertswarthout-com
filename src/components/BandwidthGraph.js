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
        let total = Number((parseFloat(payload[0].value) + parseFloat(payload[1].value)).toFixed(2));

        return (
            <div className="bg-white border border-gray-500 rounded-sm shadow-md p-1">
                <table>
                    <tbody>
                        <tr>
                            <td className="text-left" style={{ color: payload[0].color }}>{ payload[0].name }</td>
                            <td className="text-right">{ payload[0].value }</td>
                        </tr>
                        <tr>
                            <td className="text-left" style={{ color: payload[1].color }}>{ payload[1].name }</td>
                            <td className="text-right">{ payload[1].value }</td>
                        </tr>
                        <tr>
                            <td className="text-left pr-1 font-bold">Total</td>
                            <td className="text-right font-bold">{ total }</td>
                        </tr>
                    </tbody>
                </table>
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
                        left: 10,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis unit=" GB" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="rx" stackId="a" fill="#4299e1" unit=" GB" name="Rx" />
                    <Bar dataKey="tx" stackId="a" fill="#48bb78" unit=" GB" name="Tx" />
                </BarChart>
            </ResponsiveContainer>
        );
    }
}