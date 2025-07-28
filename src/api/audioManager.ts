let audioContext: AudioContext;

const getContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new window.AudioContext();
  }
  return audioContext;
};

// Function to generate a more satisfying "pop" sound
export const playPopSound = () => {
  const context = getContext();
  const now = context.currentTime;

  // Master Gain for the overall sound envelope
  const masterGain = context.createGain();
  masterGain.connect(context.destination);
  masterGain.gain.setValueAtTime(0, now);
  // Fast attack, then decay to create a "thump"
  masterGain.gain.linearRampToValueAtTime(0.7, now + 0.01); // Quick attack
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25); // Slower decay for more body

  // Oscillator for the tonal part of the pop
  const oscillator = context.createOscillator();
  oscillator.type = 'triangle';
  
  // Pitch envelope for a deeper "thwump" sound
  const initialPitch = 150 + Math.random() * 50; // Pitch between 150-200 Hz for a bassier pop
  oscillator.frequency.setValueAtTime(initialPitch, now);
  oscillator.frequency.exponentialRampToValueAtTime(initialPitch * 0.5, now + 0.1); // Quick pitch drop

  oscillator.connect(masterGain);
  oscillator.start(now);
  oscillator.stop(now + 0.25);

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