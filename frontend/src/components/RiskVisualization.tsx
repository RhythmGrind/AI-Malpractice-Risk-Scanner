import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, AlertTriangle, Shield } from "lucide-react";

interface RiskDataPoint {
  category: string;
  risk: number;
  impact: number;
  confidence: number;
  color: string;
}

interface RiskVisualizationProps {
  riskData: RiskDataPoint[];
  overallRisk: number;
}

export function RiskVisualization({ riskData, overallRisk }: RiskVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const maxRadius = Math.min(centerX, centerY) - 20;

    let animationProgress = 0;

    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw concentric risk circles
      const riskLevels = [
        { radius: maxRadius * 0.3, color: 'rgba(34, 197, 94, 0.1)', label: 'Low Risk' },
        { radius: maxRadius * 0.6, color: 'rgba(234, 179, 8, 0.1)', label: 'Medium Risk' },
        { radius: maxRadius * 0.9, color: 'rgba(239, 68, 68, 0.1)', label: 'High Risk' }
      ];

      riskLevels.forEach((level, index) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, level.radius, 0, 2 * Math.PI);
        ctx.fillStyle = level.color;
        ctx.fill();
        ctx.strokeStyle = level.color.replace('0.1', '0.3');
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw risk data points as animated bubbles
      riskData.forEach((point, index) => {
        const angle = (index / riskData.length) * 2 * Math.PI + animationProgress * 0.01;
        const distance = (point.risk / 100) * maxRadius * 0.8;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        const radius = Math.max(5, (point.impact / 100) * 15 + Math.sin(animationProgress * 0.1 + index) * 2);

        // Draw bubble with glow effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, point.color);
        gradient.addColorStop(1, point.color.replace('1)', '0.3)'));

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Add confidence ring
        ctx.beginPath();
        ctx.arc(x, y, radius + 3, 0, (point.confidence / 100) * 2 * Math.PI);
        ctx.strokeStyle = point.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw overall risk indicator in center
      const riskIndicatorRadius = 30;
      const riskGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, riskIndicatorRadius
      );
      
      if (overallRisk < 30) {
        riskGradient.addColorStop(0, 'rgba(34, 197, 94, 0.8)');
        riskGradient.addColorStop(1, 'rgba(34, 197, 94, 0.2)');
      } else if (overallRisk < 70) {
        riskGradient.addColorStop(0, 'rgba(234, 179, 8, 0.8)');
        riskGradient.addColorStop(1, 'rgba(234, 179, 8, 0.2)');
      } else {
        riskGradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
        riskGradient.addColorStop(1, 'rgba(239, 68, 68, 0.2)');
      }

      ctx.beginPath();
      ctx.arc(centerX, centerY, riskIndicatorRadius, 0, 2 * Math.PI);
      ctx.fillStyle = riskGradient;
      ctx.fill();

      // Draw risk percentage
      ctx.fillStyle = '#000';
      ctx.font = 'bold 14px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(`${overallRisk}%`, centerX, centerY + 5);

      animationProgress += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [riskData, overallRisk]);

  const getRiskLevel = (risk: number) => {
    if (risk < 30) return { level: "LOW", icon: Shield, color: "text-green-600" };
    if (risk < 70) return { level: "MODERATE", icon: AlertTriangle, color: "text-yellow-600" };
    return { level: "HIGH", icon: TrendingUp, color: "text-red-600" };
  };

  const riskInfo = getRiskLevel(overallRisk);
  const RiskIcon = riskInfo.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RiskIcon className={`h-5 w-5 ${riskInfo.color}`} />
          Risk Visualization Map
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-48 md:h-64 rounded-lg"
            style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Risk Categories</h4>
            <div className="space-y-1">
              {riskData.map((point, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-xs min-w-0"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: point.color }}
                  />
                  <span className="flex-1 truncate">{point.category}</span>
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    {point.risk}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Legend</h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-200 flex-shrink-0" />
                <span className="truncate">Low (0-30%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-200 flex-shrink-0" />
                <span className="truncate">Med (30-70%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-200 flex-shrink-0" />
                <span className="truncate">High (70-100%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <RiskIcon className={`h-4 w-4 ${riskInfo.color}`} />
            <span className="text-sm font-medium">
              Overall Risk: {riskInfo.level}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-tight">
            Bubble size represents impact level, ring completion shows confidence score
          </p>
        </div>
      </CardContent>
    </Card>
  );
}