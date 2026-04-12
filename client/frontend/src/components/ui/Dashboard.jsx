import Card from "./Card"
import Table from "./Table"
import {
    AlignEndHorizontal,
 ChartNoAxesCombined,
 HandCoins,
 ShoppingCart
} from "lucide-react";
import ReactECharts from 'echarts-for-react';
import { symbol } from "joi";

const Dashboard = () => {

    const columns = [
        {
            title: "Total Sales",
            data: 100,
            subtitle: "vs last month",
            logo: ChartNoAxesCombined,
            bgColor: "p-2 bg-sky-300 rounded-md"
        },
        {
            title: "Total Purchases",
            data: 100,
            subtitle: "vs last month",
            logo: ShoppingCart,
            bgColor: "p-2 bg-yellow-300 rounded-md"
        },
        {
            title: "Total Revenues",
            data: 100,
            subtitle: "vs last month",
            logo: HandCoins,
            bgColor: "p-2 bg-pink-300 rounded-md"
        },
        {
            title: "Total Products",
            data: 200,
            subtitle: "vs last month",
            logo: AlignEndHorizontal,
            bgColor: "p-2 bg-cyan-300 rounded-md"
        }
    ]

    const option = {
        title: {text: "Revenue Analytics"},
        tooltip: {trigger: "axis"},
        xAxis: {data: ["Jan","Feb","Mar"], 

            // style for axis items,and their pointer
            // axisLabel : {
            //     color: "#08eaff"
            // },

            
            },
        yAxis: {
            type: "value",
            axisLine: {
                show: false
            },
            // split line from y-axis
            splitLine: {
                // lineStyle: {
                //     color: "#08eaff"
                // }
                show: false
            }
        },
        series: [{
            type: "line",
            data: [120, 200, 150, 280],

            lineStyle: {
                type: "solid",
                color: "#E69F00",
                width: 3
            },

            // point - attribute

            symbol: "circle",
            symbolSize: 8,

            // pointer style

            itemStyle: {
                color: "#00000",
                borderWidth: 3,
                borderColor: "#00000"
            },

            // area style - color under chart
            areaStyle: {
                color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        {offset: 0,color: "rgba(59,130,246,0.5)"},
                        {offset: 1,color: "rgba(59,130,246,0)"},
                    ]
                }
            },

            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true
            },
            
           

            smooth: true

        }]
    }

    return (
        <div>
            <div>
                <Card columns={columns} />
            </div>
            <div>
                <ReactECharts 
                option={option}
                style={{height: 400,width: "100%"}}
                // theme="light"
                />
            </div>
        </div>
    )
}

export default Dashboard