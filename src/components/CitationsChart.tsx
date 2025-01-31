import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Rectangle, CartesianGrid } from 'recharts';
import { Info, ChevronDown, ChevronUp, TrendingUp, Calendar, Presentation as Citation } from 'lucide-react';

interface CitationsChartProps {
  citationsPerYear: Record<number, number>;
}

// Custom bar component for actual and predicted citations
const CustomBar = (props: any) => {
  const { x, y, width, height, isPredicted, fill } = props;
  
  if (isPredicted) {
    return (
      <g>
        <defs>
          <pattern
            id="prediction-pattern"
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
            patternTransform="rotate(45)"
          >
            <path
              d="M 0 0 L 0 4"
              stroke="#E84E10"
              strokeWidth="2"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <Rectangle
          x={x}
          y={y}
          width={width}
          height={height}
          fill="url(#prediction-pattern)"
          stroke="#E84E10"
          strokeWidth={1}
        />
      </g>
    );
  }

  return <Rectangle x={x} y={y} width={width} height={height} fill={fill} />;
};

function calculateCurrentYearProjection(currentYearCitations: number): number {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11
  const currentDay = currentDate.getDate();
  
  // Calculate how much of the year has passed
  const daysInYear = 365;
  const daysPassed = Math.floor((currentMonth * 30.44) + currentDay); // Using average month length
  const yearProgress = daysPassed / daysInYear;
  
  // Project citations for the full year based on current rate
  if (yearProgress > 0) {
    return Math.round(currentYearCitations / yearProgress);
  }
  
  return currentYearCitations;
}

