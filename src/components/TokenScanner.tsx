import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Shield, AlertTriangle, X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { solanaAPI, TokenMetrics } from '@/lib/api';
import TradingChart from './TradingChart';
import TopHolders from './TopHolders';
import SniperAnalysis from './SniperAnalysis';
import HumanFeedback from './HumanFeedback';

interface RiskAnalysis {
  riskLevel: 'safe' | 'moderate' | 'high';
  riskScore: number;
  reasons: string[];
  recommendation: string;
}

interface TokenScannerProps {
  initialAddress?: string;
}

const TokenScanner: React.FC<TokenScannerProps> = ({ initialAddress = '' }) => {
  const [tokenAddress, setTokenAddress] = useState(initialAddress);
  const [isScanning, setIsScanning] = useState(false);
  const [tokenMetrics, setTokenMetrics] = useState<TokenMetrics | null>(null);
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-scan if initial address is provided
  useEffect(() => {
    if (initialAddress && initialAddress !== tokenAddress) {
      setTokenAddress(initialAddress);
      scanToken();
    }
  }, [initialAddress]);

  const analyzeRisk = (metrics: TokenMetrics): RiskAnalysis => {
    const reasons: string[] = [];
    let riskScore = 0;
    
    const liquidity = metrics.liquidity?.usd || 0;
    const holders = metrics.holders?.total || 0;
    const volume24h = metrics.volume?.h24 || 0;
    const price = metrics.price?.value || 0;
    const marketCap = metrics.marketCap || 0;

    // Liquidity analysis (40% weight)
    if (liquidity < 1000) {
      reasons.push(`Extremely low liquidity ($${liquidity.toLocaleString()})`);
      riskScore += 35;
    } else if (liquidity < 10000) {
      reasons.push(`Very low liquidity ($${liquidity.toLocaleString()})`);
      riskScore += 25;
    } else if (liquidity < 100000) {
      reasons.push(`Moderate liquidity ($${liquidity.toLocaleString()})`);
      riskScore += 15;
    } else {
      reasons.push(`Good liquidity ($${liquidity.toLocaleString()})`);
      riskScore += 0;
    }

    // Holder count analysis (30% weight)
    if (holders < 50) {
      reasons.push(`Very few holders (${holders})`);
      riskScore += 25;
    } else if (holders < 500) {
      reasons.push(`Limited holders (${holders})`);
      riskScore += 15;
    } else if (holders < 2000) {
      reasons.push(`Moderate holder count (${holders})`);
      riskScore += 8;
    } else {
      reasons.push(`Good holder distribution (${holders}+)`);
      riskScore += 0;
    }

    // Volume analysis (20% weight)
    if (volume24h < 1000) {
      reasons.push(`Very low 24h volume ($${volume24h.toLocaleString()})`);
      riskScore += 20;
    } else if (volume24h < 50000) {
      reasons.push(`Low trading activity ($${volume24h.toLocaleString()})`);
      riskScore += 10;
    } else {
      reasons.push(`Active trading ($${volume24h.toLocaleString()} 24h volume)`);
      riskScore += 0;
    }

    // Market cap analysis (10% weight)
    if (marketCap < 100000) {
      reasons.push(`Very small market cap ($${marketCap.toLocaleString()})`);
      riskScore += 10;
    } else if (marketCap < 1000000) {
      reasons.push(`Small market cap ($${marketCap.toLocaleString()})`);
      riskScore += 5;
    }

    // Price analysis
    if (price < 0.000001) {
      reasons.push('Extremely low token price');
      riskScore += 5;
    }

    // Determine risk level and recommendation
    let riskLevel: 'safe' | 'moderate' | 'high';
    let recommendation: string;

    if (riskScore >= 60) {
      riskLevel = 'high';
      recommendation = 'High risk investment. Consider avoiding or only invest what you can afford to lose.';
    } else if (riskScore >= 30) {
      riskLevel = 'moderate';
      recommendation = 'Moderate risk. Do thorough research and invest cautiously.';
    } else {
      riskLevel = 'safe';
      recommendation = 'Lower risk profile. Still perform due diligence before investing.';
    }

    return { riskLevel, riskScore, reasons, recommendation };
  };

  const scanToken = async () => {
    if (!tokenAddress.trim()) return;
    
    setIsScanning(true);
    setError(null);
    setTokenMetrics(null);
    setRiskAnalysis(null);

    try {
      console.log('Scanning token:', tokenAddress);
      
      // Fetch real token data
      const metrics = await solanaAPI.fetchCompleteTokenMetrics(tokenAddress.trim());
      
      if (!metrics) {
        throw new Error('Unable to fetch token data. Please verify the address is correct.');
      }

      console.log('Token metrics received:', metrics);
      
      // Analyze risk based on real data
      const risk = analyzeRisk(metrics);
      
      setTokenMetrics(metrics);
      setRiskAnalysis(risk);
      
    } catch (err) {
      console.error('Scan error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to scan token. Please check the address and try again.';
      setError(errorMessage);
    } finally {
      setIsScanning(false);
    }
  };

  const resetScan = () => {
    setTokenAddress('');
    setTokenMetrics(null);
    setRiskAnalysis(null);
    setError(null);
  };

  const formatNumber = (num: number, decimals = 2): string => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(decimals)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(decimals)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(decimals)}K`;
    return num.toFixed(decimals);
  };

  const formatPrice = (price: number): string => {
    if (price < 0.000001) return price.toExponential(2);
    if (price < 0.01) return price.toFixed(6);
    return price.toFixed(4);
  };

  const getTokenInfo = () => {
    if (!tokenMetrics) return null;
    
    // Extract token info from DEX Screener data if available
    const symbol = 'TOKEN'; // This will be properly set once we have the token info
    const name = 'Token'; // This will be properly set once we have the token info
    
    return { symbol, name };
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'safe': return 'text-neon-green';
      case 'moderate': return 'text-yellow-500';
      case 'high': return 'text-danger-red';
      default: return 'text-foreground';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'safe': return <Shield className="h-6 w-6 text-neon-green" />;
      case 'moderate': return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'high': return <X className="h-6 w-6 text-danger-red" />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Modern Scanner Interface */}
      <Card className="glass-strong hover-glow transition-smooth border-glow">
        <CardContent className="p-10">
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 glass rounded-full">
                <div className="relative">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 bg-primary rounded-full animate-ping opacity-75" />
                </div>
                <span className="text-sm font-semibold text-primary">AI Scanner Online</span>
              </div>
              
              <h2 className="text-4xl font-bold mb-4 text-gradient">
                Token Risk Scanner
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Paste any Solana token address to get instant AI-powered risk analysis 
                with real-time market data and professional insights.
              </p>
              
              {/* Example Tokens */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <span className="text-sm text-muted-foreground">Try examples:</span>
                {[
                  { label: 'SOL', address: 'So11111111111111111111111111111111111111112' },
                  { label: 'USDC', address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
                  { label: 'BONK', address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' }
                ].map((token) => (
                  <Button
                    key={token.label}
                    variant="ghost"
                    size="sm"
                    onClick={() => setTokenAddress(token.address)}
                    className="glass hover:glass-strong hover:text-primary transition-smooth"
                  >
                    {token.label}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Enhanced Input */}
            <div className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="Enter Solana Token Address (44 characters)"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  className="h-14 pl-6 pr-6 text-base font-mono glass border-border/50 focus:border-primary focus:glass-strong transition-smooth placeholder:text-muted-foreground/60"
                  disabled={isScanning}
                />
                {tokenAddress && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      tokenAddress.length === 44 ? "bg-success animate-pulse" : "bg-warning"
                    )} />
                  </div>
                )}
              </div>
              
              <Button 
                onClick={scanToken}
                disabled={isScanning || !tokenAddress.trim()}
                size="lg"
                className="w-full h-14 text-base font-semibold group"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Analyzing Token...
                  </>
                ) : (
                  <>
                    <Shield className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
                    Analyze Token Risk
                    <div className="ml-3 w-2 h-2 bg-current rounded-full animate-pulse" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isScanning && (
        <Card className="mt-6 cyber-border gradient-card animate-scale-in">
          <CardContent className="p-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-electric-blue/20 animate-scan-line rounded-lg"></div>
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-electric-blue mb-4" />
              <p className="text-lg font-medium">Analyzing token...</p>
              <p className="text-muted-foreground">Fetching data from multiple sources</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="mt-6 cyber-border bg-danger-red/10 border-danger-red/30 animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <X className="h-6 w-6 text-danger-red" />
              <div>
                <p className="font-medium text-danger-red">Scan Failed</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

          {/* Results */}
      {tokenMetrics && riskAnalysis && (
        <div className="mt-6 space-y-6 animate-fade-in">
          {/* Token Info Header */}
          <Card className="cyber-border gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {tokenMetrics.tokenInfo?.name || 'Unknown Token'} ({tokenMetrics.tokenInfo?.symbol || 'TOKEN'})
                  </h2>
                  <p className="text-sm text-muted-foreground font-mono mt-1">{tokenAddress}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">${formatPrice(tokenMetrics.price?.value || 0)}</div>
                  <div className={`text-lg ${tokenMetrics.price?.priceChange24h >= 0 ? 'text-neon-green' : 'text-danger-red'}`}>
                    {tokenMetrics.price?.priceChange24h >= 0 ? '+' : ''}{tokenMetrics.price?.priceChange24h?.toFixed(2) || 0}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trading Chart */}
          <TradingChart 
            tokenAddress={tokenAddress} 
            symbol={tokenMetrics.tokenInfo?.symbol} 
          />

          {/* Risk Analysis Card */}
          <Card className={cn(
            "cyber-border",
            riskAnalysis.riskLevel === 'safe' && "bg-neon-green/5 border-neon-green/30 crypto-glow-success",
            riskAnalysis.riskLevel === 'moderate' && "bg-yellow-500/5 border-yellow-500/30",
            riskAnalysis.riskLevel === 'high' && "bg-danger-red/5 border-danger-red/30 crypto-glow-danger"
          )}>
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {getRiskIcon(riskAnalysis.riskLevel)}
                  <div>
                    <h3 className="text-2xl font-bold">
                      Risk Level: {' '}
                      <span className={getRiskColor(riskAnalysis.riskLevel)}>
                        {riskAnalysis.riskLevel.charAt(0).toUpperCase() + riskAnalysis.riskLevel.slice(1)}
                      </span>
                    </h3>
                    <p className="text-muted-foreground">Risk Score: {riskAnalysis.riskScore}/100</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => window.open(`https://solscan.io/token/${tokenAddress}`, '_blank')}
                    variant="outline"
                    size="sm"
                    className="cyber-border hover:bg-secondary/50"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Solscan
                  </Button>
                  <Button
                    onClick={resetScan}
                    variant="outline"
                    className="cyber-border hover:bg-secondary/50"
                  >
                    New Scan
                  </Button>
                </div>
              </div>
              
              <div className="mb-6 p-4 rounded-lg bg-secondary/20 border border-border">
                <h4 className="font-semibold mb-2">Recommendation:</h4>
                <p className="text-sm text-muted-foreground">{riskAnalysis.recommendation}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Analysis Factors:</h4>
                  <ul className="space-y-2">
                    {riskAnalysis.reasons.map((reason, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-electric-blue"></div>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Token Overview:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span>${formatPrice(tokenMetrics.price?.value || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Market Cap:</span>
                      <span>${formatNumber(tokenMetrics.marketCap)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">24h Change:</span>
                      <span className={tokenMetrics.price?.priceChange24h >= 0 ? 'text-neon-green' : 'text-danger-red'}>
                        {tokenMetrics.price?.priceChange24h?.toFixed(2) || 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="text-xs">
                        {tokenMetrics.price?.updateHumanTime ? 
                          new Date(tokenMetrics.price.updateHumanTime).toLocaleTimeString() : 
                          'Unknown'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Human Feedback */}
          <HumanFeedback 
            tokenMetrics={tokenMetrics}
            riskLevel={riskAnalysis.riskLevel}
            riskScore={riskAnalysis.riskScore}
          />

          {/* Top Holders */}
          {tokenMetrics.topHolders && tokenMetrics.topHolders.length > 0 && (
            <TopHolders 
              holders={tokenMetrics.topHolders}
              tokenAddress={tokenAddress}
            />
          )}

          {/* Sniper Analysis */}
          {tokenMetrics.sniperAnalysis && (
            <SniperAnalysis analysis={tokenMetrics.sniperAnalysis} />
          )}

          {/* Detailed Stats */}
          <Card className="cyber-border gradient-card">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-6">Detailed Analytics</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-electric-blue mb-1">
                    ${formatNumber(tokenMetrics.liquidity?.usd || 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Liquidity (USD)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-electric-blue mb-1">
                    {formatNumber(tokenMetrics.holders?.total || 0, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Token Holders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-electric-blue mb-1">
                    ${formatNumber(tokenMetrics.volume?.h24 || 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">24h Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-electric-blue mb-1">
                    {formatNumber(tokenMetrics.supply || 0, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Supply</div>
                </div>
              </div>
              
              {/* Additional metrics */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">FDV:</span>
                    <span>${formatNumber(tokenMetrics.fdv)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">6h Volume:</span>
                    <span>${formatNumber(tokenMetrics.volume?.h6 || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">1h Volume:</span>
                    <span>${formatNumber(tokenMetrics.volume?.h1 || 0)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TokenScanner;