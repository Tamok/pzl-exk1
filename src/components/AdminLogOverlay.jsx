// src/components/AdminLogOverlay.jsx
import React, { useEffect, useState } from 'react';
import {
  addLogListener,
  removeLogListener,
  getStoredLogs,
  clearStoredLogs
} from '../utils/logger';
import { db } from '../firebase/config';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit
} from 'firebase/firestore';

const AdminLogOverlay = () => {
  const [logs, setLogs] = useState(() => getStoredLogs());
  const [remoteLogs, setRemoteLogs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState(['ALL']);
  const [search, setSearch] = useState('');
  const [recentOnly, setRecentOnly] = useState(false);
  const [showRemote, setShowRemote] = useState(true);
  const [showLocal, setShowLocal] = useState(true);
  const [heatmapMode, setHeatmapMode] = useState('combined'); // 'local', 'remote', 'combined'

  const allTags = ['AUTH', 'NAV', 'ENTRY', 'PLAYER', 'MAPPING', 'DATA', 'ERROR', 'THEME'];

  useEffect(() => {
    const listener = (log) => {
      setLogs(prev => [log, ...prev]);
    };
    addLogListener(listener);
    return () => removeLogListener(listener);
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'), limit(300));
    const unsub = onSnapshot(q, snap => {
      const newLogs = snap.docs.map(doc => {
        const data = doc.data();
        const ts = data.timestamp?.toDate()?.toISOString() ?? 'N/A';
        return `[${ts}][${data.tag}] ${data.message} (by ${data.user?.email ?? 'unknown'})`;
      });
      setRemoteLogs(newLogs);
    });
    return () => unsub();
  }, []);

  const handleCopyLog = () => {
    navigator.clipboard.writeText(filteredLogs.join('\n'))
      .then(() => alert("Log copied to clipboard"))
      .catch(err => alert("Copy failed: " + err.message));
  };

  const exportLogToFile = () => {
    const blob = new Blob([filteredLogs.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-log-${new Date().toISOString()}.txt`;
    a.click();
  };

  const formatLogEntry = (entry, index) => {
    const match = entry.match(/^\[(.*?)\]\[(.*?)\] (.*)$/);
    if (!match) return <div key={index} className="text-xs mb-1 break-words">{entry}</div>;
    const [_, rawTimestamp, tag, message] = match;
    const timestamp = rawTimestamp.replace('T', ' ').replace('Z', '');
    return (
      <div key={index} className="text-xs mb-1 break-words">
        <span className="text-[0.65rem] italic text-gray-400 mr-2">[{timestamp}]</span>
        <span className="font-bold text-blue-400 mr-2">[{tag}]</span>
        <span>{message}</span>
      </div>
    );
  };

  const combinedLogs = [
    ...(showLocal ? logs : []),
    ...(showRemote ? remoteLogs : [])
  ];

  const filteredLogs = combinedLogs.filter(entry => {
    const match = entry.match(/^\[(.*?)\]\[(.*?)\] (.*)$/);
    if (!match) return false;
    const [_, ts, tag, ] = match;
    const tagMatch = (selectedTags.includes('ALL') || selectedTags.includes(tag));
    const searchMatch = (!search || entry.toLowerCase().includes(search.toLowerCase()));
    const timeMatch = (!recentOnly || (Date.now() - new Date(ts).getTime()) < 10 * 60 * 1000);
    return tagMatch && searchMatch && timeMatch;
  });

  const buildHeatmapData = () => {
    const buckets = {};
  
    const addToBucket = (log, source) => {
      const match = log.match(/^\[(.*?)\]/);
      if (!match) return;
      const minute = match[1].slice(0, 16).replace('T', ' ');
      if (!buckets[minute]) buckets[minute] = { local: 0, remote: 0 };
      buckets[minute][source]++;
    };
  
    if (heatmapMode !== 'remote') logs.forEach(log => addToBucket(log, 'local'));
    if (heatmapMode !== 'local') remoteLogs.forEach(log => addToBucket(log, 'remote'));
  
    return Object.entries(buckets)
      .map(([minute, counts]) => ({ minute, ...counts }))
      .sort((a, b) => b.minute.localeCompare(a.minute))
      .slice(0, 30);
  };  

  const dailyBreakdown = () => {
    const daily = {};
    combinedLogs.forEach(log => {
      const match = log.match(/^\[(.*?)\]/);
      if (match) {
        const day = match[1].split('T')[0];
        daily[day] = (daily[day] || 0) + 1;
      }
    });
    return Object.entries(daily)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 7);
  };

  return (
    <>
      {isOpen ? (
        <div className="fixed right-0 top-0 h-full w-96 bg-gray-800/90 text-white p-4 rounded-l shadow-lg z-50 backdrop-blur-sm flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">Console Log</span>
            <div className="flex items-center space-x-1 text-sm">
              <button onClick={() => { clearStoredLogs(); setLogs([]); }} title="Clear local">🗑</button>
              <button onClick={handleCopyLog} title="Copy">📋</button>
              <button onClick={exportLogToFile} title="Export">⬇️</button>
              <button onClick={() => setIsOpen(false)} title="Close">❌</button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2 text-xs">
            <select
              multiple
              value={selectedTags}
              onChange={e =>
                setSelectedTags(
                  Array.from(e.target.selectedOptions, option => option.value)
                )
              }
              className="bg-gray-700 text-white rounded p-1 text-xs"
            >
              <option value="ALL">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>

            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 px-2 py-1 text-sm rounded bg-gray-700 text-white placeholder-gray-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={recentOnly} onChange={() => setRecentOnly(v => !v)} />
              Last 10 min
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={showLocal} onChange={() => setShowLocal(v => !v)} />
              Local
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={showRemote} onChange={() => setShowRemote(v => !v)} />
              Remote
            </label>
            <label className="flex items-center gap-1">
              Heatmap:
              <select
                value={heatmapMode}
                onChange={e => setHeatmapMode(e.target.value)}
                className="bg-gray-700 text-white rounded p-1 text-xs"
              >
                <option value="combined">Combined</option>
                <option value="local">Local Only</option>
                <option value="remote">Remote Only</option>
              </select>
            </label>
          </div>

          <div className="text-xs mt-2 mb-3">
            <h4 className="font-semibold mb-1">Log Heatmap (last 30 blocks)</h4>
            <div className="flex gap-2 flex-wrap items-end">
              {buildHeatmapData().map(({ minute, local, remote }) => {
                const total = local + remote;
                const height = Math.min(32, 4 + total * 2);
                const title = `${minute}:\nLocal: ${local}\nRemote: ${remote}`;
                const preview = logs
                  .concat(remoteLogs)
                  .filter(log => log.includes(minute))
                  .slice(0, 1)[0]?.slice(0, 100) ?? '';

                const label = total > 0 ? (
                  <div className="text-[0.6rem] text-center text-white">{total}</div>
                ) : <div className="h-3"></div>;

                if (heatmapMode === 'local') {
                  return (
                    <div key={minute} className="flex flex-col items-center" title={`${title}\n\n${preview}`}>
                      {label}
                      <div
                        className="w-4 rounded bg-blue-600"
                        style={{ height, opacity: Math.min(0.15 + local / 10, 1) }}
                      />
                    </div>
                  );
                }

                if (heatmapMode === 'remote') {
                  return (
                    <div key={minute} className="flex flex-col items-center" title={`${title}\n\n${preview}`}>
                      {label}
                      <div
                        className="w-4 rounded bg-orange-500"
                        style={{ height, opacity: Math.min(0.15 + remote / 10, 1) }}
                      />
                    </div>
                  );
                }

                // Combined
                const localHeight = (local / total) * height;
                const remoteHeight = height - localHeight;

                return (
                  <div key={minute} className="flex flex-col items-center" title={`${title}\n\n${preview}`}>
                    {label}
                    <div className="w-4 flex flex-col-reverse rounded overflow-hidden">
                      <div style={{ height: localHeight }} className="bg-blue-600 w-full" />
                      <div style={{ height: remoteHeight }} className="bg-orange-500 w-full" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


          <div className="text-xs mb-2">
            <h4 className="font-semibold mb-1">Daily Breakdown</h4>
            <ul className="pl-2 list-disc">
              {dailyBreakdown().map(([day, count]) => (
                <li key={day}>{day}: {count} logs</li>
              ))}
            </ul>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {filteredLogs.map(formatLogEntry)}
          </div>
        </div>
      ) : (
        <div className="fixed right-4 bottom-4 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="h-12 w-12 rounded-full bg-gray-800/75 text-white flex items-center justify-center shadow-lg"
            title="Open Console Log"
          >
            <span className="text-sm">LOG</span>
          </button>
        </div>
      )}
    </>
  );
};

export default AdminLogOverlay;
