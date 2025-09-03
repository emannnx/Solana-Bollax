// API service for fetching real Solana token data
export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  supply: number;
}

export interface PriceData {
  value: number;
  updateUnixTime: number;
  updateHumanTime: string;
  priceChange24h: number;
}

export interface LiquidityData {
  usd: number;
  updatedAt: number;
}

export interface VolumeData {
  h24: number;
  h6: number;
  h1: number;
  m5: number;
}

export interface HolderData {
  total: number;
  updatedAt: number;
}

export interface HolderInfo {
  address: string;
  amount: number;
  percentage: number;
  rank: number;
}

export interface SniperAnalysis {
  detected: boolean;
  count: number;
  reasons: string[];
}

export interface TokenMetrics {
  price: PriceData | null;
  liquidity: LiquidityData | null;
  volume: VolumeData | null;
  holders: HolderData | null;
  marketCap: number;
  fdv: number;
  supply: number;
  topHolders?: HolderInfo[];
  sniperAnalysis?: SniperAnalysis;
  tokenInfo?: TokenInfo;
}

export interface LatestCoin {
  address: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  liquidity: number;
  volume24h: number;
  riskLevel: 'safe' | 'moderate' | 'high';
  riskScore: number;
  recommendation: string;
}

class SolanaTokenAPI {
  private readonly BIRDEYE_BASE = 'https://public-api.birdeye.so';
  private readonly SOLSCAN_BASE = 'https://public-api.solscan.io';
  private readonly DEXSCREENER_BASE = 'https://api.dexscreener.com';

