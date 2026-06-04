/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  SCAFFOLDING_ITEMS 
} from '../data/mockData';
import { ScaffoldingItem, RentMethod, Customer, UserProfile } from '../types';
import { 
  Building2, 
  MapPin, 
  Phone, 
  User, 
  Calendar, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Truck, 
  HelpCircle,
  AlertCircle,
  CheckCircle,
  Receipt
} from 'lucide-react';

interface SewaFormProps {
  onAddOrder: (newOrder: any, newInvoice: any) => void;
  inventory: any[];
  customers: Customer[];
  currentUser: UserProfile;
}

export default function SewaForm({ onAddOrder, inventory, customers, currentUser }: SewaFormProps) {
  // Contractor Credentials
  const [contractorName, setContractorName] = useState('');
  const [contractorPhone, setContractorPhone] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectAddress, setProjectAddress] = useState('');

  // Handle auto prefill customer
  const handleSelectCustomer = (customerId: string) => {
    if (!customerId) {
      setContractorName('');
      setContractorPhone('');
      setProjectAddress('');
      return;
    }
    const selected = customers.find(c => c.id === customerId);
    if (selected) {
      setContractorName(selected.companyName);
      setContractorPhone(selected.phone);
      setProjectAddress(selected.address);
    }
  };

  // Cart: item_id -> quantity
  const [cart, setCart] = useState<{ [itemId: string]: number }>({});
  
  // Rent timing
  const [rentMethod, setRentMethod] = useState<RentMethod>('bulanan');
  const [duration, setDuration] = useState<number>(1); // 1 month or 1 day by default

  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Filter items
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return SCAFFOLDING_ITEMS;
    return SCAFFOLDING_ITEMS.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  // Adjust cart items
  const updateCartQty = (itemId: string, delta: number) => {
    const itemStock = inventory.find(i => i.itemId === itemId);
    const availableStock = itemStock ? itemStock.available : 999;

    setCart(prev => {
      const current = prev[itemId] || 0;
      let next = current + delta;
      if (next < 0) next = 0;
      if (next > availableStock) {
        alert(`Maaf, stok ${itemStock?.itemName || 'barang'} yang tersedia di gudang hanya tersisa ${availableStock} pcs.`);
        next = availableStock;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const clearCart = () => {
    setCart({});
  };

  // Calculations
  const calculatedStats = useMemo(() => {
    let rentalCost = 0;
    let securityDeposit = 0;
    let totalWeight = 0;
    let itemCount = 0;
    const itemsList: any[] = [];

    Object.entries(cart).forEach(([itemId, qtyVal]) => {
      const qty = Number(qtyVal);
      if (qty <= 0) return;
      const item = SCAFFOLDING_ITEMS.find(i => i.id === itemId);
      if (!item) return;

      itemCount += qty;
      totalWeight += item.weightKg * qty;
      
      let itemCost = 0;
      if (rentMethod === 'harian') {
        itemCost = item.dailyRate * qty * duration;
      } else {
        itemCost = item.monthlyRate * qty * duration;
      }
      
      rentalCost += itemCost;
      securityDeposit += item.depositRate * qty;

      itemsList.push({
        itemId: item.id,
        itemName: item.name,
        quantity: qty,
        dailyRate: item.dailyRate,
        monthlyRate: item.monthlyRate,
        depositRate: item.depositRate
      });
    });

    // Shipping cost calculation: Rp 5.000 per 10 kg, minimum Rp 150.000
    const calculatedShipping = itemCount > 0 ? Math.max(150000, Math.round(totalWeight / 10) * 5000) : 0;
    const discount = rentMethod === 'bulanan' && duration >= 3 ? Math.round(rentalCost * 0.05) : 0; // 5% discount for 3+ months sewa
    const firstInvoiceTotal = rentalCost + securityDeposit + calculatedShipping - discount;

    return {
      rentalCost,
      securityDeposit,
      totalWeight: Math.round(totalWeight * 10) / 10,
      itemCount,
      shippingCost: calculatedShipping,
      discount,
      firstInvoiceTotal,
      itemsList
    };
  }, [cart, rentMethod, duration]);

  // Handle rental placement
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (calculatedStats.itemCount === 0) {
      alert('Keranjang belanja Anda masih kosong! Silakan tambahkan beberapa unit scaffolding terlebih dahulu.');
      return;
    }
    if (!contractorName || !contractorPhone || !projectName || !projectAddress) {
      alert('Silakan lengkapi formulir informasi kontraktor dan alamat pengiriman proyek.');
      return;
    }

    const orderId = 'TRX-' + Math.floor(10000 + Math.random() * 90000);
    const invoiceId = 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    const today = new Date();
    const startDateStr = today.toISOString().split('T')[0];
    
    const endDate = new Date();
    if (rentMethod === 'harian') {
      endDate.setDate(today.getDate() + duration);
    } else {
      endDate.setMonth(today.getMonth() + duration);
    }
    const endDateStr = endDate.toISOString().split('T')[0];

    // Create order structure
    const newOrder = {
      id: orderId,
      contractorName,
      contractorPhone,
      projectName,
      projectAddress,
      items: calculatedStats.itemsList,
      rentMethod,
      durationValue: duration,
      startDate: startDateStr,
      endDate: endDateStr,
      securityDepositPaid: calculatedStats.securityDeposit,
      status: 'loading', // start loading status -> ship -> deliver
      trackingStep: 1, // loading
      shippingProgress: 5,
      gpsLat: -6.182 + (Math.random() - 0.5) * 0.03, // random near Jakarta
      gpsLng: 106.82 + (Math.random() - 0.5) * 0.03,
      createdAt: new Date().toISOString(),
      isExtended: false,
      refundStatus: 'none'
    };

    // Create Invoice structure
    const newInvoice = {
      id: invoiceId,
      orderId,
      contractorName,
      projectName,
      type: 'initial',
      createdAt: new Date().toISOString(),
      rentCost: calculatedStats.rentalCost + calculatedStats.shippingCost, // bundle shipping inside rent charge on invoice representation
      securityDeposit: calculatedStats.securityDeposit,
      discount: calculatedStats.discount,
      totalAmount: calculatedStats.firstInvoiceTotal,
      isPaid: false, // starts unpaid, contractor pays it
      dueDate: startDateStr
    };

    onAddOrder(newOrder, newInvoice);

    // Reset state values
    setCart({});
    setContractorName('');
    setContractorPhone('');
    setProjectName('');
    setProjectAddress('');
    setDuration(rentMethod === 'bulanan' ? 1 : 7);

    alert(`Pemesanan Scaffolding Berhasil! Pesanan Anda dengan ID ${orderId} telah dibuat. Silakan menuju ke tab "Lacak Pengiriman" untuk memantau pengantaran logistik Anda.`);
  };

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div id="sewa-tab" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Product list (Left Column - 7 col span) */}
      <div className="lg:col-span-7 space-y-4">
        {/* Category filters */}
        <div className="bg-slate-800 p-3 rounded-xl border border-slate-705/10 flex flex-wrap gap-2">
          {['all', 'frame', 'accessories', 'safety', 'support'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                activeCategory === cat 
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {cat === 'all' && 'Semua Barang'}
              {cat === 'frame' && 'Rangka Frame'}
              {cat === 'accessories' && 'Pasak & Klem'}
              {cat === 'safety' && 'Keamanan / Walkway'}
              {cat === 'support' && 'Akurasi Jack / Penopang'}
            </button>
          ))}
        </div>

        {/* Catalog items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1">
          {filteredItems.map((item) => {
            const isAdded = (cart[item.id] || 0) > 0;
            const itemStock = inventory.find(i => i.itemId === item.id);
            const available = itemStock ? itemStock.available : 0;

            return (
              <div 
                key={item.id} 
                className={`bg-slate-800 border rounded-xl overflow-hidden shadow transition-all duration-250 flex flex-col justify-between ${
                  isAdded ? 'border-amber-500 ring-1 ring-amber-500/20' : 'border-slate-700/50'
                }`}
              >
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-amber-500 uppercase px-2 py-0.5 rounded bg-amber-500/10 font-bold">
                        {item.category === 'frame' && 'Rangka Utama'}
                        {item.category === 'accessories' && 'Klem / Pasak'}
                        {item.category === 'safety' && 'Alas / Tangga'}
                        {item.category === 'support' && 'Ulir Jack'}
                      </span>
                      <h3 className="font-display font-medium text-white text-sm mt-1.5">{item.name}</h3>
                    </div>
                    {/* Weight indicator */}
                    <span className="text-[10px] text-slate-400 font-mono italic">
                      {item.weightKg} Kg
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/40 text-[11px] text-slate-300">
                    <div>
                      <span className="text-slate-500 block">Sewa Harian</span>
                      <span className="font-bold text-white font-mono">{formatRupiah(item.dailyRate)}</span><span className="text-[9px] text-slate-400">/hari</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Sewa Bulanan</span>
                      <span className="font-bold text-amber-400 font-mono">{formatRupiah(item.monthlyRate)}</span><span className="text-[9px] text-slate-400">/bln</span>
                    </div>
                  </div>

                  <div className="pt-1.5 flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">Jaminan Refund:</span>
                    <span className="font-bold text-blue-400 font-mono">{formatRupiah(item.depositRate)} <span className="text-slate-500 font-normal">/pcs</span></span>
                  </div>
                </div>

                <div className="bg-slate-900/40 p-3 border-t border-slate-700/30 flex items-center justify-between">
                  {/* Stock status tag */}
                  <span className={`text-[10px] font-mono font-semibold ${available > 10 ? 'text-emerald-400' : available > 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {available > 0 ? `${available} Pcs Tersedia` : 'Stok Kosong'}
                  </span>
                  
                  {available === 0 ? (
                    <button disabled className="px-2.5 py-1 rounded bg-slate-800 text-slate-600 text-xs font-semibold cursor-not-allowed">
                      Habis
                    </button>
                  ) : (cart[item.id] || 0) === 0 ? (
                    <button 
                      onClick={() => updateCartQty(item.id, 1)}
                      className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold shadow hover:scale-105 transition flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Ambil
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => updateCartQty(item.id, -1)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-sm text-white font-bold w-5 text-center">
                        {cart[item.id]}
                      </span>
                      <button 
                        type="button"
                        onClick={() => updateCartQty(item.id, 1)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart, Method & Client Info Panel (Right Column - 5 col span) */}
      <form onSubmit={handleSubmitOrder} className="lg:col-span-5 space-y-6 bg-slate-800 border border-slate-700/50 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-500" />
            <h2 className="font-display font-bold text-white text-lg">Detail Penyewaan</h2>
          </div>
          {calculatedStats.itemCount > 0 && (
            <button 
              type="button" 
              onClick={clearCart} 
              className="text-xs text-rose-400 hover:text-rose-300 hover:underline"
            >
              Reset Keranjang
            </button>
          )}
        </div>

        {/* Selected Items summary */}
        <div className="space-y-2">
          {calculatedStats.itemCount === 0 ? (
            <div className="py-6 text-center text-slate-500 border border-dashed border-slate-700 rounded-xl space-y-2">
              <ShoppingCart className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">Ukur kebutuhan proyek Anda & tambahkan modul scaffolding di sebelah kanan.</p>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
              {calculatedStats.itemsList.map(item => (
                <div key={item.itemId} className="flex items-center justify-between text-xs bg-slate-900/40 p-2 rounded-lg border border-slate-705/5">
                  <div className="flex-1">
                    <span className="font-medium text-slate-200 block">{item.itemName}</span>
                    <span className="text-[10px] text-slate-400 italic">
                      Jaminan Refund: {formatRupiah(item.depositRate)} /pcs
                    </span>
                  </div>
                  <div className="text-right ml-4">
                    <span className="font-bold text-white block">x{item.quantity} Pcs</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {rentMethod === 'harian' 
                        ? formatRupiah(item.dailyRate * item.quantity * duration)
                        : formatRupiah(item.monthlyRate * item.quantity * duration)
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rental Method & Duration Section */}
        <div className="bg-slate-900/60 p-4 border border-slate-700/40 rounded-xl space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setRentMethod('harian');
                setDuration(7); // reset daily default to 7 days
              }}
              className={`py-2 rounded-lg text-xs font-bold transition flex flex-col items-center gap-0.5 ${
                rentMethod === 'harian'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              <span>Sewa Harian</span>
              <span className="text-[9px] font-normal opacity-80">(Minimum 1 Hari)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRentMethod('bulanan');
                setDuration(1); // reset monthly default to 1 month
              }}
              className={`py-2 rounded-lg text-xs font-bold transition flex flex-col items-center gap-0.5 ${
                rentMethod === 'bulanan'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              <span>Sewa Bulanan</span>
              <span className="text-[9px] font-normal opacity-80">(Recommended Terjangkau)</span>
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Durasi Sewa:</span>
              <span className="font-mono text-amber-400 font-bold text-sm bg-slate-800 px-2 py-0.5 rounded">
                {duration} {rentMethod === 'harian' ? 'Hari' : 'Bulan'}
              </span>
            </div>
            
            <input 
              type="range" 
              min="1" 
              max={rentMethod === 'harian' ? 30 : 12}
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 italic mt-1">
              <span>1 {rentMethod === 'harian' ? 'Hari' : 'Bulan'}</span>
              {rentMethod === 'bulanan' && <span className="text-amber-500 font-sans font-semibold">Min. 3 Bln Ekstra Diskon 5%</span>}
              <span>{rentMethod === 'harian' ? '30 Hari' : '12 Bulan'}</span>
            </div>
          </div>
        </div>

        {/* Contractor & Project Form Inputs */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-amber-500" />
              Destinasi & Kontraktor Proyek
            </h3>
            
            {/* Quick-fill selector */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[9px] text-slate-500">PILIH REKANAN:</span>
              <select
                onChange={(e) => handleSelectCustomer(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-[10px] rounded px-1.5 py-0.5 text-slate-300 focus:outline-none focus:border-amber-500 cursor-pointer max-w-[130px] truncate"
              >
                <option value="">-- Manual --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.companyName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 block font-medium">Nama Kontraktor/PT</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input 
                  type="text"
                  required
                  placeholder="Contoh: PT Hutama Karya"
                  value={contractorName}
                  onChange={(e) => setContractorName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 block font-medium">No. Telepon Aktif</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input 
                  type="tel"
                  required
                  placeholder="Contoh: 0812-xxxx-xxxx"
                  value={contractorPhone}
                  onChange={(e) => setContractorPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 block font-medium">Nama Pekerjaan Proyek</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                required
                placeholder="Contoh: Proyek Apartemen Kemang Pratama"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 block font-medium">Alamat Lengkap Pengiriman</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <textarea 
                required
                rows={2}
                placeholder="Jl. Raya Kemerdekaan Baru No. 17, Jakarta Selatan"
                value={projectAddress}
                onChange={(e) => setProjectAddress(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Calculation Invoice breakdown */}
        {calculatedStats.itemCount > 0 && (
          <div className="border-t border-slate-700/60 pt-4 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
              <Receipt className="w-3.5 h-3.5 text-amber-500" />
              Draf Invoice Awal + Jaminan
            </h4>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 text-xs space-y-2.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Harga Sewa Scaffolding ({duration} {rentMethod === 'harian' ? 'Hari' : 'Bulan'}):</span>
                <span className="text-white">{formatRupiah(calculatedStats.rentalCost)}</span>
              </div>
              
              <div className="flex justify-between text-blue-400">
                <span className="flex items-center gap-1">
                  Uang Jaminan Refundable:
                  <span title="Dapat dikembalikan setelah sewa berakhir" className="cursor-help"><HelpCircle className="w-3 h-3 text-blue-400 inline" /></span>
                </span>
                <span>{formatRupiah(calculatedStats.securityDeposit)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Biaya Pengiriman (Cargo {calculatedStats.totalWeight} Kg):</span>
                <span className="text-white">{formatRupiah(calculatedStats.shippingCost)}</span>
              </div>

              {calculatedStats.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Diskon Paket:</span>
                  <span>-{formatRupiah(calculatedStats.discount)}</span>
                </div>
              )}

              <div className="border-t border-slate-700/50 pt-2 flex justify-between font-sans text-sm font-bold">
                <span className="text-slate-200">Total Invoice #1:</span>
                <span className="text-amber-500 scale-105 transition-transform">{formatRupiah(calculatedStats.firstInvoiceTotal)}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 text-center leading-normal italic">
              *Setelah masa sewa berakhir, uang jaminan sebesar <strong className="text-blue-400">{formatRupiah(calculatedStats.securityDeposit)}</strong> akan dicairkan kembali secara tunai atau ditransfer.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/10 cursor-pointer text-sm flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
        >
          <Truck className="w-4 h-4" />
          Kirim & Buat Pesanan Baru
        </button>
      </form>
    </div>
  );
}
