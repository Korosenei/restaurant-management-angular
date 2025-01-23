import { Injectable } from '@angular/core';
import { BrowserQRCodeReader } from '@zxing/browser';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {
  private qrCodeReader = new BrowserQRCodeReader();

  async decodeImage(file: File): Promise<string | null> {
    const imageUrl = URL.createObjectURL(file);

    try {
      const result = await this.qrCodeReader.decodeFromImageUrl(imageUrl);
      return result.getText();
    } catch (error) {
      console.error('Erreur lors du décodage du QR code :', error);
      return null;
    } finally {
      URL.revokeObjectURL(imageUrl); // Libérez la mémoire
    }
  }
}
