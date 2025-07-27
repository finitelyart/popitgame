let audioContext: AudioContext;

const getContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new window.AudioContext();
  }
  return audioContext;
};

// Function to generate the satisfying "pop"
export const playPopSound = () => {
  const context = getContext();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  // The "pop" comes from a sharp volume envelope
  const now = context.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(1, now + 0.01); // Sharp attack
  gainNode.gain.linearRampToValueAtTime(0, now + 0.1);  // Quick decay

  // Randomize pitch for variety
  oscillator.frequency.value = 300 + Math.random() * 200; // Pitch between 300-500 Hz
  oscillator.type = 'triangle'; // 'triangle' or 'sine' works well

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(now);
  oscillator.stop(now + 0.1);

  // Haptic feedback for mobile devices
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
};

// Function for a reward chime
export const playRewardSound = () => {
  const context = getContext();
  const now = context.currentTime;
  const gainNode = context.createGain();
  gainNode.connect(context.destination);
  
  // Play a C, E, G chord
  const freqs = [523.25, 659.25, 783.99]; 
  freqs.forEach((freq, i) => {
    const osc = context.createOscillator();
    osc.connect(gainNode);
    osc.frequency.value = freq;
    
    const startTime = now + i * 0.1;
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.5, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

    osc.start(startTime);
    osc.stop(startTime + 0.5);
  });
};