
import { Component, ChangeDetectionStrategy, signal, ElementRef, viewChild, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { RewardedAdModalComponent } from './components/rewarded-ad-modal/rewarded-ad-modal.component';

declare var html2canvas: any;

type Language = 'ar' | 'en';

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

  language = signal<Language>('ar');

  private initialQuotes = {
    ar: "اكتب اقتباسك هنا",
    en: "Write your quote here"
  };

  userQuote = signal(this.initialQuotes.ar);
  textColor = signal('#FFFFFF');
  fontSize = signal(24);
  fontFamily = signal('Georgia');
  backgroundImageUrl = signal('https://images.pexels.com/photos/2310641/pexels-photo-2310641.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
  
  canDownloadWithoutWatermark = signal(false);
  isAdModalOpen = signal(false);
  isCapturing = signal(false);
  
  fonts = ['Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New', 'Impact'];
  
  backgroundImages = [
    'https://images.pexels.com/photos/2310641/pexels-photo-2310641.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/1528640/pexels-photo-1528640.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/1423600/pexels-photo-1423600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  ];

  private translations = {
    ar: {
      quoteTextLabel: 'نص الاقتباس',
      textColorLabel: 'لون النص',
      fontFamilyLabel: 'نوع الخط',
      backgroundLabel: 'اختر الخلفية',
      uploadLabel: 'رفع صورة',
      fontSizeLabel: 'حجم الخط',
      adPlaceholder: 'مساحة إعلانية',
      downloadButton: 'إنشاء وتنزيل',
      processingButton: 'جاري المعالجة...',
      watermark: 'QuoteForge.app'
    },
    en: {
      quoteTextLabel: 'Quote Text',
      textColorLabel: 'Text Color',
      fontFamilyLabel: 'Font Family',
      backgroundLabel: 'Choose Background',
      uploadLabel: 'Upload Image',
      fontSizeLabel: 'Font Size',
      adPlaceholder: 'Ad Space',
      downloadButton: 'Create and Download',
      processingButton: 'Processing...',
      watermark: 'QuoteForge.app'
    }
  };

  t = computed(() => this.translations[this.language()]);

  showWatermark = computed(() => !this.canDownloadWithoutWatermark() && !this.isCapturing());

  setLanguage(lang: Language) {
    this.language.set(lang);
    // Only change the quote if it's still the default placeholder
    if (this.userQuote() === this.initialQuotes.ar || this.userQuote() === this.initialQuotes.en) {
      this.userQuote.set(this.initialQuotes[lang]);
    }
  }

  changeBackground(url: string) {
    this.backgroundImageUrl.set(url);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        this.backgroundImageUrl.set(e.target.result);
      };
      
      reader.readAsDataURL(file);
    }
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