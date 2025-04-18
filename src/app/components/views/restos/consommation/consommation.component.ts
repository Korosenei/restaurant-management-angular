import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
} from '@angular/common/http';
import { QRCODE } from '../../../../models/model-restos/qrcode.model';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/browser';

@Component({
  selector: 'app-consommation',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, ZXingScannerModule],
  templateUrl: './consommation.component.html',
  styleUrl: './consommation.component.scss',
})
export class ConsommationComponent {
  qrCodeData: string = '';
  qrCode: QRCODE | null = null;
  formatsEnabled: BarcodeFormat[] = [BarcodeFormat.QR_CODE];
  scanState: 'valide' | 'expiré' | 'corrompu' | null = null;
  selectedDevice: MediaDeviceInfo | undefined;
  scanMessage: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  get qrCodeDetails() {
    if (!this.qrCode) return [];
    return [
      {
        label: 'Numéro Transaction',
        value: this.qrCode.ticket?.transactionDto?.reference || '-',
      },
      { label: 'Numéro Ticket', value: this.qrCode.ticket?.numero || '-' },
      {
        label: "Date d'achat",
        value: this.qrCode.creationDate || '-',
      },
      {
        label: 'Client',
        value: `${this.qrCode.client?.prenom || ''} ${
          this.qrCode.client?.nom || ''
        }`,
      },
      {
        label: 'Géneré le ',
        value: this.qrCode.creationDate || '-',
      },
      {
        label: 'Expire le ',
        value: this.qrCode.expirationDate || '-',
      },
      {
        label: 'Statut',
        value: this.qrCode.consumed ? 'Consommé' : 'Non consommé',
      },
    ];
  }

  scannerQrCode() {
    if (!this.qrCodeData) return;

    this.loading = true;
    this.qrCode = null;
    this.scanState = null;
    this.scanMessage = '';

    const url = `http://localhost:2030/qrcodes/scan/${encodeURIComponent(
      this.qrCodeData
    )}`;

    this.http.get<QRCODE>(url).subscribe({
      next: (data) => {
        this.qrCode = new QRCODE(data);
        this.scanState = 'valide';
        this.scanMessage = 'QR Code valide.';
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        if (err.status === 410) {
          this.scanState = 'expiré';
          this.scanMessage = 'QR Code expiré.';
        } else if (err.status === 404) {
          this.scanState = 'corrompu';
          this.scanMessage = 'QR Code Corrompu.';
        } else {
          this.scanState = 'corrompu';
          this.scanMessage = 'QR Code Corrompu.';
        }
      },
    });
  }

  validerConsommation() {
    if (!this.qrCode) return;

    const url = `http://localhost:2030/qrcodes/confirm/${encodeURIComponent(
      this.qrCodeData
    )}`;

    this.http.put(url, {}).subscribe({
      next: () => {
        this.qrCode!.consumed = true;
        alert('Ticket marqué comme consommé !');
      },
      error: () => {
        alert('Échec de la validation.');
      },
    });
  }

  refuserConsommation() {
    this.qrCode = null;
    this.scanState = null;
    this.qrCodeData = '';
    this.scanMessage = 'Scan annulé.';
  }

  ngAfterViewInit(): void {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          const videoDevices = devices.filter((d) => d.kind === 'videoinput');
          if (videoDevices.length > 0) {
            this.selectedDevice = videoDevices[0];
          }
        });
      })
      .catch((err) => {
        console.error('Permission caméra refusée ou non disponible.', err);
        alert(
          'Permission caméra refusée. Vérifiez les autorisations du navigateur.'
        );
      });
  }

  // Lorsque le scanner détecte un code

  handleQrCodeResult(result: string): void {
    console.log('QR Code détecté :', result);
    this.qrCodeData = result;
    this.scannerQrCode();
  }
}
