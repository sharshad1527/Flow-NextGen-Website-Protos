import { useState } from "react";
import { 
  List, 
  Pause, 
  Play, 
  RotateCcw, 
  Trash2, 
  Check, 
  AlertTriangle 
} from "lucide-react";
import "./TaskLedgerQueue.css";

interface Job {
  id: string;
  type: string;
  name: string;
  prompt: string;
  status: "COMPLETE" | "FAILED" | "RUNNING" | "PENDING";
  details: string;
}

export function TaskLedgerQueue() {
  const [isPaused, setIsPaused] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "job_01",
      type: "Text to Video",
      name: "COMPLETE",
      prompt: "An artistic cyberpunk scene with @samurai walking und...",
      status: "COMPLETE",
      details: "18.4s COMPILED"
    },
    {
      id: "job_02",
      type: "Ingredients to Video",
      name: "FAILED",
      prompt: "@samurai style_cyberpunk.png voice narrative dialog...",
      status: "FAILED",
      details: "45% ATTEMPT 3/3"
    }
  ]);
  const [logs, setLogs] = useState<string[]>([
    "[23:25:01] Flow Companion 24.13.37 initialized.",
    "[23:25:05] Synced with Flow NextGen Engine.",
    "[23:26:23] Scheduler picked up pending task [task_04]. Dispatching..."
  ]);

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString("en-US", { hour12: false });
    setLogs(prev => [...prev, `[${time}] ${message}`]);
  };

  const handlePauseToggle = () => {
    setIsPaused(prev => !prev);
    addLog(isPaused ? "Queue processing resumed." : "Queue processing paused by user.");
  };

  const handleRetryFailed = () => {
    const failedExists = jobs.some(j => j.status === "FAILED");
    if (!failedExists) {
      addLog("No failed tasks in the queue.");
      return;
    }
    
    addLog("Initiating retry for failed tasks...");
    setJobs(prev => prev.map(job => {
      if (job.status === "FAILED") {
        return {
          ...job,
          status: "RUNNING",
          details: "0% ATTEMPT 1/3"
        };
      }
      return job;
    }));

    // Simulate completion after 2 seconds
    setTimeout(() => {
      setJobs(prev => prev.map(job => {
        if (job.id === "job_02") {
          return {
            ...job,
            status: "COMPLETE",
            details: "22.8s COMPILED"
          };
        }
        return job;
      }));
      addLog("Task [job_02] retry succeeded.");
    }, 2000);
  };

  const handlePruneFailed = () => {
    const failedCount = jobs.filter(j => j.status === "FAILED").length;
    if (failedCount === 0) {
      addLog("No failed tasks to prune.");
      return;
    }
    setJobs(prev => prev.filter(job => job.status !== "FAILED"));
    addLog(`Pruned ${failedCount} failed task(s) from the queue.`);
  };

  const handleClearSucceeded = () => {
    const succeededCount = jobs.filter(j => j.status === "COMPLETE").length;
    if (succeededCount === 0) {
      addLog("No completed tasks to clear.");
      return;
    }
    setJobs(prev => prev.filter(job => job.status !== "COMPLETE"));
    addLog(`Cleared ${succeededCount} completed task(s) from the queue.`);
  };

  // Calculate statistics
  const activeCount = jobs.filter(j => j.status === "RUNNING" || j.status === "PENDING").length;
  const succeededCount = jobs.filter(j => j.status === "COMPLETE").length;
  const failedCount = jobs.filter(j => j.status === "FAILED").length;

  return (
    <div className="task-ledger-queue">
      {/* Title Block */}
      <div className="queue-title-block">
        <div className="queue-title-left">
          <List className="queue-title-icon" size={16} />
          <div className="queue-title-text-group">
            <h3 className="queue-main-header">TASK LEDGER QUEUE</h3>
            <span className="queue-subheader">FLOW COMPANION 24.13.37</span>
          </div>
        </div>
        <div className="queue-live-badge">
          <span className="queue-live-dot"></span>
          <span>LIVE</span>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="queue-metrics-dashboard">
        {/* Card 1: Statistics Grid */}
        <div className="queue-metric-card stats-card">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">ACTIVE</span>
              <span className="stat-value">{activeCount} tasks</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">AVG TIME</span>
              <span className="stat-value">18.4s</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">SUCCEEDED</span>
              <span className="stat-value success-text">{succeededCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">FAILED</span>
              <span className="stat-value error-text">{failedCount}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Pause/Resume Action Card */}
        <button 
          onClick={handlePauseToggle}
          className={`queue-metric-card action-card ${isPaused ? "paused" : "active"}`}
        >
          {isPaused ? <Play size={14} className="action-icon" /> : <Pause size={14} className="action-icon" />}
          <span className="action-label">{isPaused ? "RESUME" : "PAUSE QUEUE"}</span>
        </button>
      </div>

      {/* Queue Operations Bar */}
      <div className="queue-operations-bar">
        <span className="operations-title">QUEUE OPERATIONS</span>
        <div className="operations-actions">
          <button onClick={handleRetryFailed} className="operation-btn">
            <RotateCcw size={12} />
            <span>Retry Failed</span>
          </button>
          <button onClick={handlePruneFailed} className="operation-btn">
            <Trash2 size={12} />
            <span>Prune Failed</span>
          </button>
          <button onClick={handleClearSucceeded} className="operation-btn">
            <Trash2 size={12} />
            <span>Clear Succeeded</span>
          </button>
        </div>
      </div>

      {/* Active Jobs List */}
      <div className="queue-jobs-list">
        {jobs.length === 0 ? (
          <div className="no-jobs">No jobs in queue</div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className={`job-card-mockup ${job.status.toLowerCase()}`}>
              <div className="job-card-content">
                <div className="job-left">
                  <div className={`status-icon-wrap ${job.status.toLowerCase()}`}>
                    {job.status === "COMPLETE" && <Check size={12} />}
                    {job.status === "FAILED" && <AlertTriangle size={12} />}
                    {job.status === "RUNNING" && <span className="running-spinner"></span>}
                  </div>
                  <div className="job-details">
                    <div className="job-header">
                      <span className={`job-status-badge ${job.status.toLowerCase()}`}>{job.status}</span>
                      <span className="job-type">({job.type})</span>
                    </div>
                    <p className="job-prompt">{job.prompt}</p>
                  </div>
                </div>
                <div className="job-right">
                  <span className="job-status-time">{job.details}</span>
                </div>
              </div>
              <div className={`job-accent-bar ${job.status.toLowerCase()}`} />
            </div>
          ))
        )}
      </div>

      {/* Log Console */}
      <div className="queue-log-console">
        <div className="console-lines">
          {logs.map((log, index) => (
            <div key={index} className="console-line">{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
