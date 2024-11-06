import { WordGenerator } from './WordGenerator';

export class TypingTest {
    private textDisplay: HTMLElement;
    private typingInput: HTMLInputElement;
    private wpmDisplay: HTMLElement;
    private accuracyDisplay: HTMLElement;
    private timerDisplay: HTMLElement;
    private restartBtn: HTMLElement;
    
    private currentText: string = '';
    private timeLeft: number = 60;
    private timer: NodeJS.Timeout | null = null;
    private startTime: number | null = null;
    private correctCharacters: number = 0;
    private totalCharacters: number = 0;

    constructor() {
        this.textDisplay = document.getElementById('text-display')!;
        this.typingInput = document.getElementById('typing-input') as HTMLInputElement;
        this.wpmDisplay = document.getElementById('wpm')!;
        this.accuracyDisplay = document.getElementById('accuracy')!;
        this.timerDisplay = document.getElementById('timer')!;
        this.restartBtn = document.getElementById('restart-btn')!;

        this.initializeEventListeners();
        this.resetTest();
    }

    private initializeEventListeners(): void {
        this.typingInput.addEventListener('input', () => this.handleInput());
        this.restartBtn.addEventListener('click', () => this.resetTest());
    }

    private handleInput(): void {
        if (!this.startTime) {
            this.startTime = Date.now();
            this.startTimer();
        }

        const currentInput = this.typingInput.value;
        this.totalCharacters++;

        if (currentInput.charAt(currentInput.length - 1) === 
            this.currentText.charAt(currentInput.length - 1)) {
            this.correctCharacters++;
        }

        this.updateStats();
    }

    private startTimer(): void {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.timerDisplay.textContent = `Time: ${this.timeLeft}s`;

            if (this.timeLeft <= 0) {
                this.endTest();
            }
        }, 1000);
    }

    private updateStats(): void {
        const timeElapsed = (Date.now() - (this.startTime || Date.now())) / 1000 / 60;
        const wpm = Math.round((this.correctCharacters / 5) / timeElapsed);
        const accuracy = Math.round((this.correctCharacters / this.totalCharacters) * 100);

        this.wpmDisplay.textContent = `WPM: ${wpm}`;
        this.accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;
    }

    private endTest(): void {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.typingInput.disabled = true;
    }

    private resetTest(): void {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.currentText = WordGenerator.generateWords(25);
        this.textDisplay.textContent = this.currentText;
        this.typingInput.value = '';
        this.typingInput.disabled = false;
        this.timeLeft = 60;
        this.startTime = null;
        this.correctCharacters = 0;
        this.totalCharacters = 0;
        
        this.wpmDisplay.textContent = 'WPM: 0';
        this.accuracyDisplay.textContent = 'Accuracy: 100%';
        this.timerDisplay.textContent = 'Time: 60s';
    }
} 