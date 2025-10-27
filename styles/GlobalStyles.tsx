import React from 'react';

const GlobalStyles = () => {
  const css = `
    :root {
      --glow-purple: #A855F7;
      --glow-pink: #EC4899;
      --glow-blue: #3B82F6;
      --deep-purple: #7C3AED;
      --soft-pink: #FBCFE8;
      --dark-grey: #1F2937;
      
      --primary-color: var(--glow-purple);
      --primary-hover: var(--deep-purple);
      --xp-color: var(--glow-pink);
      
      --background-color: #f9fafb;
      --card-background: #ffffff;
      --text-color: var(--dark-grey);
      --subtle-text: #6b7280;
      --border-color: #e5e7eb;
      --correct-color: #10B981;
      --incorrect-color: #EF4444;

      --font-headline: 'Poppins', sans-serif;
      --font-body: 'Inter', sans-serif;
      --font-accent: 'Space Grotesk', monospace;
      
      --shadow: 0 8px 32px 0 rgba(168, 85, 247, 0.1);
      --card-border-radius: 20px;
      --gradient: linear-gradient(135deg, var(--glow-purple) 0%, var(--glow-pink) 50%, var(--glow-blue) 100%);
    }

    body[data-theme="dark"] {
      --primary-color: #c084fc;
      --primary-hover: var(--glow-purple);
      --xp-color: var(--glow-pink);

      --background-color: #111827;
      --card-background: var(--dark-grey);
      --text-color: #f9fafb;
      --subtle-text: #9ca3af;
      --border-color: #374151;
      
      --shadow: 0 8px 32px 0 rgba(168, 85, 247, 0.2);
    }

    body {
      margin: 0;
      font-family: var(--font-body);
      background-color: var(--background-color);
      color: var(--text-color);
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      box-sizing: border-box;
      position: relative;
      overflow-x: hidden;
      padding: max(32px, env(safe-area-inset-top)) max(32px, env(safe-area-inset-right)) max(32px, env(safe-area-inset-bottom)) max(32px, env(safe-area-inset-left));
      transition: background-color 0.3s ease;
    }

    .focus-mode {
      background-color: var(--background-color);
    }
    .focus-mode #root {
      max-width: 680px; /* Optimal reading width */
    }

    #root {
      width: 100%;
      max-width: 1080px;
      transition: max-width 0.3s ease;
    }

    .card {
      background-color: var(--card-background);
      border-radius: var(--card-border-radius);
      padding: 32px;
      box-shadow: var(--shadow);
      border: 1px solid var(--border-color);
      animation: fadeIn 0.5s ease-in-out;
      transition: background-color 0.3s ease, border-color 0.3s ease;
      position: relative;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .spinner {
      width: 48px;
      height: 48px;
      border: 5px solid var(--border-color);
      border-top: 5px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--gradient);
      color: white;
      font-size: 16px;
      font-weight: 600;
      border: none;
      border-radius: 12px;
      padding: 14px 24px;
      cursor: pointer;
      text-decoration: none;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      width: 100%;
      box-sizing: border-box;
      text-align: center;
      min-height: 48px;
      background-size: 100% 100%;
    }
    
    .button:disabled {
        background: var(--subtle-text);
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
        opacity: 0.7;
    }

    .button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    .button-secondary {
        background: transparent;
        color: var(--primary-color);
        border: 1px solid var(--border-color);
    }
    .button-secondary:hover:not(:disabled) {
        background: var(--primary-color);
        color: var(--card-background);
        border-color: var(--primary-color);
    }
    
     .button-tertiary {
        background: none;
        border: none;
        color: var(--primary-color);
        font-weight: 500;
        cursor: pointer;
        padding: 8px;
        border-radius: 6px;
        font-size: 15px;
    }
    .button-tertiary:hover {
        background-color: var(--border-color);
    }
    
    .button-spinner {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top: 3px solid white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    h1, h2, h3 {
      margin-top: 0;
      font-family: var(--font-headline);
      font-weight: 700;
      color: var(--text-color);
    }
    h1 { font-size: 2rem; font-weight: 800; }
    h2 { font-size: 1.5rem; }
    p { line-height: 1.6; }

    /* Dashboard Redesign */
    .dashboard-container {
      padding: 0;
    }
    .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-wrap: wrap;
        gap: 16px;
        margin-bottom: 24px;
    }
    .dashboard-subtitle {
        color: var(--subtle-text);
        margin: 4px 0 0 0;
        font-size: 1.1rem;
    }
    .header-controls { display: flex; align-items: center; gap: 16px; }
    
    .theme-toggle {
        background: none;
        border: 1px solid var(--border-color);
        color: var(--subtle-text);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s, color 0.2s;
    }
    .theme-toggle:hover {
        background-color: var(--border-color);
        color: var(--text-color);
    }
    
    .subject-switcher {
      display: flex;
      background-color: var(--background-color);
      border-radius: 12px;
      padding: 6px;
      margin: 0 0 24px 0;
      border: 1px solid var(--border-color);
      flex-wrap: wrap;
    }
    .subject-switcher button {
      flex: 1;
      padding: 10px;
      border: none;
      background: transparent;
      border-radius: 8px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 600;
      color: var(--subtle-text);
      transition: background-color 0.3s ease, color 0.3s ease;
      min-width: 120px;
    }
    .subject-switcher button.active {
      background-color: var(--card-background);
      color: var(--primary-color);
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .dashboard-tabs {
      display: flex;
      background-color: var(--background-color);
      border-radius: 12px;
      padding: 6px;
      margin: 0 0 24px 0;
      border: 1px solid var(--border-color);
    }
    .dashboard-tabs button {
      flex: 1;
      padding: 12px;
      border: none;
      background: transparent;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      color: var(--subtle-text);
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    .dashboard-tabs button.active {
      background-color: var(--card-background);
      color: var(--primary-color);
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    
    .dashboard-tab-content {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
    
    .dashboard-hero {
        text-align: center;
        padding: 40px 32px;
    }
    .dashboard-hero h2 { font-size: 1.8rem; }
    .dashboard-hero p { max-width: 450px; margin: 8px auto 24px auto; color: var(--subtle-text); }
    .dashboard-hero .button { max-width: 300px; margin: 0 auto; }

    .upgrade-card {
      background: var(--gradient);
      color: #fff;
    }
    .upgrade-card h3 { color: #fff; }
    .upgrade-card p { color: rgba(255,255,255,0.8); }
    .upgrade-card .button {
      background-color: #fff;
      color: var(--primary-color);
      font-weight: 700;
    }

    .daily-limit-tracker {
      margin-bottom: 16px;
      font-size: 14px;
      color: var(--subtle-text);
      max-width: 300px; margin-left: auto; margin-right: auto;
    }
    .daily-limit-tracker span {
      display: block;
      margin-bottom: 6px;
      text-align: left;
    }

    .study-streak {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        font-size: 16px;
        color: var(--xp-color);
        background-color: var(--background-color);
        padding: 8px 12px;
        border-radius: 20px;
        border: 1px solid var(--border-color);
    }

    .skill-progress, .level-progress { margin-bottom: 16px; }
    .progress-bar { width: 100%; height: 12px; background-color: var(--background-color); border-radius: 6px; overflow: hidden; margin-top: 8px; }
    .progress-fill { height: 100%; border-radius: 6px; transition: width 0.5s ease; }
    .skill-progress-fill { background-color: var(--primary-color); }
    .xp-progress-fill { background-color: var(--xp-color); }
    
    .passage {
        background-color: var(--background-color);
        border-left: 4px solid var(--primary-color);
        padding: 16px;
        margin: 24px 0;
        border-radius: 4px;
        line-height: 1.6;
        font-style: italic;
    }
    
    .question-timer {
      position: absolute;
      top: 24px;
      right: 32px;
      background-color: var(--background-color);
      color: var(--text-color);
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 14px;
      border: 1px solid var(--border-color);
      transition: color 0.3s, background-color 0.3s;
    }

    .question-timer.low-time {
      color: var(--incorrect-color);
      background-color: rgba(239, 68, 68, 0.1);
    }

    .question-text {
        font-size: 1.2rem;
        line-height: 1.6;
        margin-bottom: 24px;
        padding-right: 40px; /* Space for speech button */
    }
    
    textarea, .date-input, .chat-input {
        width: 100%;
        border: 1px solid var(--border-color);
        background-color: var(--background-color);
        border-radius: 8px;
        padding: 12px;
        font-size: 16px;
        font-family: var(--font-body);
        box-sizing: border-box;
        color: var(--text-color);
        transition: border-color 0.2s, background-color 0.2s;
    }
    textarea:focus, .date-input:focus, .chat-input:focus {
      border-color: var(--primary-color);
      outline: none;
    }
    textarea { min-height: 120px; resize: vertical; margin-bottom: 16px; }
    
    .mcq-options { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
    .mcq-label { display: block; padding: 16px; border: 1px solid var(--border-color); border-radius: 12px; cursor: pointer; transition: background-color 0.2s ease, border-color 0.2s ease; }
    .mcq-label:hover { border-color: var(--primary-color); }
    .mcq-input:checked + .mcq-label { background-color: var(--primary-color); color: white; border-color: var(--primary-color); }
    .mcq-input { display: none; }
    
    .hint-box { background-color: var(--background-color); border-left: 4px solid var(--correct-color); padding: 12px; margin-top: 16px; border-radius: 4px; font-size: 14px; }
    
    .feedback-correct { color: var(--correct-color); }
    .feedback-incorrect { color: var(--incorrect-color); }
    
    .correct-model, .review-section { margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--border-color); }
    .correct-model h3, .review-section h3 { font-size: 16px; color: var(--subtle-text); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .ai-feedback, .proactive-help-box { background-color: var(--background-color); border: 1px solid var(--border-color); padding: 16px; margin-top: 24px; border-radius: 8px; }
    .mindset-tip { margin-top: 24px; background-color: var(--background-color); border: 1px solid var(--border-color); padding: 16px; border-radius: 8px; }
    
    .feedback-tools-section { margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border-color); }
    .feedback-tools-title { font-size: 16px; text-align: center; color: var(--subtle-text); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; }

    .feature-list { list-style: none; padding: 0; margin: 32px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .feature-item { display: flex; align-items: flex-start; gap: 16px; }
    .feature-icon { width: 40px; height: 40px; flex-shrink: 0; background-color: var(--background-color); border-radius: 12px; display: flex; justify-content: center; align-items: center; color: var(--primary-color); font-weight: 700; border: 1px solid var(--border-color); }
    .welcome-subtitle { color: var(--subtle-text); font-size: 1.1rem; line-height: 1.6; max-width: 550px; margin: 16px auto 32px auto; }
    
    .welcome-logo-container {
      width: clamp(200px, 40vw, 250px);
      margin: 0 auto 16px auto;
    }

    .dashboard-logo-container {
      width: clamp(160px, 30vw, 200px);
      position: relative;
    }

    .premium-badge {
      position: absolute;
      top: -4px;
      right: -32px;
      background: var(--gradient);
      color: white;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .planner-week { border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 16px; }
    .planner-week:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    .planner-task, .info-task { display: flex; align-items: center; gap: 12px; padding: 8px 0; }
    .planner-task input[type="checkbox"] { width: 18px; height: 18px; accent-color: var(--primary-color); }
    .planner-task label { flex-grow: 1; cursor: pointer; }
    .planner-task input:checked + label { text-decoration: line-through; color: var(--subtle-text); }
    
    .info-task {
        cursor: pointer;
        font-weight: 500;
        padding: 8px;
        border-radius: 8px;
        transition: background-color 0.2s;
    }
    .info-task:hover {
        background-color: var(--border-color);
    }
    .info-task svg {
        flex-shrink: 0;
        color: var(--primary-color);
    }
    .aira-footer { text-align: center; margin-top: 32px; font-size: 14px; color: var(--subtle-text); }
    .aira-footer a { color: var(--primary-color); text-decoration: none; font-weight: 500; }
    .aira-footer a:hover { text-decoration: underline; }
    
    .user-answer { background-color: var(--background-color); border-left: 4px solid var(--incorrect-color); padding: 16px; margin: 8px 0; border-radius: 4px; }
    
    .readable-content { position: relative; }
    .speech-button { background: none; border: none; cursor: pointer; color: var(--subtle-text); position: absolute; right: 0; top: 0; padding: 4px; transition: color 0.2s; }
    .speech-button:hover, .speech-button.active { color: var(--primary-color); }
    .speech-button:disabled { cursor: not-allowed; opacity: 0.5; }

    .passage .speech-button { right: 16px; top: 16px; }
    
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; animation: fadeIn 0.3s; }
    .modal-content { max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto; }
    
    .chat-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: flex-end; z-index: 1000; padding: 16px; animation: fadeIn 0.3s; }
    .chat-modal-content { width: 100%; max-width: 600px; height: 70vh; display: flex; flex-direction: column; }
    .chat-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 16px; }
    .chat-close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: var(--subtle-text); }
    .chat-history { flex-grow: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
    .chat-message { padding: 10px 14px; border-radius: 18px; max-width: 80%; }
    .chat-message.model { background-color: var(--border-color); align-self: flex-start; }
    .chat-message.user { background: var(--gradient); color: white; align-self: flex-end; }
    .chat-message.system { text-align: center; font-size: 13px; color: var(--subtle-text); background-color: transparent; align-self: center; }
    .chat-form { display: flex; gap: 12px; margin-top: 16px; border-top: 1px solid var(--border-color); padding-top: 16px; }
    
    .payment-modal-content { max-width: 400px; text-align: center; }
    .payment-success-view { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px; }
    .success-checkmark svg { width: 80px; height: 80px; border-radius: 50%; display: block; stroke-width: 2; stroke: #fff; stroke-miterlimit: 10; box-shadow: inset 0px 0px 0px var(--correct-color); animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both; }
    .success-checkmark circle { stroke-dasharray: 166; stroke-dashoffset: 166; stroke-width: 2; stroke-miterlimit: 10; stroke: var(--correct-color); fill: none; animation: stroke .6s cubic-bezier(0.65, 0, 0.45, 1) forwards; }
    .success-checkmark path { transform-origin: 50% 50%; stroke-dasharray: 48; stroke-dashoffset: 48; animation: stroke .3s cubic-bezier(0.65, 0, 0.45, 1) .8s forwards; }
    @keyframes stroke { 100% { stroke-dashoffset: 0; } }
    @keyframes scale { 0%, 100% { transform: none; } 50% { transform: scale3d(1.1, 1.1, 1); } }
    @keyframes fill { 100% { box-shadow: inset 0px 0px 0px 40px var(--correct-color); } }

    .affirmation-box { min-height: 60px; background: var(--background-color); border-radius: 8px; padding: 16px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; text-align: center; font-style: italic; color: var(--subtle-text); }
    .affirmation-section, .focus-sounds-section { margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--border-color); text-align: center; }
    .focus-sounds-section h3, .affirmation-section h3 { font-size: 16px; color: var(--subtle-text); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; }
    .sound-buttons { display: flex; justify-content: center; gap: 12px; }
    .sound-buttons .button-tertiary.active { background-color: var(--primary-color); color: white; }

    .breathing-container { position: relative; width: 150px; height: 150px; margin: 32px auto; display: flex; align-items: center; justify-content: center; }
    .breathing-circle { width: 100%; height: 100%; background-color: var(--primary-color); border-radius: 50%; opacity: 0.3; transform: scale(0.6); }
    .breathing-text { position: absolute; color: var(--text-color); font-weight: 500; }

    @keyframes breath-inhale { 0% { transform: scale(0.6); } 100% { transform: scale(1); } }
    @keyframes breath-hold { 0%, 100% { transform: scale(1); } }
    @keyframes breath-exhale { 0% { transform: scale(1); } 100% { transform: scale(0.6); } }

    .concept-explanation-content, .review-content { min-height: 150px; margin-top: 16px; }
    .button-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
    .button-grid-vertical { display: flex; flex-direction: column; gap: 12px; }
    
    .badges-container {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        justify-content: center;
        margin-top: 16px;
    }
    .badge {
        position: relative;
        cursor: help;
    }
    .badge-icon {
        font-size: 40px;
        width: 64px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background-color: var(--background-color);
        border: 2px solid var(--border-color);
        transition: transform 0.2s ease, filter 0.3s ease;
    }
    .badge:not(.earned) .badge-icon {
        filter: grayscale(100%);
        opacity: 0.5;
    }
    .badge.earned .badge-icon {
        border-color: var(--xp-color);
    }
    .badge:hover .badge-icon {
        transform: scale(1.1);
    }

    @media (max-width: 768px) {
      body { padding: 16px; }
      .feature-list { grid-template-columns: 1fr; }
    }
    
    @media (max-width: 600px) {
        .subject-switcher {
            flex-direction: column;
        }
    }
  `;
  return <style>{css}</style>;
};

export default GlobalStyles;