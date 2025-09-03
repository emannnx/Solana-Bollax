import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import { solanaAPI, TokenMetrics } from '@/lib/api';
import TokenScanner from '@/components/TokenScanner';

const TokenDetails: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const [tokenMetrics, setTokenMetrics] = useState<TokenMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      loadTokenDetails(address);
    }
  }, [address]);

  const loadTokenDetails = async (tokenAddress: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const metrics = await solanaAPI.fetchCompleteTokenMetrics(tokenAddress);
      setTokenMetrics(metrics);
    } catch (err) {
      console.error('Error loading token details:', err);
      setError(err instanceof Error ? err.message : 'Failed to load token details');
    } finally {
      setIsLoading(false);
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Token Address</h1>
          <Link to="/coins">
            <Button>Back to Coin List</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/coins">
              <Button variant="outline" size="sm" className="cyber-border">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to List
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="sm" className="cyber-border">
                Scanner
              </Button>
            </Link>
            <Button
              onClick={() => window.open(`https://solscan.io/token/${address}`, '_blank')}
              variant="outline"
              size="sm"
              className="cyber-border"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Solscan
            </Button>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {tokenMetrics?.tokenInfo?.name || 'Token Analysis'}
            </h1>
            <p className="text-muted-foreground font-mono text-sm">
              {address}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-electric-blue mb-4" />
              <p className="text-lg font-medium">Loading detailed analysis...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <h2 className="text-xl font-bold mb-4 text-danger-red">Error Loading Token</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => loadTokenDetails(address)}>
              Try Again
            </Button>
          </div>
        )}

        {/* Token Scanner with pre-filled address */}
        {!isLoading && !error && (
          <div className="max-w-6xl mx-auto">
            <TokenScanner initialAddress={address} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenDetails;