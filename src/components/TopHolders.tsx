import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Users } from 'lucide-react';
import { HolderInfo } from '@/lib/api';

interface TopHoldersProps {
  holders: HolderInfo[];
  tokenAddress: string;
}

const TopHolders: React.FC<TopHoldersProps> = ({ holders, tokenAddress }) => {
  const formatAddress = (address: string): string => {
    if (address.length <= 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const formatAmount = (amount: number): string => {
    if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`;
    if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`;
    if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K`;
    return amount.toFixed(0);
  };

  const getHolderRiskColor = (percentage: number): string => {
    if (percentage > 20) return 'text-danger-red';
    if (percentage > 10) return 'text-yellow-500';
    if (percentage > 5) return 'text-orange-500';
    return 'text-neon-green';
  };

  const analyzeHolderDistribution = () => {
    const top3Percentage = holders.slice(0, 3).reduce((sum, holder) => sum + holder.percentage, 0);
    const top10Percentage = holders.reduce((sum, holder) => sum + holder.percentage, 0);
    
    let risk = 'Low';
    let color = 'text-neon-green';
    let analysis = 'Healthy holder distribution';
    
    if (top3Percentage > 50) {
      risk = 'High';
      color = 'text-danger-red';
      analysis = 'Top 3 holders control majority of supply - high centralization risk';
    } else if (top3Percentage > 30) {
      risk = 'Moderate';
      color = 'text-yellow-500';
      analysis = 'Moderate concentration among top holders';
    } else if (top10Percentage > 80) {
      risk = 'Moderate';
      color = 'text-yellow-500';
      analysis = 'High concentration in top 10 holders';
    }
    
    return { risk, color, analysis, top3Percentage, top10Percentage };
  };

  const distribution = analyzeHolderDistribution();

  return (
    <Card className="cyber-border gradient-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-electric-blue" />
            <h3 className="text-xl font-bold">Top Holders Analysis</h3>
          </div>
          <Button
            onClick={() => window.open(`https://solscan.io/token/${tokenAddress}#holders`, '_blank')}
            variant="outline"
            size="sm"
            className="cyber-border hover:bg-secondary/50"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Full List
          </Button>
        </div>

        <div className="mb-6 p-4 rounded-lg bg-secondary/20 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Distribution Risk:</span>
            <span className={`font-bold ${distribution.color}`}>{distribution.risk}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{distribution.analysis}</p>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Top 3 Control:</span>
              <span className="ml-2 font-medium">{distribution.top3Percentage.toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-muted-foreground">Top 10 Control:</span>
              <span className="ml-2 font-medium">{distribution.top10Percentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {holders.length > 0 ? (
            holders.map((holder, index) => (
              <div 
                key={holder.address} 
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/10 border border-border/50 hover:bg-secondary/20 transition-smooth"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                    #{holder.rank}
                  </div>
                  <div>
                    <button
                      onClick={() => window.open(`https://solscan.io/account/${holder.address}`, '_blank')}
                      className="font-mono text-sm hover:text-electric-blue transition-smooth"
                    >
                      {formatAddress(holder.address)}
                    </button>
                    <div className="text-xs text-muted-foreground">
                      {formatAmount(holder.amount)} tokens
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${getHolderRiskColor(holder.percentage)}`}>
                    {holder.percentage.toFixed(2)}%
                  </div>
                  <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        holder.percentage > 20 ? 'bg-danger-red' :
                        holder.percentage > 10 ? 'bg-yellow-500' :
                        holder.percentage > 5 ? 'bg-orange-500' : 'bg-neon-green'
                      }`}
                      style={{ width: `${Math.min(holder.percentage * 5, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Unable to fetch holder data</p>
              <p className="text-sm">This might indicate API limitations or token privacy settings</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopHolders;