import { Component, ViewChild, ElementRef } from '@angular/core';
import { QrCodeService } from '../../../../services/qr-code/qr-code.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import jsQR from 'jsqr';

@Component({
  selector: 'app-consommation',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './consommation.component.html',
  styleUrl: './consommation.component.scss'
})
export class ConsommationComponent {

  // Variables pour afficher les résultats
  transactionNumber: string | null = null;
  ticketNumber: string | null = null;
  clientName: string | null = null;
  purchaseDate: Date | null = null;
  status: string | null = null;
  ticketValid: boolean = false;  // Indicateur de validité du ticket
  qrCodeImageUrl: string | null = null;  // URL de l'image QR Code téléchargée
  file: File | null = null;  // Fichier téléchargé

  // Constructeur
  constructor(private http: HttpClient) {}

  // Méthode pour traiter l'image téléchargée
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.file = file;
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const imageDataUrl = e.target.result;
        this.qrCodeImageUrl = imageDataUrl;

        // Décodez l'image QR à partir de l'URL de données
        this.decodeQRCode(imageDataUrl);
      };

      reader.readAsDataURL(file);
    }
  }

  // Méthode pour décoder le QR code à partir de l'image
  decodeQRCode(imageDataUrl: string): void {
    const img = new Image();
    img.src = imageDataUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const qrCode = jsQR(imageData.data, canvas.width, canvas.height);
        if (qrCode) {
          this.processQRCode(qrCode.data);
        } else {
          this.ticketValid = false;
        }
      }
    };
  }

  // Traitement des données extraites du QR code
  processQRCode(data: string): void {
    this.http.get<any>(`http://localhost:3000/qrCodes`).subscribe(qrCodes => {
      const qrCode = qrCodes.find((code: any) => code.uniqueCode === data);
      if (qrCode) {
        // Si le QR Code est valide, remplissez les résultats
        this.transactionNumber = qrCode.transactionNumber;
        this.ticketNumber = qrCode.ticketNumber;
        this.clientName = qrCode.clientName;
        this.purchaseDate = new Date(qrCode.purchaseDate);
        this.status = qrCode.status;
        this.ticketValid = true; // Indique que le ticket est valide
      } else {
        // QR Code invalide
        this.ticketValid = false;
      }
    }, error => {
      console.error('Erreur lors de la récupération des QR Codes:', error);
      this.ticketValid = false;
    });
  }
}
