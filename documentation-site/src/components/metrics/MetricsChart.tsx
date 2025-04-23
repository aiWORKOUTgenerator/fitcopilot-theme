import BrowserOnly from '@docusaurus/BrowserOnly';
import React, { useEffect, useRef, useState } from 'react';

interface MetricsChartProps {
    src: string;
    keys: string[];
    title?: string;
    type?: 'line' | 'bar';
    height?: number;
}

interface MetricsData {
    date: string;
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    webVitals: {
        lcp: number;
        fid: number;
        cls: number;
        fcp: number;
        tbt: number;
    };
}

const MetricsChart: React.FC<MetricsChartProps> = ({
    src,
    keys,
    title,
    type = 'line',
    height = 300,
}) => {
    // Render this component only in the browser
    return (
        <BrowserOnly>
            {() => <MetricsChartBrowser src={src} keys={keys} title={title} type={type} height={height} />}
        </BrowserOnly>
    );
};

// Browser-only implementation to avoid SSR issues with Chart.js
const MetricsChartBrowser: React.FC<MetricsChartProps> = ({
    src,
    keys,
    title,
    type = 'line',
    height = 300,
}) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const [data, setData] = useState<MetricsData | null>(null);
    const [historyData, setHistoryData] = useState<MetricsData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [chart, setChart] = useState<any>(null);

    // Function to get nested property value
    const getNestedValue = (obj: any, path: string): number => {
        return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj) || 0;
    };

    // Function to format metrics for display
    const formatMetric = (key: string, value: number): string => {
        if (key.includes('cls')) return value.toFixed(3);
        if (key.includes('lcp') || key.includes('fid') || key.includes('fcp') || key.includes('tbt')) {
            return `${(value / 1000).toFixed(2)}s`;
        }
        return value.toFixed(0);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Load the Chart.js library dynamically
                const { Chart, LineController, BarController, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } = await import('chart.js');

                Chart.register(
                    LineController,
                    BarController,
                    CategoryScale,
                    LinearScale,
                    PointElement,
                    LineElement,
                    BarElement,
                    Title,
                    Tooltip,
                    Legend
                );

                // Fetch latest metrics
                const response = await fetch(src);
                const metricsData = await response.json();
                setData(metricsData);

                // Fetch historical data if available
                try {
                    const historyResponse = await fetch('/metrics/data/history.json');
                    const historyData = await historyResponse.json();
                    setHistoryData(historyData);
                } catch (historyError) {
                    console.warn('Could not load historical data:', historyError);
                    // If history isn't available, create a simple array with just the current data
                    setHistoryData([metricsData]);
                }

                setLoading(false);
            } catch (err) {
                setError('Failed to load metrics data');
                setLoading(false);
                console.error('Error loading metrics:', err);
            }
        };

        fetchData();

        // Cleanup
        return () => {
            if (chart) {
                chart.destroy();
            }
        };
    }, [src]);

    useEffect(() => {
        if (!loading && !error && chartRef.current && historyData.length > 0) {
            const ctx = chartRef.current.getContext('2d');

            if (ctx) {
                // Destroy existing chart if it exists
                if (chart) {
                    chart.destroy();
                }

                // Format labels (dates)
                const labels = historyData.map(d => new Date(d.date).toLocaleDateString());

                // Create datasets from keys
                const datasets = keys.map(key => {
                    let label = key;
                    let data = historyData.map(d => getNestedValue(d, key));

                    // Formatting labels for better display
                    if (key === 'performance') label = 'Performance Score';
                    if (key === 'accessibility') label = 'Accessibility Score';
                    if (key === 'bestPractices') label = 'Best Practices';
                    if (key === 'seo') label = 'SEO Score';
                    if (key === 'webVitals.lcp') label = 'LCP';
                    if (key === 'webVitals.fid') label = 'FID';
                    if (key === 'webVitals.cls') label = 'CLS';
                    if (key === 'webVitals.fcp') label = 'FCP';
                    if (key === 'webVitals.tbt') label = 'TBT';

                    // Set colors based on metrics
                    let borderColor = '#4285F4';
                    if (key.includes('performance')) borderColor = '#0CCE6B';
                    if (key.includes('accessibility')) borderColor = '#7B68EE';
                    if (key.includes('bestPractices')) borderColor = '#1E88E5';
                    if (key.includes('seo')) borderColor = '#FF8F00';
                    if (key.includes('lcp')) borderColor = '#06A77D';
                    if (key.includes('fid')) borderColor = '#1E88E5';
                    if (key.includes('cls')) borderColor = '#7B68EE';
                    if (key.includes('fcp')) borderColor = '#FF8F00';
                    if (key.includes('tbt')) borderColor = '#E53935';

                    return {
                        label,
                        data,
                        borderColor,
                        backgroundColor: `${borderColor}33`,
                        borderWidth: 2,
                        tension: 0.2,
                    };
                });

                // Create the chart
                const newChart = new Chart(ctx, {
                    type: type,
                    data: {
                        labels,
                        datasets,
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: !!title,
                                text: title || '',
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        const label = context.dataset.label || '';
                                        const value = context.parsed.y;
                                        const key = keys[context.datasetIndex];
                                        return `${label}: ${formatMetric(key, value)}`;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: false,
                                ticks: {
                                    callback: function (value) {
                                        // Format y-axis values based on the metric type
                                        const key = keys[0]; // Use the first key for formatting
                                        return formatMetric(key, value as number);
                                    }
                                }
                            }
                        }
                    },
                });

                setChart(newChart);
            }
        }
    }, [loading, error, historyData, keys, title, type, chart]);

    if (loading) {
        return (
            <div className="chart-loading" style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', borderRadius: '8px' }}>
                Loading metrics...
            </div>
        );
    }

    if (error) {
        return (
            <div className="chart-error" style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff0f0', borderRadius: '8px', color: '#e53935', padding: '16px' }}>
                {error}
            </div>
        );
    }

    if (!data) {
        return (
            <div className="chart-no-data" style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', borderRadius: '8px' }}>
                No data available
            </div>
        );
    }

    return (
        <div className="metrics-chart-container" style={{ height }}>
            <canvas ref={chartRef} />
        </div>
    );
};

export default MetricsChart; 