import { ArrowLeft } from "lucide-react";

interface CertificatePageProps {
  onBack: () => void;
}

export default function CertificatePage({ onBack }: CertificatePageProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition-colors text-sm font-medium mb-6"
          data-ocid="certificate.back.button"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <div className="flex justify-center">
          <img
            src="/assets/degree-certificate-220504250731.jpg"
            alt="Degree Certificate"
            style={{ maxWidth: 900, width: "100%" }}
            className="rounded shadow"
            data-ocid="certificate.canvas_target"
          />
        </div>
      </div>
    </div>
  );
}
