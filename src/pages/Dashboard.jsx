import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ScanSearch,
  ShieldCheck,
  ShieldAlert,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  ServerCrash
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded bg-cyber-cyan/10 px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider text-cyber-cyan border border-cyber-cyan/20">
              SEC-OPS
            </span>
            <span className="text-xs text-cyber-muted font-mono tracking-wide uppercase">Real-time telemetry active</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
            Security Intelligence
          </h1>
          <p className="text-sm text-cyber-muted leading-relaxed">
            Monitor incoming traffic, analyze suspicious payloads, and neutralize threats using real-time machine learning classification.
          </p>
        </div>

        <button
          onClick={() => navigate('/scanner')}
          className="group relative inline-flex items-center gap-2 rounded-lg bg-cyber-cyan px-5 py-2.5 text-sm font-bold text-black transition-all duration-300 hover:bg-white hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] overflow-hidden shrink-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] animate-[scanline_2s_linear_infinite]" />
          <Sparkles size={16} className="fill-black" />
          <span>Launch Deep Scanner</span>
        </button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<ScanSearch size={16} />}
          title="Total Processed"
          value={stats.totalScans}
          change="+12%"
          changeType="positive"
          subtext="Requests today"
        />
        <StatCard
          icon={<ShieldCheck size={16} />}
          title="Safe Traffic"
          value={stats.safeCount}
          change="Baseline"
          changeType="positive"
          subtext="Verified benign"
        />
        <StatCard
          icon={<ShieldAlert size={16} />}
          title="Threats Blocked"
          value={stats.phishingCount}
          change="Urgent"
          changeType="danger"
          subtext="Malicious payloads"
        />
        <StatCard
          icon={<Activity size={16} />}
          title="Engine Confidence"
          value={stats.detectionRate}
          change="Stable"
          changeType="positive"
          subtext="ML Model accuracy"
        />
      </motion.div>

      {/* Instant Scan Panel */}
      <motion.div variants={itemVariants} className="glass-panel relative overflow-hidden rounded-2xl p-6 md:p-8">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative z-10 max-w-4xl">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
            Target Analysis
          </h2>
          <p className="text-sm text-cyber-muted mb-6">
            Input a URL to initiate immediate lexical extraction, domain reputational lookup, and Random Forest classification.
          </p>
          <URLInput onScan={handleQuickScan} isScanning={isScanning} />
        </div>
      </motion.div>

      {/* Activity and Intel Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Scans */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 lg:col-span-2 flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">Recent Detections</h3>
              <p className="text-xs text-cyber-muted mt-1">Latest payloads evaluated by the engine</p>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="group flex items-center gap-1.5 text-xs font-semibold text-cyber-cyan hover:text-white transition-colors"
            >
              <span>View Audit Log</span>
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {recentScans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-cyber-border text-[10px] font-semibold uppercase tracking-widest text-cyber-dim font-mono">
                    <th className="pb-3 px-2">Target Payload</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-right">Risk Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-border/50 text-sm">
                  {recentScans.map((scan) => (
                    <tr
                      key={scan.id}
                      onClick={() => navigate('/history')}
                      className="group cursor-pointer transition-colors hover:bg-white/5"
                    >
                      <td className="py-3 px-2 max-w-[200px] truncate">
                        <div className="font-mono text-xs text-white group-hover:text-cyber-cyan transition-colors truncate">
                          {scan.url}
                        </div>
                        <div className="text-[10px] text-cyber-muted font-mono mt-0.5 truncate">{scan.domain}</div>
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        <ThreatBadge status={scan.status} size="small" />
                      </td>
                      <td className="py-3 px-2 text-right whitespace-nowrap">
                        <span className={`font-mono text-xs font-bold ${
                          scan.riskScore > 70 ? 'text-cyber-danger' : scan.riskScore > 35 ? 'text-cyber-warning' : 'text-cyber-mint'
                        }`}>
                          {scan.riskScore}
                        </span>
                        <span className="text-[10px] text-cyber-dim font-mono">/100</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-cyber-border rounded-xl">
              <ServerCrash size={24} className="text-cyber-dim mb-3" />
              <p className="text-sm font-medium text-cyber-muted">No recent activity detected.</p>
              <p className="text-xs text-cyber-dim mt-1">Initiate a scan to populate the audit log.</p>
            </div>
          )}
        </motion.div>

        {/* Threat Intel Summary */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 flex flex-col">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <TrendingUp className="text-cyber-cyan" size={16} />
              Threat Intel Vector
            </h3>
            <p className="mt-1 text-xs text-cyber-muted">Primary detection patterns</p>
          </div>

          <div className="flex-1 space-y-5">
            <div>
              <div className="flex justify-between text-[11px] mb-2 font-mono uppercase tracking-wider">
                <span className="text-cyber-muted">Brand Spoofing</span>
                <span className="text-cyber-danger font-bold">64%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-cyber-dark overflow-hidden">
                <div className="h-full bg-cyber-danger rounded-full" style={{ width: '64%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-2 font-mono uppercase tracking-wider">
                <span className="text-cyber-muted">IP Masking</span>
                <span className="text-cyber-warning font-bold">22%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-cyber-dark overflow-hidden">
                <div className="h-full bg-cyber-warning rounded-full" style={{ width: '22%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-2 font-mono uppercase tracking-wider">
                <span className="text-cyber-muted">Domain Entropy</span>
                <span className="text-cyber-cyan font-bold">14%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-cyber-dark overflow-hidden">
                <div className="h-full bg-cyber-cyan rounded-full" style={{ width: '14%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-cyber-cyan/20 bg-cyber-cyan/5 p-4 text-xs text-cyber-muted leading-relaxed">
            <span className="font-semibold text-cyber-cyan block mb-1">Analyst Insight</span> 
            HTTPS adoption in phishing payloads has increased. Do not rely on TLS certificates alone for validation.
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
