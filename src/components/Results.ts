import { Chart, ChartConfiguration } from 'chart.js/auto';

export class Results {
    private container: HTMLElement;
    private wpmData: number[] = [];
    private chart: Chart | null = null;

    constructor() {
        this.container = document.getElementById('results-container')!;
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
} 