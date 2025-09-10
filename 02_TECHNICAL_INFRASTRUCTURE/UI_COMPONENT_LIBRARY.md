# 🎨 UI COMPONENT LIBRARY - RPG Fantasy MMO

## 📋 **COMPONENT SPECIFICATIONS**

### **🎯 Design System Overview**
Complete component library basato sull'analisi delle interfacce moderne, adattato per il nostro universo fantasy con sistema famiglia e 9 razze.

---

## 🔘 **BUTTON COMPONENTS**

### **Primary Button - "Cosmic Action"**
```css
.btn-primary {
  /* Base Styling */
  padding: 12px 24px;
  border-radius: 8px;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.5px;
  
  /* Faction-Based Colors */
  background: linear-gradient(135deg, var(--faction-primary), var(--faction-secondary));
  border: 2px solid var(--faction-glow);
  color: #FFFFFF;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  
  /* Effects */
  box-shadow: 
    0 4px 8px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.2);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.btn-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 
    0 6px 16px rgba(0,0,0,0.4),
    0 0 20px var(--faction-glow);
  filter: brightness(110%);
}

.btn-primary:active {
  transform: translateY(0) scale(0.98);
  transition: all 0.1s ease;
}

/* Divine Intervention Effect */
.btn-primary.divine-blessing::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
  animation: blessing-pulse 2s infinite;
  pointer-events: none;
}

@keyframes blessing-pulse {
  0%, 100% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1); }
}
```

### **Family Bond Button - "Emotional Connection"**
```css
.btn-family {
  /* Unique Design for Family Actions */
  background: linear-gradient(135deg, #F5A623, #E98B00);
  border: 2px solid #FFD700;
  position: relative;
  
  /* Heart Beat Animation */
  animation: heartbeat 1.5s ease-in-out infinite;
}

.btn-family::after {
  content: "❤️";
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 14px;
  animation: heart-glow 2s infinite;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes heart-glow {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; text-shadow: 0 0 10px #FFD700; }
}
```

### **Racial Heritage Button - "Cultural Identity"**
```css
.btn-racial {
  /* Base Structure */
  padding: 10px 20px;
  border-radius: 6px;
  background: var(--race-primary);
  border: 2px solid var(--race-accent);
  color: var(--race-text);
  
  /* Cultural Pattern Overlay */
  background-image: var(--race-pattern);
  background-size: 20px 20px;
  background-blend-mode: overlay;
  
  /* Hover Effects */
  transition: all 0.3s ease;
}

.btn-racial:hover {
  background-size: 25px 25px;
  box-shadow: 0 0 15px var(--race-accent);
}

/* Race-Specific Variants */
.btn-racial.elven {
  --race-primary: #2E8B57;
  --race-accent: #98FB98;
  --race-text: #F0FFF0;
  --race-pattern: url('patterns/elven-leaves.svg');
}

.btn-racial.dwarven {
  --race-primary: #8B4513;
  --race-accent: #DAA520;
  --race-text: #FFFAF0;
  --race-pattern: url('patterns/dwarven-runes.svg');
}

.btn-racial.draconic {
  --race-primary: #8B0000;
  --race-accent: #FF4500;
  --race-text: #FFF8DC;
  --race-pattern: url('patterns/dragon-scales.svg');
}
```

---

## 📊 **PROGRESS COMPONENTS**

### **Family Bond Meter - "Emotional Connection Gauge"**
```css
.family-bond-meter {
  width: 100%;
  height: 24px;
  background: #2d2d2d;
  border-radius: 12px;
  border: 2px solid #444;
  position: relative;
  overflow: hidden;
}

.family-bond-fill {
  height: 100%;
  background: linear-gradient(90deg, 
    #F5A623 0%, 
    #FFD700 50%, 
    #FFF8DC 100%);
  border-radius: 10px;
  position: relative;
  transition: width 0.5s ease;
  
  /* Pulsing Heart Effects */
  animation: bond-strength-pulse 2s infinite;
}

.family-bond-fill::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, 
    transparent 30%, 
    rgba(255,255,255,0.3) 50%, 
    transparent 70%);
  animation: shine-sweep 3s infinite;
}

.family-bond-meter .bond-hearts {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 8px;
  color: #FFF;
  font-size: 14px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
}

@keyframes bond-strength-pulse {
  0%, 100% { filter: brightness(100%); }
  50% { filter: brightness(120%); }
}

@keyframes shine-sweep {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### **Divine Faction Alignment Bar**
```css
.divine-alignment-bar {
  display: flex;
  width: 100%;
  height: 32px;
  border-radius: 16px;
  background: #1a1a1a;
  border: 2px solid #444;
  overflow: hidden;
  position: relative;
}