export function CitationsChart({ citationsPerYear }: CitationsChartProps) {
  const [timeRange, setTimeRange] = useState<'5y' | '10y' | 'all'>('5y');

  const chartData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    
    // Convert historical data to array and sort by year
    const historicalData = Object.entries(citationsPerYear)
      .map(([year, citations]) => ({
        year: parseInt(year),
        citations,
        actualCitations: citations,
        predictedCitations: 0,
        yearOverYearGrowth: 0
      }))
      .sort((a, b) => a.year - b.year);

    // Calculate year-over-year growth rates for completed years
    for (let i = 1; i < historicalData.length; i++) {
      const prevYear = historicalData[i - 1].citations;
      const currentYear = historicalData[i].citations;
      if (prevYear > 0 && historicalData[i].year < new Date().getFullYear()) {
        const growthRate = ((currentYear - prevYear) / prevYear) * 100;
        historicalData[i].yearOverYearGrowth = Math.round(growthRate * 10) / 10;
      }
    }

    // Handle current year projection
    const currentYearData = historicalData.find(d => d.year === currentYear);
    if (currentYearData) {
      const projectedTotal = calculateCurrentYearProjection(currentYearData.actualCitations);
      currentYearData.predictedCitations = Math.max(0, projectedTotal - currentYearData.actualCitations);
      
      // Calculate projected growth rate
      const previousYearData = historicalData.find(d => d.year === currentYear - 1);
      if (previousYearData) {
        const projectedGrowth = ((projectedTotal - previousYearData.citations) / previousYearData.citations) * 100;
        currentYearData.yearOverYearGrowth = Math.round(projectedGrowth * 10) / 10;
      }
    }

    // Filter data based on selected time range
    const filteredData = (() => {
      switch (timeRange) {
        case '5y':
          return historicalData.filter(d => d.year > currentYear - 5);
        case '10y':
          return historicalData.filter(d => d.year > currentYear - 10);
        default:
          return historicalData;
      }
    })();

    return filteredData;
  }, [citationsPerYear, timeRange]);

  // Calculate summary statistics
  const stats = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const recentYears = chartData.filter(d => d.year > currentYear - 5);
    
    const totalCitations = recentYears.reduce((sum, d) => sum + d.actualCitations, 0);
    const avgCitationsPerYear = Math.round(totalCitations / recentYears.length);
    
    const growthRates = recentYears.map(d => d.yearOverYearGrowth).filter(rate => !isNaN(rate));
    const avgGrowthRate = growthRates.length > 0
      ? Math.round(growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length)
      : 0;
    
    const peakYear = chartData.reduce((max, d) => 
      d.actualCitations > max.citations ? { year: d.year, citations: d.actualCitations } : max,
      { year: 0, citations: 0 }
    );

    return {
      avgCitationsPerYear,
      avgGrowthRate,
      peakYear
    };
  }, [chartData]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900 flex items-center">
            <Citation className="h-4 w-4 text-blue-600 mr-2" />
            Citation Trends & Projections
          </h4>
          <div className="mt-2 grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center text-xs text-blue-600 mb-1">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                Average Growth
              </div>
              <div className="text-lg font-semibold text-blue-900">
                {stats.avgGrowthRate > 0 ? '+' : ''}{stats.avgGrowthRate}%
              </div>
              <div className="text-xs text-blue-600">per year</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center text-xs text-blue-600 mb-1">
                <Citation className="h-3.5 w-3.5 mr-1" />
                Average Citations
              </div>
              <div className="text-lg font-semibold text-blue-900">
                {stats.avgCitationsPerYear.toLocaleString()}
              </div>
              <div className="text-xs text-blue-600">per year</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center text-xs text-blue-600 mb-1">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                Peak Year
              </div>
              <div className="text-lg font-semibold text-blue-900">
                {stats.peakYear.year}
              </div>
              <div className="text-xs text-blue-600">
                {stats.peakYear.citations.toLocaleString()} citations
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setTimeRange('5y')}
            className={`px-2 py-1 text-xs rounded-md transition-colors ${
              timeRange === '5y'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Last 5 Years
          </button>
          <button
            onClick={() => setTimeRange('10y')}
            className={`px-2 py-1 text-xs rounded-md transition-colors ${
              timeRange === '10y'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Last 10 Years
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-2 py-1 text-xs rounded-md transition-colors ${
              timeRange === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Years
          </button>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            barCategoryGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="year"
              tick={{ fontSize: 11, fill: '#666666' }}
              axisLine={{ stroke: '#e5e5e5' }}
              tickLine={false}
            />
            <YAxis 
              orientation="right"
              tick={{ fontSize: 11, fill: '#666666' }}
              tickCount={6}
              axisLine={false}
              tickLine={false}
              width={40}
              domain={[0, 'auto']}
              allowDecimals={false}
            />
            <Tooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload;
                const currentYear = new Date().getFullYear();
                
                return (
                  <div className="bg-white/95 backdrop-blur-sm shadow-lg border border-gray-100 rounded-lg p-3 text-xs">
                    <div className="font-medium text-gray-900 mb-1">{data.year}</div>
                    <div className="space-y-1">
                      <div className="text-gray-600">
                        Current Citations: {data.actualCitations.toLocaleString()}
                      </div>
                      {data.year === currentYear && data.predictedCitations > 0 && (
                        <>
                          <div className="text-gray-500">
                            Projected Additional: +{data.predictedCitations.toLocaleString()}
                          </div>
                          <div className="text-gray-600">
                            Total Projected: {(data.actualCitations + data.predictedCitations).toLocaleString()}
                          </div>
                          <div className="text-blue-600 text-[10px] border-t border-gray-100 pt-1 mt-1">
                            Based on current year progress
                          </div>
                        </>
                      )}
                      {data.yearOverYearGrowth !== 0 && (
                        <div className={`text-xs ${
                          data.yearOverYearGrowth > 0 ? 'text-green-600' : 'text-red-600'
                        } border-t border-gray-100 pt-1 mt-1`}>
                          Year-over-Year Growth: {data.yearOverYearGrowth > 0 ? '+' : ''}{data.yearOverYearGrowth}%
                        </div>
                      )}
                    </div>
                  </div>
                );
              }}
            />
            <Bar 
              dataKey="actualCitations"
              fill="#019DD4"
              stackId="citations"
            />
            <Bar 
              dataKey="predictedCitations"
              fill="#E84E10"
              stackId="citations"
              shape={<CustomBar isPredicted={true} />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-end space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-[#019DD4]"></div>
            <span>Actual Citations</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-[#E84E10] bg-stripe"></div>
            <span>Projected</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 bg-blue-50/50 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 mb-1">Citation Analysis</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Average growth rate shows citation momentum over recent years</li>
                <li>• Peak year indicates highest citation impact period</li>
                <li>• Projections are based on current year's citation rate</li>
                <li>• Growth patterns help identify research impact trends</li>
                <li>• Consider field-specific citation patterns when interpreting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}