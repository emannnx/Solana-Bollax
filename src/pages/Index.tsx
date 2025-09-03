import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight } from "lucide-react";
import TokenScanner from "@/components/TokenScanner";
import Hero from "@/components/Hero";
import { Container, Section, Flex } from "@/components/ui/layout";

const Index = () => {
  return (
    <div className="min-h-screen gradient-hero">
      <Hero />
      
      {/* Call to Action Section */}
      <Section variant="glass" padding="lg">
        <Container>
          <Flex direction="col" align="center" gap="lg" className="text-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gradient">
                Discover New Opportunities
              </h3>
              <p className="text-muted-foreground max-w-2xl">
                Explore the latest Solana tokens with AI-powered analysis 
                and make informed investment decisions.
              </p>
            </div>
            
            <Link to="/coins">
              <Button size="lg" variant="accent" className="group">
                <TrendingUp className="h-5 w-5 mr-2" />
                View Latest Coins
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </Flex>
        </Container>
      </Section>
    </div>
  );
};

export default Index;