.alignment-section {
  flex: 1;
  position: relative;
  transition: all 0.3s ease;
}

.alignment-section.order {
  background: linear-gradient(90deg, #4A90E2, #87CEEB);
}

.alignment-section.chaos {
  background: linear-gradient(90deg, #E85D5D, #FF6B6B);
}

.alignment-section.void {
  background: linear-gradient(90deg, #8B5AA0, #DDA0DD);
}

.alignment-indicator {
  position: absolute;
  top: -4px;
  width: 4px;
  height: 40px;
  background: #FFD700;
  border-radius: 2px;
  box-shadow: 0 0 10px #FFD700;
  transition: left 0.5s ease;
}

.divine-alignment-bar::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.divine-alignment-bar:hover::after {
  opacity: 1;
}
```

---

## 🃏 **CARD COMPONENTS**

### **Character Card - "Family Member Display"**
```css
.character-card {
  width: 280px;
  height: 380px;
  background: linear-gradient(145deg, #2d2d2d, #1a1a1a);
  border-radius: 16px;
  border: 2px solid transparent;
  background-clip: padding-box;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.character-card::before {
  content: "";
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, var(--faction-primary), var(--faction-secondary));
  border-radius: 18px;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.character-card:hover::before {
  opacity: 1;
}

.character-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 20px 40px rgba(0,0,0,0.3),
    0 0 30px var(--faction-glow);
}

.character-portrait {
  width: 100%;
  height: 200px;
  background: var(--character-portrait-url);
  background-size: cover;
  background-position: center;
  position: relative;
}

.character-portrait::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
}

.character-info {
  padding: 16px;
  position: relative;
}

.character-name {
  font-family: "Cinzel", serif;
  font-size: 20px;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 8px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.character-class {
  color: var(--faction-primary);
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
}

.character-level {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0,0,0,0.8);
  color: #FFD700;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
}

.bond-indicator {
  position: absolute;
  top: 12px;
  left: 12px;
  color: #F5A623;
  font-size: 18px;
  animation: bond-pulse 2s infinite;
}

@keyframes bond-pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
}
```

### **Quest Card - "Mission Display"**
```css
.quest-card {
  background: linear-gradient(135deg, #2d2d2d, #1a1a1a);
  border-radius: 12px;
  border: 1px solid #444;
  padding: 20px;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.quest-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255,255,255,0.1), 
    transparent);
  transition: left 0.5s ease;
}

.quest-card:hover::before {
  left: 100%;
}

.quest-card:hover {
  border-color: var(--faction-primary);
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  transform: translateY(-2px);
}

.quest-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.quest-title {
  font-family: "Cinzel", serif;
  font-size: 18px;
  font-weight: 600;
  color: #FFFFFF;
  flex: 1;
}

.quest-type {
  background: var(--quest-type-color);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.quest-description {
  color: #CCCCCC;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
}

.quest-progress {
  background: #333;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.quest-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--faction-primary), var(--faction-secondary));
  border-radius: 4px;
  transition: width 0.3s ease;
  position: relative;
}

.quest-progress-fill::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, 
    transparent 30%, 
    rgba(255,255,255,0.4) 50%, 
    transparent 70%);
  animation: progress-shine 2s infinite;
}

