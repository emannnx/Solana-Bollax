import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

interface ChartDataPoint {
  time: string;
  price: number;
  volume: number;
}

interface TradingChartProps {
  tokenAddress: string;
  symbol?: string;
}

const TradingChart: React.FC<TradingChartProps> = ({ tokenAddress, symbol = 'TOKEN' }) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'1h' | '4h' | '24h'>('24h');

  const generateMockChartData = (): ChartDataPoint[] => {
    const now = Date.now();
    const points = 50;
    const interval = timeframe === '1h' ? 1.2 * 60 * 1000 : timeframe === '4h' ? 4.8 * 60 * 1000 : 28.8 * 60 * 1000;
    
    let basePrice = Math.random() * 0.01 + 0.001;
    const data: ChartDataPoint[] = [];
    
    for (let i = points; i >= 0; i--) {
      const timestamp = now - (i * interval);
      const volatility = 0.05;
      const change = (Math.random() - 0.5) * volatility;
      basePrice = Math.max(basePrice * (1 + change), 0.0001);
      
      data.push({
        time: new Date(timestamp).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          ...(timeframe === '24h' && { month: 'short', day: 'numeric' })
        }),
        price: basePrice,
        volume: Math.random() * 100000 + 10000
      });
    }
    
    return data;
  };

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call delay
    const timer = setTimeout(() => {
      setChartData(generateMockChartData());
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [tokenAddress, timeframe]);

  const formatPrice = (price: number): string => {
    if (price < 0.000001) return price.toExponential(2);
    if (price < 0.01) return price.toFixed(6);
    return price.toFixed(4);
  };

  const currentPrice = chartData.length > 0 ? chartData[chartData.length - 1].price : 0;
  const previousPrice = chartData.length > 1 ? chartData[chartData.length - 2].price : currentPrice;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0;

  return (
    <Card className="cyber-border gradient-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold">{symbol} Price Chart</h3>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-2xl font-mono">${formatPrice(currentPrice)}</span>
              <span className={`text-sm font-medium ${priceChange >= 0 ? 'text-neon-green' : 'text-danger-red'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {(['1h', '4h', '24h'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-md text-sm transition-smooth ${
                  timeframe === tf 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary/50 hover:bg-secondary'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  tickFormatter={formatPrice}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${formatPrice(value)}`, 'Price']}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="hsl(var(--electric-blue))" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: 'hsl(var(--electric-blue))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingChart;