import React, { useEffect, useRef, useMemo } from 'react';

declare const Chart: any; // Using Chart.js from CDN

const SmallBizChart: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<any>(null);

    // Data from user's example
    const data = useMemo(() => [
        { label: "Shop Owner", value: 400000 },
        { label: "Software Engineer", value: 800000 },
        { label: "Freelancer", value: 500000 }
    ], []);

    const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                }

                chartInstanceRef.current = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: data.map((d) => d.label),
                        datasets: [
                            {
                                data: data.map((d) => d.value),
                                backgroundColor: ["#36A2EB", "#FF6384", "#FFCD56"],
                                borderColor: "#fff",
                                borderWidth: 2
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'bottom' as const },
                            tooltip: {
                                callbacks: {
                                    label: (ctx: any) => {
                                        const v = ctx.raw as number;
                                        const pct = ((v / total) * 100).toFixed(1);
                                        const format =
                                            v >= 100000
                                                ? `₹${(v / 100000).toFixed(1)} L`
                                                : `₹${v.toLocaleString()}`;
                                        return `${ctx.label}: ${format} (${pct}%)`;
                                    }
                                }
                            }
                        }
                    },
                });
            }
        }
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [data, total]);

    // Use Tailwind classes for a consistent card UI
    return (
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-purple-200/50 hover:[transform:rotateX(10deg)_rotateY(-4deg)_scale(1.05)]">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Jobs vs. Small Business — Avg. Annual Income</h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6">
                A comparison of average annual incomes for different career paths.
            </p>
            <div className="relative h-80 sm:h-96 w-full max-w-sm sm:max-w-md mx-auto">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
};

export default SmallBizChart;