import React, { useState, useRef, useEffect } from "react";
import { profile } from "../config/profile";

export default function Terminal() {
  const [history, setHistory] = useState([
    {
      type: "system",
      content: "Adwaith OS v2.4.0 (x86_64-portfolio-darwin)\nType 'help' to view available commands, or click any quick chip below."
    },
    {
      type: "command",
      cmd: "whoami"
    },
    {
      type: "output",
      content: `${profile.name} — ${profile.role}\n📍 Location: ${profile.location} | ⚡ Status: ${profile.status}`
    }
  ]);

  const [inputVal, setInputVal] = useState("");
  const [cmdHistory, setCmdHistory] = useState(["whoami"]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (rawCmd) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    const cmd = trimmed.toLowerCase();
    const newEntry = { type: "command", cmd: trimmed };
    setCmdHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);

    let outputEntry = null;

    switch (cmd) {
      case "help":
        outputEntry = {
          type: "output",
          content: `AVAILABLE COMMANDS:
  • whoami     - Display developer identity and current status
  • about      - Read personal bio, background & focus
  • projects   - List featured projects and jump to showcase
  • skills     - View tech stack & specialized frameworks
  • contact    - Get in touch or jump to message form
  • github     - Open Adwaith's GitHub profile in new tab
  • resume     - View career overview & resume download
  • date       - Display current system timestamp
  • clear      - Clear terminal screen
  • sudo       - Request administrator privileges`
        };
        break;

      case "whoami":
        outputEntry = {
          type: "output",
          content: `👤 ${profile.name}
💼 ${profile.role}
📍 ${profile.location}
🟢 ${profile.status}
📧 ${profile.email}`
        };
        break;

      case "about":
        outputEntry = {
          type: "output",
          content: profile.bio.join("\n\n")
        };
        break;

      case "projects":
        outputEntry = {
          type: "output",
          content: `🚀 FEATURED PROJECTS:\n` +
            profile.projects.map((p, i) => `[${i + 1}] ${p.title} (${p.category})\n    ${p.description}\n    Tags: ${p.tags.join(", ")}`).join("\n\n") +
            `\n\n⬇ Navigating to Projects section...`
        };
        setTimeout(() => {
          document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
        }, 800);
        break;

      case "skills":
        outputEntry = {
          type: "output",
          content: `⚡ TECHNICAL SKILLS MATRIX:\n` +
            profile.skills.map((s, i) => `[0${i + 1}] ${s.name} (${s.category}) — ${s.level} [${s.percentage}%]\n    Tags: ${s.tags.join(" • ")}\n    ${s.description}`).join("\n\n") +
            `\n\n⬇ Navigating to Skills showcase...`
        };
        setTimeout(() => {
          document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
        }, 800);
        break;

      case "contact":
        outputEntry = {
          type: "output",
          content: `📬 CONTACT INFO:\nEmail: ${profile.email}\nGitHub: ${profile.github}\n\n⬇ Navigating to Contact form...`
        };
        setTimeout(() => {
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        }, 800);
        break;

      case "github":
        outputEntry = {
          type: "output",
          content: `🔗 Opening GitHub: ${profile.github} in a new tab...`
        };
        window.open(profile.github, "_blank", "noreferrer");
        break;

      case "resume":
        outputEntry = {
          type: "output",
          content: `📄 Resume: ${profile.name} — Full Stack Developer\nHighlights: 2+ Years Exp • 15+ Projects • React, Node, Python, Cloud\nContact: ${profile.email}`
        };
        break;

      case "date":
        outputEntry = {
          type: "output",
          content: new Date().toString()
        };
        break;

      case "sudo":
        outputEntry = {
          type: "error",
          content: `⚠️ Permission denied: guest is not in the sudoers file. This incident has been logged.`
        };
        break;

      case "clear":
        setHistory([]);
        setInputVal("");
        return;

      default:
        outputEntry = {
          type: "error",
          content: `zsh: command not found: ${trimmed}. Type 'help' for a list of available commands.`
        };
        break;
    }

    setHistory((prev) => [...prev, newEntry, outputEntry]);
    setInputVal("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCommand(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInputVal(cmdHistory[nextIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= cmdHistory.length) {
        setHistoryIdx(-1);
        setInputVal("");
      } else {
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      }
    }
  };

  const quickPills = ["whoami", "help", "projects", "skills", "contact", "clear"];

  return (
    <section className="terminal-section section" id="terminal">
      <div className="section-number">02 / INTERACTIVE TERMINAL</div>
      <div className="terminal-heading">
        <span>DEV</span>
        <span className="orange-text">SHELL.</span>
      </div>

      <div className="terminal-container">
        <div className="terminal-window" onClick={() => inputRef.current?.focus()}>
          <div className="terminal-topbar">
            <div className="terminal-dots">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <div className="terminal-title">adwaith@portfolio: ~ (zsh)</div>
            <div className="terminal-actions">
              <span className="term-badge">ACTIVE</span>
            </div>
          </div>

          <div className="terminal-body">
            {history.map((item, idx) => {
              if (item.type === "system") {
                return (
                  <div key={idx} className="term-line term-system">
                    <pre>{item.content}</pre>
                  </div>
                );
              }
              if (item.type === "command") {
                return (
                  <div key={idx} className="term-line term-cmd-line">
                    <span className="term-prompt">adwaith@portfolio ~ $</span>
                    <span className="term-cmd-text">{item.cmd}</span>
                  </div>
                );
              }
              if (item.type === "error") {
                return (
                  <div key={idx} className="term-line term-error">
                    <pre>{item.content}</pre>
                  </div>
                );
              }
              return (
                <div key={idx} className="term-line term-output">
                  <pre>{item.content}</pre>
                </div>
              );
            })}

            <div className="term-line term-input-line">
              <span className="term-prompt">adwaith@portfolio ~ $</span>
              <input
                ref={inputRef}
                type="text"
                className="term-input"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="type a command (e.g. help)..."
                autoComplete="off"
                spellCheck="false"
              />
              <span className="term-cursor"></span>
            </div>
            <div ref={terminalEndRef} />
          </div>

          <div className="terminal-footer">
            <span className="quick-label">QUICK ACTIONS:</span>
            <div className="quick-chips">
              {quickPills.map((p) => (
                <button
                  key={p}
                  type="button"
                  className="quick-chip magnetic"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCommand(p);
                  }}
                >
                  ${p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
