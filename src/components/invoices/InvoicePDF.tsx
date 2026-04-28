import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Invoice } from "@/types";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
    color: "#333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    borderBottom: 1,
    borderBottomColor: "#eee",
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  invoiceInfo: {
    textAlign: "right",
  },
  infoText: {
    fontSize: 10,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#999",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#f9f9f9",
    borderBottomColor: "#ddd",
    borderBottomWidth: 2,
  },
  col1: { flex: 3 },
  col2: { flex: 1, textAlign: "right" },
  col3: { flex: 1, textAlign: "right" },
  col4: { flex: 1, textAlign: "right" },
  headerText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
  },
  footer: {
    marginTop: 50,
    paddingTop: 20,
    borderTop: 1,
    borderTopColor: "#eee",
    textAlign: "center",
  },
  totalSection: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  totalLabel: {
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4f46e5",
  },
  compliance: {
    marginTop: 30,
    fontSize: 8,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
  },
});

export const InvoicePDF = ({ invoice }: { invoice: Invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.infoText}>{invoice.type} Record</Text>
        </View>
        <View style={styles.invoiceInfo}>
          <Text style={styles.infoText}>Invoice Number</Text>
          <Text style={styles.infoValue}>{invoice.id}</Text>
          <Text style={styles.infoText}>Date Issued</Text>
          <Text style={styles.infoValue}>{new Date().toLocaleDateString()}</Text>
          <Text style={styles.infoText}>Due Date</Text>
          <Text style={styles.infoValue}>{invoice.dueDate}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bill To</Text>
        <Text style={{ fontSize: 14, fontWeight: "bold" }}>{invoice.customer}</Text>
      </View>

      <View style={[styles.row, styles.tableHeader]}>
        <View style={styles.col1}><Text style={styles.headerText}>Description</Text></View>
        <View style={styles.col2}><Text style={styles.headerText}>Qty</Text></View>
        <View style={styles.col3}><Text style={styles.headerText}>Price</Text></View>
        <View style={styles.col4}><Text style={styles.headerText}>Total</Text></View>
      </View>

      {invoice.items && invoice.items.length > 0 ? (
        invoice.items.map((item, i) => (
          <View key={i} style={styles.row}>
            <View style={styles.col1}><Text>{item.description}</Text></View>
            <View style={styles.col2}><Text>{item.quantity}</Text></View>
            <View style={styles.col3}><Text>${(parseFloat(String(item.price).replace(/[^0-9.-]+/g, "")) || 0).toFixed(2)}</Text></View>
            <View style={styles.col4}><Text>${(item.quantity * (parseFloat(String(item.price).replace(/[^0-9.-]+/g, "")) || 0)).toFixed(2)}</Text></View>
          </View>
        ))
      ) : (
        <View style={styles.row}>
          <View style={styles.col1}><Text>Services Rendered</Text></View>
          <View style={styles.col2}><Text>1</Text></View>
          <View style={styles.col3}><Text>${(parseFloat(String(invoice.amount).replace(/[^0-9.-]+/g, "")) || 0).toFixed(2)}</Text></View>
          <View style={styles.col4}><Text>${(parseFloat(String(invoice.amount).replace(/[^0-9.-]+/g, "")) || 0).toFixed(2)}</Text></View>
        </View>
      )}

      <View style={styles.totalSection}>
        <View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text>${(parseFloat(String(invoice.amount).replace(/[^0-9.-]+/g, "")) || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax (0%):</Text>
            <Text>$0.00</Text>
          </View>
          <View style={[styles.totalRow, { borderTopWidth: 1, borderTopColor: "#eee", marginTop: 5, paddingTop: 5 }]}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>${(parseFloat(String(invoice.amount).replace(/[^0-9.-]+/g, "")) || 0).toLocaleString()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>Thank you for your business!</Text>
        <Text style={styles.compliance}>
          This invoice complies with Sharia principles. No late fees or interest are charged.
        </Text>
      </View>
    </Page>
  </Document>
);
