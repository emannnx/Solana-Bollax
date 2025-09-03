import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, Search, TrendingUp, TrendingDown, ExternalLink, ArrowLeft, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { solanaAPI, LatestCoin } from '@/lib/api';

const CoinList: React.FC = () => {
  const [coins, setCoins] = useState<LatestCoin[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<LatestCoin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<'all' | 'safe' | 'moderate' | 'high'>('all');

  useEffect(() => {
    loadLatestCoins();
  }, []);

  useEffect(() => {
    filterCoins();
  }, [coins, searchTerm, filterRisk]);

  const loadLatestCoins = async () => {
    setIsLoading(true);
    try {
      const latestCoins = await solanaAPI.fetchLatestCoins();
      setCoins(latestCoins);
    } catch (error) {
      console.error('Error loading latest coins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCoins = () => {
    let filtered = coins;

    if (searchTerm) {
      filtered = filtered.filter(coin => 
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRisk !== 'all') {
      filtered = filtered.filter(coin => coin.riskLevel === filterRisk);
    }

    setFilteredCoins(filtered);
  };

  const formatPrice = (price: number): string => {
    if (price < 0.000001) return price.toExponential(2);
    if (price < 0.01) return price.toFixed(6);
    return price.toFixed(4);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(0);
  };

  const getRiskBadge = (riskLevel: 'safe' | 'moderate' | 'high') => {
    const config = {
      safe: { 
        label: 'Safe', 
        className: 'bg-neon-green/10 text-neon-green border-neon-green/30 font-medium',
        icon: '🛡️'
      },
      moderate: { 
        label: 'Moderate', 
        className: 'bg-cyber-orange/10 text-cyber-orange border-cyber-orange/30 font-medium',
        icon: '⚠️'
      },
      high: { 
        label: 'High Risk', 
        className: 'bg-danger-red/10 text-danger-red border-danger-red/30 font-medium',
        icon: '🚨'
      }
    };
    
    const { label, className, icon } = config[riskLevel];
    return (
      <Badge variant="outline" className={className}>
        <span className="mr-1">{icon}</span>
        {label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen gradient-hero relative">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
            <Link to="/">
              <Button variant="outline" size="sm" className="glass-surface hover:bg-primary/10 transition-smooth">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Scanner
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gradient-primary mb-2">Latest Solana Tokens</h1>
              <p className="text-lg text-muted-foreground">
                Discover newly launched tokens with AI-powered risk analysis
              </p>
            </div>
            <div className="glass-surface px-4 py-2 rounded-full text-sm">
              <span className="text-muted-foreground">Found </span>
              <span className="text-primary font-medium">{filteredCoins.length}</span>
              <span className="text-muted-foreground"> tokens</span>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <Card className="glass-strong mb-8 hover-glow transition-smooth">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or symbol..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 bg-background/50 border-border/50 focus:border-primary focus:bg-background/80 transition-smooth"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['all', 'safe', 'moderate', 'high'] as const).map((risk) => (
                  <Button
                    key={risk}
                    onClick={() => setFilterRisk(risk)}
                    variant={filterRisk === risk ? 'default' : 'outline'}
                    size="sm"
                    className={cn(
                      "transition-smooth",
                      filterRisk === risk 
                        ? 'crypto-glow-primary bg-primary text-primary-foreground' 
                        : 'glass-surface hover:bg-primary/10'
                    )}
                  >
                    {risk === 'all' ? 'All Tokens' : `${risk.charAt(0).toUpperCase() + risk.slice(1)} Risk`}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Loading State */}
        {isLoading && (
          <Card className="glass-strong animate-scale-in">
            <CardContent className="p-12 text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 mx-auto border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <div className="absolute inset-0 w-16 h-16 mx-auto bg-primary/10 rounded-full blur-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Scanning Market</h3>
              <p className="text-muted-foreground">Fetching latest token data with AI analysis...</p>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Coins Grid */}
        {!isLoading && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCoins.map((coin, index) => (
              <Card 
                key={coin.address || index} 
                className="glass-strong hover:border-primary/50 transition-smooth animate-fade-in group hover-glow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-xl text-gradient-primary">{coin.symbol}</h3>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      </div>
                      <p className="text-sm text-muted-foreground truncate max-w-[180px] font-medium">
                        {coin.name}
                      </p>
                    </div>
                    {getRiskBadge(coin.riskLevel)}
                  </div>

                  <div className="space-y-4 mb-5">
                    <div className="glass-surface rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="font-mono font-bold text-primary">${formatPrice(coin.price)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">24h Change</span>
                        <div className={cn(
                          "flex items-center gap-1 font-medium",
                          coin.priceChange24h >= 0 ? 'text-neon-green' : 'text-danger-red'
                        )}>
                          {coin.priceChange24h >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          <span>{coin.priceChange24h >= 0 ? '+' : ''}{coin.priceChange24h.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-accent">${formatNumber(coin.liquidity)}</div>
                        <div className="text-xs text-muted-foreground">Liquidity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-accent">${formatNumber(coin.volume24h)}</div>
                        <div className="text-xs text-muted-foreground">24h Volume</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-5 p-4 glass-surface rounded-lg border border-border/30">
                    <p className="text-sm text-muted-foreground leading-relaxed">{coin.recommendation}</p>
                  </div>

                  <div className="flex gap-3">
                    <Link to={`/token/${coin.address}`} className="flex-1">
                      <Button className="w-full crypto-glow-primary transition-smooth font-medium">
                        <Shield className="h-4 w-4 mr-2" />
                        Analyze Token
                      </Button>
                    </Link>
                    <Button
                      onClick={() => window.open(`https://solscan.io/token/${coin.address}`, '_blank')}
                      variant="outline"
                      size="sm"
                      className="glass-surface hover:bg-primary/10 transition-smooth"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredCoins.length === 0 && (
          <Card className="cyber-border gradient-card">
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No tokens found</p>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CoinList;