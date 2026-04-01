import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  Clock,
  FileText,
  Home,
  LogOut,
  Upload,
  User,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Document } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddDocument,
  useGetCallerDocuments,
  useGetCallerUserProfile,
  useGetStats,
  useVerifyDocument,
} from "../hooks/useQueries";

const DIGI_LOGO =
  "https://digilockergovin-tu6.caffeine.xyz/assets/uploads/digi_logo_copy-removebg-preview-019d32f5-1b26-744b-ac87-a57a710500be-2.png";

const DOC_TYPES = [
  "Aadhaar Card",
  "PAN Card",
  "Passport",
  "Driving License",
  "Birth Certificate",
  "Marksheet",
  "Income Tax Certificate",
  "Electricity Bill",
  "Other",
];

const ISSUERS = [
  "UIDAI",
  "Income Tax Department",
  "Ministry of External Affairs",
  "Ministry of Road Transport",
  "Municipal Corporation",
  "CBSE Board",
  "JVVNL Limited",
  "Other",
];

function StatusBadge({ status }: { status: string }) {
  if (status === "verified")
    return (
      <Badge className="bg-green-100 text-green-700 border-green-200">
        <CheckCircle size={12} className="mr-1" />
        Verified
      </Badge>
    );
  if (status === "pending")
    return (
      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
        <Clock size={12} className="mr-1" />
        Pending
      </Badge>
    );
  return (
    <Badge className="bg-red-100 text-red-700 border-red-200">
      <XCircle size={12} className="mr-1" />
      Failed
    </Badge>
  );
}

interface DashboardPageProps {
  onNavigateHome: () => void;
}

