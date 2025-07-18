/**
 * データ暗号化サービス
 * 個人情報の保護とセキュリティ強化
 */

import CryptoJS from 'crypto-js';

export class EncryptionService {
  private static readonly SECRET_KEY = 'jyushin-care-app-secret-key-2024';
  private static readonly IV_SIZE = 16;

  /**
   * データを暗号化する
   */
  static encrypt(data: any): string {
    try {
      const jsonString = JSON.stringify(data);
      const iv = CryptoJS.lib.WordArray.random(this.IV_SIZE);
      const encrypted = CryptoJS.AES.encrypt(jsonString, this.SECRET_KEY, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      // IVと暗号化データを結合してBase64エンコード
      const result = iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
      return result;
    } catch (error) {
      console.error('暗号化エラー:', error);
      throw new Error('データの暗号化に失敗しました');
    }
  }

  /**
   * データを復号化する
   */
  static decrypt(encryptedData: string): any {
    try {
      // 暗号化データの解析
      const data = JSON.parse(encryptedData);
      const iv = CryptoJS.enc.Hex.parse(data.iv);
      const ciphertext = CryptoJS.enc.Hex.parse(data.ciphertext);
      
      // 復号化
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext, salt: '' } as any,
        this.SECRET_KEY,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );
      
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('復号化エラー:', error);
      throw new Error('データの復号化に失敗しました');
    }
  }

  /**
   * ファイルを暗号化して保存する
   */
  static async encryptAndSaveFile(data: any, filename: string): Promise<void> {
    try {
      const encryptedData = this.encrypt(data);
      const blob = new Blob([encryptedData], { type: 'application/octet-stream' });
      
      // ファイルをダウンロード
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.encrypted`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('ファイル暗号化エラー:', error);
      throw new Error('ファイルの暗号化に失敗しました');
    }
  }

  /**
   * 暗号化されたファイルを読み込んで復号化する
   */
  static async loadAndDecryptFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const encryptedData = e.target?.result as string;
          const decryptedData = this.decrypt(encryptedData);
          resolve(decryptedData);
        } catch (error) {
          reject(new Error('ファイルの復号化に失敗しました'));
        }
      };

      reader.onerror = () => {
        reject(new Error('ファイルの読み込みに失敗しました'));
      };

      reader.readAsText(file);
    });
  }

  /**
   * データの整合性をチェックする（ハッシュ値による検証）
   */
  static generateHash(data: any): string {
    const jsonString = JSON.stringify(data);
    return CryptoJS.SHA256(jsonString).toString();
  }

  /**
   * ハッシュ値が一致するかチェックする
   */
  static verifyHash(data: any, expectedHash: string): boolean {
    const actualHash = this.generateHash(data);
    return actualHash === expectedHash;
  }
} 