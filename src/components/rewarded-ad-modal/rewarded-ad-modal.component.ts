
import { Component, ChangeDetectionStrategy, output, signal, OnDestroy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

type Language = 'ar' | 'en';

@Component({
  selector: 'app-rewarded-ad-modal',
  templateUrl: './rewarded-ad-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class RewardedAdModalComponent implements OnDestroy {
  language = input.required<Language>();
  adCompleted = output<void>();
  closeModal = output<void>();

  isLoading = signal(false);
  countdown = signal(5);
  adWatched = signal(false);
  
  private countdownInterval: ReturnType<typeof setInterval> | undefined;

  private translations = {
    ar: {
      title: 'تنزيل بدون علامة مائية',
      description: 'شاهد إعلانًا قصيرًا لفتح تنزيل عالي الجودة وخالي من العلامات المائية لصورتك.',
      watchAdButton: 'مشاهدة الإعلان',
      adRunningText: 'الإعلان قيد التشغيل... يرجى الانتظار',
      successMessage: 'شكراً للمشاهدة! التنزيل الخاص بك جاهز.',
      downloadNowButton: 'تنزيل الآن',
      cancelButton: 'إلغاء'
    },
    en: {
      title: 'Download without Watermark',
      description: 'Watch a short ad to unlock a high-quality, watermark-free download of your image.',
      watchAdButton: 'Watch Ad',
      adRunningText: 'Ad is running... Please wait',
      successMessage: 'Thanks for watching! Your download is ready.',
      downloadNowButton: 'Download Now',
      cancelButton: 'Cancel'
    }
  };

  t = computed(() => this.translations[this.language()]);


  simulateAd() {
    console.log("Simulating rewarded ad view...");

    // *************************************************************
    // This is where you would integrate your actual rewarded ad SDK
    /*
    1. Trigger the ad library (AdMob/AdSense etc.).
    2. The code below should only run on the success callback from the library.
    */
    // *************************************************************

    this.isLoading.set(true);
    this.countdown.set(5);
    this.countdownInterval = setInterval(() => {
      this.countdown.update(c => c - 1);
      if (this.countdown() <= 0) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = undefined;
        this.adWatched.set(true);
        this.isLoading.set(false);
        console.log("Ad successfully watched (simulated)!");
      }
    }, 1000);
  }

  completeAction() {
    this.adCompleted.emit();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}
