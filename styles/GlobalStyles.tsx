
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
      --medium-time-color: #F59E0B;

      --font-headline: 'Poppins', sans-serif;
      --font-body: 'Inter', sans-serif;
      --font-accent: 'Space Grotesk', monospace;
      
      --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
      --card-border-radius: 20px;
      --gradient: linear-gradient(135deg, var(--glow-purple) 0%, var(--glow-pink) 50%, var(--glow-blue) 100%);
    }

    body[data-theme="dark"] {
      --primary-color: #c084fc;
      --primary-hover: var(--glow-purple);
      --xp-color: var(--glow-pink);

      --background-color: #1e293b;
      --card-background: #334155;
      --text-color: #f9fafb;
      --subtle-text: #9ca3af;
      --border-color: #374151;
      
      --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    }

    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-body);
      background-color: var(--background-color);
      color: var(--text-color);
      box-sizing: border-box;
      position: relative;
      overflow-x: hidden;
      transition: background-color 0.3s ease;
      background-image: radial-gradient(circle at top left, hsla(263, 89%, 69%, 0.1), transparent 40%),
                        radial-gradient(circle at bottom right, hsla(332, 79%, 60%, 0.1), transparent 50%);
      background-attachment: fixed;
    }
    
    body[data-theme="dark"] {
        background-image: radial-gradient(circle at top left, hsla(263, 89%, 69%, 0.15), transparent 40%),
                            radial-gradient(circle at bottom right, hsla(332, 79%, 60%, 0.15), transparent 50%);
    }
    
    #root {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .app-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;
      padding: max(32px, env(safe-area-inset-top)) max(32px, env(safe-area-inset-right)) max(32px, env(safe-area-inset-bottom)) max(32px, env(safe-area-inset-left));
      box-sizing: border-box;
      isolation: isolate;
    }

    @keyframes pulse-bg {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .app-wrapper.focus-mode {
      max-width: 720px;
    }

    :fullscreen .app-wrapper.focus-mode {
        max-width: 800px;
        justify-content: center;
    }
    ::backdrop {
      background-color: var(--background-color);
    }

    .app-wrapper.focus-mode::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, hsla(263, 89%, 69%, 0.05), hsla(332, 79%, 60%, 0.05), hsla(217, 91%, 60%, 0.05));
        background-size: 400% 400%;
        animation: pulse-bg 15s ease infinite;
        z-index: -1;
    }


    .card {
      background-color: var(--card-background);
      border-radius: var(--card-border-radius);
      padding: 32px;
      box-shadow: var(--shadow);
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
    
    .button .pro-badge {
        display: inline-block;
        background: var(--xp-color);
        color: white;
        font-size: 10px;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 20px;
        margin-left: 8px;
        text-transform: uppercase;
        vertical-align: middle;
        line-height: 1;
        transition: opacity 0.2s;
    }
    .button:disabled .pro-badge {
        opacity: 0.7;
    }

    h1, h2, h3 {
      margin-top: 0;
      font-family: var(--font-headline);
      font-weight: 700;
      color: var(--text-color);
    }
    h1 { font-size: 2rem; font-weight: 800; margin-bottom: 12px; }
    h2 { font-size: 1.5rem; }
    p { line-height: 1.6; }
    
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }

    /* Dashboard Redesign */
    .dashboard-container {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      min-height: 0;
      position: relative;
    }

    .app-header {
      background-color: rgba(255, 255, 255, 0.95);
      border-radius: var(--card-border-radius);
      padding: 12px 32px;
      margin-bottom: 32px;
      box-shadow: var(--shadow);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 1px solid var(--border-color);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    body[data-theme="dark"] .app-header {
        background-color: rgba(51, 65, 85, 0.95);
    }
    
    .header-left { flex-shrink: 0; }
    
    .header-center-nav {
        display: flex;
        justify-content: center;
        flex-grow: 1;
        gap: 8px;
    }

    .header-center-nav button {
        background: none;
        border: none;
        padding: 10px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 15px;
        font-weight: 600;
        color: var(--subtle-text);
        transition: background-color 0.3s ease, color 0.3s ease;
        white-space: nowrap;
        position: relative;
    }
    .header-center-nav button:hover {
        color: var(--text-color);
        background-color: var(--background-color);
    }
    .header-center-nav button.active {
        color: var(--primary-color);
    }
    .header-center-nav button.active::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 16px;
        right: 16px;
        height: 3px;
        background-color: var(--primary-color);
        border-radius: 3px;
    }

    .header-right { 
        display: flex; 
        align-items: center; 
        gap: 16px; 
        flex-shrink: 0;
    }
    
    .subject-picker-container {
        position: relative;
    }
    .subject-picker-trigger {
        display: flex;
        align-items: center;
        gap: 8px;
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 8px 12px;
        font-size: 14px;
        font-weight: 600;
        color: var(--text-color);
        cursor: pointer;
        transition: border-color 0.2s, background-color 0.2s;
        min-width: 180px;
    }
    .subject-picker-trigger:hover {
        border-color: var(--primary-color);
    }
    .subject-picker-trigger span:first-of-type {
        flex-grow: 1;
        text-align: left;
    }
    .subject-picker-icon {
        font-size: 16px;
    }
    .subject-picker-trigger svg {
        color: var(--subtle-text);
        transition: transform 0.2s;
    }
    .subject-picker-trigger[aria-expanded="true"] svg {
        transform: rotate(180deg);
    }
    .subject-picker-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        width: 280px;
        background-color: var(--card-background);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        z-index: 200;
        padding: 8px;
        max-height: 300px;
        overflow-y: auto;
    }
    .subject-picker-item {
        display: flex;
        align-items: center;
        width: 100%;
        text-align: left;
        padding: 10px 12px;
        background: none;
        border: none;
        border-radius: 6px;
        font-size: 15px;
        font-weight: 500;
        color: var(--text-color);
        cursor: pointer;
        gap: 12px;
    }
    .subject-picker-item:hover {
        background-color: var(--background-color);
    }
    .subject-picker-item.active {
        font-weight: 600;
        color: var(--primary-color);
    }
    .checkmark-icon {
        margin-left: auto;
    }

    .auth-button {
      font-size: 14px;
      padding: 8px 12px;
      border: 1px solid var(--border-color);
      white-space: nowrap;
    }
    .auth-button:hover {
        background-color: var(--border-color);
    }

    .dashboard-subtitle {
        color: var(--subtle-text);
        margin: 4px 0 0 0;
        font-size: 1.1rem;
    }
    
    .theme-toggle {
        background: none;
        border: 1px solid var(--border-color);
        color: var(--subtle-text);
        width: 38px;
        height: 38px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s, color 0.2s;
        flex-shrink: 0;
    }
    .theme-toggle:hover {
        background-color: var(--border-color);
        color: var(--text-color);
    }
    
    .header-xp-progress {
        width: 120px;
    }
    .header-xp-info {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        font-weight: 600;
        color: var(--subtle-text);
        margin-bottom: 4px;
        padding: 0 2px;
    }

    .dashboard-content-area {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    .dashboard-content-area > * {
      width: 100%;
    }

    .dashboard-main-column {
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 720px;
      margin: 0 auto;
      width: 100%;
    }
    
    .dashboard-hero {
        text-align: center;
        padding: 40px 32px;
    }
    .dashboard-hero h2 { font-size: 1.8rem; }
    .dashboard-hero p { max-width: 450px; margin: 8px auto 24px auto; }
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
    
    .loading-message {
      margin-top: 16px;
      color: var(--subtle-text);
      font-style: italic;
      min-height: 24px;
      font-size: 15px;
    }

    .study-streak {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        font-size: 15px;
        color: var(--xp-color);
        background-color: var(--background-color);
        padding: 8px 12px;
        border-radius: 20px;
        border: 1px solid var(--border-color);
        flex-shrink: 0;
    }

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

    .question-timer.medium-time {
      color: var(--medium-time-color);
      background-color: rgba(245, 158, 11, 0.1);
    }

    .question-timer.low-time {
      color: var(--incorrect-color);
      background-color: rgba(239, 68, 68, 0.1);
    }

    .question-text {
        font-size: 1.2rem;
        line-height: 1.6;
        margin-bottom: 24px;
        padding-right: 40px;
        flex-grow: 1;
    }
    
    textarea, .date-input, .chat-input, .text-input {
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
    textarea:focus, .date-input:focus, .chat-input:focus, .text-input:focus {
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

    .feedback-deep-dive-tools {
        display: flex;
        gap: 12px;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--border-color);
    }
    .feedback-deep-dive-tools .button-tertiary {
        flex: 1;
    }
    .simplified-explanation, .analogy-explanation {
        margin-top: 16px;
        padding: 16px;
        background-color: var(--background-color);
        border-radius: 8px;
        border-left: 4px solid var(--xp-color);
    }
    .simplified-explanation h3, .analogy-explanation h3 {
        color: var(--xp-color);
        font-size: 16px;
        margin-bottom: 8px;
    }

    .welcome-logo-container {
      max-width: 280px; 
      margin: 0 auto 24px auto;
      display: flex;
      justify-content: center;
    }

    .welcome-subtitle {
      color: var(--subtle-text);
      max-width: 500px;
      margin: 12px auto 32px auto;
    }

    .feature-list {
      list-style: none;
      padding-left: 0;
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
      margin: 32px 0;
      text-align: left;
    }

    @media (min-width: 550px) {
      .feature-list {
        grid-template-columns: 1fr 1fr;
      }
    }

    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }

    .feature-icon {
      background-color: var(--background-color);
      color: var(--primary-color);
      border-radius: 50%;
      width: 32px;
      height: 32px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
      border: 1px solid var(--border-color);
    }

    .feature-item h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .feature-item p {
      margin: 0;
      color: var(--subtle-text);
      font-size: 14px;
    }
    
    .welcome-footer-text {
      text-align: center; 
      margin-top: 24px; 
      font-size: 13px; 
      color: var(--subtle-text);
    }

    @media (max-width: 1200px) {
        .app-header {
            justify-content: space-around;
        }
        .header-center-nav {
            order: 1;
            flex-basis: 100%;
            justify-content: flex-start;
            overflow-x: auto;
        }
    }
    
    @media (max-width: 768px) {
      .app-wrapper {
          padding: max(24px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(24px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
      }
      .app-header {
          padding: 12px 16px;
          gap: 12px;
      }
      .header-center-nav button { font-size: 14px; padding: 8px 10px; }
      .header-right { gap: 8px; }
      .subject-picker-trigger { min-width: 150px; }
       .header-xp-progress { width: 100px; }
      .card {
        padding: 24px;
      }
      h1 { font-size: 1.8rem; }
      h2 { font-size: 1.3rem; }
    }
    
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(15, 23, 42, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
      animation: fadeIn 0.3s ease;
    }

    .modal-content {
      max-width: 500px;
      width: calc(100% - 32px);
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }
    .chat-close-btn {
        background: none;
        border: none;
        font-size: 28px;
        cursor: pointer;
        color: var(--subtle-text);
        padding: 0;
        line-height: 1;
    }

    .chat-modal-overlay { 
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(15, 23, 42, 0.6);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
      animation: fadeIn 0.3s ease;
      padding: 16px;
    }
    .chat-modal-content {
      width: 100%;
      max-width: 600px;
      height: 70vh;
      max-height: 700px;
      display: flex;
      flex-direction: column;
    }
    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-color);
    }
    .chat-history {
      flex-grow: 1;
      overflow-y: auto;
      padding: 16px 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .chat-message {
      padding: 10px 14px;
      border-radius: 16px;
      max-width: 80%;
      line-height: 1.5;
    }
    .chat-message.model {
      background-color: var(--background-color);
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .chat-message.user {
      background-color: var(--primary-color);
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .chat-message.system {
        text-align: center;
        font-size: 13px;
        color: var(--subtle-text);
        padding: 4px;
        background: none;
        max-width: 100%;
    }
    .chat-form {
      display: flex;
      gap: 10px;
      padding-top: 16px;
      border-top: 1px solid var(--border-color);
    }
    .typing-cursor {
      display: inline-block;
      width: 8px;
      height: 16px;
      background-color: var(--text-color);
      animation: blink 1s step-end infinite;
      margin-left: 4px;
      vertical-align: text-bottom;
    }
    @keyframes blink {
      from, to { background-color: transparent; }
      50% { background-color: var(--text-color); }
    }

    .payment-modal-content { max-width: 400px; }
    .payment-success-view { text-align: center; }
    .payment-disclaimer {
      font-size: 12px;
      color: var(--subtle-text);
      text-align: center;
    }
    .success-checkmark {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: block;
      stroke-width: 3;
      stroke: var(--correct-color);
      stroke-miterlimit: 10;
      margin: 24px auto;
      box-shadow: inset 0px 0px 0px var(--correct-color);
      animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
    }
    .success-checkmark circle {
      stroke-dasharray: 166;
      stroke-dashoffset: 166;
      stroke-width: 2;
      stroke-miterlimit: 10;
      stroke: var(--correct-color);
      fill: none;
      animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }
    .success-checkmark path {
      transform-origin: 50% 50%;
      stroke-dasharray: 48;
      stroke-dashoffset: 48;
      animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
    }
    @keyframes stroke { 100% { stroke-dashoffset: 0; } }
    @keyframes scale { 0%, 100% { transform: none; } 50% { transform: scale3d(1.1, 1.1, 1); } }
    @keyframes fill { 100% { box-shadow: inset 0px 0px 0px 40px var(--correct-color); } }

    .breathing-container { text-align: center; padding: 24px 0; }
    .breathing-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: var(--gradient);
      margin: 0 auto;
    }
    .breathing-text { font-size: 1.1rem; font-weight: 500; margin-top: 16px; }
    @keyframes breath-inhale {
      0% { transform: scale(0.8); opacity: 0.8; }
      100% { transform: scale(1.2); opacity: 1; }
    }
    @keyframes breath-hold {
      0% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(1.2); opacity: 1; }
    }
    @keyframes breath-exhale {
      0% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(0.8); opacity: 0.8; }
    }
    .zen-zone-content {
      margin-top: 16px;
    }

    .badges-container { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 16px; }
    .badge { opacity: 0.4; filter: grayscale(80%); transition: all 0.3s ease; }
    .badge.earned { opacity: 1; filter: grayscale(0%); }
    .badge-icon { font-size: 32px; }

    .daily-quests-container .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .quest-item { display: flex; align-items: center; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--border-color); }
    .quest-item:last-child { border-bottom: none; }
    .quest-item.completed .quest-description { text-decoration: line-through; color: var(--subtle-text); }
    .quest-icon { font-size: 24px; }
    .quest-details { flex-grow: 1; }
    .quest-description { margin: 0 0 8px 0; font-weight: 500; }

    .user-profile { position: relative; }
    .user-profile-trigger {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        border-radius: 50%;
    }
    .user-avatar { width: 40px; height: 40px; border-radius: 50%; }
    .profile-dropdown {
        position: absolute;
        top: calc(100% + 12px);
        right: 0;
        width: 240px;
        background-color: var(--card-background);
        border-radius: 12px;
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        z-index: 200;
        border: 1px solid var(--border-color);
        overflow: hidden;
        animation: fadeIn 0.2s ease-out;
    }
    .profile-dropdown-header {
        padding: 16px;
        border-bottom: 1px solid var(--border-color);
    }
    .profile-dropdown-header strong {
        display: block;
        font-size: 15px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .profile-dropdown-email {
        display: block;
        font-size: 13px;
        color: var(--subtle-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .profile-dropdown-button {
        display: block;
        width: 100%;
        text-align: left;
        padding: 12px 16px;
        background: none;
        border: none;
        font-size: 15px;
        color: var(--text-color);
        cursor: pointer;
    }
    .profile-dropdown-button:hover {
        background-color: var(--background-color);
    }

    .dashboard-logo-container { display: flex; align-items: center; gap: 12px; }
    .premium-badge {
        display: inline-block;
        background: var(--gradient);
        color: white;
        font-size: 11px;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 20px;
        text-transform: uppercase;
        line-height: 1;
    }

    .planner-week { margin-bottom: 24px; }
    .planner-task { display: flex; align-items: center; gap: 12px; padding: 8px 0; }
    .planner-task.completed label { text-decoration: line-through; color: var(--subtle-text); }
    .planner-task input[type="checkbox"] { width: 18px; height: 18px; }
    .planner-task label { flex-grow: 1; }
    .planner-task .task-status-icon {
        font-size: 16px;
        width: 24px;
        text-align: center;
        flex-shrink: 0;
    }
    .info-task {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background-color: var(--background-color);
        border-radius: 8px;
        margin-top: 8px;
        cursor: pointer;
        transition: background-color 0.2s;
        color: var(--primary-color);
    }
    .info-task:hover { background-color: var(--border-color); }
    .button-link-style {
        background: none; border: none; padding: 0; font: inherit; color: var(--primary-color); cursor: pointer; text-decoration: underline; font-weight: 600;
    }
    .task-description {
        line-height: 1.5;
    }

    .user-answer {
        background-color: var(--background-color);
        border-left: 4px solid var(--subtle-text);
        padding: 12px;
        margin: 0;
        border-radius: 4px;
        font-style: italic;
    }
    .button-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
    .button-grid-vertical { display: flex; flex-direction: column; gap: 12px; }

    .readable-content {
        position: relative;
    }
    .speech-button {
        position: absolute;
        top: 0;
        right: 0;
        background: none;
        border: 1px solid var(--border-color);
        color: var(--subtle-text);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }
    .speech-button.active, .speech-button:hover {
        background-color: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }
    .speech-button:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }

    .exam-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color); }
    .exam-progress { font-weight: 600; }
    .exam-timer { font-weight: 600; }
    .exam-question-nav { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
    .nav-item {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        border: 1px solid var(--border-color);
        background-color: var(--background-color);
        cursor: pointer;
        font-weight: 600;
        color: var(--text-color);
    }
    .nav-item.active { border-color: var(--primary-color); background-color: var(--primary-color); color: white; }
    .nav-item.answered { background-color: var(--border-color); }
    .nav-item.flagged { color: var(--medium-time-color); border-color: var(--medium-time-color); }
    .exam-flag-button { background: none; border: none; cursor: pointer; color: var(--subtle-text); padding: 8px; }
    .exam-flag-button.flagged { color: var(--medium-time-color); }
    .exam-navigation { display: flex; gap: 16px; margin-top: 24px; border-top: 1px solid var(--border-color); padding-top: 24px; }
    .exam-navigation .button { flex: 1; }

    .exam-results-summary { text-align: center; padding: 24px; }
    .exam-score { font-size: 3rem; font-weight: 800; color: var(--primary-color); margin: 8px 0; }
    .exam-question-review { padding: 16px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 16px; }
    .exam-question-review.correct { border-left: 4px solid var(--correct-color); }
    .exam-question-review.incorrect { border-left: 4px solid var(--incorrect-color); }

    #file-upload { display: none; }
    label[for="file-upload"] {
        display: block;
        border: 2px dashed var(--border-color);
        border-radius: 12px;
        padding: 32px;
        text-align: center;
        cursor: pointer;
        transition: border-color 0.2s;
        min-height: 150px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    label[for="file-upload"]:hover { border-color: var(--primary-color); }
    .upload-preview { max-width: 100%; max-height: 200px; border-radius: 8px; }

    .sso-button-container { display: flex; flex-direction: column; gap: 12px; }
    .sso-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        width: 100%;
        padding: 12px;
        font-size: 16px;
        font-weight: 600;
        border-radius: 8px;
        border: 1px solid var(--border-color);
        background-color: var(--background-color);
        color: var(--text-color);
        cursor: pointer;
        min-height: 48px;
    }
    .auth-consent-text { font-size: 13px; color: var(--subtle-text); text-align: center; margin-top: 24px; }

    .proactive-greeting {
        background-color: var(--background-color);
        border-radius: 16px;
        padding: 24px;
        display: flex;
        align-items: flex-start;
        gap: 20px;
        margin-bottom: 0;
    }
    .proactive-greeting-icon { font-size: 2rem; }
    .proactive-greeting-content h3 { margin-bottom: 8px; }
    .proactive-greeting-content p { margin: 0 0 16px 0; color: var(--subtle-text); }

    .pulse-check-question { margin-top: 24px; }
    .pulse-check-question label { display: block; font-weight: 600; margin-bottom: 12px; }
    .pulse-check-rating { display: flex; justify-content: space-around; }
    .rating-emoji-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        transition: background-color 0.2s;
    }
    .rating-emoji-btn:hover { background-color: var(--background-color); }
    .rating-emoji-btn.selected { background-color: var(--soft-pink); }
    .rating-emoji { font-size: 2rem; display: block; }
    .rating-label { font-size: 14px; color: var(--subtle-text); }

    .progress-report-container h2 {
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-color);
    }
    .progress-report-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 24px;
    }
    @media (min-width: 600px) {
        .progress-report-grid {
            grid-template-columns: 1fr 1fr;
        }
    }
    .chart-container {
        width: 100%;
        height: 200px;
    }
    .chart-container svg { width: 100%; height: 100%; }
    .grid-line { stroke: var(--border-color); stroke-width: 1; }
    .axis-label { font-size: 10px; fill: var(--subtle-text); }
    .data-line { stroke: var(--primary-color); stroke-width: 2; fill: none; }
    .data-point { fill: var(--primary-color); }

    .flashcard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
    }
    .flashcard-deck-card {
        transition: transform 0.2s, box-shadow 0.2s;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .flashcard-deck-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.07);
    }
    .flashcard-practice-container {
        perspective: 1000px;
    }
    .flashcard {
        width: 100%;
        height: 300px;
        position: relative;
        cursor: pointer;
    }
    .flashcard-inner {
        width: 100%;
        height: 100%;
        transition: transform 0.6s;
        transform-style: preserve-3d;
    }
    .flashcard.is-flipped .flashcard-inner { transform: rotateY(180deg); }
    .flashcard-front, .flashcard-back {
        position: absolute;
        width: 100%;
        height: 100%;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 24px;
        box-sizing: border-box;
        border: 1px solid var(--border-color);
        border-radius: 16px;
        background-color: var(--background-color);
    }
    .flashcard-back { transform: rotateY(180deg); }
    .flashcard-controls { margin-top: 24px; }

    .squad-goal-card { background-color: var(--background-color); }
    .squad-goal-progress { display: flex; align-items: center; gap: 12px; margin-top: 8px; }
    .squad-goal-progress .progress-bar { flex-grow: 1; }
    .squad-leaderboard { list-style: none; padding: 0; margin: 0; }
    .leaderboard-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border-color); }
    .leaderboard-item:last-child { border-bottom: none; }
    .leaderboard-rank { font-weight: 700; color: var(--subtle-text); width: 20px; text-align: center; }
    .leaderboard-avatar { font-size: 20px; }
    .leaderboard-name { flex-grow: 1; font-weight: 500; }
    .leaderboard-xp { font-weight: 600; color: var(--xp-color); }
    .activity-feed { max-height: 250px; overflow-y: auto; padding-right: 8px; }
    .activity-feed-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
    .activity-avatar { font-size: 20px; margin-top: 4px; }
    .activity-text { margin: 0; line-height: 1.4; }

    .summary-hub-input-area {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    @media (min-width: 600px) {
        .summary-hub-input-area {
            flex-direction: row;
        }
        .summary-hub-input-area .button {
            width: auto;
            flex-shrink: 0;
        }
    }

    .summary-content-area {
        margin-top: 24px;
        padding-top: 24px;
        border-top: 1px solid var(--border-color);
        min-height: 100px;
    }
    .summary-action-toolbar {
        margin-top: 24px;
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }
    .generated-questions-container {
        margin-top: 24px;
        border-top: 1px solid var(--border-color);
        padding-top: 24px;
    }
    .generated-question {
        background-color: var(--background-color);
        margin-top: 16px;
    }

    .tutor-intervention-modal-content {
      max-width: 400px;
      text-align: center;
    }
    
    /* Phase 1 Styles */
    .admin-stats-list {
      list-style: none;
      padding: 0;
      margin-top: 16px;
    }
    .admin-stats-list li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid var(--border-color);
      font-size: 15px;
    }
    .admin-stats-list li:last-child {
      border-bottom: none;
    }
    .admin-stats-list li span:first-child {
      font-weight: 600;
      color: var(--text-color);
    }
    .admin-stats-list li span:last-child {
      font-weight: 500;
      color: var(--subtle-text);
      font-family: var(--font-accent);
    }
    .feature-feedback-buttons {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }
    .feature-feedback-buttons .button {
      flex: 1;
    }
  `;
  return <style>{css}</style>;
};

export default GlobalStyles;
