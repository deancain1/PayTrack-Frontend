import {
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
  ChangeDetectorRef,
  NgZone,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Html5Qrcode } from 'html5-qrcode';

import { AttendanceService } from '../../features/services/attendance-service';
import { AttendanceScanModel } from '../../features/models/attendance/attendance-scan-model';

@Component({
  selector: 'app-scanner-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scanner-page.html',
  styleUrl: './scanner-page.scss'
})
export class ScannerPage implements OnInit, OnDestroy {

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  statusMessage = 'Starting scanner...';

  countdown = 3;
  isCountingDown = false;

  showPhotoCamera = false;

  private html5QrCode!: Html5Qrcode;
  private photoStream?: MediaStream;

  private scannedId = '';
  private scannedEmployeeNumber = '';

  private isScanning = false;

  constructor(
    private attendanceService: AttendanceService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  
  async ngOnInit() {
    await this.startQrScanner();
  }

  ngOnDestroy(): void {
    this.stopPhotoCamera();

    if (this.html5QrCode) {
      this.html5QrCode.stop().catch(() => {});
    }
  }


  // RESET FLOW 
  private async resetScanner() {
    this.stopPhotoCamera();

    this.showPhotoCamera = false;
    this.isCountingDown = false;
    this.countdown = 3;

    this.scannedId = '';
    this.scannedEmployeeNumber = '';
    this.statusMessage = 'Ready to scan QR...';

    this.cdr.detectChanges();

    setTimeout(() => {
      this.startQrScanner();
    }, 300);
  }

  // QR SCANNER
  async startQrScanner() {
    if (this.isScanning) return;

    this.isScanning = true;

    this.html5QrCode = new Html5Qrcode('reader');

    try {
      await this.html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: 250
        },
        async (decodedText) => {

          const parts = decodedText.split('|');

          const Id = parts[0] ?? '';
          const employeeNumber = parts[1] ?? '';

          if (!Id || !employeeNumber) return;

          this.scannedId = Id;
          this.scannedEmployeeNumber = employeeNumber;

          this.statusMessage = `QR detected: ${employeeNumber}`;

          await this.html5QrCode.stop();
          this.isScanning = false;

          this.openSelfieCamera();
        },
        () => {}
      );

    } catch (err) {
      console.error('QR scanner error:', err);
      this.isScanning = false;
    }
  }

  // SELFIE CAMERA
  async openSelfieCamera() {
    this.showPhotoCamera = true;
    this.cdr.detectChanges();

    try {
      this.photoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });

      setTimeout(async () => {
        const video = this.video?.nativeElement;
        if (!video || !this.photoStream) return;

        video.srcObject = this.photoStream;

        try {
          await video.play();
        } catch (err) {
          console.warn('Video play failed:', err);
        }

        this.startCountdown();
      }, 200);

    } catch (err) {
      console.error('Camera error:', err);
    }
  }

  // COUNTDOWN 
  startCountdown() {
    this.countdown = 3;
    this.isCountingDown = true;
    this.cdr.detectChanges();

    const interval = setInterval(() => {
      this.ngZone.run(() => {

        this.countdown--;
        this.cdr.detectChanges();

        if (this.countdown <= 0) {
          clearInterval(interval);

          this.isCountingDown = false;
          this.cdr.detectChanges();

          setTimeout(() => {
            this.captureAndSubmit();
          }, 150);
        }

      });
    }, 1000);
  }

  // CAPTURE PHOTO
  capturePhoto(): string {
    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
  }

  // SUBMIT ATTENDANCE
  captureAndSubmit() {
    const photoBase64 = this.capturePhoto();

    const payload: AttendanceScanModel = {
      Id: this.scannedId,
      employeeNumber: this.scannedEmployeeNumber,
      photoBase64
    };

    this.statusMessage = 'Uploading attendance...';

    this.attendanceService.recordAttendance(payload).subscribe({

      next: async () => {
        this.statusMessage =
          `Attendance recorded for ${this.scannedEmployeeNumber}`;

        await this.resetScanner();
      },

      error: async () => {
        this.statusMessage = 'Failed to record attendance';

        await this.resetScanner();
      }
    });
  }

  // STOP CAMERA
  stopPhotoCamera() {
    if (!this.photoStream) return;

    this.photoStream.getTracks().forEach(t => t.stop());
    this.photoStream = undefined;
  }
}