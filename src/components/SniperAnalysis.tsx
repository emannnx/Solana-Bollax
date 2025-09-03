import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle, Target, TrendingUp } from 'lucide-react';
import { SniperAnalysis as SniperData } from '@/lib/api';

interface SniperAnalysisProps {
  analysis: SniperData;
}

const SniperAnalysis: React.FC<SniperAnalysisProps> = ({ analysis }) => {
  const getSniperIcon = () => {
    if (analysis.detected) {
      return <AlertTriangle className="h-6 w-6 text-danger-red" />;
    }
    return <Shield className="h-6 w-6 text-neon-green" />;
  };

  const getSniperStatus = () => {
    if (analysis.detected) {
      return {
        status: 'Detected',
        color: 'text-danger-red',
        bgColor: 'bg-danger-red/10 border-danger-red/30',
        description: 'Potential sniper/MEV activity detected'
      };
    }
    return {
      status: 'Clear',
      color: 'text-neon-green',
      bgColor: 'bg-neon-green/10 border-neon-green/30',
      description: 'No significant sniper activity detected'
    };
  };

  const sniperStatus = getSniperStatus();

  return (
    <Card className={`cyber-border ${sniperStatus.bgColor}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          {getSniperIcon()}
          <div>
            <h3 className="text-xl font-bold">Sniper Detection</h3>
            <p className="text-sm text-muted-foreground">MEV/Bot activity analysis</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Status:</span>
                <span className={`font-bold ${sniperStatus.color}`}>
                  {sniperStatus.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{sniperStatus.description}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-electric-blue" />
                <div>
                  <span className="text-sm font-medium">Risk Score:</span>
                  <span className="ml-2 font-bold">{analysis.count}/10</span>
                </div>
              </div>

              {analysis.detected && (
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-yellow-500" />
                  <div>
                    <span className="text-sm font-medium">Confidence:</span>
                    <span className="ml-2 font-bold">
                      {analysis.count > 7 ? 'High' : analysis.count > 4 ? 'Medium' : 'Low'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Analysis Details:</h4>
            <ul className="space-y-2">
              {analysis.reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    analysis.detected ? 'bg-danger-red' : 'bg-neon-green'
                  }`}></div>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {analysis.detected && (
          <div className="mt-6 p-4 rounded-lg bg-danger-red/10 border border-danger-red/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-danger-red mt-0.5" />
              <div>
                <p className="font-semibold text-danger-red mb-1">Caution Advised</p>
                <p className="text-sm text-muted-foreground">
                  This token shows signs of potential sniper/MEV bot activity. Consider waiting for 
                  market stabilization or using anti-MEV protection when trading.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SniperAnalysis;