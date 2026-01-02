// Sound Manager using Web Audio API
// No external files needed - all sounds are synthesized

export class SoundManager {
    constructor() {
        this.enabled = true;
        this.volume = 0.3;
        this.audioContext = null;
    }

    init() {
        // Create AudioContext on first user interaction (browser requirement)
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Ensure context is running (browsers pause it until user interaction)
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Simple beep sound
    playTone(frequency, duration, type = 'sine') {
        if (!this.enabled || !this.audioContext) return;
        this.resume();

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // UI Click sound - short, subtle
    playClick() {
        this.playTone(800, 0.05, 'sine');
    }

    // Money gain - happy "cha-ching"
    playMoneyGain() {
        if (!this.enabled || !this.audioContext) return;
        this.resume();

        // Two-note ascending
        setTimeout(() => this.playTone(523, 0.1, 'sine'), 0);   // C5
        setTimeout(() => this.playTone(659, 0.15, 'sine'), 80); // E5
    }

    // Money loss - sad descending
    playMoneyLoss() {
        if (!this.enabled || !this.audioContext) return;
        this.resume();

        setTimeout(() => this.playTone(440, 0.1, 'sine'), 0);   // A4
        setTimeout(() => this.playTone(349, 0.15, 'sine'), 80); // F4
    }

    // Event notification - attention-grabbing
    playAlert() {
        if (!this.enabled || !this.audioContext) return;
        this.resume();

        setTimeout(() => this.playTone(880, 0.1, 'square'), 0);
        setTimeout(() => this.playTone(880, 0.1, 'square'), 150);
    }

    // Success sound
    playSuccess() {
        if (!this.enabled || !this.audioContext) return;
        this.resume();

        setTimeout(() => this.playTone(523, 0.08, 'sine'), 0);   // C5
        setTimeout(() => this.playTone(659, 0.08, 'sine'), 60);  // E5
        setTimeout(() => this.playTone(784, 0.15, 'sine'), 120); // G5
    }

    // Error/fail sound
    playError() {
        this.playTone(200, 0.2, 'sawtooth');
    }

    // Toggle sound on/off
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
    }
}
