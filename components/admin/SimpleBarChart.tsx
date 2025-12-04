import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChartData {
    label: string;
    value: number;
}

interface SimpleBarChartProps {
    data: ChartData[];
    barColor?: string;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, barColor = '#14B8A6' }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

    React.useLayoutEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const { width, height } = dimensions;
    const padding = { top: 20, right: 20, bottom: 40, left: 30 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxValue = Math.max(...data.map(d => d.value), 0);
    const yScale = chartHeight / (maxValue === 0 ? 1 : maxValue);
    const barWidth = data.length > 0 ? chartWidth / data.length * 0.8 : 0;
    const barGap = data.length > 0 ? chartWidth / data.length * 0.2 : 0;

    const yAxisTicks = React.useMemo(() => {
        if (maxValue === 0) return [0];
        const ticks = [];
        const tickCount = 4;
        const step = Math.ceil(maxValue / tickCount);
        for (let i = 0; i <= tickCount; i++) {
            ticks.push(i * step);
        }
        return ticks;
    }, [maxValue]);

    return (
        <div ref={containerRef} className="w-full h-full min-h-[300px]">
            {width > 0 && (
                <svg width={width} height={height}>
                    <g transform={`translate(${padding.left}, ${padding.top})`}>
                        {/* Y-Axis */}
                        {yAxisTicks.map(tick => (
                            <g key={tick} transform={`translate(0, ${chartHeight - tick * yScale})`}>
                                <line x2={chartWidth} stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-gray-700" />
                                <text x="-5" dy=".32em" textAnchor="end" fontSize="10" className="fill-current text-gray-500 dark:text-gray-400">
                                    {tick}
                                </text>
                            </g>
                        ))}

                        {/* Bars */}
                        <AnimatePresence>
                            {data.map((d, i) => (
                                <g key={d.label} transform={`translate(${(i * (barWidth + barGap)) + (barGap / 2)}, 0)`}>
                                    <motion.rect
                                        x="0"
                                        y={chartHeight - (d.value * yScale)}
                                        width={barWidth}
                                        height={d.value * yScale}
                                        fill={barColor}
                                        rx="2"
                                        initial={{ height: 0, y: chartHeight }}
                                        animate={{ height: d.value * yScale, y: chartHeight - (d.value * yScale) }}
                                        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.05 }}
                                    />
                                    <text
                                        x={barWidth / 2}
                                        y={chartHeight + 15}
                                        textAnchor="middle"
                                        fontSize="10"
                                        className="fill-current text-gray-500 dark:text-gray-400"
                                    >
                                        {d.label}
                                    </text>
                                </g>
                            ))}
                        </AnimatePresence>
                    </g>
                </svg>
            )}
        </div>
    );
};

export default SimpleBarChart;