.quest-rewards {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.reward-item {
  background: rgba(245, 166, 35, 0.2);
  border: 1px solid #F5A623;
  color: #F5A623;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

@keyframes progress-shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

---

## 📱 **MODAL COMPONENTS**

### **Divine Intervention Modal - "Cosmic Event"**
```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: modal-fade-in 0.3s ease;
}

.divine-intervention-modal {
  width: 600px;
  max-width: 90vw;
  background: linear-gradient(145deg, #2d2d2d, #1a1a1a);
  border-radius: 20px;
  border: 3px solid var(--faction-primary);
  box-shadow: 
    0 20px 40px rgba(0,0,0,0.5),
    0 0 60px var(--faction-glow);
  position: relative;
  overflow: hidden;
  animation: modal-scale-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.divine-intervention-modal::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, var(--faction-primary) 0%, transparent 70%);
  opacity: 0.1;
  animation: divine-aura 4s infinite;
}

.modal-header {
  padding: 24px;
  text-align: center;
  position: relative;
  border-bottom: 2px solid var(--faction-primary);
}

.modal-title {
  font-family: "Cinzel", serif;
  font-size: 28px;
  color: #FFFFFF;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
  margin: 0;
}

.modal-subtitle {
  color: var(--faction-primary);
  font-size: 16px;
  margin-top: 8px;
  font-weight: 500;
}

.modal-body {
  padding: 24px;
  max-height: 400px;
  overflow-y: auto;
}

.modal-footer {
  padding: 20px 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  border-top: 1px solid #444;
}

@keyframes modal-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modal-scale-in {
  from { transform: scale(0.8) translateY(20px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

@keyframes divine-aura {
  0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.1; }
  50% { transform: rotate(180deg) scale(1.1); opacity: 0.2; }
}
```

---

## 💬 **CHAT COMPONENTS**

### **Multi-Channel Chat Interface**
```css
.chat-container {
  width: 400px;
  height: 500px;
  background: rgba(26, 26, 26, 0.95);
  border-radius: 12px;
  border: 1px solid #444;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-tabs {
  display: flex;
  background: #1a1a1a;
  border-bottom: 1px solid #444;
}

.chat-tab {
  flex: 1;
  padding: 12px 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #888;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.chat-tab.active {
  color: var(--faction-primary);
  background: rgba(74, 144, 226, 0.1);
}

.chat-tab.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--faction-primary);
}

.chat-tab .notification-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #E85D5D;
  color: white;
  border-radius: 8px;
  padding: 2px 6px;
  font-size: 10px;
  min-width: 16px;
  text-align: center;
}

.chat-messages {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #444 transparent;
}

.chat-message {
  margin-bottom: 12px;
  animation: message-slide-in 0.3s ease;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.message-author {
  font-weight: 600;
  color: var(--author-faction-color);
  font-size: 14px;
}

.message-timestamp {
  color: #666;
  font-size: 11px;
}

.message-content {
  color: #CCCCCC;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.family-message .message-author {
  color: #F5A623;
}

.family-message::before {
  content: "❤️";
  margin-right: 4px;
}

.guild-message .message-author {
  color: #4A90E2;
}

.system-message {
  color: #888;
  font-style: italic;
  text-align: center;
  font-size: 13px;
}

.chat-input-area {
  padding: 12px;
  border-top: 1px solid #444;
  display: flex;
  gap: 8px;
}

.chat-input {
  flex: 1;
  background: #333;
  border: 1px solid #555;
  border-radius: 6px;
  padding: 8px 12px;
  color: #FFFFFF;
  font-size: 14px;
}

.chat-input:focus {
  outline: none;
  border-color: var(--faction-primary);
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.3);
}

.chat-send-btn {
  background: var(--faction-primary);
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chat-send-btn:hover {
  background: var(--faction-secondary);
  transform: scale(1.05);
}

@keyframes message-slide-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 🎯 **UTILITY CLASSES**

### **Animation Utilities**
```css
/* Divine Blessing Effects */
.divine-blessed {
  animation: divine-blessing 3s infinite;
}

@keyframes divine-blessing {
  0%, 100% { filter: brightness(100%); }
  50% { filter: brightness(120%) drop-shadow(0 0 10px var(--faction-primary)); }
}

/* Family Bond Connections */
.family-connected::after {
  content: "";
  position: absolute;
  width: 2px;
  height: 20px;
  background: linear-gradient(#F5A623, #FFD700);
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  animation: bond-pulse 1.5s infinite;
}

/* Faction Glow */
.faction-glow {
  box-shadow: 0 0 20px var(--faction-glow);
  animation: faction-pulse 2s infinite;
}

@keyframes faction-pulse {
  0%, 100% { box-shadow: 0 0 20px var(--faction-glow); }
  50% { box-shadow: 0 0 30px var(--faction-glow); }
}

/* Loading States */
.loading-shimmer {
  background: linear-gradient(90deg, #333 0%, #555 50%, #333 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Hover Elevate */
.hover-elevate {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-elevate:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
}

/* Gentle Fade In */
.fade-in {
  animation: fade-in 0.5s ease;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### **Responsive Utilities**
```css
/* Mobile First Responsive */
@media (max-width: 768px) {
  .mobile-hidden { display: none; }
  .mobile-full-width { width: 100%; }
  .mobile-stack { flex-direction: column; }
  
  .character-card {
    width: 100%;
    height: auto;
  }
  
  .chat-container {
    width: 100%;
    height: 60vh;
  }
}

@media (min-width: 769px) {
  .desktop-only { display: block; }
  .mobile-only { display: none; }
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .btn-primary, .btn-family, .btn-racial {
    min-height: 44px;
    min-width: 44px;
  }
  
  .chat-tab {
    min-height: 44px;
  }
}
```

---

## 🌟 **IMPLEMENTATION NOTES**

### **CSS Custom Properties**
```css
:root {
  /* Faction Colors */
  --order-primary: #4A90E2;
  --order-secondary: #87CEEB;
  --order-glow: rgba(74, 144, 226, 0.5);
  
  --chaos-primary: #E85D5D;
  --chaos-secondary: #FF6B6B;
  --chaos-glow: rgba(232, 93, 93, 0.5);
  
  --void-primary: #8B5AA0;
  --void-secondary: #DDA0DD;
  --void-glow: rgba(139, 90, 160, 0.5);
  
  /* Family System */
  --family-gold: #F5A623;
  --family-heart: #FFD700;
  --family-bond: rgba(245, 166, 35, 0.3);
  
  /* Dynamic Faction Assignment */
  --faction-primary: var(--order-primary);
  --faction-secondary: var(--order-secondary);
  --faction-glow: var(--order-glow);
}

/* JavaScript-controlled faction switching */
[data-faction="chaos"] {
  --faction-primary: var(--chaos-primary);
  --faction-secondary: var(--chaos-secondary);
  --faction-glow: var(--chaos-glow);
}

[data-faction="void"] {
  --faction-primary: var(--void-primary);
  --faction-secondary: var(--void-secondary);
  --faction-glow: var(--void-glow);
}
```

### **JavaScript Integration Points**
```javascript
// Component Behavior Examples
const ComponentLibrary = {
  // Family Bond Updates
  updateFamilyBond(playerId, bondStrength) {
    const meter = document.querySelector(`[data-family-member="${playerId}"] .family-bond-fill`);
    meter.style.width = `${bondStrength}%`;
    meter.setAttribute('data-bond-level', Math.floor(bondStrength / 20));
  },
  
  // Divine Intervention Trigger
  triggerDivineIntervention(faction) {
    document.body.setAttribute('data-divine-intervention', faction);
    setTimeout(() => {
      document.body.removeAttribute('data-divine-intervention');
    }, 3000);
  },
  
  // Faction Switch
  changeFaction(newFaction) {
    document.documentElement.setAttribute('data-faction', newFaction);
    this.updateFactionColors(newFaction);
  },
  
  // Chat Message Animation
  addChatMessage(channel, author, content, isFamily = false) {
    const container = document.querySelector(`[data-channel="${channel}"] .chat-messages`);
    const message = this.createMessageElement(author, content, isFamily);
    container.appendChild(message);
    container.scrollTop = container.scrollHeight;
  }
};
```

---

**🎨 Un sistema di componenti degno di guardiani cosmici e famiglie scelte!**
