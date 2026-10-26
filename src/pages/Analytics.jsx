import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ShieldCheck, ShieldAlert, Activity, Server, Target, BrainCircuit, Fingerprint, Clock, ExternalLink } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useNavigate } from 'react-router-dom';
import { 
  THREAT_DISTRIBUTION_DATA, 
  TARGETED_BRANDS_DATA,
  FEATURE_IMPORTANCE,
  CONFUSION_MATRIX,
  MODEL_LEADERBOARD
} from '../data/dummyData';

const COLORS = {
  safe: '#10b981', // muted green
  phishing: '#ef4444', // muted red
  suspicious: '#f59e0b', // muted amber
  total: 'var(--color-text-very-dim)'
};

const generateTimelineData = (days) => {
  const data = [];
  let baseTotal = 50;
  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Create realistic deterministic-looking noise
    const noise = Math.floor(Math.sin(i) * 20);
    const total = baseTotal + noise + (days === 7 ? 0 : Math.floor(i % 10));
    const phishing = Math.floor(total * (0.15 + (Math.cos(i) * 0.05)));
    const suspicious = Math.floor(total * (0.05 + (Math.sin(i) * 0.05)));
    const safe = total - phishing - suspicious;
    const avgRisk = Math.floor((phishing * 85 + suspicious * 55 + safe * 10) / total);
    
    data.push({ date: dateStr, total: Math.max(10, total), safe: Math.max(5, safe), phishing: Math.max(2, phishing), suspicious: Math.max(1, suspicious), avgRisk });
  }
  return data;
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7D');
  const navigate = useNavigate();

  const timelineData = useMemo(() => {
    const days = timeRange === '7D' ? 7 : timeRange === '30D' ? 30 : 90;
    return generateTimelineData(days);
  }, [timeRange]);

  const totalScans = timelineData.reduce((acc, curr) => acc + curr.total, 0);
  const totalThreats = timelineData.reduce((acc, curr) => acc + curr.phishing + curr.suspicious, 0);
  const avgRiskOverall = Math.floor(timelineData.reduce((acc, curr) => acc + curr.avgRisk, 0) / timelineData.length);

  const getTimelineOption = () => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross', label: { backgroundColor: 'var(--color-surface-3)', color: 'var(--color-text-primary)' }, lineStyle: { color: 'var(--color-border)' } },
        backgroundColor: 'var(--color-surface-2)',
        borderColor: 'var(--color-border)',
        borderWidth: 1,
        textStyle: { color: 'var(--color-text-primary)', fontSize: 12 },
        padding: 16,
        formatter: (params) => {
          let html = `<div style="font-weight:600;margin-bottom:12px;font-family:ui-monospace, monospace;border-bottom:1px solid var(--color-border);padding-bottom:8px;color:var(--color-text-muted);font-size:11px;letter-spacing:0.05em;">${params[0].axisValue}</div>`;
          let total = 0;
          let risk = 0;
          params.forEach(p => {
            html += `<div style="display:flex;justify-content:space-between;margin-bottom:8px;align-items:center;">
              <span style="display:flex;align-items:center;">
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:${p.color};margin-right:8px;"></span>
                <span style="color:var(--color-text-dim);font-size:12px;">${p.seriesName}</span>
              </span>
              <span style="font-family:ui-monospace, monospace;font-weight:600;margin-left:24px;">${p.value}</span>
            </div>`;
          });
          const dataPoint = timelineData.find(d => d.date === params[0].axisValue);
          if (dataPoint) {
            html += `<div style="display:flex;justify-content:space-between;margin-top:12px;border-top:1px solid var(--color-border);padding-top:12px;align-items:center;">
              <span style="color:var(--color-text-very-dim);font-size:12px;text-transform:uppercase;letter-spacing:0.05em;font-weight:500;">Avg Risk Score</span>
              <span style="font-family:ui-monospace, monospace;font-weight:600;color:${dataPoint.avgRisk > 50 ? '#f59e0b' : '#10b981'}">${dataPoint.avgRisk}</span>
            </div>`;
          }
          return html;
        }
      },
      legend: {
        data: ['Total Scans', 'Phishing', 'Suspicious', 'Safe'],
        textStyle: { color: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'Inter' },
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        bottom: 0,
        itemGap: 20
      },
      grid: { top: 30, left: 20, right: 20, bottom: 50, containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timelineData.map(d => d.date),
        axisLine: { lineStyle: { color: 'var(--color-border)' } },
        axisLabel: { color: 'var(--color-text-dim)', fontSize: 11, margin: 16, fontFamily: 'ui-monospace, monospace' },
        splitLine: { show: true, lineStyle: { color: 'var(--color-border)', type: 'dashed' } }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: 'var(--color-text-dim)', fontSize: 11, fontFamily: 'ui-monospace, monospace' },
        splitLine: { lineStyle: { color: 'var(--color-border)', type: 'dashed' } }
      },
      series: [
        {
          name: 'Total Scans',
          type: 'line',
          data: timelineData.map(d => d.total),
          smooth: 0.3,
          showSymbol: false,
          lineStyle: { width: 2, color: '#3b82f6' },
          itemStyle: { color: '#3b82f6' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59, 130, 246, 0.15)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0)' }
            ])
          }
        },
        {
          name: 'Phishing',
          type: 'line',
          data: timelineData.map(d => d.phishing),
          smooth: 0.3,
          showSymbol: false,
          lineStyle: { width: 2, color: COLORS.phishing },
          itemStyle: { color: COLORS.phishing },
        },
        {
          name: 'Suspicious',
          type: 'line',
          data: timelineData.map(d => d.suspicious),
          smooth: 0.3,
          showSymbol: false,
          lineStyle: { width: 2, color: COLORS.suspicious, type: 'dashed' },
          itemStyle: { color: COLORS.suspicious },
        },
        {
          name: 'Safe',
          type: 'line',
          data: timelineData.map(d => d.safe),
          smooth: 0.3,
          showSymbol: false,
          lineStyle: { width: 2, color: COLORS.safe },
          itemStyle: { color: COLORS.safe },
        }
      ],
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    };
  };

  const getDonutOption = () => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'var(--color-surface-2)',
        borderColor: 'var(--color-border)',
        borderWidth: 1,
        textStyle: { color: 'var(--color-text-primary)', fontSize: 12 },
        padding: [12, 16],
        formatter: (params) => {
          return `<div style="display:flex;align-items:center;gap:8px;">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:${params.color};"></span>
            <span style="color:var(--color-text-dim);">${params.name}</span>
            <span style="font-family:ui-monospace, monospace;font-weight:600;color:var(--color-text-primary);margin-left:8px;">${params.value}</span>
            <span style="font-family:ui-monospace, monospace;color:var(--color-text-very-dim);margin-left:4px;">(${params.percent}%)</span>
          </div>`;
        }
      },
      legend: { show: false },
      series: [
        {
          name: 'Threat Distribution',
          type: 'pie',
          radius: ['65%', '85%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: 'var(--color-surface-1)',
            borderWidth: 2
          },
          label: { show: false },
          labelLine: { show: false },
          data: [
            { value: THREAT_DISTRIBUTION_DATA.find(d=>d.name==='Safe URLs').value, name: 'Safe', itemStyle: { color: COLORS.safe } },
            { value: THREAT_DISTRIBUTION_DATA.find(d=>d.name==='Phishing URLs').value, name: 'Phishing', itemStyle: { color: COLORS.phishing } },
            { value: THREAT_DISTRIBUTION_DATA.find(d=>d.name==='Suspicious').value, name: 'Suspicious', itemStyle: { color: COLORS.suspicious } }
          ]
        }
      ]
    };
  };

  const onDonutClick = (params) => {
    const filterMap = { 'Phishing': 'phishing', 'Suspicious': 'suspicious', 'Safe': 'safe' };
    if (filterMap[params.name]) {
      navigate(`/history?filter=${filterMap[params.name]}`);
    }
  };

  const getRiskDistributionOption = () => {
    // We will dynamically generate risk distribution based on timeRange
    const data = [
      { range: '0-20', count: Math.floor(totalScans * 0.4) },
      { range: '21-40', count: Math.floor(totalScans * 0.15) },
      { range: '41-60', count: Math.floor(totalScans * 0.1) },
      { range: '61-80', count: Math.floor(totalScans * 0.15) },
      { range: '81-100', count: Math.floor(totalScans * 0.2) },
    ];
    
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'var(--color-surface-2)',
        borderColor: 'var(--color-border)',
        textStyle: { color: 'var(--color-text-primary)' },
        formatter: (params) => {
          const p = params[0];
          return `<div style="color:var(--color-text-dim);font-size:11px;margin-bottom:4px;">Risk Range: <span style="color:var(--color-text-primary);font-family:ui-monospace, monospace;">${p.name}</span></div>
          <div style="font-weight:600;font-family:ui-monospace, monospace;color:var(--color-text-primary);">${p.value} <span style="color:var(--color-text-very-dim);font-size:12px;font-weight:400;font-family:Inter;">scans</span></div>`;
        }
      },
      grid: { top: 10, left: 10, right: 10, bottom: 20, containLabel: true },
      xAxis: {
        type: 'category',
        data: data.map(d => d.range),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: 'var(--color-text-dim)', fontSize: 10, fontFamily: 'ui-monospace, monospace' }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'var(--color-border)', type: 'dashed' } },
        axisLabel: { color: 'var(--color-text-dim)', fontSize: 10 }
      },
      series: [
        {
          type: 'bar',
          data: data.map((d, i) => {
            let color = COLORS.safe;
            if (i === 3) color = COLORS.suspicious;
            if (i === 4) color = COLORS.phishing;
            return { value: d.count, itemStyle: { color } };
          }),
          barWidth: '40%',
          itemStyle: { borderRadius: [4, 4, 0, 0] }
        }
      ]
    };
  };

  return (
    <PageTransition>
      <div className="space-y-8 max-w-[1400px] mx-auto pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-cyber-white tracking-tight flex items-center gap-3">
              <BrainCircuit className="text-cyber-textMuted" size={28} />
              Security Intelligence
            </h1>
            <p className="text-sm text-cyber-textMuted mt-2 max-w-2xl leading-relaxed">
              Global telemetry and threat distribution analysis across all processed scans. Model performance metrics are generated from continuous adversarial feedback loops.
            </p>
          </div>
          <div className="flex bg-cyber-dark border border-cyber-border rounded p-1 shadow-sm">
            {['7D', '30D', '90D'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-5 py-1.5 text-xs font-medium rounded-sm transition-all ${
                  timeRange === range
                    ? 'bg-cyber-cardActive text-cyber-white shadow'
                    : 'text-cyber-textMuted hover:text-cyber-white hover:bg-cyber-cardHover'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* METRIC STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Scans', value: totalScans.toLocaleString(), icon: Activity },
            { label: 'Threats Detected', value: totalThreats.toLocaleString(), icon: ShieldAlert, color: 'text-cyber-danger' },
            { label: 'Detection Rate', value: ((totalThreats / totalScans) * 100).toFixed(1) + '%', icon: Target },
            { label: 'Average Risk', value: avgRiskOverall, icon: Fingerprint, color: avgRiskOverall > 50 ? 'text-cyber-warning' : 'text-cyber-success' },
            { label: 'Model Confidence', value: '97.4%', icon: BrainCircuit },
            { label: 'Inference Latency', value: '34ms', icon: Clock }
          ].map((stat, idx) => (
            <Card key={idx} className="bg-cyber-dark hover:bg-cyber-card transition-colors border-cyber-border/60 shadow-sm">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] text-cyber-textMuted font-semibold uppercase tracking-widest">{stat.label}</span>
                  <stat.icon size={14} className={stat.color || "text-cyber-textMuted"} />
                </div>
                <div className="text-2xl font-mono text-cyber-white font-medium tracking-tight">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* MAIN CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-cyber-dark border-cyber-border/60">
            <CardHeader className="p-6 pb-2 border-b border-cyber-border/30">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-cyber-white flex items-center gap-2">
                  <Activity size={16} className="text-cyber-textMuted" />
                  Detection Activity
                </CardTitle>
                <div className="text-[10px] font-mono text-cyber-textMuted bg-cyber-cardHover px-2 py-1 rounded">
                  {timeRange} VIEW
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-4 h-[380px]">
              <ReactECharts 
                option={getTimelineOption()} 
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'svg' }}
                notMerge={true}
              />
            </CardContent>
          </Card>

          <Card className="bg-cyber-dark border-cyber-border/60 flex flex-col">
            <CardHeader className="p-6 pb-2 border-b border-cyber-border/30">
              <CardTitle className="text-sm font-medium text-cyber-white flex items-center gap-2">
                <ShieldCheck size={16} className="text-cyber-textMuted" />
                Threat Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex-grow flex flex-col justify-between">
              <div className="relative h-[220px] w-full">
                <ReactECharts 
                  option={getDonutOption()} 
                  style={{ height: '100%', width: '100%' }}
                  onEvents={{ 'click': onDonutClick }}
                  opts={{ renderer: 'svg' }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
                  <span className="text-4xl font-semibold text-cyber-white font-mono tracking-tight">
                    {THREAT_DISTRIBUTION_DATA.reduce((a, b) => a + b.value, 0)}
                  </span>
                  <span className="text-[10px] text-cyber-textMuted font-semibold uppercase tracking-widest mt-1">Total Signals</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-1">
                {THREAT_DISTRIBUTION_DATA.map((item, idx) => (
                  <div key={idx} 
                       className="flex justify-between items-center text-sm p-3 hover:bg-cyber-cardHover rounded cursor-pointer transition-all border border-transparent hover:border-cyber-border/50 group"
                       onClick={() => onDonutClick({name: item.name.replace(' URLs', '')})}>
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                      <span className="text-cyber-textMuted font-medium group-hover:text-cyber-white transition-colors">{item.name.replace(' URLs', '')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-cyber-white font-mono font-medium">{item.value}</span>
                      <ExternalLink size={14} className="text-cyber-textMuted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* BOTTOM ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="bg-cyber-dark border-cyber-border/60">
            <CardHeader className="p-6 pb-4 border-b border-cyber-border/30">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-cyber-white">
                <Target size={16} className="text-cyber-textMuted" />
                Targeted Brands
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col divide-y divide-cyber-border/30">
                {TARGETED_BRANDS_DATA.map((item, idx) => (
                  <div key={idx} className="flex flex-col p-5 hover:bg-cyber-cardHover transition-colors cursor-pointer group" onClick={() => navigate('/history?search=' + item.brand.toLowerCase())}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-cyber-dim font-medium group-hover:text-cyber-white transition-colors">{item.brand}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-cyber-white font-mono bg-cyber-cardHover px-2 py-0.5 rounded border border-cyber-border/50">{item.attacks} det</span>
                        <ExternalLink size={12} className="text-cyber-textMuted opacity-0 group-hover:opacity-100" />
                      </div>
                    </div>
                    <div className="w-full bg-cyber-cardHover rounded-full h-1 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.attacks / TARGETED_BRANDS_DATA[0].attacks) * 100}%` }}
                        transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                        className="bg-cyber-danger h-full rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-cyber-dark border-cyber-border/60">
            <CardHeader className="p-6 pb-4 border-b border-cyber-border/30">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-cyber-white">
                <Activity size={16} className="text-cyber-textMuted" />
                Risk Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-6 h-[320px]">
              <ReactECharts 
                option={getRiskDistributionOption()} 
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'svg' }}
                notMerge={true}
              />
            </CardContent>
          </Card>

          <Card className="bg-cyber-dark border-cyber-border/60">
            <CardHeader className="p-6 pb-4 border-b border-cyber-border/30">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-cyber-white">
                <BrainCircuit size={16} className="text-cyber-textMuted" />
                Feature Importance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col divide-y divide-cyber-border/30">
                {FEATURE_IMPORTANCE.map((item, idx) => (
                  <div key={idx} className="flex flex-col p-5 hover:bg-cyber-cardHover transition-colors">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-cyber-dim">{item.feature}</span>
                      <span className="text-[11px] font-mono bg-cyber-cardHover px-2 py-0.5 rounded border border-cyber-border/50 text-cyber-white">{item.importance}%</span>
                    </div>
                    <div className="w-full bg-cyber-cardHover rounded-full h-1 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.importance}%` }}
                        transition={{ duration: 1, delay: 0.4 + idx * 0.1 }}
                        className="bg-cyber-textMuted h-full rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-cyber-dark border-cyber-border/60">
            <CardHeader className="p-6 pb-4 border-b border-cyber-border/30">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-cyber-white">
                <Server size={16} className="text-cyber-textMuted" />
                Model Validation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] text-cyber-textMuted uppercase tracking-widest mb-3 font-semibold">Confusion Matrix (Test Set)</h4>
                  <div className="grid grid-cols-3 gap-1.5 text-xs text-center">
                    <div className="p-2 border border-transparent"></div>
                    <div className="p-2 text-cyber-textMuted font-medium text-[10px] uppercase tracking-wider">Pred Safe</div>
                    <div className="p-2 text-cyber-textMuted font-medium text-[10px] uppercase tracking-wider">Pred Phish</div>
                    
                    <div className="p-2 flex items-center justify-end text-cyber-textMuted font-medium pr-3 text-[10px] uppercase tracking-wider">Act Safe</div>
                    <div className="bg-cyber-success/10 text-cyber-success font-mono border border-cyber-success/20 p-2.5 rounded shadow-inner">{CONFUSION_MATRIX.safe.safe}</div>
                    <div className="bg-cyber-danger/10 text-cyber-danger font-mono border border-cyber-danger/20 p-2.5 rounded shadow-inner">{CONFUSION_MATRIX.safe.phishing}</div>
                    
                    <div className="p-2 flex items-center justify-end text-cyber-textMuted font-medium pr-3 text-[10px] uppercase tracking-wider">Act Phish</div>
                    <div className="bg-cyber-danger/10 text-cyber-danger font-mono border border-cyber-danger/20 p-2.5 rounded shadow-inner">{CONFUSION_MATRIX.phishing.safe}</div>
                    <div className="bg-cyber-success/10 text-cyber-success font-mono border border-cyber-success/20 p-2.5 rounded shadow-inner">{CONFUSION_MATRIX.phishing.phishing}</div>
                  </div>
                </div>
                
                <div className="pt-5 border-t border-cyber-border/30 grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <div className="text-[10px] text-cyber-textMuted uppercase tracking-widest mb-1.5">Precision</div>
                    <div className="text-xl font-mono text-cyber-white font-medium">100.0%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-cyber-textMuted uppercase tracking-widest mb-1.5">Recall</div>
                    <div className="text-xl font-mono text-cyber-white font-medium">99.58%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-cyber-textMuted uppercase tracking-widest mb-1.5">Accuracy</div>
                    <div className="text-xl font-mono text-cyber-white font-medium">99.77%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-cyber-textMuted uppercase tracking-widest mb-1.5">F1 Score</div>
                    <div className="text-xl font-mono text-cyber-white font-medium">0.998</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MACHINE LEARNING MODEL COMPARISON LEADERBOARD */}
        <Card className="bg-cyber-dark border-cyber-border/60">
          <CardHeader className="p-6 pb-4 border-b border-cyber-border/30">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-cyber-white">
                <BrainCircuit size={16} className="text-cyber-textMuted" />
                Machine Learning Algorithm Comparison (5-Fold Stratified Cross Validation)
              </CardTitle>
              <span className="text-[10px] font-mono text-cyber-textMuted bg-cyber-cardHover px-2 py-1 rounded border border-cyber-border/40">
                SCIKIT-LEARN PIPELINE
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cyber-card/60 text-cyber-textMuted uppercase font-semibold text-[10px] tracking-wider border-b border-cyber-border/30">
                <tr>
                  <th className="py-3 px-6">Algorithm</th>
                  <th className="py-3 px-6">Test Accuracy</th>
                  <th className="py-3 px-6">Precision</th>
                  <th className="py-3 px-6">Recall</th>
                  <th className="py-3 px-6">F1 Score</th>
                  <th className="py-3 px-6">ROC-AUC</th>
                  <th className="py-3 px-6">Pipeline Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border/20 text-cyber-white font-mono">
                {MODEL_LEADERBOARD.map((m, idx) => (
                  <tr key={idx} className="hover:bg-cyber-cardHover/50 transition-colors">
                    <td className="py-3.5 px-6 font-sans font-medium text-cyber-white flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-sage-400' : 'bg-cyber-border'}`} />
                      {m.model_name}
                    </td>
                    <td className="py-3.5 px-6 text-cyber-success font-semibold">{m.accuracy}%</td>
                    <td className="py-3.5 px-6">{m.precision}%</td>
                    <td className="py-3.5 px-6">{m.recall}%</td>
                    <td className="py-3.5 px-6 text-cyber-accent font-semibold">{m.f1_score}</td>
                    <td className="py-3.5 px-6">{m.roc_auc}</td>
                    <td className="py-3.5 px-6 font-sans">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        idx === 0 ? 'bg-cyber-success/10 text-cyber-success border border-cyber-success/30' : 'bg-cyber-card text-cyber-textMuted'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
