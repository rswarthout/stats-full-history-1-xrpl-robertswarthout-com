import React from 'react';
import axios from "axios";
import BandwidthGraph from '../components/BandwidthGraph';

export default class Home extends React.Component {

    constructor() {
        super();
        this.state = {};
        this.getUplinkData = this.getUplinkData.bind(this);
        this.getStorageData = this.getStorageData.bind(this);
    }

    componentDidMount() {
        this.getUplinkData();
        this.getStorageData();
    }

    async getStorageData() {
        let data = await axios
            .get("/assets/json/storage.json")
            .then(function (response) {
                return response;
            })
            .catch(function(error) {
                console.log(error);
            });

        this.setState({
            databaseSize: data.data.volume,
        });
    }

    async getUplinkData() {
        let data = await axios
            .get("/assets/json/uplink.json")
            .then(function (response) {
                return response;
            })
            .catch(function(error) {
                console.log(error);
            });

        let uplink30Days = data.data.interfaces[0].traffic.day.slice(-31);
        let totalBandwidth = 0;
        let totalDays = 0;

        for (var i = 0; i < uplink30Days.length; i++) {
            totalBandwidth += uplink30Days[i].rx + uplink30Days[i].tx;

            if (uplink30Days[i].rx !== 0 && uplink30Days[i].tx !== 0) {
                totalDays++;
            }
        }

        this.setState({
            uplink24Hours: data.data.interfaces[0].traffic.hour.slice(-24),
            uplink30Days: uplink30Days,
            bandwidth30Avg: (totalBandwidth / totalDays)
        });
    }

    getReadableFileSizeString(fileSizeInBytes) {
        var i = -1;
        var byteUnits = [' kB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];

        do {
            fileSizeInBytes = fileSizeInBytes / 1024;
            i++;
        } while (fileSizeInBytes > 1024);

        return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
    }

    render() {

        let graph30Days = (
            <span>Loading...</span>
        );

        let graph24Hours = (
            <span>Loading...</span>
        );

        let databaseSize = "-";
        let bandwidth30Avg = "-";

        if (this.state.uplink24Hours) {
            graph30Days = <BandwidthGraph unit="day" data={this.state.uplink30Days} />
            graph24Hours = <BandwidthGraph unit="hour" data={this.state.uplink24Hours} />
        }

        if (this.state.bandwidth30Avg) {
            bandwidth30Avg = this.getReadableFileSizeString(this.state.bandwidth30Avg);
        }

        if (this.state.databaseSize) {
            // We multiply by 1024 since this values comes in KB instead of bytes.
            databaseSize = this.getReadableFileSizeString((this.state.databaseSize * 1024));
        }

        return (
            <div className="pt-12 sm:pt-16">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl leading-9 font-extrabold text-gray-900 sm:text-4xl sm:leading-10">
                            Stats from an XRPL Full-History Node
                        </h2>
                        <p className="mt-3 text-xl leading-7 text-gray-500 sm:mt-4">
                            n9Mh83gUuY4hBXVD9geWHsyVwz5h32rjauLWQCZJVTEbCb5TYs21
                        </p>
                    </div>
                </div>
                <div className="mt-10 pb-10 sm:pb-16">
                    <div className="relative">
                        <div className="absolute inset-0 h-1/2"></div>
                        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="max-w-2xl mx-auto">
                                <dl className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-2">
                                    <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                                        <dd className="order-1 text-5xl leading-none font-extrabold text-blue-600" aria-describedby="item-1">
                                            { databaseSize }
                                        </dd>
                                        <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500" id="item-1">
                                            Database Size
                                        </dt>
                                    </div>
                                    <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                                        <dd className="order-1 text-5xl leading-none font-extrabold text-blue-600">
                                            { bandwidth30Avg }
                                        </dd>
                                        <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                                            30-Day Bandwidth Avg / Day
                                        </dt>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative pb-10 px-4 sm:px-6">
                    <div className="absolute inset-0">
                        <div className="bg-white h-1/3 sm:h-2/3"></div>
                    </div>
                    <div className="relative max-w-7xl mx-auto">
                        <div className="text-center">
                            <h2 className="text-2xl leading-9 tracking-tight font-bold text-gray-900">
                                Bandwidth Usage
                            </h2>
                        </div>
                        <div className="mt-8 grid gap-5 max-w-lg mx-auto lg:grid-cols-2 lg:max-w-none">
                            <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="text-md font-bold text-gray-900 text-center my-5">
                                    Bandwidth Consumption by Hour
                                </div>
                                <div className="pb-6 pr-10">
                                    { graph24Hours }
                                </div>
                            </div>
                            <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="text-md font-bold text-gray-900 text-center my-5">
                                    Bandwidth Consumption by Day
                                </div>
                                <div className="pb-6 pr-10">
                                    { graph30Days }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}