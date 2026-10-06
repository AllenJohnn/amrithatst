import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import { useScan } from '../context/ScanContext';
import URLInput from '../components/URLInput';
import PageTransition from '../components/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export default function Dashboard() {
  const navigate = useNavigate();
  const { stats, scans, executeScan, isScanning } = useScan();

  const handleQuickScan = async (url) => {
    await executeScan(url);
    navigate('/scanner');
  };

  const recentScans = scans.slice(0, 5);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'phishing': return 'destructive';
      case 'suspicious': return 'warning';
      default: return 'success';
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
        <div className="flex flex-col gap-1 mb-2">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Security Overview</h1>
          <p className="text-sm text-cyber-textMuted max-w-xl">
            Real-time visibility into URL analysis, threat classifications, and detection activity.
          </p>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#0F0F0F]">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <span className="text-[10px] text-cyber-textMuted font-semibold uppercase tracking-widest block mb-2">Total Scans</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-white font-mono tracking-tight">{stats.totalScans}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#0F0F0F]">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <span className="text-[10px] text-cyber-textMuted font-semibold uppercase tracking-widest block mb-2">Threats Detected</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-red-400 font-mono tracking-tight">{stats.phishingCount}</span>
                <span className="text-[10px] text-red-400 bg-red-900/20 px-2 py-0.5 rounded-sm font-medium">Action Req</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#0F0F0F]">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <span className="text-[10px] text-cyber-textMuted font-semibold uppercase tracking-widest block mb-2">Safe URLs</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-white font-mono tracking-tight">{stats.safeCount}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#0F0F0F]">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <span className="text-[10px] text-cyber-textMuted font-semibold uppercase tracking-widest block mb-2">Model Confidence</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-white font-mono tracking-tight">{stats.detectionRate}</span>
                <span className="text-[10px] text-green-400 bg-green-900/20 px-2 py-0.5 rounded-sm font-medium">Stable</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-6">
            <Card className="bg-[#0F0F0F]">
              <CardHeader className="p-5 pb-0">
                <CardTitle className="text-sm">Target Analysis</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <URLInput onScan={handleQuickScan} isScanning={isScanning} />
              </CardContent>
            </Card>

            <Card className="bg-[#0F0F0F] flex-1">
              <div className="flex justify-between items-center p-5 border-b border-cyber-border">
                <CardTitle className="text-sm">Recent Detections</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/history')} className="text-xs text-cyber-textMuted">
                  View full log <ArrowRight size={14} className="ml-1" />
                </Button>
              </div>
              <CardContent className="p-0">
                {recentScans.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-cyber-border bg-[#141414] text-xs text-cyber-textMuted font-medium">
                          <th className="font-medium px-5 py-3 w-1/2">Target Payload</th>
                          <th className="font-medium px-5 py-3">Classification</th>
                          <th className="font-medium px-5 py-3 text-right">Risk</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cyber-border/50">
                        {recentScans.map((scan) => (
                          <tr key={scan.id} className="hover:bg-[#1A1A1A] transition-colors cursor-pointer group" onClick={() => navigate('/history')}>
                            <td className="px-5 py-3">
                              <div className="font-mono text-white text-[13px] truncate max-w-[300px] group-hover:text-sage-400 transition-colors">{scan.url}</div>
                              <div className="text-[11px] text-cyber-textMuted mt-0.5">{scan.domain}</div>
                            </td>
                            <td className="px-5 py-3">
                              <Badge variant={getStatusBadgeVariant(scan.status)} className="px-2 py-0.5 uppercase tracking-widest text-[9px]">
                                {scan.status}
                              </Badge>
                            </td>
                            <td className="px-5 py-3 text-right">
                              <span className={`font-mono text-sm font-medium ${
                                scan.riskScore > 70 ? 'text-red-400' : scan.riskScore > 35 ? 'text-amber-400' : 'text-green-400'
                              }`}>
                                {scan.riskScore}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-sm text-cyber-textMuted">
                    No recent activity.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="w-full lg:w-80 flex flex-col gap-6">
            <Card className="bg-[#0F0F0F]">
              <CardHeader className="p-5 pb-0">
                <CardTitle className="text-[10px] font-semibold text-cyber-textMuted uppercase tracking-widest">Security Posture</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-cyber-border/50">
                    <span className="text-cyber-textMuted">Threat Level</span>
                    <span className="text-amber-400 font-medium">Moderate</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-cyber-border/50">
                    <span className="text-cyber-textMuted">Analysis Engine</span>
                    <span className="text-green-400 font-medium">Operational</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-cyber-textMuted">Last Detection</span>
                    <span className="text-white font-mono text-xs">17:42 UTC</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0F0F0F]">
              <CardHeader className="p-5 pb-0">
                <CardTitle className="text-[10px] font-semibold text-cyber-textMuted uppercase tracking-widest">Active Vectors</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white">Brand Spoofing</span>
                      <span className="text-cyber-textMuted font-mono">64%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div className="h-full bg-red-400 rounded-full" style={{ width: '64%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white">Raw IP Hosts</span>
                      <span className="text-cyber-textMuted font-mono">22%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: '22%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white">Domain Entropy</span>
                      <span className="text-cyber-textMuted font-mono">14%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div className="h-full bg-sage-500 rounded-full" style={{ width: '14%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
