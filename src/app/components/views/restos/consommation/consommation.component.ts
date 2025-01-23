import { Component } from '@angular/core';
import { QrCodeService } from '../../../../services/qr-code/qr-code.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consommation',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './consommation.component.html',
  styleUrl: './consommation.component.scss'
})
export class ConsommationComponent {

  qrCode: string | null = null;
  manualCode: string = '';
  scanResult: any = null;

  constructor(private qrCodeService: QrCodeService) {}

  async onFileSelected(event: Event): Promise<void> {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      this.qrCode = await this.qrCodeService.decodeImage(file);

      if (this.qrCode) {
        this.scanResult = {
          transactionNumber: 'TXN123456',
          ticketNumber: 'TKT987654',
          client: 'Jean Dupont',
          purchaseDate: new Date(),
          status: 'VALIDE',
        };
      } else {
        alert('Impossible de lire le QR code.');
      }
    }
  }

  approve(): void {
    if (this.qrCode) {
      console.log('Ticket approuvé :', this.scanResult);
      alert('Ticket approuvé avec succès');
    }
  }

  reject(): void {
    if (this.qrCode) {
      console.log('Ticket rejeté :', this.scanResult);
      alert('Ticket rejeté');
    }
  }
}
