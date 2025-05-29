import React, { Component, HtmlHTMLAttributes } from "react";
import "@root/styles/graphCard.scss";
import Button from "./Button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, TooltipProps } from 'recharts';

type graphDataItem = {
    [key in "day" | "spotter" | "other"]: number;
}

const keyframes = [
    { day: 0, spotter: 98, other: 97 },
    { day: 30, spotter: 97, other: 86 },
    { day: 60, spotter: 96, other: 80 },
    { day: 90, spotter: 94, other: 50 },
    { day: 120, spotter: 98, other: 25 },
];

function interpolateGraphData(keyframes: graphDataItem[]): graphDataItem[] {
    const result: graphDataItem[] = [];

    for (let i = 0; i < keyframes.length - 1; i++) {
        const start = keyframes[i];
        const end = keyframes[i + 1];
        const duration = end.day - start.day;

        for (let d = 0; d < duration; d++) {
            const t = d / duration;
            const day = start.day + d;

            result.push({
                day,
                spotter: parseFloat((start.spotter + (end.spotter - start.spotter) * t).toFixed(3)),
                other: parseFloat((start.other + (end.other - start.other) * t).toFixed(3)),
            });
        }
    }

    result.push(keyframes[keyframes.length - 1]);

    return result;
}

const interpolatedData = interpolateGraphData(keyframes);

type div = HtmlHTMLAttributes<HTMLDivElement>;
interface GraphProps extends div {
    containerProps?: div;
}

export default class extends Component<GraphProps> {
    state = {
        size: 600,
        tooltipForce: null as TooltipProps<any, any> | null,
    };

    constructor(props: GraphProps) {
        super(props);
        this.state.size = this.getSize();
    }

    resize = () => {
        const size = this.getSize();
        if (size !== this.state.size) {
            this.setState({ size });
        }
    };

    componentDidMount(): void {
        window.addEventListener("resize", this.resize);

        const isMobile = window.innerWidth <= 600;
        if (isMobile) {
            const tooltipDay = 90;
            const tooltipData = interpolatedData.find(item => item.day === tooltipDay);

            if (tooltipData) {
                this.setState({
                    tooltipForce: {
                        active: true,
                        label: tooltipData.day,
                        payload: [
                            { name: "spotter", value: tooltipData.spotter, dataKey: "spotter" },
                            { name: "other", value: tooltipData.other, dataKey: "other" },
                        ],
                        position: {
                            x: this.getSize() * 0.6,
                            y: this.getSize() / 3,
                        },
                    }
                });
            }
        }
    }

    componentWillUnmount(): void {
        window.removeEventListener("resize", this.resize);
    }

    getSize = () => {
        const initialWidth = window.innerWidth;
        let size = initialWidth - 48;
        return size > 600 ? 600 : size;
    }

    Typer = () => (
        <div className="typer">
            <span>Why Spotter</span>
            <div className="typing">
                <span>_</span>
            </div>
        </div>
    );

    Info = () => (
        <>
            <h1>
                The internet's most<br />
                <b className="text-primary">accurate</b> visitor identifier
            </h1>
            <p>
                <b>Industry-leading accuracy</b> that lasts for months
                or years, even when cookies are cleared.
            </p>
        </>
    );

    CustomDot = () => null;

    CustomTooltip = (props: TooltipProps<any, any>) => {
        const { label, payload } = props;
        if (!label || !payload || payload.length === 0) return null;

        const element = interpolatedData.find(d => d.day === label);
        if (!element) return null;

        let spotter = 100 - element.spotter;
        let other = 100 - element.other;

        return (
            <div className="preview_graph">
                <div className="day">{element.day} DAYS</div>
                <div className="info">
                    <div className="spotter label">
                        spotter <span>-{spotter % 1 === 0 ? spotter : spotter.toFixed(2)}%</span>
                    </div>
                    <div className="other label">
                        other <span>-{other % 1 === 0 ? other : other.toFixed(2)}%</span>
                    </div>
                </div>
            </div>
        );
    };

    CustomXAxisLine = ({ x, y, height, width }: any) => {
        const maxWidth = 540;
        const adjustedWidth = Math.min(width, maxWidth);
        return (
            <line
                x1={x}
                y1={y + height}
                x2={x + adjustedWidth}
                y2={y + height}
                stroke="red"
                strokeWidth={1}
            />
        );
    };

    render(): React.ReactNode {
        const { Typer, Info, CustomDot, CustomTooltip, CustomXAxisLine } = this;

        return (
            <div className="graph_card">
                <div className="content">
                    <Typer />
                    <Info />
                    <div style={{ paddingBottom: "1rem" }}>
                        <Button>Learn More</Button>
                    </div>
                </div>

                <div className="line_graph">
                    <div className="lines">
                        <LineChart width={this.state.size} height={Math.round(this.state.size / 2)} data={keyframes}>
                            <XAxis
                                dataKey="day"
                                label={{
                                    value: "Days After Initial Identification",
                                    position: "insideBottom",
                                    style: { fill: 'transparent', fontSize: 12, left: 18 }
                                }}
                                padding={{ left: 24, right: 24 }}
                                axisLine={<CustomXAxisLine />}
                                className="top_line"
                            />
                            <Line
                                type="monotone"
                                dataKey="other"
                                stroke="#f97316"
                                strokeWidth={2}
                                dot={<CustomDot />}
                                activeDot={<CustomDot />}
                                name=""
                            />
                            <Line
                                type="monotone"
                                dataKey="spotter"
                                stroke="teal"
                                strokeWidth={2}
                                dot={<CustomDot />}
                                activeDot={<CustomDot />}
                            />
                        </LineChart>
                    </div>

                    <div className="hover_elements">
                        <LineChart width={this.state.size} height={Math.round(this.state.size / 2)} data={interpolatedData}>
                            <XAxis
                                dataKey="day"
                                label={{
                                    value: "Days After Initial Identification",
                                    position: "insideBottom",
                                    style: { fill: 'black', fontSize: 12, marginLeft: 18 }
                                }}
                                padding={{ left: 24, right: 24 }}
                                axisLine={<CustomXAxisLine />}
                            />
                            <Tooltip content={<CustomTooltip />} {...(this.state.tooltipForce || {})} />
                            <Line type="monotone" dataKey="other" stroke="" strokeWidth={0} dot={<CustomDot />} name="" />
                            <Line
                                type="monotone"
                                dataKey="spotter"
                                stroke="teal"
                                strokeWidth={0}
                                dot={<CustomDot />}
                                activeDot={{ r: 4, stroke: "teal", strokeWidth: 3, fill: "#fff" }}
                            />
                        </LineChart>
                    </div>

                    <div className="after">
                        <span>Accuracy dropoff</span>
                        <span>days after initial identification</span>
                    </div>
                </div>
            </div>
        );
    }

    mouseCods = 0;
}
