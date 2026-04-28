import { pdf } from "@react-pdf/renderer";
import React from "react";
import { InvoicePDF } from "@/components/invoices/InvoicePDF";
import type { Invoice } from "@/types";

/**
 * Generates and downloads a PDF for a specific invoice
 * @param invoice The invoice data to generate the PDF from
 */
export const downloadInvoicePDF = async (invoice: Invoice) => {
  try {
    const blob = await pdf(React.createElement(InvoicePDF, { invoice }) as any).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice-${invoice.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
