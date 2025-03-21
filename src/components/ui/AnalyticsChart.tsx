
import { Activity } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface DataPoint {
  name: string;
  value: number;
  [key: string]: any; // Allow additional properties
}

interface AnalyticsChartProps {
  data: DataPoint[];
  type: 'bar' | 'line' | 'pie';
  dataKey?: string;
  xAxisKey?: string;
  title: string;
  className?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const AnalyticsChart = ({ 
  data, 
  type, 
  dataKey = 'value', 
  xAxisKey = 'name',
  title, 
  className 
}: AnalyticsChartProps) => {
  
  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <Card className={cn("health-card", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-health-foreground">
            <Activity className="h-5 w-5 text-health-accent" />
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-health-foreground/60">
          <p>No data available</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn("health-card", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-health-foreground">
          <Activity className="h-5 w-5 text-health-accent" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'bar' && (
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey={xAxisKey} tick={{ fill: '#6B7280' }} />
                <YAxis tick={{ fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.375rem' }}
                  itemStyle={{ color: '#D1D5DB' }}
                  labelStyle={{ color: '#F9FAFB' }}
                />
                <Legend wrapperStyle={{ color: '#D1D5DB' }} />
                <Bar dataKey={dataKey} fill="#3B82F6">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            )}
            
            {type === 'line' && (
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey={xAxisKey} tick={{ fill: '#6B7280' }} />
                <YAxis tick={{ fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.375rem' }}
                  itemStyle={{ color: '#D1D5DB' }}
                  labelStyle={{ color: '#F9FAFB' }}
                />
                <Legend wrapperStyle={{ color: '#D1D5DB' }} />
                <Line 
                  type="monotone" 
                  dataKey={dataKey} 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            )}
            
            {type === 'pie' && (
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey={dataKey}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.375rem' }}
                  itemStyle={{ color: '#D1D5DB' }}
                  labelStyle={{ color: '#F9FAFB' }}
                />
                <Legend wrapperStyle={{ color: '#D1D5DB' }} />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
