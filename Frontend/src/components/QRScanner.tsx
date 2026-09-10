import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export const QRScanner: React.FC<{ onScan: (text: string) => void }> = ({ onScan }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');

  const stopCamera = async () => {
    if (!scannerRef.current) return;
    try {
      await scannerRef.current.stop();
      scannerRef.current.clear();
    } catch {
      // ignore clean-up error
    }
    scannerRef.current = null;
    setScanning(false);
  };

  const startCamera = async () => {
    setError('');
    try {
      const scanner = new Html5Qrcode('carecue-qr-reader');
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 260, height: 260 } },
        (decodedText: string) => {
          onScan(decodedText);
          void stopCamera();
        },
        () => undefined
      );
      setScanning(true);
    } catch {
      scannerRef.current = null;
      setError('Could not start the camera. Check browser permission and try again.');
    }
  };

  const scanImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError('');
    let imageScanner: Html5Qrcode | null = null;
    try {
      await stopCamera();
      imageScanner = new Html5Qrcode('carecue-qr-image-reader');
      const decodedText = await imageScanner.scanFile(file, true);
      onScan(decodedText);
    } catch {
      setError('Could not find a QR code in that image. Upload a clear image containing the complete QR code.');
    } finally {
      imageScanner?.clear();
    }
  };

  useEffect(() => () => { void stopCamera(); }, []);

  return (
    <div className="space-y-3">
      <div id="carecue-qr-reader" className="max-w-sm mx-auto overflow-hidden rounded-2xl" />
      <div id="carecue-qr-image-reader" className="max-w-sm mx-auto overflow-hidden rounded-2xl" />
      <div className="flex justify-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => void (scanning ? stopCamera() : startCamera())}
          className="px-4 py-2 rounded-xl bg-amber-600 text-white text-sm font-bold cursor-pointer hover:bg-amber-700 transition"
        >
          {scanning ? 'Stop camera' : 'Start camera'}
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-bold cursor-pointer hover:bg-gray-200 transition"
        >
          Scan image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={scanImage}
          className="hidden"
        />
      </div>
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
    </div>
  );
};