export default function DashboardPage({ onNavigateHome }: DashboardPageProps) {
  const { identity, clear } = useInternetIdentity();
  const { data: documents = [], isLoading } = useGetCallerDocuments();
  const { data: stats } = useGetStats();
  const { data: profile } = useGetCallerUserProfile();
  const addDocument = useAddDocument();
  const verifyDocument = useVerifyDocument();

  const [uploadForm, setUploadForm] = useState({
    name: "",
    docType: "",
    issuer: "",
  });
  const [verifyId, setVerifyId] = useState("");
  const [verifyResult, setVerifyResult] = useState<
    null | "verified" | "pending" | "failed"
  >(null);

  const principal = identity?.getPrincipal().toString() ?? "";
  const displayName =
    profile?.name || (principal ? `${principal.slice(0, 8)}...` : "User");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.name || !uploadForm.docType || !uploadForm.issuer) {
      toast.error("Please fill all fields");
      return;
    }
    const doc: Document = {
      id: BigInt(Date.now()),
      name: uploadForm.name,
      docType: uploadForm.docType,
      issuer: uploadForm.issuer,
      status: "pending",
      uploadDate: BigInt(Date.now()),
    };
    try {
      await addDocument.mutateAsync(doc);
      toast.success("Document uploaded successfully!");
      setUploadForm({ name: "", docType: "", issuer: "" });
    } catch {
      toast.error("Failed to upload document");
    }
  };

  const handleVerify = async () => {
    const id = BigInt(verifyId);
    const found = documents.find((d) => d.id === id);
    if (!found) {
      setVerifyResult("failed");
      return;
    }
    try {
      await verifyDocument.mutateAsync(id);
      setVerifyResult("verified");
      toast.success("Document verified!");
    } catch {
      setVerifyResult("failed");
    }
  };

  const handleLogout = () => {
    clear();
    onNavigateHome();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center"
          >
            <img
              src={DIGI_LOGO}
              alt="DigiLocker"
              className="h-12 object-contain"
            />
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#003366" }}
              >
                <User size={16} className="text-white" />
              </div>
              <span className="gov-blue-text font-medium hidden sm:block">
                {displayName}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateHome}
              className="hidden sm:flex items-center gap-1"
              data-ocid="dashboard.home.button"
            >
              <Home size={14} />
              Home
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
              data-ocid="dashboard.logout.button"
            >
              <LogOut size={14} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl text-white p-6 mb-8"
          style={{
            background: "linear-gradient(135deg, #003366 0%, #1a4a8a 100%)",
          }}
        >
          <h1 className="text-2xl font-bold mb-1">
            Welcome to your DigiLocker, {displayName}!
          </h1>
          <p className="text-blue-200 text-sm">
            Your secure digital document wallet
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "My Documents",
              value: documents.length,
              icon: FileText,
              color: "#003366",
            },
            {
              label: "Verified",
              value: documents.filter((d) => d.status === "verified").length,
              icon: CheckCircle,
              color: "#16a34a",
            },
            {
              label: "Pending",
              value: documents.filter((d) => d.status === "pending").length,
              icon: Clock,
              color: "#ca8a04",
            },
            {
              label: "Total Platform Users",
              value: stats ? Number(stats.totalUsers) : 0,
              icon: User,
              color: "#F4811F",
            },
          ].map((s, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: stat index stable
            <Card key={i} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: s.color }}
                    >
                      {s.value}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {s.label}
                    </div>
                  </div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${s.color}20` }}
                  >
                    <s.icon size={18} style={{ color: s.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="documents" data-ocid="dashboard.tab">
          <TabsList className="mb-6">
            <TabsTrigger value="documents" data-ocid="dashboard.documents.tab">
              My Documents
            </TabsTrigger>
            <TabsTrigger value="upload" data-ocid="dashboard.upload.tab">
              Upload Document
            </TabsTrigger>
            <TabsTrigger value="verify" data-ocid="dashboard.verify.tab">
              Verify Document
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg gov-blue-text">
                  Recent Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div
                    className="text-center py-8 text-gray-400"
                    data-ocid="documents.loading_state"
                  >
                    Loading documents...
                  </div>
                ) : documents.length === 0 ? (
                  <div
                    className="text-center py-12 text-gray-400"
                    data-ocid="documents.empty_state"
                  >
                    <FileText size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No documents yet</p>
                    <p className="text-sm mt-1">
                      Upload your first document to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc, i) => (
                      <motion.div
                        key={doc.id.toString()}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-blue-200 transition-colors"
                        data-ocid={`documents.item.${i + 1}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: "#003366" }}
                          >
                            <FileText size={16} className="text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-sm gov-blue-text">
                              {doc.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {doc.docType} &bull; {doc.issuer}
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={doc.status} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg gov-blue-text">
                  Upload Document
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleUpload}
                  className="space-y-4 max-w-lg"
                  data-ocid="upload.panel"
                >
                  <div>
                    <label
                      htmlFor="doc-name"
                      className="text-sm font-medium text-gray-700 mb-1 block"
                    >
                      Document Name
                    </label>
                    <Input
                      id="doc-name"
                      value={uploadForm.name}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, name: e.target.value })
                      }
                      placeholder="e.g. My Aadhaar Card"
                      data-ocid="upload.name.input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="doc-type"
                      className="text-sm font-medium text-gray-700 mb-1 block"
                    >
                      Document Type
                    </label>
                    <Select
                      value={uploadForm.docType}
                      onValueChange={(v) =>
                        setUploadForm({ ...uploadForm, docType: v })
                      }
                    >
                      <SelectTrigger
                        id="doc-type"
                        data-ocid="upload.type.select"
                      >
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {DOC_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label
                      htmlFor="doc-issuer"
                      className="text-sm font-medium text-gray-700 mb-1 block"
                    >
                      Issuer
                    </label>
                    <Select
                      value={uploadForm.issuer}
                      onValueChange={(v) =>
                        setUploadForm({ ...uploadForm, issuer: v })
                      }
                    >
                      <SelectTrigger
                        id="doc-issuer"
                        data-ocid="upload.issuer.select"
                      >
                        <SelectValue placeholder="Select issuer" />
                      </SelectTrigger>
                      <SelectContent>
                        {ISSUERS.map((is) => (
                          <SelectItem key={is} value={is}>
                            {is}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    disabled={addDocument.isPending}
                    style={{ backgroundColor: "#003366" }}
                    className="text-white flex items-center gap-2"
                    data-ocid="upload.submit_button"
                  >
                    {addDocument.isPending ? (
                      "Uploading..."
                    ) : (
                      <>
                        <Upload size={16} /> Upload Document
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verify">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg gov-blue-text">
                  Verify Document
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-md">
                  <p className="text-sm text-gray-600 mb-4">
                    Enter the Document ID (numeric) to verify its status
                  </p>
                  <div className="flex gap-3">
                    <Input
                      value={verifyId}
                      onChange={(e) => {
                        setVerifyId(e.target.value);
                        setVerifyResult(null);
                      }}
                      placeholder="Enter numeric Document ID"
                      type="number"
                      data-ocid="verify.input"
                    />
                    <Button
                      type="button"
                      onClick={handleVerify}
                      disabled={verifyDocument.isPending || !verifyId}
                      style={{ backgroundColor: "#003366" }}
                      className="text-white px-6"
                      data-ocid="verify.submit_button"
                    >
                      Verify
                    </Button>
                  </div>
                  {verifyResult && (
                    <div
                      className={`mt-4 p-4 rounded-lg text-sm font-medium ${
                        verifyResult === "verified"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : verifyResult === "pending"
                            ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                      data-ocid={`dashboard.verify.${verifyResult}_state`}
                    >
                      {verifyResult === "verified" &&
                        "✅ Document Verified — Authentic and valid."}
                      {verifyResult === "pending" &&
                        "⏳ Verification Pending — Document is under review."}
                      {verifyResult === "failed" &&
                        "❌ Verification Failed — Document not found or invalid."}
                    </div>
                  )}
                  {documents.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-2">
                        Your document IDs:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {documents.slice(0, 5).map((doc) => (
                          <button
                            key={doc.id.toString()}
                            type="button"
                            onClick={() => {
                              setVerifyId(doc.id.toString());
                              setVerifyResult(null);
                            }}
                            className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 font-mono"
                          >
                            {doc.id.toString().slice(0, 8)}...
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
