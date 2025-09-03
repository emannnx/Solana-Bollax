import React from 'react';
import TokenScanner from './TokenScanner';
import heroBackground from '@/assets/hero-background.jpg';
import { Container, Section, Stack, Flex, BackgroundEffects } from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Sparkles, Shield, TrendingUp } from 'lucide-react';

const Hero = () => {
  return (
    <Section variant="hero" padding="none" className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background System */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <BackgroundEffects />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Modern Header */}
        <header className="glass-subtle border-b border-border/20">
          <Container>
            <Flex justify="between" className="py-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold text-gradient">
                  Bollax-Solana
                </h1>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-sm font-medium text-success">AI Active</span>
              </div>
            </Flex>
          </Container>
        </header>

        {/* Hero Content */}
        <main className="flex-1 flex items-center">
          <Container size="xl" className="py-20">
            <Stack gap="xl" align="center" className="text-center">
              {/* Hero Text */}
              <div className="space-y-8 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full mb-6">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">AI-Powered Token Analysis</span>
                </div>
                
                <h2 className="text-6xl md:text-8xl font-bold leading-tight">
                  <span className="text-gradient block mb-4">
                    Analyze Solana
                  </span>
                  <span className="text-foreground/90">Meme Coins</span>
                </h2>
                
                <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  Get instant AI-powered risk analysis for any Solana token with real-time data, 
                  holder insights, and professional trading recommendations.
                </p>
                
                {/* Feature Pills */}
                <Flex justify="center" wrap className="gap-4">
                  {[
                    { icon: "🛡️", text: "Risk Assessment" },
                    { icon: "📊", text: "Live Trading Data" },
                    { icon: "🔍", text: "Holder Analysis" },
                    { icon: "🤖", text: "AI Insights" }
                  ].map((feature, index) => (
                    <div 
                      key={index}
                      className="glass px-6 py-3 rounded-full transition-smooth hover:glass-strong"
                    >
                      <span className="text-lg mr-2">{feature.icon}</span>
                      <span className="text-sm font-medium">{feature.text}</span>
                    </div>
                  ))}
                </Flex>
              </div>

              {/* Enhanced Token Scanner */}
              <div className="w-full max-w-4xl animate-scale-in" style={{ animationDelay: '0.3s' }}>
                <TokenScanner />
              </div>
            </Stack>
          </Container>
        </main>

        {/* Enhanced Footer */}
        <footer className="glass-subtle border-t border-border/20">
          <Container>
            <Flex justify="between" align="center" className="py-6">
              <p className="text-sm text-muted-foreground">
                Real-time data from Birdeye, Solscan, and DEX Screener APIs
              </p>
              <Flex gap="lg" className="text-xs text-muted-foreground/60">
                <span>Professional Analysis</span>
                <span>•</span>
                <span>Live Market Data</span>
                <span>•</span>
                <span>AI-Powered Insights</span>
              </Flex>
            </Flex>
          </Container>
        </footer>
      </div>
    </Section>
  );
};

export default Hero;