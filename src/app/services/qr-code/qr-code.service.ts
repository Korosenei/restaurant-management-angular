import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jsQR from 'jsqr';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {
  constructor(private http: HttpClient) {}

  // Méthode pour scanner et valider un QR code
  validateQRCode(canvas: HTMLCanvasElement): void {
    const context = canvas.getContext('2d');
    if (context) {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const decoded = jsQR(imageData.data, canvas.width, canvas.height);

      if (decoded) {
        const qrData = JSON.parse(decoded.data); // Décode le QR Code en JSON
        this.checkQRCodeInDatabase(qrData); // Vérifier dans la base de données
      } else {
        alert('QR Code non valide ou corrompu');
      }
    }
  }

  // Vérifier si les données du QR code existent dans la base de données
  checkQRCodeInDatabase(qrData: any): void {
    this.http.get<any[]>(`http://localhost:3000/qrCodes`).subscribe(
      (qrCodes) => {
        // Vérifier si le QR code scanné existe dans la base
        const found = qrCodes.find(qrCode => qrCode.transactionNumber === qrData.transactionNumber &&
                                                qrCode.ticketNumber === qrData.ticketNumber);

        if (found) {
          // QR Code valide, afficher les informations
          this.displayScanResult(qrData);
        } else {
          alert('QR Code invalide ou non trouvé');
        }
      },
      (error) => {
        console.error('Erreur lors de la vérification du QR code', error);
      }
    );
  }

  // Afficher les résultats dans le tableau
  displayScanResult(qrData: any): void {
    console.log('QR Code valide:', qrData);
  }
}
