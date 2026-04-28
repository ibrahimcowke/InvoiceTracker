const fs = require('fs');

const files = [
  { name: 'src/pages/Checks.tsx', v: 'selectedCheck' },
  { name: 'src/pages/Customers.tsx', v: 'selectedCustomer', t: 'Customer' },
  { name: 'src/pages/Delivery.tsx', v: 'selectedDelivery' },
  { name: 'src/pages/Invoices.tsx', v: 'selectedInvoice', t: 'Invoice' },
  { name: 'src/pages/Payments.tsx', v: 'selectedPayment' }
];

files.forEach(f => {
  let content = fs.readFileSync(f.name, 'utf8');
  
  content = content.replace(/const confirmDelete = \(\) => \{\n(\s+)set/g, `const confirmDelete = () => {\n$1if (!${f.v}) return;\n$1set`);
  content = content.replace(/const saveEdit = \(\) => \{\n(\s+)set/g, `const saveEdit = () => {\n$1if (!${f.v}) return;\n$1set`);
  
  if (f.t) {
    const regex = new RegExp(`setSelected${f.t}\\(\\{\\.\\.\\.${f.v},([^}]+)\\}\\)`, 'g');
    content = content.replace(regex, `setSelected${f.t}({...${f.v},$1} as ${f.t})`);
  }
  
  fs.writeFileSync(f.name, content);
});
console.log("Fixes applied successfully");
