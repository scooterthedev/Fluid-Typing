import { Chart, ChartConfiguration } from 'chart.js/auto';

export class Results {
    private container: HTMLElement;
    private wpmData: number[] = [];
    private chart: Chart | null = null;
    private userName: string | null = null;
    private leaderboard: { name: string, wpm: number }[] = [];

    constructor() {
        this.container = document.getElementById('results-container')!;
        this.loadUserProfile();
    }

    private loadUserProfile(): void {
        this.userName = localStorage.getItem('userName');
        const userNameElement = document.getElementById('user-name');
        if (this.userName && userNameElement) {
            userNameElement.textContent = `User: ${this.userName}`;
        } else {
            if (userNameElement) {
                this.promptUserName();
            } else {
                console.error("User name element not found.");
            }
        }
    }

    private promptUserName(): void {
        const name = prompt("Please enter your name:");
        if (name) {
            this.userName = name;
            localStorage.setItem('userName', name);
            const userNameElement = document.getElementById('user-name');
            if (userNameElement) {
                userNameElement.textContent = `User: ${name}`;
            } else {
                console.error("User name element not found when setting name.");
            }
        } else {
            console.warn("No name entered.");
        }
    }

    show(wpm: number, accuracy: number, timeElapsed: number, wpmHistory: number[], isNewRecord: boolean): void {
        this.wpmData = wpmHistory;
        
        document.getElementById('test-container')!.classList.add('hidden');
        this.container.classList.remove('hidden');
        
        document.getElementById('final-wpm')!.textContent = `Final WPM: ${wpm}`;
        document.getElementById('final-accuracy')!.textContent = `Accuracy: ${accuracy}%`;
        document.getElementById('final-time')!.textContent = `Time: ${timeElapsed}s`;
        
        if (isNewRecord) {
            const recordBadge = document.createElement('div');
            recordBadge.className = 'new-record';
            recordBadge.textContent = '🏆 New Record!';
            document.getElementById('final-wpm')!.appendChild(recordBadge);
        }
        
        this.createChart();
        this.updateLeaderboard(this.userName || 'Anonymous', wpm);
    }

    hide(): void {
        this.container.classList.add('hidden');
        document.getElementById('test-container')!.classList.remove('hidden');
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }

    private createChart(): void {
        const ctx = (document.getElementById('wpm-chart') as HTMLCanvasElement).getContext('2d')!;
        
        const config: ChartConfiguration = {
            type: 'line',
            data: {
                labels: this.wpmData.map((_, i) => i + 1),
                datasets: [{
                    label: 'WPM over time',
                    data: this.wpmData,
                    borderColor: '#0078d4',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };

        this.chart = new Chart(ctx, config);
    }

    private updateLeaderboard(name: string, wpm: number): void {
        this.leaderboard.push({ name, wpm });
        this.leaderboard.sort((a, b) => b.wpm - a.wpm);
        this.leaderboard = this.leaderboard.slice(0, 5); // Keep top 5 scores
        this.displayLeaderboard();
    }

    private displayLeaderboard(): void {
        const leaderboardContainer = document.getElementById('leaderboard');
        if (!leaderboardContainer) {
            console.error("Leaderboard container not found.");
            return; // Exit the method if the container is not found
        }
        
        leaderboardContainer.innerHTML = '';
        this.leaderboard.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.textContent = `${entry.name}: ${entry.wpm} WPM`;
            leaderboardContainer.appendChild(entryDiv);
        });
    }
} 