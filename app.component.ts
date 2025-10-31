import { Component, ChangeDetectionStrategy, signal, ElementRef, viewChild, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { RewardedAdModalComponent } from './components/rewarded-ad-modal/rewarded-ad-modal.component';

declare var html2canvas: any;

type TextAlign = 'left' | 'center' | 'right';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    RewardedAdModalComponent
  ]
})
export class AppComponent {
  quoteCanvas = viewChild.required<ElementRef>('quoteCanvas');

  userQuote = signal("اكتب اقتباسك هنا");
  textColor = signal('#FFFFFF');
  fontSize = signal(24);
  textAlign = signal<TextAlign>('right');
  fontFamily = signal('Georgia');
  
  canDownloadWithoutWatermark = signal(false);
  isAdModalOpen = signal(false);
  isCapturing = signal(false);
  
  fonts = ['Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New', 'Impact'];
  
  showWatermark = computed(() => !this.canDownloadWithoutWatermark() && !this.isCapturing());

  changeAlignment(align: TextAlign) {
    this.textAlign.set(align);
  }

  onGenerateAndDownload() {
    if (this.canDownloadWithoutWatermark()) {
      this.exportImage();
    } else {
      this.openRewardedAdModal();
    }
  }

  openRewardedAdModal() {
    this.isAdModalOpen.set(true);
  }

  closeRewardedAdModal() {
    this.isAdModalOpen.set(false);
  }

  onAdCompletedSuccessfully() {
    this.canDownloadWithoutWatermark.set(true);
    this.closeRewardedAdModal();
    // Automatically trigger download after ad success
    setTimeout(() => this.exportImage(), 100); 
  }

  exportImage() {
    this.isCapturing.set(true);
    
    setTimeout(() => {
      const elementToCapture = this.quoteCanvas().nativeElement;
      if (elementToCapture) {
        html2canvas(elementToCapture, {
          backgroundColor: null,
          useCORS: true, 
          logging: false
        }).then((canvas: HTMLCanvasElement) => {
          const link = document.createElement('a');
          link.download = 'QuoteForge.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
        }).catch((err: any) => {
          console.error('Error generating image:', err);
        }).finally(() => {
          // Reset state after download
          this.canDownloadWithoutWatermark.set(false);
          this.isCapturing.set(false);
        });
      } else {
        this.isCapturing.set(false);
      }
    }, 100);
  }
}