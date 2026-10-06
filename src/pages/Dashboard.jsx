import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
} from 'lucide-react';
import { useScan } from '../context/ScanContext';
import ThreatBadge from '../components/ThreatBadge';
import URLInput from '../components/URLInput';

const Dashboard = () => {
  const navigate = useNavigate();
  const { stats, scans, executeScan, isScanning } = useScan();

  const handleQuickScan = async (url) => {
    await executeScan(url);
    navigate('/scanner');
  };

  const recentScans = scans.slice(0, 5);

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-cyber-white">Security Overview</h1>
        <p className="text-sm text-cyber-muted">
          Real-time visibility into URL analysis, threat classifications, and detection activity.
        </p>
      </div>

      {/* KPI Strip */}
      <div className="flex flex-col sm:flex-row border border-cyber-border rounded-lg bg-cyber-dark overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-cyber-border">
        <div className="flex-1 p-4 flex flex-col justify-between">
          <span className="text-xs text-cyber-muted font-medium mb-1 uppercase tracking-wider">Total Scans</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono text-cyber-white">{stats.totalScans}</span>
          </div>
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <span className="text-xs text-cyber-muted font-medium mb-1 uppercase tracking-wider">Threats Detected</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono text-cyber-danger">{stats.phishingCount}</span>
            <span className="text-xs text-cyber-danger bg-cyber-danger/10 px-1.5 rounded">Action Req</span>
          </div>
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <span className="text-xs text-cyber-muted font-medium mb-1 uppercase tracking-wider">Safe URLs</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono text-cyber-white">{stats.safeCount}</span>
          </div>
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <span className="text-xs text-cyber-muted font-medium mb-1 uppercase tracking-wider">Model Confidence</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono text-cyber-white">{stats.detectionRate}</span>
            <span className="text-xs text-cyber-success bg-cyber-success/10 px-1.5 rounded">Stable</span>
          </div>
        </div>
      </div>

      {/* Layout Columns */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Main Column */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Quick Scan */}
          <div className="panel p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold text-cyber-white">Target Analysis</h2>
            </div>
            <URLInput onScan={handleQuickScan} isScanning={isScanning} />
          </div>

          {/* Recent Scans */}
          <div className="panel flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-cyber-border">
              <h2 className="text-sm font-semibold text-cyber-white">Recent Detections</h2>
              <button
                onClick={() => navigate('/history')}
                className="text-xs text-cyber-muted hover:text-cyber-white flex items-center gap-1 transition-colors"
              >
                View full log <ArrowRight size={12} />
              </button>
            </div>
            {recentScans.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-cyber-border bg-cyber-card text-xs text-cyber-dim">
                      <th className="font-normal px-4 py-2 w-1/2">Target</th>
                      <th className="font-normal px-4 py-2">Verdict</th>
                      <th className="font-normal px-4 py-2 text-right">Risk Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyber-border/50">
                    {recentScans.map((scan) => (
                      <tr key={scan.id} className="hover:bg-cyber-cardHover transition-colors cursor-pointer" onClick={() => navigate('/history')}>
                        <td className="px-4 py-3">
                          <div className="font-mono text-cyber-white text-xs truncate max-w-[250px]">{scan.url}</div>
                          <div className="text-[11px] text-cyber-muted mt-0.5">{scan.domain}</div>
                        </td>
                        <td className="px-4 py-3">
                          <ThreatBadge status={scan.status} size="small" />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-mono text-xs ${
                            scan.riskScore > 70 ? 'text-cyber-danger' : scan.riskScore > 35 ? 'text-cyber-warning' : 'text-cyber-success'
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
              <div className="p-8 text-center text-sm text-cyber-muted">
                No recent activity.
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          {/* Security Posture */}
          <div className="panel p-4 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-cyber-white uppercase tracking-wider text-xs">Security Posture</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-cyber-border/50">
                <span className="text-cyber-muted">Threat Level</span>
                <span className="text-cyber-warning font-medium">Moderate</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-cyber-border/50">
                <span className="text-cyber-muted">Analysis Engine</span>
                <span className="text-cyber-success font-medium">Operational</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-cyber-border/50">
                <span className="text-cyber-muted">Last Detection</span>
                <span className="text-cyber-white font-mono text-xs">17:42 UTC</span>
              </div>
            </div>
          </div>

          {/* Threat Distribution */}
          <div className="panel p-4 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-cyber-white uppercase tracking-wider text-xs">Active Vectors</h2>
            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cyber-white">Brand Spoofing</span>
                  <span className="text-cyber-muted font-mono">64%</span>
                </div>
                <div className="h-1 w-full bg-cyber-card rounded-full overflow-hidden">
                  <div className="h-full bg-cyber-danger rounded-full" style={{ width: '64%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cyber-white">Raw IP Hosts</span>
                  <span className="text-cyber-muted font-mono">22%</span>
                </div>
                <div className="h-1 w-full bg-cyber-card rounded-full overflow-hidden">
                  <div className="h-full bg-cyber-warning rounded-full" style={{ width: '22%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cyber-white">Domain Entropy</span>
                  <span className="text-cyber-muted font-mono">14%</span>
                </div>
                <div className="h-1 w-full bg-cyber-card rounded-full overflow-hidden">
                  <div className="h-full bg-cyber-accent rounded-full" style={{ width: '14%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
