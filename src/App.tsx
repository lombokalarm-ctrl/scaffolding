/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  INITIAL_ORDERS, 
  INITIAL_INVENTORY, 
  INITIAL_INVOICES, 
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS,
  INITIAL_CUSTOMERS,
  INITIAL_LOGS
} from './data/mockData';
import { 
  RentalOrder, 
  InventoryStock, 
  Invoice, 
  SystemNotification, 
  UserProfile, 
  UserRole, 
  Customer, 
  AuditLog 
} from './types';
import Dashboard from './components/Dashboard';
import SewaForm from './components/SewaForm';
import InvoiceViewer from './components/InvoiceViewer';
import InventoryReport from './components/InventoryReport';
import CustomerManager from './components/CustomerManager';
import { 
  Layers, 
  Wrench, 
  Truck, 
  Receipt, 
  ClipboardList, 
  Clock, 
  Menu, 
  X,
  Radio,
  Smartphone,
  Check,
  Building,
  HelpCircle,
  Users,
  ChevronDown,
  Activity
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Core App states
  const [orders, setOrders] = useState<RentalOrder[]>(INITIAL_ORDERS);
  const [inventory, setInventory] = useState<InventoryStock[]>(INITIAL_INVENTORY);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // User database & audit logging states
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]); // Default "Budi Santoso", warehouse_admin
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_LOGS);

  // Integrated action audit logger
  const logAction = (userName: string, userRole: UserRole, action: string, details: string, category: 'inventory' | 'sales' | 'customer' | 'system') => {
    const newLog: AuditLog = {
      id: 'LOG-' + Math.floor(10000 + Math.random() * 90000),
      userName,
      userRole,
      action,
      details,
      timestamp: new Date().toISOString(),
      category
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Handle adding new rental order from form submission
  const handleAddOrder = (newOrder: RentalOrder, newInvoice: Invoice) => {
    // 1. Save new structures
    setOrders(prev => [newOrder, ...prev]);
    setInvoices(prev => [newInvoice, ...prev]);

    // 2. Adjust warehouse inventory quantities dynamically
    setInventory(prevInv => {
      return prevInv.map(stockItem => {
        const selected = newOrder.items.find(item => item.itemId === stockItem.itemId);
        if (selected) {
          const nextRented = stockItem.rented + selected.quantity;
          const nextAvailable = Math.max(0, stockItem.available - selected.quantity);
          return {
            ...stockItem,
            rented: nextRented,
            available: nextAvailable
          };
        }
        return stockItem;
      });
    });

    // 3. Register Customer Project Incrementation
    setCustomers(prevCustomers => prevCustomers.map(cust => {
      if (cust.companyName.toLowerCase() === newOrder.contractorName.toLowerCase() ||
          cust.name.toLowerCase() === newOrder.contractorName.toLowerCase()) {
        return {
          ...cust,
          activeProjectsCount: cust.activeProjectsCount + 1
        };
      }
      return cust;
    }));

    // 4. Log to Audit trail
    logAction(
      currentUser.name,
      currentUser.role,
      'Transaksi Baru',
      `Mencatatkan transaksi awal online ${newOrder.id} untuk ${newOrder.contractorName} sebesar ${newInvoice.totalAmount.toLocaleString('id-ID')}.`,
      'sales'
    );

    // 5. Create initial notification alert
    const newAlert: SystemNotification = {
      id: 'NTF-' + Math.floor(10000 + Math.random() * 90000),
      orderId: newOrder.id,
      title: 'Pemesanan Berhasil & Disiapkan',
      message: `Pemuatan komponen scaffolding pesanan ${newOrder.id} sedang dipersiapkan di Gudang Utama untuk dilarikan menuju "${newOrder.projectName}".`,
      type: 'info',
      createdAt: new Date().toISOString(),
      read: false,
      actionType: 'view_invoice'
    };
    setNotifications(prev => [newAlert, ...prev]);

    // 6. Auto navigate safely to view the newly created invoice
    setSelectedOrderId(null);
    setActiveTab('invoice');
  };

  // Handle live delivery updates from Delivery tracker cockpit panel
  const handleUpdateOrderStatus = (
    orderId: string, 
    status: string, 
    progress: number, 
    trackingStep: number
  ) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const statusString = status as 'shipping' | 'active' | 'completed' | 'returned';

        // Log if status just shifted to active
        if (statusString === 'active' && order.status !== 'active') {
          logAction(
            currentUser.name, 
            currentUser.role, 
            'Bongkar Muat Scaffolding', 
            `Material scaffolding order ${orderId} telah tiba di lokasi proyek "${order.projectName}". Berstatus SEWA AKTIF.`, 
            'inventory'
          );
        }

        return {
          ...order,
          status: statusString,
          trackingStep,
          shippingProgress: progress
        };
      }
      return order;
    }));
  };

  // Monthly Extension Trigger (carried over months)
  const handleTriggerExtension = (orderId: string, monthlyRentCost: number) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Create Invoice 2 structure (type = extension, securityDeposit = 0)
    const extInvoiceId = 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    const newExtInvoice: Invoice = {
      id: extInvoiceId,
      orderId: order.id,
      contractorName: order.contractorName,
      projectName: order.projectName,
      type: 'extension',
      createdAt: today.toISOString(),
      rentCost: monthlyRentCost,
      securityDeposit: 0, // CRITICAL: Rp 0 Deposit as carrying over month-1 jaminan
      discount: 0,
      totalAmount: monthlyRentCost,
      isPaid: false,
      dueDate: today.toISOString().split('T')[0]
    };

    // Update orders list to flag extension completed
    setOrders(prev => prev.map(o => o.id === orderId ? { 
      ...o, 
      isExtended: true, 
      extendedAt: today.toISOString(),
      endDate: nextMonth.toISOString().split('T')[0]
    } : o));

    // Register invoice
    setInvoices(prev => [newExtInvoice, ...prev]);

    // Record Log Audit
    logAction(
      currentUser.name, 
      currentUser.role, 
      'Perpanjangan Kontrak', 
      `Memproses perpanjangan kontrak sewa ${orderId} ke Bulan Kedua (Invoice: ${extInvoiceId}) murni tanpa uang jaminan tambahan.`, 
      'sales'
    );

    // Send notification log
    const extensionAlert: SystemNotification = {
      id: 'NTF-' + Math.floor(10000 + Math.random() * 90000),
      orderId: order.id,
      title: 'Invoice Perpanjangan Terbit (Rp 0 Jaminan)',
      message: `Kontrak sewa untuk proyek "${order.projectName}" telah diperpanjang ke Bulan Kedua. Faktur baru ${extInvoiceId} diterbitkan murni biaya sewa tanpa jaminan tambahan.`,
      type: 'warning',
      createdAt: new Date().toISOString(),
      read: false,
      actionType: 'view_invoice'
    };
    setNotifications(prev => [extensionAlert, ...prev]);
  };

  // Pay invoice
  const handlePayInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        logAction(
          currentUser.name, 
          currentUser.role, 
          'Terima Pelunasan', 
          `Meregistrasikan pembayaran lunas untuk Invoice ${invoiceId} sebesar Rp ${inv.totalAmount.toLocaleString('id-ID')}.`, 
          'sales'
        );
        return { ...inv, isPaid: true };
      }
      return inv;
    }));

    const alertPay: SystemNotification = {
      id: 'NTF-' + Math.floor(10000 + Math.random() * 95000),
      title: 'Faktur Dilunasi Sukses',
      message: `Invoice dengan kode ${invoiceId} telah tervalidasi lunas oleh departemen Keuangan Logistindo.`,
      type: 'success',
      createdAt: new Date().toISOString(),
      read: false,
      actionType: 'view_invoice'
    };
    setNotifications(prev => [alertPay, ...prev]);
  };

  // Return & Secure Refund
  const handleTriggerRefund = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // 1. Mark order as returned & refunded
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'returned', refundStatus: 'refunded' } : o));

    // 2. Reduce Customer Active projects by 1
    setCustomers(prevCustomers => prevCustomers.map(cust => {
      if (cust.companyName.toLowerCase() === order.contractorName.toLowerCase() ||
          cust.name.toLowerCase() === order.contractorName.toLowerCase()) {
        return {
          ...cust,
          activeProjectsCount: Math.max(0, cust.activeProjectsCount - 1)
        };
      }
      return cust;
    }));

    // 3. Return physical items to warehouse available pool
    setInventory(prevInv => {
      return prevInv.map(stockItem => {
        const orderItem = order.items.find(it => it.itemId === stockItem.itemId);
        if (orderItem) {
          return {
            ...stockItem,
            rented: Math.max(0, stockItem.rented - orderItem.quantity),
            available: stockItem.available + orderItem.quantity
          };
        }
        return stockItem;
      });
    });

    // 4. Log to Audit Trace
    logAction(
      currentUser.name, 
      currentUser.role, 
      'Refund Jaminan', 
      `Mengembalikan dana jaminan sebesar Rp ${order.securityDepositPaid.toLocaleString('id-ID')} kepada ${order.contractorName} sehubungan scaffolding telah dikembalikan utuh ke Gudang.`, 
      'sales'
    );

    // Spawn return notification
    const refundAlert: SystemNotification = {
      id: 'NTF-' + Math.floor(10000 + Math.random() * 90000),
      orderId: order.id,
      title: 'Jaminan Refund Dibereskan',
      message: `Pemuatan kembali material rental selesai. Uang jaminan kontrak ${order.id} sebesar Rp ${order.securityDepositPaid.toLocaleString('id-ID')} telah dicairkan kembali secara utuh ke saldo rekanan.`,
      type: 'success',
      createdAt: new Date().toISOString(),
      read: false,
      actionType: 'view_invoice'
    };
    setNotifications(prev => [refundAlert, ...prev]);
  };

  // Restock logic by admin simulator
  const handleRestockItem = (itemId: string, qtyToAdd: number) => {
    setInventory(prev => prev.map(item => {
      if (item.itemId === itemId) {
        logAction(
          currentUser.name, 
          currentUser.role, 
          'Restock Alat', 
          `Menambah pasokan logistik sebanyak ${qtyToAdd} pcs secara manual untuk komponen ${item.itemName}.`, 
          'inventory'
        );
        return {
          ...item,
          total: item.total + qtyToAdd,
          available: item.available + qtyToAdd
        };
      }
      return item;
    }));
  };

  // Send items to maintenance repair workshop
  const handleSendToMaintenance = (itemId: string, qty: number) => {
    setInventory(prev => prev.map(item => {
      if (item.itemId === itemId) {
        logAction(
          currentUser.name, 
          currentUser.role, 
          'Kirim Perbaikan', 
          `Mengirimkan ${qty} pcs ${item.itemName} ke bengkel servis akibat karat / penyok las.`, 
          'inventory'
        );
        return {
          ...item,
          available: Math.max(0, item.available - qty),
          maintenance: item.maintenance + qty
        };
      }
      return item;
    }));
  };

  // Custom detailed update stock by admin
  const handleUpdateStockDetails = (itemId: string, updatedFields: Partial<InventoryStock>) => {
    setInventory(prev => prev.map(item => {
      if (item.itemId === itemId) {
        const originalName = item.itemName;
        const newName = updatedFields.itemName || item.itemName;
        
        let detailMsg = `Melakukan pembaruan profil stok ${newName}:`;
        if (updatedFields.available !== undefined && updatedFields.available !== item.available) {
          detailMsg += ` Ready Gudang ${item.available} ➔ ${updatedFields.available} pcs.`;
        }
        if (updatedFields.maintenance !== undefined && updatedFields.maintenance !== item.maintenance) {
          detailMsg += ` Perbaikan ${item.maintenance} ➔ ${updatedFields.maintenance} pcs.`;
        }
        if (updatedFields.rented !== undefined && updatedFields.rented !== item.rented) {
          detailMsg += ` Di Proyek ${item.rented} ➔ ${updatedFields.rented} pcs.`;
        }
        if (updatedFields.itemName !== undefined && originalName !== updatedFields.itemName) {
          detailMsg += ` Nama katalog diubah dari "${originalName}" ➔ "${updatedFields.itemName}".`;
        }

        logAction(currentUser.name, currentUser.role, 'Pembaruan Manual Stok', detailMsg, 'inventory');

        const merged = { ...item, ...updatedFields };
        merged.total = Number(merged.available) + Number(merged.rented) + Number(merged.maintenance);
        return merged;
      }
      return item;
    }));
  };

  // Register brand new stock component category/model
  const handleAddNewStockItem = (newItem: InventoryStock) => {
    setInventory(prev => [...prev, newItem]);
    logAction(
      currentUser.name, 
      currentUser.role, 
      'Registrasi Model Baru', 
      `Meregistrasikan model komponen scaffolding baru "${newItem.itemName}" (Kode: ${newItem.itemId}) dengan kuantitas impor mula ${newItem.total} pcs.`, 
      'inventory'
    );
  };

  // Delete a master stock component category/model
  const handleDeleteStockItem = (itemId: string) => {
    // Check if item is being rented in active orders (not returned)
    const rentedCountInActiveOrders = orders
      .filter(o => o.status !== 'returned')
      .reduce((sum, o) => {
        const item = o.items.find(it => it.itemId === itemId);
        return sum + (item ? item.quantity : 0);
      }, 0);

    if (rentedCountInActiveOrders > 0) {
      alert(`Gagal menghapus komponen: Sebanyak ${rentedCountInActiveOrders} unit komponen ini sedang berkontrak dalam sewa proyek aktif.`);
      return;
    }

    const itemToDelete = inventory.find(i => i.itemId === itemId);
    if (!itemToDelete) return;

    setInventory(prev => prev.filter(item => item.itemId !== itemId));
    logAction(
      currentUser.name,
      currentUser.role,
      'Hapus Model Komponen',
      `Menghapus komponen scaffolding "${itemToDelete.itemName}" (Kode: ${itemToDelete.itemId}) dari daftar inventaris master.`,
      'inventory'
    );
    alert(`Berhasil menghapus komponen "${itemToDelete.itemName}" dari katalog!`);
  };

  // Add customer manually
  const handleAddCustomer = (newCust: Customer) => {
    setCustomers(prev => [...prev, newCust]);
    logAction(
      currentUser.name, 
      currentUser.role, 
      'Registrasi Kontraktor Baru', 
      `Mendaftarkan perusahaan kontraktor "${newCust.companyName}" dengan representatif ${newCust.name} (Telepon: ${newCust.phone}).`, 
      'customer'
    );
  };

  // Update customer manually
  const handleUpdateCustomer = (updatedCust: Customer) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === updatedCust.id) {
        logAction(
          currentUser.name, 
          currentUser.role, 
          'Pembaruan Data Kontraktor', 
          `Memperbarui profil mitra industri "${updatedCust.companyName}" (Telp: ${updatedCust.phone}, Lokasi: ${updatedCust.address}).`, 
          'customer'
        );
        return updatedCust;
      }
      return c;
    }));

    // Cascade modification to active orders from this firm 
    setOrders(prevOrders => prevOrders.map(order => {
      if (order.contractorName.toLowerCase() === updatedCust.companyName.toLowerCase() ||
          order.contractorPhone === updatedCust.phone) {
        return {
          ...order,
          contractorName: updatedCust.companyName,
          contractorPhone: updatedCust.phone,
          projectAddress: updatedCust.address
        };
      }
      return order;
    }));
  };

  // Simulate an H-3 warning alert manually to demonstrate alert cycles
  const handleSimulateReminder = () => {
    const randomOrderId = orders[0]?.id || 'TRX-SAMPLE';
    const randomProjectName = orders[0]?.projectName || 'Proyek Renovasi Balai Kota';
    
    const leaseEndingAlert: SystemNotification = {
      id: 'NTF-' + Math.floor(10000 + Math.random() * 92000),
      orderId: randomOrderId,
      title: 'Peringatan Kontrak Berakhir (H-3)',
      message: `Masa sewa scaffolding proyek "${randomProjectName}" tersisa 3 hari lagi. Klik menu 'Faktur & Kontrak' untuk menguji pelanjutan masa sewa bulan ke-2 demi menghindari pinalti atau keterlambatan bongkar muat.`,
      type: 'warning',
      createdAt: new Date().toISOString(),
      read: false,
      actionType: 'extend'
    };

    setNotifications(prev => [leaseEndingAlert, ...prev]);
    logAction('Sistem Otomatis', 'manager', 'Notifikasi Pengingat', `Memicu sinyal peringatan masa sewa berakhir (H-3) untuk transaksi sewa ${randomOrderId}.`, 'system');
    alert('Simulasi Sukses! Notifikasi "Masa Sewa Berakhir (H-3)" telah disalurkan. Anda dapat memeriksanya di sudut kanan atas Dashboard atau meluncurkan tombol perpanjangan bulan kedua.');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Header Navigation Strip */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo/Brand */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="bg-amber-500 text-slate-950 p-2 rounded-xl flex items-center justify-center font-display font-black tracking-tight shrink-0 shadow-lg shadow-amber-500/10">
                <Layers className="w-5 h-5 shrink-0" />
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-bold text-white text-base md:text-lg block tracking-tight">SCAFFORENT</span>
                <span className="text-[9px] text-amber-500 font-mono tracking-widest block font-bold uppercase">LOGISTICS MONITOR</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { id: 'dashboard', name: 'Dashboard', icon: Radio },
                { id: 'sewa', name: 'Mulai Sewa Online', icon: Wrench },
                { id: 'invoice', name: 'Faktur & Kontrak', icon: Receipt },
                { id: 'inventory', name: 'Kelola Inventaris', icon: ClipboardList },
                { id: 'pelanggan', name: 'Database Pelanggan', icon: Users }
              ].map((tab) => {
                const IconComponent = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      active 
                      ? 'bg-amber-500 text-slate-950 shadow font-bold' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 shrink-0" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>

            {/* Interactive User Switcher (Aktor Simulator Dropdown) */}
            <div className="flex items-center gap-3">
              
              {/* Account Dropdown */}
              <div className="relative group">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700/60 rounded-xl cursor-pointer transition">
                  <span className={`w-2.5 h-2.5 rounded-full ${currentUser.avatar} shrink-0`}></span>
                  <div className="text-left py-0.5">
                    <span className="text-[11px] font-bold text-white block leading-none">{currentUser.name}</span>
                    <span className="text-[9px] text-slate-400 block font-mono font-bold tracking-tight uppercase">
                      {currentUser.role === 'warehouse_admin' ? 'Admin Gudang' : currentUser.role === 'sales_admin' ? 'Sales Admin' : 'Manager'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-500 transition shrink-0" />
                </div>
                
                {/* Dropdown Options */}
                <div className="absolute right-0 mt-1 w-56 bg-slate-850 border border-slate-700 rounded-2xl shadow-2xl py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-50">
                  <div className="px-3.5 py-2 border-b border-slate-700/50 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Simulasi Identitas Logistik
                  </div>
                  {INITIAL_USERS.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setCurrentUser(user);
                        logAction(user.name, user.role, 'Ganti Akun', `Mengganti simulasi aktor kontrol menjadi ${user.name} (${user.role}).`, 'system');
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs hover:bg-slate-800 transition flex items-center justify-between ${
                        currentUser.id === user.id ? 'bg-slate-805 text-amber-400 font-bold' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${user.avatar}`}></span>
                        <span>{user.name}</span>
                      </div>
                      <span className="text-[8px] px-1 bg-slate-900 border border-slate-700 rounded text-slate-400 font-mono">
                        {user.role === 'warehouse_admin' ? 'Gudang' : user.role === 'sales_admin' ? 'Sales' : 'Mgr'}
                      </span>
                    </button>
                  ))}
                  <div className="px-3.5 py-2 bg-slate-900 text-[10px] text-slate-400 border-t border-slate-700/50 leading-normal font-sans">
                    * Ganti peran untuk menguji batasan validasi edit stok di menu Kelola Inventaris.
                  </div>
                </div>
              </div>

              {/* Offline Indicator Badge */}
              <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-450 text-slate-400/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-mono">PWA Active</span>
              </div>
            </div>

            {/* Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 py-3 space-y-1.5 shadow-xl">
            {[
              { id: 'dashboard', name: 'Dashboard Monitoring', icon: Radio },
              { id: 'sewa', name: 'Sewa Baru (Online)', icon: Wrench },
              { id: 'invoice', name: 'Invoices & Jaminan', icon: Receipt },
              { id: 'inventory', name: 'Kelola Inventaris Gudang', icon: ClipboardList },
              { id: 'pelanggan', name: 'Database Pelanggan', icon: Users }
            ].map((tab) => {
              const IconComponent = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition ${
                    active 
                    ? 'bg-amber-500 text-slate-950 font-bold' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  <IconComponent className="w-4 h-4 shrink-0" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:py-8">
        
        {/* Render Active Tab */}
        {activeTab === 'dashboard' && (
          <Dashboard
            orders={orders}
            inventory={inventory}
            invoices={invoices}
            notifications={notifications}
            auditLogs={auditLogs}
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectOrder={(id) => setSelectedOrderId(id)}
            onSimulateReminder={handleSimulateReminder}
            onTriggerExtension={handleTriggerExtension}
          />
        )}

        {activeTab === 'sewa' && (
          <SewaForm
            onAddOrder={handleAddOrder}
            inventory={inventory}
            customers={customers}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'invoice' && (
          <InvoiceViewer
            invoices={invoices}
            orders={orders}
            onTriggerExtension={handleTriggerExtension}
            onPayInvoice={handlePayInvoice}
            onTriggerRefund={handleTriggerRefund}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryReport
            inventory={inventory}
            onRestockItem={handleRestockItem}
            onSendToMaintenance={handleSendToMaintenance}
            onUpdateStockDetails={handleUpdateStockDetails}
            onAddNewStockItem={handleAddNewStockItem}
            onDeleteStockItem={handleDeleteStockItem}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'pelanggan' && (
          <CustomerManager
            customers={customers}
            onAddCustomer={handleAddCustomer}
            onUpdateCustomer={handleUpdateCustomer}
            currentUser={currentUser}
          />
        )}

      </main>

      {/* Footer Branding with system information */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans">
            © {new Date().getFullYear()} PT ScaffoRent Logistik Indonesia. Semua Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block"></span>
              PWA Standalone Ready
            </span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-slate-500">Jakarta Pusat, Indonesia</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
