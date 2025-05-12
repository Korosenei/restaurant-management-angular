import { Component, OnInit } from '@angular/core';
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
export class ConsommationComponent implements OnInit {
  qrCodeData: string = '';
  scanResult: QRCODE | null = null;
  qrCode: QRCODE | null = null;
  qrCodeList: QRCODE[] = [];
  formatsEnabled: BarcodeFormat[] = [BarcodeFormat.QR_CODE];
  scanState: 'invalide' | 'valide' | 'expire' | 'corrompu' | null = null;
  selectedDevice: MediaDeviceInfo | undefined;
  scanMessage: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getQrcode();
  }

  getQrcode() {
    this.http.get<QRCODE[]>('http://localhost:2030/qrcodes/all').subscribe({
      next: (res) => {
        this.qrCodeList = res;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des QRCodes', err);
      },
    });
  }

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

    const url = `http://localhost:2030/qrcodes/scan/${encodeURIComponent(this.qrCodeData)}`;

    this.http.get<QRCODE>(url).subscribe({
      next: (data) => {
        this.loading = false;

        if (!data) {
          this.setScanResult('corrompu', '❌ QR Code invalide ou non reconnu.');
          return;
        }

        this.qrCode = data;
        this.setScanResult('valide', '✅ QR Code valide.');
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;

        const code = error?.error?.code;
        const message = error?.error?.message || 'Erreur inconnue.';

        switch (code) {
          case 100: // QRCODE_NOT_FOUND
            this.setScanResult('corrompu', '❌ QR Code invalide ou non reconnu.');
            break;
          case 101: // QRCODE_EXPIRED
            this.setScanResult('expire', '⛔ QR Code expiré. Générer à nouveau.');
            break;
          case 102: // QRCODE_NOT_VALID
          case 103: // QRCODE_ALREADY_IN_USE
            this.setScanResult('invalide', '⚠️ QR Code déjà utilisé pour un ticket consommé.');
            break;
          default:
            this.setScanResult('corrompu', `❌ ${message}`);
        }
      },
    });
  }

  private setScanResult(
    state: 'valide' | 'invalide' | 'expire' | 'corrompu',
    message: string
  ) {
    this.scanState = state;
    this.scanMessage = message;
  }

  getScanClass(): string {
    switch (this.scanState) {
      case 'valide':
        return 'bg-success animate__animated animate__fadeInDown';
      case 'expire':
        return 'bg-warning text-dark animate__animated animate__shakeX';
      case 'invalide':
        return 'bg-danger animate__animated animate__fadeInUp';
      case 'corrompu':
        return 'bg-dark text-light animate__animated animate__fadeIn';
      default:
        return 'bg-secondary';
    }
  }

  validerConsommation() {
    if (!this.qrCode) return;

    const url = `http://localhost:2030/qrcodes/confirm/${encodeURIComponent(this.qrCodeData)}`;

    this.http.put(url, {}).subscribe({
      next: () => {
        // On marque comme consommé côté affichage
        this.qrCode!.consumed = true;

        // Message de succès
        this.setScanResult('valide', '✅ Ticket consommé avec succès.');

        // Réinitialisation après délai (affichage message 3 secondes)
        setTimeout(() => {
          this.qrCode = null;
          this.qrCodeData = '';
          this.scanState = null;
          this.scanMessage = '';
        }, 3000);
      },
      error: () => {
        alert('Échec de la validation.');
      },
    });
  }

  refuserConsommation() {
    this.qrCode = null;
    this.qrCodeData = '';
    this.scanState = 'invalide';
    this.scanMessage = '❌ Scan annulé.';

    // Réinitialiser l'état après 3 secondes
    setTimeout(() => {
      this.scanState = null;
      this.scanMessage = '';
    }, 3000);
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
