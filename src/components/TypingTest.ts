import { WordGenerator } from './WordGenerator';
import { Results } from './Results';

export class TypingTest {
    private textDisplay: HTMLElement;
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
    private wpmHistory: number[] = [];
    private results: Results;
    private lastWpmUpdate: number = 0;

    constructor() {
        const textDisplay = document.getElementById('text-display');
        const wpmDisplay = document.getElementById('wpm');
        const accuracyDisplay = document.getElementById('accuracy');
        const timerDisplay = document.getElementById('timer');
        const restartBtn = document.getElementById('restart-btn');

        if (!textDisplay || !wpmDisplay || 
            !accuracyDisplay || !timerDisplay || !restartBtn) {
            throw new Error('Required DOM elements not found');
        }

        this.textDisplay = textDisplay;
        this.wpmDisplay = wpmDisplay;
        this.accuracyDisplay = accuracyDisplay;
        this.timerDisplay = timerDisplay;
        this.restartBtn = restartBtn;

        this.results = new Results();
        this.textDisplay.setAttribute('tabindex', '0');

        this.initializeEventListeners();
        this.resetTest();
    }

    private initializeEventListeners(): void {
        this.textDisplay.addEventListener('keydown', (e) => {
            if (e.key.length === 1) {
                this.handleKeyPress(e.key);
                e.preventDefault();
            } else if (e.key === 'Backspace') {
                this.handleBackspace();
                e.preventDefault();
            }
        });
        
        this.restartBtn.addEventListener('click', () => this.resetTest());
        document.getElementById('retry-btn')?.addEventListener('click', () => {
            this.results.hide();
            this.resetTest();
        });
    }

    private handleKeyPress(key: string): void {
        if (!this.startTime) {
            this.startTime = Date.now();
            this.startTimer();
            this.textDisplay.focus();
        }

        const currentPosition = this.getCurrentPosition();
        if (currentPosition < this.currentText.length) {
            this.checkCharacter(key, currentPosition);
            this.updateStats();
        }
    }

    private handleBackspace(): void {
        // Implementation for backspace
        // Similar to current logic but removing the last character
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
        const timeElapsed = (Date.now() - (this.startTime || Date.now())) / 1000;
        const wpm = Math.round((this.correctCharacters / 5) / (timeElapsed / 60));
        const accuracy = Math.round((this.correctCharacters / this.totalCharacters) * 100);

        if (timeElapsed - this.lastWpmUpdate >= 1) {
            this.wpmHistory.push(wpm);
            this.lastWpmUpdate = timeElapsed;
        }

        this.wpmDisplay.textContent = `WPM: ${wpm}`;
        this.accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;
    }

    private endTest(): void {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        const timeElapsed = Math.round((Date.now() - (this.startTime || Date.now())) / 1000);
        const wpm = Math.round((this.correctCharacters / 5) / (timeElapsed / 60));
        const accuracy = Math.round((this.correctCharacters / this.totalCharacters) * 100);
        
        this.results.show(wpm, accuracy, timeElapsed, this.wpmHistory);
    }

    private resetTest(): void {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.currentText = WordGenerator.generateWords(25);
        this.displayTextAsSpans();
        this.timeLeft = 60;
        this.startTime = null;
        this.correctCharacters = 0;
        this.totalCharacters = 0;
        this.wpmHistory = [];
        this.lastWpmUpdate = 0;
        
        const firstChar = document.getElementById('char-0');
        if (firstChar) {
            firstChar.classList.add('current');
        }
        
        this.wpmDisplay.textContent = 'WPM: 0';
        this.accuracyDisplay.textContent = 'Accuracy: 100%';
        this.timerDisplay.textContent = 'Time: 60s';
        
        this.textDisplay.focus();
    }

    private displayTextAsSpans(): void {
        this.textDisplay.innerHTML = this.currentText
            .split('')
            .map((char, index) => {
                if (char === ' ') {
                    return `<span id="char-${index}" class="space">${char}</span>`;
                }
                return `<span id="char-${index}">${char}</span>`;
            })
            .join('');
    }

    private getCurrentPosition(): number {
        return this.totalCharacters;
    }

    private checkCharacter(key: string, position: number): void {
        const currentChar = this.currentText[position];
        const charElement = document.getElementById(`char-${position}`);
        
        if (charElement) {
            if (key === currentChar) {
                charElement.classList.add('correct');
                this.correctCharacters++;
            } else {
                charElement.classList.add('incorrect');
            }
            this.totalCharacters++;
            
            document.querySelector('.current')?.classList.remove('current');
            
            const nextChar = document.getElementById(`char-${position + 1}`);
            if (nextChar) {
                nextChar.classList.add('current');
            } else if (position === this.currentText.length - 1) {
                this.endTest();
            }
        }
    }
} 