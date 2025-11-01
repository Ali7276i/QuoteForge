
import { Component, ChangeDetectionStrategy, output, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rewarded-ad-modal',
  templateUrl: './rewarded-ad-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class RewardedAdModalComponent implements OnDestroy {
  adCompleted = output<void>();
  closeModal = output<void>();

  isLoading = signal(false);
  countdown = signal(5);
  adWatched = signal(false);
  // FIX: Correct the type to be compatible with both browser (number) and Node (Timeout) environments.
  private countdownInterval: ReturnType<typeof setInterval> | undefined;

  simulateAd() {
    console.log("يتم الآن محاكاة مشاهدة الإعلان المكافِئ...");

    // *************************************************************
    // المنطقة التي سيتم فيها إضافة كود الإعلان المكافِئ الفعلي:
    
    /*
    1. هنا يتم تشغيل مكتبة الإعلان الفعلية (AdMob/AdSense).
    2. يتم تنفيذ الكود أدناه فقط بعد تأكيد نجاح الإعلان من المكتبة.
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
        console.log("تمت مشاهدة الإعلان بنجاح (محاكاة)!");
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
