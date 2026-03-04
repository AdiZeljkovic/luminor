const PDFDocument = require('pdfkit');

/**
 * Generate a Luminor-branded invoice PDF
 * @param {Object} invoice - Invoice model instance (plain object)
 * @param {Object} client - Client model instance (plain object)
 * @returns {Promise<Buffer>}
 */
function generateInvoicePdf(invoice, client) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: 'A4', margin: 50 });
            const chunks = [];
            doc.on('data', c => chunks.push(c));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            const DARK = '#0F172A';
            const ORANGE = '#FF9F1C';
            const GRAY = '#64748B';
            const LIGHT = '#F8FAFC';

            // ── Header ─────────────────────────────────────────
            doc.rect(0, 0, doc.page.width, 90).fill(DARK);

            doc.fontSize(28).font('Helvetica-Bold').fillColor(ORANGE).text('LUMINOR', 50, 28);
            doc.fontSize(9).font('Helvetica').fillColor('#FFFFFF').text('luminor.solutions', 50, 60);

            doc.fontSize(9).fillColor('#FFFFFF')
                .text('Porodice Ribar 39, 71000 Sarajevo', doc.page.width - 230, 28, { width: 180, align: 'right' })
                .text('info@luminor.solutions', doc.page.width - 230, 42, { width: 180, align: 'right' })
                .text('+387 62 574 783', doc.page.width - 230, 56, { width: 180, align: 'right' });

            // ── Invoice title ───────────────────────────────────
            doc.moveDown(4);
            doc.fontSize(22).font('Helvetica-Bold').fillColor(DARK)
                .text('INVOICE', 50, 110);
            doc.fontSize(10).font('Helvetica').fillColor(GRAY)
                .text(`# ${invoice.invoice_number}`, 50, 136);

            // Status badge
            const statusColors = { paid: '#10B981', pending: '#F59E0B', overdue: '#EF4444', draft: '#94A3B8' };
            const statusColor = statusColors[invoice.status] || GRAY;
            doc.roundedRect(doc.page.width - 130, 110, 80, 24, 4).fill(statusColor);
            doc.fontSize(9).font('Helvetica-Bold').fillColor('#FFFFFF')
                .text(invoice.status.toUpperCase(), doc.page.width - 130, 118, { width: 80, align: 'center' });

            // ── Bill To ─────────────────────────────────────────
            doc.fontSize(9).font('Helvetica-Bold').fillColor(GRAY).text('BILL TO', 50, 170);
            doc.fontSize(12).font('Helvetica-Bold').fillColor(DARK).text(client.name || 'Client', 50, 184);
            if (client.company) doc.fontSize(10).font('Helvetica').fillColor(GRAY).text(client.company, 50, 200);
            doc.fontSize(10).font('Helvetica').fillColor(GRAY).text(client.email || '', 50, client.company ? 214 : 200);

            // Dates
            doc.fontSize(9).font('Helvetica-Bold').fillColor(GRAY).text('ISSUE DATE', doc.page.width - 200, 170, { width: 150, align: 'right' });
            doc.fontSize(10).font('Helvetica').fillColor(DARK)
                .text(new Date(invoice.createdAt || Date.now()).toLocaleDateString('en-GB'), doc.page.width - 200, 184, { width: 150, align: 'right' });
            if (invoice.due_date) {
                doc.fontSize(9).font('Helvetica-Bold').fillColor(GRAY).text('DUE DATE', doc.page.width - 200, 202, { width: 150, align: 'right' });
                doc.fontSize(10).font('Helvetica').fillColor(DARK)
                    .text(new Date(invoice.due_date).toLocaleDateString('en-GB'), doc.page.width - 200, 216, { width: 150, align: 'right' });
            }

            // ── Items Table ─────────────────────────────────────
            const tableTop = 260;
            doc.rect(50, tableTop, doc.page.width - 100, 28).fill(DARK);
            doc.fontSize(8).font('Helvetica-Bold').fillColor('#FFFFFF')
                .text('DESCRIPTION', 62, tableTop + 10)
                .text('QTY', 340, tableTop + 10, { width: 40, align: 'right' })
                .text('UNIT PRICE', 390, tableTop + 10, { width: 70, align: 'right' })
                .text('TOTAL', 470, tableTop + 10, { width: 75, align: 'right' });

            const items = Array.isArray(invoice.items) ? invoice.items : [];
            let y = tableTop + 28;

            items.forEach((item, i) => {
                const rowBg = i % 2 === 0 ? LIGHT : '#FFFFFF';
                doc.rect(50, y, doc.page.width - 100, 26).fill(rowBg);
                doc.fontSize(9).font('Helvetica').fillColor(DARK)
                    .text(item.description || '', 62, y + 8, { width: 270 })
                    .text(String(item.quantity || 1), 340, y + 8, { width: 40, align: 'right' })
                    .text(`${invoice.currency || 'EUR'} ${Number(item.unit_price || 0).toFixed(2)}`, 390, y + 8, { width: 70, align: 'right' })
                    .text(`${invoice.currency || 'EUR'} ${Number(item.total || 0).toFixed(2)}`, 470, y + 8, { width: 75, align: 'right' });
                y += 26;
            });

            // ── Total ───────────────────────────────────────────
            y += 10;
            doc.rect(doc.page.width - 210, y, 160, 32).fill(ORANGE);
            doc.fontSize(10).font('Helvetica-Bold').fillColor(DARK)
                .text('TOTAL', doc.page.width - 205, y + 10)
                .text(`${invoice.currency || 'EUR'} ${Number(invoice.amount || 0).toFixed(2)}`, doc.page.width - 205, y + 10, { width: 150, align: 'right' });

            // ── Notes ───────────────────────────────────────────
            if (invoice.notes) {
                y += 50;
                doc.fontSize(8).font('Helvetica-Bold').fillColor(GRAY).text('NOTES', 50, y);
                doc.fontSize(9).font('Helvetica').fillColor(DARK).text(invoice.notes, 50, y + 14, { width: doc.page.width - 100 });
            }

            // ── Footer ──────────────────────────────────────────
            doc.rect(0, doc.page.height - 40, doc.page.width, 40).fill(DARK);
            doc.fontSize(8).font('Helvetica').fillColor('#64748B')
                .text('Thank you for your business! — luminor.solutions', 50, doc.page.height - 25, { align: 'center', width: doc.page.width - 100 });

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = { generateInvoicePdf };
