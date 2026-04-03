"use client";

import { useState } from "react";
import { Copy, ExternalLink, Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { prepareInvoiceShare } from "@/actions/invoice.actions";
import { Button } from "@/components/ui/button";

interface InvoiceShareActionsProps {
  invoiceId: string;
}

export function InvoiceShareActions({ invoiceId }: InvoiceShareActionsProps) {
  const [loading, setLoading] = useState<"whatsapp-copy" | "copy-link" | "copy-text" | "email" | null>(null);

  async function getShareData() {
    return prepareInvoiceShare(invoiceId);
  }

  async function handleWhatsAppCopy() {
    setLoading("whatsapp-copy");

    try {
      const result = await getShareData();
      await navigator.clipboard.writeText(result.message);
      toast.success("WhatsApp message copied.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to copy WhatsApp message");
    } finally {
      setLoading(null);
    }
  }

  async function handleCopyLink() {
    setLoading("copy-link");
    try {
      const result = await getShareData();
      await navigator.clipboard.writeText(result.shareUrl);
      toast.success("Invoice share link copied.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to copy share link");
    } finally {
      setLoading(null);
    }
  }

  async function handleCopyText() {
    setLoading("copy-text");
    try {
      const result = await getShareData();
      await navigator.clipboard.writeText(result.message);
      toast.success("Invoice share message copied.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to copy share message");
    } finally {
      setLoading(null);
    }
  }

  async function handleEmailDraft() {
    setLoading("email");
    try {
      const result = await getShareData();
      window.location.href = result.emailDraftUrl;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to prepare email draft");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button type="button" onClick={handleWhatsAppCopy} disabled={loading !== null}>
        <MessageCircle className="mr-2 h-4 w-4" />
        {loading === "whatsapp-copy" ? "Preparing WhatsApp..." : "Copy for WhatsApp"}
      </Button>
      <Button type="button" variant="outline" onClick={handleCopyLink} disabled={loading !== null}>
        <ExternalLink className="mr-2 h-4 w-4" />
        {loading === "copy-link" ? "Preparing Link..." : "Copy Share Link"}
      </Button>
      <Button type="button" variant="outline" onClick={handleCopyText} disabled={loading !== null}>
        <Copy className="mr-2 h-4 w-4" />
        {loading === "copy-text" ? "Preparing Text..." : "Copy Share Text"}
      </Button>
      <Button type="button" variant="outline" onClick={handleEmailDraft} disabled={loading !== null}>
        <Mail className="mr-2 h-4 w-4" />
        {loading === "email" ? "Preparing Email..." : "Email Draft"}
      </Button>
    </div>
  );
}
