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
        const currentPosition = currentInput.length - 1;

        const spans = this.textDisplay.getElementsByTagName('span');
        Array.from(spans).forEach(span => span.classList.remove('current'));

        if (currentInput.length < this.currentText.length) {
            const nextChar = document.getElementById(`char-${currentInput.length}`);
            if (nextChar) nextChar.classList.add('current');
        }

        if (currentPosition >= 0) {
            const charSpan = document.getElementById(`char-${currentPosition}`);
            if (charSpan) {
                const isCorrect = currentInput.charAt(currentPosition) === this.currentText.charAt(currentPosition);
                charSpan.classList.remove('correct', 'incorrect');
                charSpan.classList.add(isCorrect ? 'correct' : 'incorrect');

                this.totalCharacters++;
                if (isCorrect) {
                    this.correctCharacters++;
                }
            }
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
        this.displayTextAsSpans();
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
} 