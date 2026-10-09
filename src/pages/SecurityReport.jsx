import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useScan } from '../context/ScanContext';
import { Printer, ArrowLeft, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export default function SecurityReport() {
  const { id } = useParams();
  const { scans } = useScan();
  const navigate = useNavigate();
  const [scan, setScan] = useState(null);

  useEffect(() => {
    const foundScan = scans.find(s => s.id === id);
    if (foundScan) {
      setScan(foundScan);
    } else {
      // Handle not found, maybe redirect
      // For dummy data, if they directly load we might not have it if state cleared.
    }
  }, [id, scans]);

  const handlePrint = () => {
    window.print();
  };

  if (!scan) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-cyber-textMuted">
        <p>Report not found or expired.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/history')}>Return to Audit Log</Button>
      </div>
    );
  }

  // Determine colors based on status
  const isPhishing = scan.status === 'phishing';
  const isSuspicious = scan.status === 'suspicious';
  const isSafe = scan.status === 'safe';

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col bg-cyber-black">
      {/* Non-printable header for actions */}
      <div className="flex justify-between items-center py-4 print:hidden border-b border-cyber-border mb-8">
        <Button variant="ghost" onClick={() => navigate('/history')} className="text-cyber-textMuted hover:text-cyber-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to History
        </Button>
        <Button onClick={handlePrint} className="bg-sage-600 hover:bg-sage-500 text-cyber-white">
          <Printer className="mr-2 h-4 w-4" />
          Print Report
        </Button>
      </div>

      {/* Printable Report Content */}
      <div className="bg-white text-black p-10 rounded-sm shadow-sm print:shadow-none print:p-0 flex-1 overflow-auto print:overflow-visible">
        <div className="border-b-2 border-black pb-6 mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Security Intelligence Report</h1>
            <p className="text-sm text-gray-500 font-mono">ID: {scan.id}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-sm">PhishGuards</p>
            <p className="text-xs text-gray-500">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Verdict Summary section */}
        <section className="mb-10 flex gap-6">
          <div className={`p-6 border-l-4 w-1/3 flex flex-col justify-center items-center text-center bg-gray-50 ${isPhishing ? 'border-red-600' : isSuspicious ? 'border-amber-500' : 'border-green-600'}`}>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Final Verdict</span>
            {isPhishing && <ShieldAlert className="h-10 w-10 text-red-600 mb-2" />}
            {isSuspicious && <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />}
            {isSafe && <ShieldCheck className="h-10 w-10 text-green-600 mb-2" />}
            <h2 className={`text-2xl font-black uppercase tracking-widest ${isPhishing ? 'text-red-600' : isSuspicious ? 'text-amber-500' : 'text-green-600'}`}>
              {scan.status}
            </h2>
          </div>
          
          <div className="w-2/3 flex flex-col justify-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Target Payload</h3>
            <div className="bg-gray-100 p-4 rounded-sm border border-gray-200">
              <p className="font-mono text-base break-all text-gray-900">{scan.url}</p>
            </div>
          </div>
        </section>

        {/* AI Analysis */}
        <section className="mb-10">
          <h3 className="text-sm font-bold uppercase tracking-widest text-black border-b border-gray-200 pb-2 mb-4">Executive Summary</h3>
          <p className="text-gray-800 leading-relaxed text-sm">
            {scan.aiExplanation}
          </p>
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 text-sm">
            <span className="font-bold">Recommendation:</span> {scan.recommendation}
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="mb-10">
          <h3 className="text-sm font-bold uppercase tracking-widest text-black border-b border-gray-200 pb-2 mb-4">Technical Telemetry</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-200 p-4">
              <span className="text-xs font-bold uppercase text-gray-500 block mb-1">Risk Score</span>
              <span className="text-3xl font-mono">{scan.riskScore}</span>
              <span className="text-sm text-gray-500 ml-1">/ 100</span>
            </div>
            <div className="border border-gray-200 p-4">
              <span className="text-xs font-bold uppercase text-gray-500 block mb-1">Model Confidence</span>
              <span className="text-3xl font-mono">{scan.confidence}%</span>
            </div>
          </div>
        </section>

        {/* Technical Features */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-widest text-black border-b border-gray-200 pb-2 mb-4">Extracted Features</h3>
          <table className="w-full text-sm text-left border-collapse">
            <tbody>
              <tr className="border-b border-gray-100">
                <th className="py-3 font-semibold text-gray-700 w-1/3">URL Length</th>
                <td className="py-3 font-mono">{scan.features.urlLength} characters</td>
              </tr>
              <tr className="border-b border-gray-100">
                <th className="py-3 font-semibold text-gray-700">Protocol Security (HTTPS)</th>
                <td className="py-3 font-mono">{scan.features.hasHttps ? 'Present' : 'Absent'}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <th className="py-3 font-semibold text-gray-700">Raw IP Host Detection</th>
                <td className="py-3 font-mono">{scan.features.hasIp ? 'Detected' : 'Not Detected'}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <th className="py-3 font-semibold text-gray-700">TLD Reputation</th>
                <td className="py-3 font-mono">{scan.features.tldRisk}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <th className="py-3 font-semibold text-gray-700">Subdomain Count</th>
                <td className="py-3 font-mono">{scan.features.dotsCount}</td>
              </tr>
              {scan.features.suspiciousWords?.length > 0 && (
                <tr className="border-b border-gray-100">
                  <th className="py-3 font-semibold text-gray-700 align-top">Suspicious Tokens</th>
                  <td className="py-3 font-mono text-red-600">{scan.features.suspiciousWords.join(', ')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Footer */}
        <div className="mt-16 pt-4 border-t border-gray-200 text-xs text-center text-gray-400">
          Generated automatically by PhishGuards Security Intelligence Engine. Confidential.
        </div>
      </div>
    </div>
  );
}
