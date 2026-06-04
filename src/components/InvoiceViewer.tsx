/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Invoice, RentalOrder } from '../types';
import { 
  Receipt, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Users, 
  FolderPlus, 
  Coins, 
  HelpCircle,
  TrendingUp,
  Download
} from 'lucide-react';

interface InvoiceViewerProps {
  invoices: Invoice[];
  orders: RentalOrder[];
  onTriggerExtension: (orderId: string, monthlyCost: number) => void;
  onPayInvoice: (invoiceId: string) => void;
  onTriggerRefund: (orderId: string) => void;
}

export default function InvoiceViewer({
  invoices,
  orders,
  onTriggerExtension,
  onPayInvoice,
  onTriggerRefund
}: InvoiceViewerProps) {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    invoices.length > 0 ? invoices[0].id : null
  );

  const activeInvoice = invoices.find(i => i.id === selectedInvoiceId) || invoices[0];

  // Helper to calculate cost for second-month extension on active monthly orders
  const getExtensionDetails = (order: RentalOrder) => {
    // Sum rental rates
    let rentCost = 0;
    order.items.forEach(item => {
      rentCost += item.monthlyRate * item.quantity;
    });
    // Check if 3+ months discount was applied
    const discount = order.durationValue >= 3 ? Math.round(rentCost * 0.05) : 0;
    return {
      monthlyRentCharge: rentCost,
      discount,
      totalExtensionCharge: rentCost - discount
    };
  };

  const handleCreateMonth2Bill = (order: RentalOrder) => {
    const details = getExtensionDetails(order);
    onTriggerExtension(order.id, details.totalExtensionCharge);
    alert(`Sukses! Invoice Bulan Kedua untuk proyek "${order.projectName}" telah diterbitkan tanpa membebankan Uang Jaminan baru.`);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const formatTanggal = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div id="invoice-tab" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Invoice list selector (4 Cols) */}
      <div className="lg:col-span-4 space-y-4">
        
        {/* Quick helper reminder box */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-705/10 p-4 rounded-xl space-y-2">
          <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-500" />
            Siklus Invoice & Jaminan
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Sistem kami memecah tagihan menjadi dua bagian: <strong>Invoice Awal (Bulan ke-1 + Jaminan)</strong>, dilanjutkan dengan <strong>Invoice Perpanjangan (Bulan ke-2 dst Tanpa Jaminan)</strong> setelah penandatanganan perpanjangan waktu.
          </p>
        </div>

        <h3 className="text-sm font-display font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Receipt className="w-4 h-4 text-amber-500" />
          Semua Faktur Tagihan
        </h3>

        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1" id="invoice-list-container">
          {invoices.map((inv) => {
            const active = activeInvoice?.id === inv.id;
            return (
              <div
                key={inv.id}
                onClick={() => setSelectedInvoiceId(inv.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex justify-between items-center ${
                  active 
                  ? 'bg-amber-500/10 border-amber-500' 
                  : 'bg-slate-800 border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-mono font-bold text-slate-400">{inv.id}</span>
                    <span className={`text-[9px] font-sans font-bold px-1.5 py-0.2 rounded ${
                      inv.type === 'initial' ? 'bg-blue-500/10 text-blue-400' :
                      inv.type === 'extension' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-rose-500/10 text-rose-400'
                    }`}>
                      {inv.type === 'initial' && 'AWAL (DEP)'}
                      {inv.type === 'extension' && 'BULAN KE-2'}
                      {inv.type === 'refund' && 'REFUND'}
                    </span>
                  </div>
                  <h4 className="text-white text-xs font-bold font-sans line-clamp-1">{inv.contractorName}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{inv.projectName}</p>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-xs font-bold text-white font-mono block">
                    {formatRupiah(inv.totalAmount)}
                  </span>
                  <span className={`text-[10px] font-semibold ${inv.isPaid ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {inv.isPaid ? 'LUNAS ✓' : 'UNPAID'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Month 2 Invoice Manual Trigger Panel */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <FolderPlus className="w-4 h-4 text-amber-500" />
            Terbitkan Invoice Bulan Ke-2
          </h4>
          <p className="text-[11px] text-slate-400 leading-normal">
            Gunakan panel ini untuk mensimulasikan perpanjangan dan menerbitkan tagihan bulan kedua tanpa jaminan jika proyek diperpanjang.
          </p>
          
          <div className="space-y-2">
            {orders
              .filter(o => o.rentMethod === 'bulanan' && o.status === 'active' && !o.isExtended)
              .map(order => (
                <div key={order.id} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850 flex flex-col gap-1.5 text-xs">
                  <div>
                    <span className="font-bold text-slate-200 block">{order.contractorName}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{order.projectName}</span>
                  </div>
                  <button
                    onClick={() => handleCreateMonth2Bill(order)}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-1 px-2 rounded text-[10px] text-center transition"
                  >
                    Simulasi Tagih Bulan Kedua (Rp 0 Deposit)
                  </button>
                </div>
              ))}
            
            {orders.filter(o => o.rentMethod === 'bulanan' && o.status === 'active' && !o.isExtended).length === 0 && (
              <p className="text-[10px] text-slate-500 italic text-center">Tidak ada kontrak bulanan aktif yang siap diperpanjang saat ini.</p>
            )}
          </div>
        </div>

        {/* Deposit Refund actions when order returned */}
        <div className="bg-slate-800 border border-slate-705/10 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5 canvas-align">
            <Coins className="w-4 h-4" />
            Pengembalian Uang Jaminan
          </h4>
          <p className="text-[11px] text-slate-400 leading-normal">
            Bila scaffolding sudah dikembalikan, proses pengembalian jaminan (Refund Deposit) untuk mencairkan saldo deposit.
          </p>

          <div className="space-y-2">
            {orders
              .filter(o => o.status === 'active' && o.refundStatus === 'none')
              .map(order => (
                <div key={order.id} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850 flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-200 block truncate max-w-[150px]">{order.contractorName}</span>
                    <span className="text-blue-400 font-bold font-mono text-[10px]">{formatRupiah(order.securityDepositPaid)}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Apakah Anda yakin ingin memproses pengembalian uang jaminan sebesar ${formatRupiah(order.securityDepositPaid)} untuk PT ${order.contractorName}?`)) {
                        onTriggerRefund(order.id);
                        alert(`Uang Jaminan Kontrak ${order.id} sebesar ${formatRupiah(order.securityDepositPaid)} telah berhasil dikembalikan.`);
                      }
                    }}
                    className="bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white font-semibold py-1 px-2 rounded text-[10px] text-center transition"
                  >
                    Proses Pengembalian Jaminan
                  </button>
                </div>
              ))}

            {orders.filter(o => o.status === 'active' && o.refundStatus === 'none').length === 0 && (
              <p className="text-[10px] text-slate-500 italic text-center">Tidak ada jaminan aktif yang terdaftar untuk dikembalikan saat ini.</p>
            )}
          </div>
        </div>

      </div>

      {/* Invoice detail mockup print block (8 Cols) */}
      <div className="lg:col-span-8 space-y-4">
        {!activeInvoice ? (
          <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-12 text-center text-slate-500 italic">
            Silakan pilih invoice di daftar sebelah kiri untuk melihat rincian penagihan.
          </div>
        ) : (
          <div className="bg-slate-800 border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden" id="invoice-doc-detail">
            {/* Invoice Top Toolrail */}
            <div className="bg-slate-900 p-4 border-b border-slate-700/40 flex justify-between items-center">
              <span className="text-xs text-slate-400 font-mono">FAKTUR FORM_ID: <strong className="text-slate-250 text-white">{activeInvoice.id}</strong></span>
              
              <div className="flex gap-2">
                {!activeInvoice.isPaid && (
                  <button
                    onClick={() => {
                      onPayInvoice(activeInvoice.id);
                      alert(`Pembayaran Invoice ${activeInvoice.id} Terkonfirmasi Lunas! Terima kasih.`);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition"
                  >
                    Bayar Lunas Sekarang
                  </button>
                )}
                
                <button
                  onClick={handlePrint}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white border border-slate-700 px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Cetak
                </button>
              </div>
            </div>

            {/* Print paper page style - Black/White with slight offwhite borders */}
            <div className="p-6 md:p-8 bg-slate-950 text-slate-900 shadow-inner max-w-3xl mx-auto rounded-b-2xl border-x border-b border-slate-800/20 font-sans" id="invoice-print-area">
              
              {/* Paper Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-350/20 pb-5 mb-6 text-slate-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="p-1 px-1.5 rounded bg-amber-500 text-slate-950 font-extrabold text-sm font-display tracking-tight">SR</span>
                    <span className="font-display font-bold text-lg text-white">SCAFFORENT LOGISTIK</span>
                  </div>
                  <p className="text-[10px] text-slate-400 max-w-xs leading-normal">
                    Penyedia Sewa Modular Keselamatan Scaffolding Konstruksi Profesional.<br />
                    DKI Jakarta & Jabodetabek, Indonesia.
                  </p>
                </div>

                <div className="text-right mt-4 md:mt-0 space-y-1 text-slate-300">
                  <h3 className="text-base font-bold tracking-wider font-display uppercase">INVOICE PENAGIHAN</h3>
                  <div className="text-xs font-mono">No: <span className="text-white font-bold">{activeInvoice.id}</span></div>
                  <div className="text-[10px] text-slate-400">Order Ref: {activeInvoice.orderId}</div>
                </div>
              </div>

              {/* Invoice Addresses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 mb-6 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                <div className="space-y-1.5">
                  <span className="text-slate-500 font-semibold block uppercase text-[9px]">DITAGIHKAN KEPADA:</span>
                  <h4 className="font-bold text-white text-sm">{activeInvoice.contractorName}</h4>
                  <p className="text-slate-400 italic line-clamp-1">{activeInvoice.projectName}</p>
                </div>

                <div className="text-left md:text-right space-y-1">
                  <div className="grid grid-cols-2 justify-end gap-1 text-[11px]">
                    <span className="text-slate-500">Tanggal Terbit:</span>
                    <span className="text-slate-300 font-mono text-right">{formatTanggal(activeInvoice.createdAt)}</span>
                    <span className="text-slate-500">Batas Tempo:</span>
                    <span className="text-slate-300 font-mono text-right">{formatTanggal(activeInvoice.dueDate)}</span>
                    <span className="text-slate-500">Status Pembayaran:</span>
                    <span className={`font-bold text-right font-sans uppercase ${activeInvoice.isPaid ? 'text-emerald-400' : 'text-amber-500'}`}>
                      {activeInvoice.isPaid ? '✓ LUNAS' : '🔔 UNPAID'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Standard Informative Alerts per Bill type */}
              {activeInvoice.type === 'initial' && (
                <div className="p-3 mb-6 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Informasi Uang Jaminan (Deposit):</strong> Invoice awal ini menyertakan biaya sewa dan uang jaminan. Jaminan ini dititipkan sementara selama masa sewa dan akan dikembalikan 100% setelah barang selesai dijemput dalam kondisi lengkap.
                  </div>
                </div>
              )}

              {activeInvoice.type === 'extension' && (
                <div className="p-3 mb-6 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Invoice Bulan Kedua (Sewa Lanjutan):</strong> Atas kesepakatan perpanjangan kontrak sewa, invoice kedua diterbitkan secara eksklusif dengan biaya sewa murni. <strong className="text-emerald-400">Biaya jaminan tercatat Rp 0</strong> karena menggunakan dana jaminan awal yang masih aktif.
                  </div>
                </div>
              )}

              {activeInvoice.type === 'refund' && (
                <div className="p-3 mb-6 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2">
                  <Coins className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Tanda Terima Pencairan Dana Jaminan:</strong> Dokumen formal pengembalian uang jaminan atas selesainya kontrak rental scaffolding. Seluruh material terverifikasi lengkap.
                  </div>
                </div>
              )}

              {/* Items Table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-slate-300 text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 uppercase text-[9px] font-bold">
                      <th className="py-2.5 text-left">Deskripsi Produk Scaffolding</th>
                      <th className="py-2.5 text-right">Biaya/Unit</th>
                      <th className="py-2.5 text-right">Durasi Rentang</th>
                      <th className="py-2.5 text-right">Jumlah</th>
                      <th className="py-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-900 hover:bg-slate-900/10">
                      <td className="py-3 font-semibold text-slate-200">
                        {activeInvoice.type === 'initial' && 'Penyewaan Awal Modul Scaffolding / Frame Konstruksi'}
                        {activeInvoice.type === 'extension' && 'Sewa Lanjutan Bulan Kedua - Scaffolding Modular'}
                        {activeInvoice.type === 'refund' && 'Pengembalian Dana Jaminan Kontral Rental (Deposit)'}
                      </td>
                      <td className="py-3 text-right font-mono">
                        {activeInvoice.type === 'refund' ? '-' : formatRupiah(activeInvoice.rentCost)}
                      </td>
                      <td className="py-3 text-right">
                        {activeInvoice.type === 'refund' ? '-' : 'Terjadwal'}
                      </td>
                      <td className="py-3 text-right font-bold text-white">
                        {activeInvoice.type === 'refund' ? '1 Kontrak' : 'Barang Terinstal'}
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-white">
                        {activeInvoice.type === 'refund' ? '-' : formatRupiah(activeInvoice.rentCost)}
                      </td>
                    </tr>

                    {/* Jaminan Line (Only displayed visually in items if initial invoice or extension) */}
                    <tr className="border-b border-slate-900">
                      <td className="py-3 text-slate-400">
                        Uang Jaminan Refundable (Security Deposit)
                        <span className="text-[10px] text-slate-500 block">Kompensasi penjaminan barang di lapangan</span>
                      </td>
                      <td className="py-3 text-right font-mono">
                        {formatRupiah(activeInvoice.securityDeposit)}
                      </td>
                      <td className="py-3 text-right">-</td>
                      <td className="py-3 text-right text-slate-400">1 Titipan</td>
                      <td className={`py-3 text-right font-mono font-bold ${activeInvoice.securityDeposit > 0 ? 'text-blue-400' : 'text-slate-500'}`}>
                        {formatRupiah(activeInvoice.securityDeposit)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Total calculations */}
              <div className="flex justify-end pt-4 border-t border-slate-800 text-slate-300 text-xs">
                <div className="w-64 space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subtotal Sewa:</span>
                    <span>{formatRupiah(activeInvoice.rentCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nilai Jaminan:</span>
                    <span className={activeInvoice.securityDeposit > 0 ? 'text-blue-400 font-bold' : ''}>
                      {formatRupiah(activeInvoice.securityDeposit)}
                    </span>
                  </div>
                  
                  {activeInvoice.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Diskon Paket:</span>
                      <span>-{formatRupiah(activeInvoice.discount)}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-800 pt-2 flex justify-between font-sans text-sm font-bold text-white">
                    <span>Grand Total:</span>
                    <span className="text-amber-500 scale-105">{formatRupiah(activeInvoice.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details / Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 pt-6 border-t border-slate-350/20 text-[10px] text-slate-400 leading-normal">
                <div>
                  <h5 className="font-bold text-slate-300 mb-1.5 uppercase tracking-wide">METODE PEMBAYARAN TRANSFER BANK:</h5>
                  <p className="font-mono bg-slate-900/60 p-2.5 rounded border border-slate-800 space-y-0.5">
                    <span className="block">Bank Mandiri: <strong>167-009-84321-11</strong></span>
                    <span className="block">Atas Nama: <strong>PT SCAFFORENT LOGISTIK INDONESIA</strong></span>
                    <span className="block text-slate-500">Sertakan Catatan: Invoice {activeInvoice.id}</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <h5 className="font-bold text-slate-300 mb-1">KETENTUAN UMUM:</h5>
                  <p>
                    1. Uang jaminan (deposit) akan **dikembalikan paling lambat H+2** setelah tim verifikator gudang menyelesaikan inspeksi kelengkapan scaffolding di lokasi bongkar muat.<br />
                    2. Untuk perpanjangan sewa kontrak bulan kedua, cukup melunasi biaya sewa bulanan murni tanpa dibebankan uang jaminan lagi.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
}
