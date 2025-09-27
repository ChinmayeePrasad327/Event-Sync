import React, { useEffect, useRef } from 'react';
import { X, Download, Share } from 'lucide-react';
import QRCode from 'qrcode';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  eventId: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, eventTitle, eventId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const qrData = `EventSync-RSVP:${eventId}:${Date.now()}`;
      QRCode.toCanvas(canvasRef.current, qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        }
      });
    }
  }, [isOpen, eventId]);

  const downloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `${eventTitle}-QR.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const shareQR = () => {
    if (navigator.share && canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `${eventTitle}-QR.png`, { type: 'image/png' });
          navigator.share({
            title: `RSVP QR Code - ${eventTitle}`,
            text: `My RSVP confirmation for ${eventTitle}`,
            files: [file]
          });
        }
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">RSVP Confirmed!</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center">
          <div className="mb-4">
            <canvas
              ref={canvasRef}
              className="mx-auto border border-gray-200 rounded-lg"
            />
          </div>
          
          <h4 className="font-medium text-gray-900 mb-2">{eventTitle}</h4>
          <p className="text-sm text-gray-600 mb-6">
            Show this QR code at the event for quick check-in
          </p>

          <div className="flex space-x-3">
            <button
              onClick={downloadQR}
              className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
            <button
              onClick={shareQR}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;