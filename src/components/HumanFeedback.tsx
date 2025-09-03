import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';
import { TokenMetrics } from '@/lib/api';

interface HumanFeedbackProps {
  tokenMetrics: TokenMetrics;
  riskLevel: 'safe' | 'moderate' | 'high';
  riskScore: number;
}

const HumanFeedback: React.FC<HumanFeedbackProps> = ({ tokenMetrics, riskLevel, riskScore }) => {
  const generateHumanFeedback = () => {
    const liquidity = tokenMetrics.liquidity?.usd || 0;
    const volume24h = tokenMetrics.volume?.h24 || 0;
    const holders = tokenMetrics.holders?.total || 0;
    const priceChange = tokenMetrics.price?.priceChange24h || 0;
    const hasSniper = tokenMetrics.sniperAnalysis?.detected || false;
    
    let sentiment = 'neutral';
    let entryAdvice = '';
    let tradeAmount = '0.01-0.05';
    let reasoning = [];
    let caution = [];
    
    // Determine sentiment and advice
    if (riskLevel === 'safe') {
      sentiment = 'bullish';
      entryAdvice = 'This looks like a solid entry opportunity';
      tradeAmount = '0.1-0.5';
      reasoning.push('Strong fundamentals with good liquidity and holder base');
      if (priceChange > 5) reasoning.push('Positive momentum with recent price gains');
      if (volume24h > 100000) reasoning.push('High trading activity suggests strong interest');
    } else if (riskLevel === 'moderate') {
      sentiment = priceChange > 0 ? 'cautiously optimistic' : 'neutral';
      entryAdvice = priceChange > 10 ? 'Consider waiting for a pullback' : 'Could be a decent entry if you believe in the project';
      tradeAmount = '0.05-0.1';
      reasoning.push('Mixed signals - some positives but needs careful monitoring');
      if (liquidity < 50000) caution.push('Lower liquidity could mean higher slippage');
      if (holders < 500) caution.push('Limited holder base increases volatility risk');
    } else {
      sentiment = 'bearish';
      entryAdvice = priceChange > 20 ? 'FOMO territory - extremely risky but potentially profitable if timed right' : 'High risk but remember - sometimes these surprise everyone';
      tradeAmount = '0.01-0.03';
      reasoning.push('High risk but crypto is unpredictable');
      caution.push('Only invest what you can afford to lose completely');
      if (hasSniper) caution.push('Bot activity detected - be extra careful with timing');
    }
    
    // Add context-specific insights
    if (priceChange > 50) {
      reasoning.push('Massive pump detected - could be genuine hype or a rug pull setup');
      caution.push('Consider taking profits gradually if you enter');
    }
    
    if (liquidity > 0 && volume24h > liquidity * 10) {
      reasoning.push('Volume is extremely high relative to liquidity - indicates strong trading interest');
    }
    
    return { sentiment, entryAdvice, tradeAmount, reasoning, caution };
  };

  const feedback = generateHumanFeedback();
  
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-neon-green';
      case 'cautiously optimistic': return 'text-electric-blue';
      case 'neutral': return 'text-yellow-500';
      case 'bearish': return 'text-orange-500';
      default: return 'text-foreground';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="h-5 w-5 text-neon-green" />;
      case 'cautiously optimistic': return <Brain className="h-5 w-5 text-electric-blue" />;
      case 'neutral': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'bearish': return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  return (
    <Card className="cyber-border gradient-card">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="h-6 w-6 text-electric-blue" />
          <h3 className="text-xl font-bold">AI Trading Insights</h3>
        </div>

        <div className="space-y-6">
          {/* Sentiment */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/20 border border-border">
            {getSentimentIcon(feedback.sentiment)}
            <div>
              <span className="text-sm font-medium text-muted-foreground">Market Sentiment: </span>
              <span className={`font-bold capitalize ${getSentimentColor(feedback.sentiment)}`}>
                {feedback.sentiment}
              </span>
            </div>
          </div>

          {/* Entry Advice */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Entry Point Analysis
            </h4>
            <p className="text-sm bg-secondary/10 p-4 rounded-lg border border-border/50">
              "{feedback.entryAdvice}"
            </p>
          </div>

          {/* Suggested Trade Amount */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Suggested Position Size
            </h4>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/10 border border-border/50">
              <span className="text-2xl font-bold text-electric-blue">{feedback.tradeAmount} SOL</span>
              <span className="text-sm text-muted-foreground">Based on risk assessment</span>
            </div>
          </div>

          {/* Reasoning */}
          <div>
            <h4 className="font-semibold mb-3">Why This Assessment?</h4>
            <ul className="space-y-2">
              {feedback.reasoning.map((reason, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-electric-blue mt-2"></div>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cautions */}
          {feedback.caution.length > 0 && (
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <h4 className="font-semibold mb-3 text-yellow-500 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Important Considerations
              </h4>
              <ul className="space-y-2">
                {feedback.caution.map((caution, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                    <span>{caution}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="text-xs text-muted-foreground p-3 rounded-lg bg-secondary/10 border border-border/50">
            <p className="mb-1">💡 <strong>Remember:</strong> This is AI analysis, not financial advice.</p>
            <p>Crypto markets are unpredictable. Many "risky" tokens have delivered massive returns while "safe" ones have failed. Always DYOR and never invest more than you can afford to lose.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HumanFeedback;