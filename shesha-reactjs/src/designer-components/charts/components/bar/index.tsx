import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useChartDataStateContext } from '../../../../providers/chartData';
import { useGeneratedTitle, useIsSmallScreen } from '../../hooks';
import { IChartData, IChartDataProps } from '../../model';
import { splitTitleIntoLines } from '../../utils';

interface BarChartProps extends IChartDataProps {
  data: IChartData;
}

ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const {
    axisProperty: xProperty,
    valueProperty: yProperty,
    aggregationMethod,
    showLegend,
    showTitle,
    legendPosition,
    showXAxisScale,
    showXAxisTitle,
    showYAxisScale,
    showYAxisTitle,
    stacked,
    dataMode,
    strokeColor,
    strokeWidth,
  } = useChartDataStateContext();

  const chartTitle: string = useGeneratedTitle();
  const isSmallScreen = useIsSmallScreen();

  if (dataMode === 'url') {
    data.datasets = data?.datasets?.map((dataset: any) => ({
      ...dataset,
      data: dataset?.data?.map((item) => item ?? 'undefined'),
      borderColor: strokeColor || 'black',
      borderWidth: typeof strokeWidth === 'number' ? strokeWidth : 0,
    }));
  }

  const options: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: isSmallScreen ? 1.5 : 2, // Smaller aspect ratio on mobile
    animation: {
      duration: isSmallScreen ? 800 : 1000, // Faster animations on mobile
      easing: 'easeInOutQuart',
      delay: (context) => context.dataIndex * (isSmallScreen ? 30 : 50),
    },
    transitions: {
      active: {
        animation: {
          duration: isSmallScreen ? 300 : 400,
        },
      },
      resize: {
        animation: {
          duration: isSmallScreen ? 600 : 800,
        },
      },
    },
    plugins: {
      legend: {
        display: !!showLegend,
        position: isSmallScreen ? 'bottom' : (legendPosition ?? 'top'), // Move legend to bottom on mobile
        labels: {
          boxWidth: isSmallScreen ? 12 : 40,
          padding: isSmallScreen ? 8 : 10,
          font: {
            size: isSmallScreen ? 10 : 12,
          },
        },
      },
      title: {
        display: !!(showTitle && chartTitle?.length > 0),
        text: splitTitleIntoLines(chartTitle),
        font: {
          size: isSmallScreen ? 12 : 16,
          weight: 'bold',
        },
        padding: {
          top: isSmallScreen ? 8 : 16,
          bottom: isSmallScreen ? 8 : 16,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: !!(showXAxisTitle && xProperty?.trim().length > 0),
          text: xProperty?.trim() ?? '',
          font: {
            size: isSmallScreen ? 10 : 12,
            weight: 'bold',
          },
          padding: {
            top: isSmallScreen ? 4 : 8,
            bottom: isSmallScreen ? 4 : 8,
          },
        },
        display: !!showXAxisScale,
        stacked: stacked,
        offset: true,
        beginAtZero: false,
        ticks: {
          maxRotation: 45, // Allow rotation up to 45 degrees
          minRotation: 0,
          font: {
            size: isSmallScreen ? 9 : 12,
          },
          padding: isSmallScreen ? 4 : 8,
          autoSkip: false, // Show all labels
          maxTicksLimit: undefined, // Remove tick limit
        },
        grid: {
          display: !isSmallScreen, // Hide grid on mobile for cleaner look
        },
      },
      y: {
        title: {
          display: !!(showYAxisTitle && yProperty?.trim().length > 0),
          text: dataMode === 'url' || !aggregationMethod
            ? yProperty?.trim() ?? ''
            : `${yProperty?.trim() ?? ''} (${aggregationMethod})`,
          font: {
            size: isSmallScreen ? 10 : 12,
            weight: 'bold',
          },
          padding: {
            top: isSmallScreen ? 4 : 8,
            bottom: isSmallScreen ? 4 : 8,
          },
        },
        display: !!showYAxisScale,
        stacked: stacked,
        ticks: {
          font: {
            size: isSmallScreen ? 9 : 12,
          },
          padding: isSmallScreen ? 4 : 8,
          callback: function (value) {
            // Format large numbers on mobile
            if (isSmallScreen && value >= 1000) {
              return (value / 1000).toFixed(1) + 'k';
            }
            return value;
          }
        },
        grid: {
          display: !isSmallScreen, // Hide grid on mobile
        },
      },
    },
  };

  return <Bar data={data as any} options={options} />;
};

export default BarChart;
