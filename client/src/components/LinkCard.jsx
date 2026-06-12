import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  Copy, 
  Calendar, 
  Trash2, 
  BarChart3, 
  QrCode, 
  Download, 
  ExternalLink,
  Hourglass
} from 'lucide-react';

const LinkCard = ({ url, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const shortUrl = `${window.location.origin}/${url.shortCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    const canvas = document.getElementById(`qr-${url._id}`);
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `linkpulse-qr-${url.shortCode}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const isExpired = url.expiresAt && new Date(url.expiresAt) <= new Date();

  return (
    <div class="glass-card p-5 sm:p-6 mb-4 relative overflow-hidden group">
      {/* Expiration warning indicator at top border */}
      {isExpired && (
        <div class="absolute top-0 left-0 right-0 h-1 bg-red-500"></div>
      )}

      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Core URL Details */}
        <div class="flex-grow min-w-0">
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <a 
              href={shortUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              class="font-display font-bold text-lg text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1.5"
            >
              /{url.shortCode}
              <ExternalLink size={14} class="opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>

            {/* Expired status indicator badge */}
            {isExpired ? (
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-950/40 text-red-400 border border-red-900/50">
                Expired
              </span>
            ) : url.expiresAt ? (
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/40 text-amber-400 border border-amber-900/40 flex items-center gap-1">
                <Hourglass size={10} />
                Expires {new Date(url.expiresAt).toLocaleDateString()}
              </span>
            ) : null}
          </div>

          <p class="text-slate-400 text-sm truncate max-w-[90%] font-mono" title={url.originalUrl}>
            {url.originalUrl}
          </p>

          <div class="flex items-center gap-4 mt-3 text-xs text-slate-500">
            <span class="flex items-center gap-1">
              <Calendar size={13} />
              {new Date(url.createdAt).toLocaleDateString()}
            </span>
            <span class="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800/60 font-semibold text-slate-300">
              {url.clicks} {url.clicks === 1 ? 'click' : 'clicks'}
            </span>
          </div>
        </div>

        {/* Action Panel */}
        <div class="flex items-center justify-end flex-wrap gap-2 pt-3 lg:pt-0 border-t border-slate-800/40 lg:border-none">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            class={`p-2.5 rounded-lg border transition-all duration-200 flex items-center gap-1.5 text-xs font-medium ${
              copied
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
            title="Copy Short URL"
          >
            <Copy size={15} />
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {/* QR Code toggle */}
          <button
            onClick={() => setShowQr(!showQr)}
            class={`p-2.5 rounded-lg border transition-all duration-200 flex items-center gap-1.5 text-xs font-medium ${
              showQr
                ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
            title="Toggle QR Code"
          >
            <QrCode size={15} />
            <span>QR Code</span>
          </button>

          {/* View Analytics */}
          <Link
            to={`/analytics/${url._id}`}
            class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-brand-400 hover:border-brand-500/30 transition-all duration-200 flex items-center gap-1.5 text-xs font-medium"
            title="View detailed analytics"
          >
            <BarChart3 size={15} />
            <span>Analytics</span>
          </Link>

          {/* Delete URL */}
          <button
            onClick={() => onDelete(url._id)}
            class="p-2.5 rounded-lg bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 hover:border-red-500/30 text-red-400 transition-all duration-200"
            title="Delete URL"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Expandable QR Code Section */}
      {showQr && (
        <div class="mt-4 pt-4 border-t border-slate-800/40 flex flex-col sm:flex-row items-center gap-4 bg-slate-950/40 p-4 rounded-xl animate-fadeIn">
          {/* Canvas-based QR Code representation */}
          <div class="bg-white p-2 rounded-lg">
            <QRCodeCanvas
              id={`qr-${url._id}`}
              value={shortUrl}
              size={120}
              level="H"
              includeMargin={false}
            />
          </div>
          <div class="text-center sm:text-left flex-grow">
            <h4 class="text-sm font-semibold text-slate-200">QR Code Generated</h4>
            <p class="text-xs text-slate-500 mt-1">Scan to navigate to your shortened URL, or download the high-res QR asset.</p>
            <button
              onClick={handleDownloadQr}
              class="mt-3 btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 mx-auto sm:mx-0"
            >
              <Download size={13} />
              Download PNG
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkCard;
