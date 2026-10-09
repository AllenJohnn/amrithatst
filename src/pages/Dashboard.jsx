import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { useScan } from '../context/ScanContext';
import URLInput from '../components/URLInput';
import PageTransition from '../components/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { SCAN_TREND_DATA } from '../data/dummyData';

export default function Dashboard() {
  const navigate = useNavigate();
  const { stats, scans, executeScan, isScanning } = useScan();

  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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

  const TinySparkline = ({ dataKey, color }) => (
    <div className="h-8 w-20 opacity-60">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={SCAN_TREND_DATA}>
          <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.2} strokeWidth={1.5} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
        <div className="flex flex-col gap-1 mb-2">
          <h1 className="text-2xl font-semibold tracking-tight text-cyber-white">Security Overview</h1>
          <p className="text-sm text-cyber-textMuted max-w-xl">
            Real-time visibility into URL analysis, threat classifications, and detection activity.
          </p>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="bg-cyber-dark">
                <CardContent className="p-5 flex flex-col justify-between h-[104px]">
                  <div className="h-3 w-24 bg-cyber-border rounded animate-pulse mb-2"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-16 bg-cyber-border rounded animate-pulse"></div>
                    <div className="h-8 w-20 bg-cyber-border rounded animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card className="bg-cyber-dark hover:bg-cyber-card transition-colors cursor-pointer" onClick={() => navigate('/history')}>
                <CardContent className="p-5 flex flex-col justify-between h-full">
                  <span className="text-[10px] text-cyber-textMuted font-semibold uppercase tracking-widest block mb-2">Total Scans</span>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-semibold text-cyber-white font-mono tracking-tight">{stats.totalScans}</span>
                    <TinySparkline dataKey="total" color="#9ca3af" />
                  </div>
                </CardContent>
              </Card>
          <Card className="bg-cyber-dark hover:bg-cyber-card transition-colors cursor-pointer" onClick={() => navigate('/history?filter=phishing')}>
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <span className="text-[10px] text-cyber-textMuted font-semibold uppercase tracking-widest block mb-2">Threats Detected</span>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-semibold text-red-400 font-mono tracking-tight">{stats.phishingCount}</span>
                <TinySparkline dataKey="threats" color="#f87171" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-cyber-dark hover:bg-cyber-card transition-colors cursor-pointer" onClick={() => navigate('/history?filter=safe')}>
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <span className="text-[10px] text-cyber-textMuted font-semibold uppercase tracking-widest block mb-2">Safe URLs</span>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-semibold text-cyber-white font-mono tracking-tight">{stats.safeCount}</span>
                <TinySparkline dataKey="safe" color="#4ade80" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-cyber-dark hover:bg-cyber-card transition-colors cursor-pointer" onClick={() => navigate('/analytics')}>
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <span className="text-[10px] text-cyber-textMuted font-semibold uppercase tracking-widest block mb-2">Model Confidence</span>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-semibold text-cyber-white font-mono tracking-tight">{stats.detectionRate}</span>
                <span className="text-[10px] text-green-400 bg-green-900/20 px-2 py-0.5 rounded-sm font-medium">Stable</span>
              </div>
            </CardContent>
          </Card>
          </>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          <div className="flex-1 flex flex-col gap-6">
            <Card className="bg-cyber-dark">
              <CardHeader className="p-5 pb-0">
                <CardTitle className="text-sm">Target Analysis</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <URLInput onScan={handleQuickScan} isScanning={isScanning} />
              </CardContent>
            </Card>

            <Card className="bg-cyber-dark flex-1">
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
                        <tr className="border-b border-cyber-border bg-cyber-card text-[11px] text-cyber-textMuted font-medium uppercase tracking-wider">
                          <th className="font-semibold px-5 py-3 w-1/2">Target Payload</th>
                          <th className="font-semibold px-5 py-3">Classification</th>
                          <th className="font-semibold px-5 py-3 text-right">Risk</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cyber-border/50">
                        {recentScans.map((scan) => (
                          <tr key={scan.id} className="hover:bg-cyber-cardHover transition-colors cursor-pointer group" onClick={() => navigate('/history?search=' + scan.domain)}>
                            <td className="px-5 py-3">
                              <div className="font-mono text-cyber-white text-[13px] truncate max-w-[300px] group-hover:text-sage-400 transition-colors">{scan.url}</div>
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
                  <div className="p-12 flex flex-col items-center justify-center text-center border border-dashed border-cyber-border m-4 rounded-lg bg-cyber-card/50">
                    <Activity className="h-8 w-8 text-cyber-textMuted mb-3 opacity-50" />
                    <span className="text-sm text-cyber-white font-medium mb-1">No Recent Detections</span>
                    <span className="text-xs text-cyber-textMuted max-w-[200px]">Execute a scan in the target analysis panel to populate the log.</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 flex flex-col gap-6">
            
            <Card className="bg-cyber-dark">
              <CardHeader className="p-5 pb-0 border-b border-cyber-border pb-3">
                <CardTitle className="text-[10px] font-semibold text-cyber-white uppercase tracking-widest">Security Posture</CardTitle>
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
                  <div className="flex justify-between items-center py-2 border-b border-cyber-border/50">
                    <span className="text-cyber-textMuted">Avg Latency</span>
                    <span className="text-cyber-white font-mono text-xs">34ms</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-cyber-textMuted">High-Risk Payloads</span>
                    <span className="text-red-400 font-mono text-xs">{stats.phishingCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cyber-dark">
              <CardHeader className="p-5 pb-0 border-b border-cyber-border pb-3">
                <CardTitle className="text-[10px] font-semibold text-cyber-white uppercase tracking-widest">Threat Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="flex flex-col gap-5">
                  <div className="cursor-pointer group">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-cyber-white group-hover:text-red-400 transition-colors">Brand Spoofing</span>
                      <span className="text-cyber-textMuted font-mono group-hover:text-cyber-white transition-colors">64%</span>
                    </div>
                    <div className="h-1.5 w-full bg-cyber-cardHover rounded-full overflow-hidden">
                      <div className="h-full bg-red-400 rounded-full" style={{ width: '64%' }}></div>
                    </div>
                  </div>
                  <div className="cursor-pointer group">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-cyber-white group-hover:text-amber-400 transition-colors">Raw IP Hosts</span>
                      <span className="text-cyber-textMuted font-mono group-hover:text-cyber-white transition-colors">22%</span>
                    </div>
                    <div className="h-1.5 w-full bg-cyber-cardHover rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: '22%' }}></div>
                    </div>
                  </div>
                  <div className="cursor-pointer group">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-cyber-white group-hover:text-sage-400 transition-colors">Domain Entropy</span>
                      <span className="text-cyber-textMuted font-mono group-hover:text-cyber-white transition-colors">14%</span>
                    </div>
                    <div className="h-1.5 w-full bg-cyber-cardHover rounded-full overflow-hidden">
                      <div className="h-full bg-sage-500 rounded-full" style={{ width: '14%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cyber-dark">
              <CardHeader className="p-5 pb-0 border-b border-cyber-border pb-3">
                <CardTitle className="text-[10px] font-semibold text-cyber-white uppercase tracking-widest">Activity Feed</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-hidden">
                <div className="flex flex-col divide-y divide-cyber-border/50">
                  <AnimatePresence initial={false}>
                  {recentScans.length > 0 ? (
                    recentScans.slice(0, 5).map((scan, idx) => (
                      <motion.div 
                        key={scan.id} 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className="p-4 flex gap-3 hover:bg-cyber-card transition-colors cursor-pointer group" 
                        onClick={() => navigate('/history?search=' + scan.domain)}
                      >
                        <div className="mt-0.5 shrink-0">
                          {scan.status === 'phishing' ? <ShieldAlert className="h-4 w-4 text-red-400 group-hover:scale-110 transition-transform" /> : 
                           scan.status === 'suspicious' ? <AlertTriangle className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" /> : 
                           <ShieldCheck className="h-4 w-4 text-green-400 group-hover:scale-110 transition-transform" />}
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="text-xs text-cyber-white group-hover:text-sage-400 transition-colors">{scan.status === 'phishing' ? 'Phishing URL detected' : scan.status === 'suspicious' ? 'Suspicious pattern flagged' : 'Safe URL verified'}</span>
                            <span className="text-[9px] font-mono text-cyber-textMuted">{scan.date || 'Just now'}</span>
                          </div>
                          <span className="text-[10px] font-mono text-cyber-textMuted truncate">{scan.url}</span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-cyber-textMuted flex flex-col items-center">
                      <ShieldCheck className="h-6 w-6 mb-2 opacity-30" />
                      All clear. No recent events.
                    </div>
                  )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
