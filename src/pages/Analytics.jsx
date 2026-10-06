import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { BarChart3, TrendingUp, ShieldAlert, Target, Calendar, Download } from 'lucide-react';
import {
  SCAN_TREND_DATA,
  THREAT_DISTRIBUTION_DATA,
  TARGETED_BRANDS_DATA,
} from '../data/dummyData';
import PageTransition from '../components/PageTransition';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Analytics() {
  const customTooltipStyle = {
    backgroundColor: '#0F0F0F',
    border: '1px solid #1F1F1F',
    borderRadius: '8px',
    color: '#F2F2F2',
    fontSize: '12px',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
    padding: '12px'
  };

  const COLORS = {
    total: '#9ca3af',    // text-muted
    threats: '#f87171',  // red-400
    phishing: '#f87171', // red-400
    suspicious: '#fbbf24', // amber-400
    safe: '#4ade80'      // green-400
  };

  const threatDistribution = THREAT_DISTRIBUTION_DATA.map(item => {
    let color = COLORS.safe;
    if (item.name === 'Phishing') color = COLORS.phishing;
    if (item.name === 'Suspicious') color = COLORS.suspicious;
    return { ...item, color };
  });

  return (
    <PageTransition>
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">
              Threat Analytics
            </h1>
            <p className="text-sm text-cyber-textMuted">
              Aggregated telemetry and model performance metrics.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Calendar className="mr-2 h-4 w-4" />
              Last 7 Days
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "MODEL ACCURACY", value: "94.7%", sub: "CV Score" },
            { label: "FALSE POSITIVE RATE", value: "1.2%", sub: "Optimal" },
            { label: "INFERENCE LATENCY", value: "34ms", sub: "Avg Time" },
            { label: "FEATURE VECTORS", value: "18", sub: "Dimensions" }
          ].map((metric, i) => (
            <Card key={i} className="bg-[#0F0F0F]">
              <CardContent className="p-5 flex flex-col justify-center h-full">
                <span className="text-[10px] text-cyber-textMuted font-semibold uppercase tracking-widest block mb-2">{metric.label}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-semibold text-white font-mono tracking-tight">{metric.value}</span>
                  <span className="text-[10px] text-cyber-textMuted uppercase hidden sm:inline-block">{metric.sub}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-[#0F0F0F] flex flex-col">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp size={16} className="text-cyber-textMuted" />
                Detection Volume (7d)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 flex-1">
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SCAN_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.total} stopOpacity={0.1}/>
                        <stop offset="95%" stopColor={COLORS.total} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.threats} stopOpacity={0.1}/>
                        <stop offset="95%" stopColor={COLORS.threats} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" vertical={false} />
                    <XAxis dataKey="day" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={customTooltipStyle} cursor={{ stroke: '#333', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area type="monotone" dataKey="total" stroke={COLORS.total} strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" name="Total Scans" />
                    <Area type="monotone" dataKey="threats" stroke={COLORS.threats} strokeWidth={2} fillOpacity={1} fill="url(#colorThreats)" name="Threats" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0F0F0F] flex flex-col">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldAlert size={16} className="text-cyber-textMuted" />
                Verdict Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 flex-1 flex flex-col">
              <div className="h-[220px] w-full relative mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={threatDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {threatDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={customTooltipStyle} itemStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
                  <span className="text-2xl font-semibold text-white font-mono">{
                    threatDistribution.reduce((acc, curr) => acc + curr.value, 0)
                  }</span>
                  <span className="text-[10px] text-cyber-textMuted font-semibold uppercase tracking-widest mt-1">Total</span>
                </div>
              </div>
              
              <div className="mt-8 space-y-3">
                {threatDistribution.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b border-cyber-border/50 pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }}></div>
                      <span className="text-cyber-textMuted font-medium">{item.name}</span>
                    </div>
                    <span className="text-white font-mono font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#0F0F0F]">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target size={16} className="text-cyber-textMuted" />
              Top Spoofed Brands
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-[280px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TARGETED_BRANDS_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="brand" type="category" stroke="#888" fontSize={12} tickLine={false} axisLine={false} width={100} />
                  <Tooltip contentStyle={customTooltipStyle} cursor={{ fill: '#1A1A1A' }} />
                  <Bar dataKey="attacks" radius={[0, 4, 4, 0]} name="Attacks" barSize={24}>
                    {TARGETED_BRANDS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.threats : index === 1 ? COLORS.suspicious : COLORS.total} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
