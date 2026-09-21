import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ScanSearch,
  ShieldCheck,
  ShieldAlert,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useScan } from '../context/ScanContext';
import StatCard from '../components/StatCard';
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
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-0.5 text-xs font-mono font-medium text-cyan-300">
              SECURITY OVERVIEW
            </span>
            <span className="text-xs text-cyber-dim font-mono">Real-time threat monitoring</span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-white">
            Security Intelligence Console 👋
          </h1>
          <p className="mt-1 text-sm text-cyber-muted max-w-2xl">
            Evaluate, inspect, and neutralize suspicious URLs with Random Forest classification & heuristic feature telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/scanner')}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 px-5 py-3 text-sm font-bold text-slate-950 transition-all duration-200 hover:opacity-95 hover:shadow-glow"
          >
            <Sparkles size={17} />
            <span>Launch Deep Scanner</span>
          </button>
        </div>
      </div>

      {/* Statistics 4-Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<ScanSearch size={22} />}
          title="Total URLs Scanned"
          value={stats.totalScans}
          change="+18% today"
          changeType="positive"
          subtext="Processed via pipeline"
        />
        <StatCard
          icon={<ShieldCheck size={22} />}
          title="Safe Verified"
          value={stats.safeCount}
          change="Clean traffic"
          changeType="positive"
          subtext="Standard benign domains"
        />
        <StatCard
          icon={<ShieldAlert size={22} />}
          title="Threats Blocked"
          value={stats.phishingCount}
          change="Urgent"
          changeType="danger"
          subtext="Zero-day & known phishing"
        />
        <StatCard
          icon={<Activity size={22} />}
          title="Detection Rate"
          value={stats.detectionRate}
          change="Random Forest v2"
          changeType="positive"
          subtext="Evaluation benchmark"
        />
      </div>

      {/* Instant Threat Scanner Panel */}
      <div className="relative overflow-hidden rounded-3xl border border-cyber-border/80 bg-cyber-card/90 p-7 shadow-glow backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <ScanSearch size={18} />
              </div>
              Instant URL Threat Scanner
            </h2>
            <p className="mt-1 text-xs text-cyber-muted">
              Enter any web address to execute lexical feature extraction, DNS validation, and ML phishing analysis.
            </p>
          </div>
        </div>

        <URLInput onScan={handleQuickScan} isScanning={isScanning} />
      </div>

      {/* Recent Activity Feed & Threat Breakdown */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Scans Table */}
        <div className="rounded-3xl border border-cyber-border/80 bg-cyber-card/80 p-6 lg:col-span-2 backdrop-blur-md">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Recent Scan Activity</h3>
              <p className="text-xs text-cyber-muted">Latest scanned links and AI verdicts</p>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>View All ({stats.totalScans})</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-cyber-border/70 text-[11px] font-semibold uppercase tracking-wider text-cyber-dim font-mono">
                  <th className="pb-3.5">URL / Target Domain</th>
                  <th className="pb-3.5">Verdict</th>
                  <th className="pb-3.5 text-center">Risk Score</th>
                  <th className="pb-3.5 text-right">Scanned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border/40 text-sm">
                {recentScans.map((scan) => (
                  <tr
                    key={scan.id}
                    onClick={() => navigate('/scanner')}
                    className="group cursor-pointer transition-colors hover:bg-cyber-dark/40"
                  >
                    <td className="py-4 pr-4 max-w-xs truncate">
                      <div className="font-mono text-xs font-medium text-white group-hover:text-cyan-300 transition-colors truncate">
                        {scan.url}
                      </div>
                      <div className="text-[11px] text-cyber-dim font-mono">{scan.domain}</div>
                    </td>
                    <td className="py-4 whitespace-nowrap">
                      <ThreatBadge status={scan.status} size="small" />
                    </td>
                    <td className="py-4 text-center whitespace-nowrap">
                      <span className={`font-mono text-xs font-bold ${
                        scan.riskScore > 70 ? 'text-cyber-danger' : scan.riskScore > 35 ? 'text-cyber-warning' : 'text-cyber-mint'
                      }`}>
                        {scan.riskScore}/100
                      </span>
                    </td>
                    <td className="py-4 text-right whitespace-nowrap text-xs text-cyber-muted font-mono">
                      {scan.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Intelligence Briefing */}
        <div className="rounded-3xl border border-cyber-border/80 bg-cyber-card/80 p-6 backdrop-blur-md">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="text-cyan-400" size={18} />
            Threat Intel Summary
          </h3>
          <p className="mt-1 text-xs text-cyber-muted">Active threat vector breakdown</p>

          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-mono">
                <span className="text-cyber-muted">Brand Impersonation (PayPal/Amazon)</span>
                <span className="text-cyber-danger font-bold">64%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-cyber-dark overflow-hidden p-0.5 border border-cyber-border">
                <div className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full" style={{ width: '64%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-mono">
                <span className="text-cyber-muted">Raw IP Host Access</span>
                <span className="text-amber-400 font-bold">22%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-cyber-dark overflow-hidden p-0.5 border border-cyber-border">
                <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" style={{ width: '22%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-mono">
                <span className="text-cyber-muted">Typosquatting & Disposable TLDs</span>
                <span className="text-cyan-400 font-bold">14%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-cyber-dark overflow-hidden p-0.5 border border-cyber-border">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" style={{ width: '14%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-xs text-cyber-muted leading-relaxed">
            <span className="font-semibold text-cyan-300">Analyst Tip:</span> Over 78% of incoming phishing payloads use HTTPS certificates to mimic trusted organizations. Always review domain entropy and keyword nesting.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
