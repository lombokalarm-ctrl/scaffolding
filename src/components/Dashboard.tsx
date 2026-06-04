/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Wrench, 
  TrendingUp, 
  Clock, 
  Receipt, 
  Layers, 
  ShieldAlert, 
  AlertTriangle,
  Smartphone,
  ChevronRight,
  PackageCheck,
  Truck,
  Users,
  Activity,
  Package
} from 'lucide-react';
import { RentalOrder, InventoryStock, Invoice, SystemNotification, AuditLog } from '../types';

interface DashboardProps {
  orders: RentalOrder[];
  inventory: InventoryStock[];
  invoices: Invoice[];
  notifications: SystemNotification[];
  auditLogs: AuditLog[];
  onNavigate: (tab: string) => void;
  onSelectOrder: (orderId: string) => void;
  onSimulateReminder: () => void;
  onTriggerExtension: (orderId: string, monthlyCost: number) => void;
}

export default function Dashboard({
  orders,
  inventory,
  invoices,
  notifications,
  auditLogs,
  onNavigate,
  onSelectOrder,
  onSimulateReminder,
  onTriggerExtension
}: DashboardProps) {
  
  // Calculate stats
  const activeOrders = orders.filter(o => o.status === 'active' || o.status === 'delivered');
  const totalDepositHeld = orders
    .filter(o => o.status !== 'returned' && o.refundStatus !== 'refunded')
    .reduce((sum, o) => sum + o.securityDepositPaid, 0);
  
  const totalStockItems = inventory.reduce((sum, item) => sum + item.total, 0);
  const totalRentedItems = inventory.reduce((sum, item) => sum + item.rented, 0);
  const overallAvailabilityPercent = Math.round(((totalStockItems - totalRentedItems) / totalStockItems) * 100) || 0;

  const unreadAlertsCount = notifications.filter(n => !n.read).length;

  const [logFilter, setLogFilter] = useState<'all' | 'inventory' | 'sales' | 'customer'>('all');

  // Helper to calculate cost for second-month extension on active monthly orders
  const getExtensionDetails = (order: RentalOrder) => {
    let rentCost = 0;
    order.items.forEach(item => {
      rentCost += item.monthlyRate * item.quantity;
    });
    const discount = order.durationValue >= 3 ? Math.round(rentCost * 0.05) : 0;
    return {
      monthlyRentCharge: rentCost,
      discount,
      totalExtensionCharge: rentCost - discount
    };
  };

  const filteredLogs = useMemo(() => {
    if (logFilter === 'all') return auditLogs;
    return auditLogs.filter(log => log.category === logFilter);
  }, [auditLogs, logFilter]);

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div id="dashboard-tab" className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute right-10 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
        
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-semibold font-mono mb-4 border border-amber-500/10">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Sistem Pendukung Keputusan Gudang & Sewa PWA
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-white mb-2">
            Portal Sewa Scaffolding Kontraktor
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Sewa scaffolding modular secara fleksibel (harian & bulanan) dengan jaminan refundable aman. Dilengkapi manajemen stok mutasi Admin Gudang, pencatatan transaksi Sales, dan database rekanan kontraktor.
          </p>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <button 
              onClick={() => onNavigate('sewa')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/15 hover:scale-[1.02] active:scale-95 transition flex items-center gap-2 text-xs md:text-sm cursor-pointer"
              id="btn-quick-sewa"
            >
              <Wrench className="w-4 h-4" />
              Buat Transaksi Sewa Baru
            </button>
            <button 
              onClick={onSimulateReminder}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60 font-semibold rounded-xl hover:scale-[1.02] active:scale-95 transition flex items-center gap-2 text-xs md:text-sm cursor-pointer"
              id="btn-simulate-alert"
              title="Picu pengingat masa sewa otomatis h-3"
            >
              <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
              Simulasikan Alarm Sewa H-3
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid">
        {/* Stat 1: Katalog Alat */}
        <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-5 flex items-center justify-between shadow-md">
          <div className="space-y-1.5">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Katalog Komponen</span>
            <span className="text-2xl font-display font-extrabold text-white block font-mono">
              {inventory.length} Model Alat
            </span>
            <span 
              onClick={() => onNavigate('inventory')}
              className="text-[11px] text-amber-500 hover:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
            >
              <Package className="w-3.5 h-3.5 inline shrink-0" /> 
              Atur Model & Edit Stok
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 2: Kontrak Berjalan */}
        <div className="bg-slate-800 border border-slate-755 border-slate-700/50 rounded-2xl p-5 flex items-center justify-between shadow-md">
          <div className="space-y-1.5">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Kontrak Sewa Aktif</span>
            <span className="text-2xl font-display font-extrabold text-white block font-mono">
              {activeOrders.length} Proyek
            </span>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <PackageCheck className="w-3.5 h-3.5 inline shrink-0" /> {orders.filter(o => o.status === 'active').length} Alat Terpasang
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-450 shrink-0">
            <Layers className="w-6 h-6 text-emerald-500" />
          </div>
        </div>

        {/* Stat 3: Uang Jaminan Ditahan */}
        <div className="bg-slate-800 border border-slate-755 border-slate-700/50 rounded-2xl p-5 flex items-center justify-between shadow-md">
          <div className="space-y-1.5">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Total Uang Jaminan</span>
            <span className="text-2xl font-display font-extrabold text-amber-400 block font-mono">
              {formatRupiah(totalDepositHeld)}
            </span>
            <span className="text-[11px] text-slate-500 block">
              Akan direfund setelah sewa selesai
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 4: Ketersediaan Stok */}
        <div className="bg-slate-800 border border-slate-755 border-slate-700/50 rounded-2xl p-5 flex items-center justify-between shadow-md">
          <div className="space-y-1.5">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Alat Ready di Gudang</span>
            <span className="text-2xl font-display font-extrabold text-white block font-mono">
              {overallAvailabilityPercent}% Ambil
            </span>
            <div className="w-24 bg-slate-700 h-1 rounded-full overflow-hidden mt-1.5">
              <div 
                className="bg-amber-500 h-full rounded-full" 
                style={{ width: `${overallAvailabilityPercent}%` }}
              ></div>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Real-time Tracking Quicklook & Audit Trail (Left Column - 8 Blocks) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Kontrak Sewa Berjalan */}
          <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base md:text-lg font-display font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Laporan Kontrak Sewa Aktif
                </h2>
                <p className="text-xs text-slate-400 font-sans">Daftar kontrak sewa proyek berjalan saat ini</p>
              </div>
              <button 
                onClick={() => onNavigate('invoice')}
                className="text-xs text-amber-500 hover:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                Kunjungi Invoices & Jaminan
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {orders.filter(o => o.status !== 'returned').length === 0 ? (
              <div className="border border-dashed border-slate-700/60 rounded-xl p-8 text-center text-slate-500">
                <Layers className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="text-xs italic leading-relaxed">Seluruh sewa scaffolding telah selesai & dikembalikan.</p>
                <button 
                  onClick={() => onNavigate('sewa')}
                  className="mt-3 text-xs bg-slate-900 hover:bg-slate-800 text-amber-500 border border-slate-700/80 px-3.5 py-1.5 rounded-xl transition cursor-pointer font-bold"
                >
                  Buat Sewa Baru Sekarang
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders
                  .filter(o => o.status !== 'returned')
                  .slice(0, 3)
                  .map(order => (
                    <div 
                      key={order.id} 
                      onClick={() => {
                        onNavigate('invoice');
                      }}
                      className="bg-slate-900/40 hover:bg-slate-900 border border-slate-700/40 hover:border-slate-700 p-4 rounded-xl cursor-pointer transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-amber-500 font-black tracking-wider uppercase">{order.id}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-305 text-slate-300 font-bold">{order.projectName}</span>
                        </div>
                        <h4 className="font-semibold text-white text-sm">{order.contractorName}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{order.projectAddress}</p>
                      </div>

                      <div className="text-right flex md:flex-col items-start md:items-end justify-between md:justify-center border-t md:border-t-0 pt-2 md:pt-0 border-slate-800 min-w-[200px]">
                        <span className="text-[11px] text-slate-300 font-mono block">
                          Jaminan Held: Rp {order.securityDepositPaid.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          Sewa: {order.items.reduce((sum, item) => sum + item.quantity, 0)} pcs ({order.rentMethod === 'bulanan' ? 'Bulanan' : 'Harian'})
                        </span>
                        <div className="flex items-center gap-3 mt-1 flex-wrap md:justify-end">
                          <span className="text-xs text-amber-500 hover:underline flex items-center font-bold">
                            Detail Tagihan <ChevronRight className="w-3.5 h-3.5 inline" />
                          </span>
                        </div>
                        {order.rentMethod === 'bulanan' && order.status === 'active' && !order.isExtended ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const details = getExtensionDetails(order);
                              onTriggerExtension(order.id, details.totalExtensionCharge);
                              alert(`Sukses perpanjangan sewa sekat secara instan!\n\nProyek: "${order.projectName}"\nBiaya Sewa Lanjutan: Rp ${details.totalExtensionCharge.toLocaleString('id-ID')}\nJaminan Tambahan: Rp 0 (Memanfaatkan jaminan berjalan).`);
                            }}
                            className="mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-1.5 px-3 rounded-lg text-[10px] leading-none transition shadow-sm hover:shadow-md cursor-pointer inline-flex items-center gap-1 shrink-0"
                          >
                            <Clock className="w-3 h-3" />
                            Perpanjang Cepat
                          </button>
                        ) : order.isExtended ? (
                          <span className="mt-2 text-[9px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono font-black tracking-wide px-2 py-0.5 rounded uppercase">
                            Bulan 2 Aktif
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Real-time Activity Logs (Audit Trail) */}
          <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-700/50 pb-3">
              <div>
                <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500 shrink-0" />
                  Jejak Real-time Log Audit Logistik
                </h3>
                <p className="text-xs text-slate-400">Verifikasi terintegrasi dari aktivitas mutasi, penagihan, dan pelanggan.</p>
              </div>

              {/* Log Filters */}
              <div className="flex flex-wrap gap-1 bg-slate-900 border border-slate-850 p-1 rounded-xl">
                {(['all', 'inventory', 'sales', 'customer'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setLogFilter(cat)}
                    className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase transition cursor-pointer ${
                      logFilter === cat 
                        ? 'bg-amber-500 text-slate-950 font-black shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat === 'all' && 'Semua Log'}
                    {cat === 'inventory' && 'Logistik'}
                    {cat === 'sales' && 'Keuangan'}
                    {cat === 'customer' && 'Pelanggan'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {filteredLogs.slice(0, 7).map((log) => {
                const isInventory = log.category === 'inventory';
                const isSales = log.category === 'sales';
                const isCustomer = log.category === 'customer';
                const isSystem = log.category === 'system';

                return (
                  <div 
                    key={log.id} 
                    className="p-3 bg-slate-900/30 rounded-xl border border-slate-700/20 hover:border-slate-700/50 transition flex items-start gap-3"
                  >
                    <div className={`p-1.5 rounded-lg text-xs shrink-0 ${
                      isInventory ? 'bg-purple-500/10 text-purple-400' :
                      isSales ? 'bg-emerald-500/10 text-emerald-450' : 
                      isCustomer ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-700/10 text-slate-400'
                    }`}>
                      {isInventory && <Wrench className="w-3.5 h-3.5" />}
                      {isSales && <Receipt className="w-3.5 h-3.5" />}
                      {isCustomer && <Users className="w-3.5 h-3.5" />}
                      {isSystem && <Activity className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-bold text-white font-sans">{log.userName}</span>
                        <span className={`text-[8px] font-bold font-mono tracking-wider px-1.5 py-0.2 rounded uppercase ${
                          log.userRole === 'warehouse_admin' ? 'bg-emerald-500/15 text-emerald-400' :
                          log.userRole === 'sales_admin' ? 'bg-indigo-500/15 text-indigo-400' :
                          'bg-amber-500/15 text-amber-500'
                        }`}>
                          {log.userRole === 'warehouse_admin' ? 'Admin Gudang' :
                           log.userRole === 'sales_admin' ? 'Sales Admin' : 'Manager'}
                        </span>

                        <span className="text-[9px] text-slate-500 font-mono ml-auto">{log.id}</span>
                      </div>

                      <p className="text-[11px] text-slate-200 font-medium mt-1 uppercase block text-amber-505 text-amber-500 tracking-wider">
                        ★ {log.action}
                      </p>
                      <p className="text-xs text-slate-400 leading-normal mt-0.5 font-sans">
                        {log.details}
                      </p>

                      <div className="text-[9px] text-slate-550 text-slate-500 font-mono mt-1.5 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(log.timestamp).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })} - {new Date(log.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} WIB
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredLogs.length === 0 && (
                <div className="p-8 text-center text-slate-500 italic text-xs leading-relaxed">
                  Tidak ada aktivitas audit logistik yang tercatat untuk filter ini.
                </div>
              )}
            </div>
          </div>

          {/* Quick Info - Masa Sewa & Jaminan Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-5 space-y-3">
              <div className="p-2 rounded bg-amber-500/10 text-amber-500 w-fit">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Aturan Sewa Harian & Bulanan</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Biaya sewa dihitung per set/komponen per hari atau per bulan. Biaya bulanan direkomendasikan untuk durasi lebih dari 15 hari karena memiliki diskon paket bulanan hingga 40%. Perpanjangan dapat disetujui otomatis.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-5 space-y-3">
              <div className="p-2 rounded bg-blue-500/10 text-blue-400 w-fit">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Uang Jaminan Kontrak (Deposit)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Setiap kontrak sewa menyertakan uang jaminan (deposit keamanan) pada Invoice Pertama. Jaminan ini akan **dikembalikan 100% secara utuh** setelah seluruh modul scaffolding dikembalikan dalam kondisi lengkap tanpa kerusakan berat.
              </p>
            </div>
          </div>

        </div>

        {/* Notifications & PWA installation sidebar (Right Column - 4 Blocks) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Automatic Notification Panel */}
          <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1">
                <Clock className="w-4 h-4 text-amber-500" />
                Sinyal Notifikasi Sewa
              </h3>
              {unreadAlertsCount > 0 && (
                <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.5 rounded-full">
                  {unreadAlertsCount} BARU
                </span>
              )}
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">Tidak ada notifikasi aktif saat ini.</p>
              ) : (
                notifications.map(notif => (
                  <div 
                    key={notif.id}
                    className={`p-3 rounded-lg border text-xs relative ${
                      notif.read ? 'bg-slate-900/30 border-slate-800/80' : 'bg-amber-500/5 border-amber-500/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-bold text-slate-200 block mb-1">{notif.title}</span>
                      <span className="text-[9px] text-slate-500 block">
                        {new Date(notif.createdAt).toLocaleTimeString('id-US', {hour: '2-digit', minute: '2-digit'})}
                      </span>
                    </div>
                    <p className="text-slate-400 leading-relaxed mb-2">{notif.message}</p>
                    
                    {notif.actionType === 'extend' && (
                      <button
                        onClick={() => {
                          onNavigate('invoice'); // Invoices tab to see invoices and extend
                        }}
                        className="bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-slate-950 px-2 py-1 rounded text-[10px] w-full font-semibold transition text-center block cursor-pointer"
                      >
                        Perpanjang Kontrak (Bulan Ke-2 tanpa Deposit)
                      </button>
                    )}
                    
                    {notif.actionType === 'view_tracker' && notif.orderId && (
                      <button
                        onClick={() => {
                          onSelectOrder(notif.orderId!);
                          onNavigate('tracking');
                        }}
                        className="bg-blue-500/10 hover:bg-blue-500/30 text-blue-400 px-2.5 py-1 rounded text-[10px] w-full font-semibold transition text-center block cursor-pointer"
                      >
                        Lacak Posisi Kargo
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* PWA Integration Banner */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-5 rounded-2xl shadow-lg text-center relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-20 h-20 bg-amber-500/5 rounded-full blur-xl"></div>
            
            <Smartphone className="w-10 h-10 mx-auto text-amber-500 mb-3" />
            
            <h4 className="font-display font-bold text-white text-sm mb-1">
              Instal Aplikasi di Smartphone
            </h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Jalankan ScaffoRent langsung dari homescreen Anda! Mendukung mode offline, notifikasi instan, dan performa pemantauan di proyek lapangan.
            </p>
            
            <div className="bg-slate-950/60 p-3 rounded-lg text-left border border-slate-800 text-[11px] text-slate-400 leading-normal space-y-1.5 mb-4">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span><strong>Android (Chrome):</strong> Pilih menu titik tiga, klik "Tambahkan ke Layar Utama".</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span><strong>iOS (Safari):</strong> Klik tombol "Share/Bagikan", pilih "Add to Home Screen".</span>
              </div>
            </div>

            <button
              onClick={() => {
                alert('PWA siap dipasang! Silakan ikuti instruksi browser di ponsel Anda. Jika menggunakan desktop Chrome, ikon install akan muncul di kanan atas kolom URL.');
              }}
              className="w-full py-2 bg-slate-700/80 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-xs font-semibold hover:text-white transition cursor-pointer"
            >
              Cek Status PWA
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