  async fetchTokenInfo(address: string): Promise<TokenInfo | null> {
    try {
      // Try Solscan first
      let response = await fetch(`${this.SOLSCAN_BASE}/token/meta?tokenAddress=${address}`);
      if (response.ok) {
        const data = await response.json();
        return {
          address,
          symbol: data.symbol || 'UNKNOWN',
          name: data.name || 'Unknown Token',
          decimals: data.decimals || 9,
          supply: data.supply || 0
        };
      }

      // Fallback to DEX Screener for token info
      response = await fetch(`${this.DEXSCREENER_BASE}/latest/dex/tokens/${address}`);
      if (response.ok) {
        const data = await response.json();
        if (data.pairs && data.pairs.length > 0) {
          const pair = data.pairs[0];
          return {
            address,
            symbol: pair.baseToken?.symbol || 'UNKNOWN',
            name: pair.baseToken?.name || 'Unknown Token',
            decimals: 9, // Default for Solana
            supply: 0 // Not available from DEX Screener
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching token info:', error);
      return null;
    }
  }

  async fetchPriceData(address: string): Promise<PriceData | null> {
    try {
      // Try DEX Screener first as it's more reliable
      let response = await fetch(`${this.DEXSCREENER_BASE}/latest/dex/tokens/${address}`);
      if (response.ok) {
        const data = await response.json();
        if (data.pairs && data.pairs.length > 0) {
          const pair = data.pairs[0];
          return {
            value: parseFloat(pair.priceUsd) || 0,
            updateUnixTime: Date.now(),
            updateHumanTime: new Date().toISOString(),
            priceChange24h: parseFloat(pair.priceChange?.h24) || 0
          };
        }
      }

      // Fallback to Birdeye (may have CORS issues)
      response = await fetch(`${this.BIRDEYE_BASE}/defi/price?address=${address}`, {
        headers: {
          'X-API-KEY': 'public'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          return {
            value: data.data.value || 0,
            updateUnixTime: data.data.updateUnixTime || Date.now(),
            updateHumanTime: data.data.updateHumanTime || new Date().toISOString(),
            priceChange24h: data.data.priceChange24h || 0
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching price data:', error);
      return null;
    }
  }

  async fetchLiquidityData(address: string): Promise<LiquidityData | null> {
    try {
      const response = await fetch(`${this.BIRDEYE_BASE}/defi/txs/token?address=${address}&tx_type=swap&limit=1`, {
        headers: {
          'X-API-KEY': 'public'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch liquidity data');
      
      const data = await response.json();
      
      // Try to get liquidity from DEX Screener as backup
      const dexResponse = await fetch(`${this.DEXSCREENER_BASE}/latest/dex/tokens/${address}`);
      const dexData = await dexResponse.json();
      
      if (dexData.pairs && dexData.pairs.length > 0) {
        const pair = dexData.pairs[0];
        return {
          usd: pair.liquidity?.usd || 0,
          updatedAt: Date.now()
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching liquidity data:', error);
      return null;
    }
  }

  async fetchVolumeData(address: string): Promise<VolumeData | null> {
    try {
      const response = await fetch(`${this.DEXSCREENER_BASE}/latest/dex/tokens/${address}`);
      
      if (!response.ok) throw new Error('Failed to fetch volume data');
      
      const data = await response.json();
      
      if (data.pairs && data.pairs.length > 0) {
        const pair = data.pairs[0];
        return {
          h24: pair.volume?.h24 || 0,
          h6: pair.volume?.h6 || 0,
          h1: pair.volume?.h1 || 0,
          m5: pair.volume?.m5 || 0
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching volume data:', error);
      return null;
    }
  }

  async fetchHolderData(address: string): Promise<HolderData | null> {
    try {
      const response = await fetch(`${this.SOLSCAN_BASE}/token/holders?tokenAddress=${address}&limit=1&offset=0`);
      
      if (!response.ok) throw new Error('Failed to fetch holder data');
      
      const data = await response.json();
      
      return {
        total: data.total || 0,
        updatedAt: Date.now()
      };
    } catch (error) {
      console.error('Error fetching holder data:', error);
      return null;
    }
  }

  async fetchTopHolders(address: string): Promise<HolderInfo[]> {
    try {
      const response = await fetch(`${this.SOLSCAN_BASE}/token/holders?tokenAddress=${address}&limit=10&offset=0`);
      
      if (!response.ok) throw new Error('Failed to fetch holders data');
      
      const data = await response.json();
      
      if (!data.data || !Array.isArray(data.data)) {
        return [];
      }

      const totalSupply = data.data.reduce((sum: number, holder: any) => sum + (holder.amount || 0), 0);
      
      return data.data.map((holder: any, index: number) => ({
        address: holder.owner || 'Unknown',
        amount: holder.amount || 0,
        percentage: totalSupply > 0 ? ((holder.amount || 0) / totalSupply) * 100 : 0,
        rank: index + 1
      }));
    } catch (error) {
      console.error('Error fetching top holders:', error);
      return [];
    }
  }

  async analyzeSnipers(address: string): Promise<SniperAnalysis> {
    try {
      // Fetch recent transactions to analyze for sniper behavior
      const response = await fetch(`${this.SOLSCAN_BASE}/token/transfer?tokenAddress=${address}&limit=50`);
      
      if (!response.ok) {
        return { detected: false, count: 0, reasons: [] };
      }
      
      const data = await response.json();
      const reasons: string[] = [];
      let sniperCount = 0;
      
      if (data.data && Array.isArray(data.data)) {
        const transactions = data.data;
        const uniqueAddresses = new Set();
        let rapidTransactions = 0;
        
        // Analyze transaction patterns
        transactions.forEach((tx: any, index: number) => {
          uniqueAddresses.add(tx.src || tx.dst);
          
          // Check for rapid consecutive transactions (potential MEV/sniper behavior)
          if (index > 0) {
            const currentTime = tx.blockTime || 0;
            const prevTime = transactions[index - 1].blockTime || 0;
            if (Math.abs(currentTime - prevTime) < 5) { // Within 5 seconds
              rapidTransactions++;
            }
          }
        });
        
        // Heuristics for sniper detection
        if (rapidTransactions > transactions.length * 0.3) {
          reasons.push('High frequency of rapid transactions detected');
          sniperCount += Math.floor(rapidTransactions / 2);
        }
        
        if (uniqueAddresses.size < transactions.length * 0.7) {
          reasons.push('Repeated transactions from same addresses');
          sniperCount += 2;
        }
        
        if (transactions.length > 30 && uniqueAddresses.size < 10) {
          reasons.push('Low unique address diversity in recent transactions');
          sniperCount += 3;
        }
      }
      
      return {
        detected: sniperCount > 3,
        count: sniperCount,
        reasons: reasons.length > 0 ? reasons : ['No sniper activity detected']
      };
    } catch (error) {
      console.error('Error analyzing snipers:', error);
      return { detected: false, count: 0, reasons: ['Unable to analyze sniper activity'] };
    }
  }

  async fetchLatestCoins(): Promise<LatestCoin[]> {
    try {
      // Fetch trending tokens from DEX Screener
      const response = await fetch(`${this.DEXSCREENER_BASE}/latest/dex/search/?q=SOL`);
      
      if (!response.ok) throw new Error('Failed to fetch latest coins');
      
      const data = await response.json();
      
      if (!data.pairs || !Array.isArray(data.pairs)) {
        return [];
      }
      
      return data.pairs.slice(0, 20).map((pair: any) => {
        const liquidity = pair.liquidity?.usd || 0;
        const volume24h = pair.volume?.h24 || 0;
        const priceChange24h = parseFloat(pair.priceChange?.h24) || 0;
        
        // Simple risk analysis
        let riskLevel: 'safe' | 'moderate' | 'high' = 'high';
        let riskScore = 70;
        let recommendation = 'High risk - proceed with extreme caution';
        
        if (liquidity > 100000 && volume24h > 50000) {
          riskLevel = 'safe';
          riskScore = 25;
          recommendation = 'Lower risk profile with good liquidity';
        } else if (liquidity > 10000 && volume24h > 5000) {
          riskLevel = 'moderate';
          riskScore = 45;
          recommendation = 'Moderate risk - do your research';
        }
        
        return {
          address: pair.baseToken?.address || '',
          symbol: pair.baseToken?.symbol || 'UNKNOWN',
          name: pair.baseToken?.name || 'Unknown Token',
          price: parseFloat(pair.priceUsd) || 0,
          priceChange24h,
          liquidity,
          volume24h,
          riskLevel,
          riskScore,
          recommendation
        };
      });
    } catch (error) {
      console.error('Error fetching latest coins:', error);
      return [];
    }
  }

  async fetchCompleteTokenMetrics(address: string): Promise<TokenMetrics | null> {
    try {
      // Validate Solana address format
      if (!this.isValidSolanaAddress(address)) {
        throw new Error('Invalid Solana token address format');
      }

      console.log('Fetching token metrics for:', address);

      // Fetch all data in parallel
      const [tokenInfo, priceData, liquidityData, volumeData, holderData, topHolders, sniperAnalysis] = await Promise.allSettled([
        this.fetchTokenInfo(address),
        this.fetchPriceData(address),
        this.fetchLiquidityData(address),
        this.fetchVolumeData(address),
        this.fetchHolderData(address),
        this.fetchTopHolders(address),
        this.analyzeSnipers(address)
      ]);

      console.log('API Results:', {
        tokenInfo: tokenInfo.status === 'fulfilled' ? tokenInfo.value : 'failed',
        priceData: priceData.status === 'fulfilled' ? priceData.value : 'failed',
        liquidityData: liquidityData.status === 'fulfilled' ? liquidityData.value : 'failed',
        volumeData: volumeData.status === 'fulfilled' ? volumeData.value : 'failed',
        holderData: holderData.status === 'fulfilled' ? holderData.value : 'failed',
        topHolders: topHolders.status === 'fulfilled' ? 'success' : 'failed',
        sniperAnalysis: sniperAnalysis.status === 'fulfilled' ? 'success' : 'failed'
      });

      // Extract successful results
      const token = tokenInfo.status === 'fulfilled' ? tokenInfo.value : null;
      const price = priceData.status === 'fulfilled' ? priceData.value : null;
      const liquidity = liquidityData.status === 'fulfilled' ? liquidityData.value : null;
      const volume = volumeData.status === 'fulfilled' ? volumeData.value : null;
      const holders = holderData.status === 'fulfilled' ? holderData.value : null;
      const holders_list = topHolders.status === 'fulfilled' ? topHolders.value : [];
      const sniper_data = sniperAnalysis.status === 'fulfilled' ? sniperAnalysis.value : undefined;

      // We need at least price data or DEX data to proceed
      if (!price && !volume) {
        throw new Error('Unable to fetch basic token data. Please verify the address is a valid Solana token.');
      }

      // Calculate market cap and FDV
      const priceValue = price?.value || 0;
      const supply = token?.supply || 1000000000; // Default large supply if unknown
      const marketCap = priceValue * supply;
      const fdv = marketCap;

      return {
        price,
        liquidity,
        volume,
        holders,
        marketCap,
        fdv,
        supply,
        topHolders: holders_list,
        sniperAnalysis: sniper_data,
        tokenInfo: token
      };
    } catch (error) {
      console.error('Error fetching complete token metrics:', error);
      throw error;
    }
  }

  private isValidSolanaAddress(address: string): boolean {
    // Solana addresses are base58 encoded and typically 32-44 characters long
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return base58Regex.test(address);
  }
}

export const solanaAPI = new SolanaTokenAPI();