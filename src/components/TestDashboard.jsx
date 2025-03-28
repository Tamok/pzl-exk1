// src/components/TestDashboard.jsx
import React, { useState } from 'react';
import { allTests } from '../tests/testRunner';
import { logEvent } from '../utils/logger';

const TestDashboard = () => {
  const [results, setResults] = useState([]);
  const [expanded, setExpanded] = useState({});

  const runTest = async (test) => {
    const timestamp = new Date().toISOString();
    const start = performance.now();
    try {
      const log = await test.run();
      const end = performance.now();
      setResults(prev => [...prev, {
        timestamp,
        name: test.name,
        category: test.category,
        duration: `${(end - start).toFixed(1)} ms`,
        status: '✅ Passed',
        log: log || 'Success'
      }]);
    } catch (e) {
      const end = performance.now();
      console.error(e);
      setResults(prev => [...prev, {
        timestamp,
        name: test.name,
        category: test.category,
        duration: `${(end - start).toFixed(1)} ms`,
        status: '❌ Failed',
        log: e.message
      }]);
    }
  };

  const runAll = async () => {
    for (const test of allTests) {
      logEvent('NAV', `Running test: ${test.name}`);
      await runTest(test);
    }
  };

  const copyResults = () => {
    const text = results.map(r =>
      `${r.timestamp}\t${r.category}\t${r.name}\t${r.status}\t${r.duration}\t${r.log}`
    ).join('\n');
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard.');
  };

  const categorized = allTests.reduce((acc, test) => {
    acc[test.category] = acc[test.category] || [];
    acc[test.category].push(test);
    return acc;
  }, {});

  const groupedResults = results.reduce((acc, r) => {
    acc[r.category] = acc[r.category] || [];
    acc[r.category].push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Test Dashboard</h2>
        <button onClick={runAll} className="bg-green-600 text-white px-4 py-2 rounded">
          Run All Tests
        </button>
      </div>

      {Object.entries(categorized).map(([category, tests]) => (
        <div key={category}>
          <h3 className="font-semibold text-lg mb-2">{category} Tests</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {tests.map((test, idx) => (
              <button
                key={idx}
                onClick={() => {
                  logEvent('NAV', `Running test: ${test.name}`);
                  runTest(test);
                }}
                className="bg-neutral-700 text-white px-2 py-1 rounded hover:bg-neutral-600 transition-colors"
              >
                {test.name}
              </button>
            ))}
          </div>
        </div>
      ))}

      <h3 className="mt-6 font-semibold text-lg">Test Results</h3>
      <div className="overflow-x-auto">
        <table className="w-full border border-collapse text-sm">
          <thead className="bg-neutral-800 text-white">
            <tr>
              <th className="border px-2 py-1 text-left">Timestamp</th>
              <th className="border px-2 py-1 text-left">Category</th>
              <th className="border px-2 py-1 text-left">Test</th>
              <th className="border px-2 py-1 text-left">Status</th>
              <th className="border px-2 py-1 text-left">Duration</th>
              <th className="border px-2 py-1 text-left">Log</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedResults).map(([category, tests]) => (
              <React.Fragment key={category}>
                <tr className="bg-neutral-200 dark:bg-neutral-700 font-bold">
                  <td colSpan="6" className="px-2 py-1">{category} Tests</td>
                </tr>
                {tests.map((r, idx) => (
                  <React.Fragment key={idx}>
                    <tr
                      className="border cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      onClick={() => setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }))}
                    >
                      <td className="px-2 py-1">{r.timestamp}</td>
                      <td className="px-2 py-1">{r.category}</td>
                      <td className="px-2 py-1">{r.name}</td>
                      <td className="px-2 py-1">{r.status}</td>
                      <td className="px-2 py-1">{r.duration}</td>
                      <td className="px-2 py-1 truncate">{r.log}</td>
                    </tr>
                    {expanded[idx] && (
                      <tr>
                        <td colSpan={6} className="bg-neutral-50 dark:bg-neutral-900 px-4 py-2 font-mono text-xs whitespace-pre-wrap">
                          {r.log}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={copyResults} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Copy Results to Clipboard
      </button>
    </div>
  );
};

export default TestDashboard;
