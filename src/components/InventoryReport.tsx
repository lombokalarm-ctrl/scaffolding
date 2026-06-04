/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InventoryStock, UserProfile } from '../types';
import { 
  Package, 
  CheckCircle, 
  AlertTriangle, 
  Wrench, 
  Plus, 
  Search,
  ChevronDown,
  Layers,
  Edit2,
  Save,
  PlusCircle,
  X,
  PackagePlus,
  Coins,
  Trash2
} from 'lucide-react';

interface InventoryReportProps {
  inventory: InventoryStock[];
  onRestockItem: (itemId: string, qtyToAdd: number) => void;
  onSendToMaintenance: (itemId: string, qty: number) => void;
  onUpdateStockDetails: (itemId: string, updatedFields: Partial<InventoryStock>) => void;
  onAddNewStockItem: (newItem: InventoryStock) => void;
  onDeleteStockItem: (itemId: string) => void;
  currentUser: UserProfile;
}

export default function InventoryReport({
  inventory,
  onRestockItem,
  onSendToMaintenance,
  onUpdateStockDetails,
  onAddNewStockItem,
  onDeleteStockItem,
  currentUser
}: InventoryReportProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'warning' | 'available'>('all');
  const [restockAmount, setRestockAmount] = useState<number>(50);

  // Editing state
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAvailable, setEditAvailable] = useState<number>(0);
  const [editRented, setEditRented] = useState<number>(0);
  const [editMaintenance, setEditMaintenance] = useState<number>(0);

  // Add new item state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newAvailable, setNewAvailable] = useState<number>(100);

  const canEdit = currentUser.role === 'warehouse_admin' || currentUser.role === 'manager';

  // Stats calculation
  const totalItemsCount = inventory.reduce((sum, item) => sum + item.total, 0);
  const rentedItemsCount = inventory.reduce((sum, item) => sum + item.rented, 0);
  const availableItemsCount = inventory.reduce((sum, item) => sum + item.available, 0);
  const maintenanceItemsCount = inventory.reduce((sum, item) => sum + item.maintenance, 0);
  
  const overallRentedRatio = Math.round((rentedItemsCount / totalItemsCount) * 100) || 0;

  // Filter list
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) || item.itemId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const availabilityRate = (item.available / item.total) * 100;
    const isWarning = availabilityRate < 25;

    if (filterCategory === 'all') return matchesSearch;
    if (filterCategory === 'warning') return matchesSearch && isWarning;
    return matchesSearch && !isWarning;
  });

  const selectItemForEdit = (item: InventoryStock) => {
    setSelectedItemId(item.itemId);
    setIsAddingNew(false);
    setEditName(item.itemName);
    setEditAvailable(item.available);
    setEditRented(item.rented);
    setEditMaintenance(item.maintenance);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) return;

    if (!canEdit) {
      alert('Akses Dibatasi: Hanya Admin Gudang atau Manager yang bisa memperbarui stok fisik.');
      return;
    }

    onUpdateStockDetails(selectedItemId, {
      itemName: editName,
      available: Number(editAvailable),
      rented: Number(editRented),
      maintenance: Number(editMaintenance)
    });

    setSelectedItemId(null);
    alert('Berhasil! Parameter stok telah disinkronkan dan terekam di Log Audit.');
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId || !newName) {
      alert('Nama dan Kode Komponen harus diisi.');
      return;
    }

    // Check unique ID
    if (inventory.some(i => i.itemId.toLowerCase() === newId.toLowerCase())) {
      alert(`Kode komponen "${newId}" sudah terdaftar dalam inventory.`);
      return;
    }

    onAddNewStockItem({
      itemId: newId.toLowerCase(),
      itemName: newName,
      total: Number(newAvailable),
      rented: 0,
      available: Number(newAvailable),
      maintenance: 0
    });

    setNewId('');
    setNewName('');
    setIsAddingNew(false);
    alert('Berhasil mendaftarkan unit scaffolding tipe baru di Gudang Logistindo!');
  };

  return (
    <div id="inventory-tab" className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl md:text-3xl font-display font-extrabold tracking-tight text-white mb-1.5">
            Daftar & Kelola <span className="text-amber-500">Inventaris Alat</span>
          </h1>
          <p className="text-slate-400 text-xs">
            Pusat kendali master inventaris scaffolding. Atur stok ready, pantau unit tersewa, kelola pemeliharaan, serta tambah dan hapus komponen secara aman.
          </p>
        </div>
        
        {!isAddingNew && !selectedItemId && canEdit && (
          <button
            type="button"
            onClick={() => {
              setIsAddingNew(true);
              setSelectedItemId(null);
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10"
          >
            <PlusCircle className="w-4 h-4" />
            Tambah Komponen Baru
          </button>
        )}
      </div>
      
      {/* Inventory KPI Stats Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="inventory-kpi-grid">
        {/* KPI 1 */}
        <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-5 shadow flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Total Armada Unit</span>
            <span className="text-3xl font-display font-extrabold text-white block font-mono">{totalItemsCount}</span>
            <span className="text-[10px] text-slate-500 block">Total aset scaffolding terdaftar</span>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-800 border border-slate-700/30 rounded-xl p-5 shadow flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Gudang Tersedia</span>
            <span className="text-3xl font-display font-extrabold text-emerald-400 block font-mono">{availableItemsCount}</span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Ready untuk dikirim online
            </span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-450 rounded-lg">
            <CheckCircle className="w-6 h-6 text-emerald-500" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-800 border border-slate-700/30 rounded-xl p-5 shadow flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Rented (Dipakai Proyek)</span>
            <span className="text-3xl font-display font-extrabold text-amber-500 block font-mono">{rentedItemsCount}</span>
            <span className="text-[10px] text-slate-400 font-mono">UTILIZATION RATE: {overallRentedRatio}%</span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg">
            <Layers className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-800 border border-slate-700/30 rounded-xl p-5 shadow flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Bengkel Korektif</span>
            <span className="text-3xl font-display font-extrabold text-purple-400 block font-mono">{maintenanceItemsCount}</span>
            <span className="text-[10px] text-slate-500 block">Peremajaan karat & las penyok</span>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg">
            <Wrench className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Stock Table and Fast-Restock Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Inventory Table (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-800 border border-slate-700/50 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                📦 Daftar Inventaris Utama (Master Catalog)
              </h3>
              <p className="text-xs text-slate-400">Pilih baris komponen untuk edit rincian stok atau hapus item secara permanen.</p>
            </div>

            {/* Quick search & filter panel */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-40">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Cari item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e: any) => setFilterCategory(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-amber-500 appearance-none pr-8 cursor-pointer font-semibold"
                >
                  <option value="all font-medium">Semua Status</option>
                  <option value="warning font-medium">Sisa Kritis (&lt;25%)</option>
                  <option value="available font-medium">Banyak Stok</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              {canEdit && (
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(true);
                    setSelectedItemId(null);
                  }}
                  className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Tambah Baru
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-700 pb-2 text-slate-500 uppercase tracking-wider text-[9px] font-bold">
                  <th className="py-2.5 text-left">Kode & Nama Komponen</th>
                  <th className="py-2.5 text-center">Fisik (Total)</th>
                  <th className="py-2.5 text-center">Disewa Proyek</th>
                  <th className="py-2.5 text-center">Ready Gudang</th>
                  <th className="py-2.5 text-center">Dalam Perbaikan</th>
                  <th className="py-2.5 text-center">Ketersediaan</th>
                  <th className="py-2.5 text-right">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {filteredInventory.map((item) => {
                  const availabilityRate = Math.round((item.available / item.total) * 100) || 0;
                  const isLow = availabilityRate < 25;
                  const isSelected = selectedItemId === item.itemId;

                  return (
                    <tr 
                      key={item.itemId} 
                      onClick={() => selectItemForEdit(item)}
                      className={`hover:bg-slate-900/40 cursor-pointer transition ${
                        isSelected ? 'bg-amber-500/10 border-l border-amber-500' : ''
                      }`}
                    >
                      <td className="py-3">
                        <span className="font-mono text-[9px] text-amber-500 font-bold block">{item.itemId}</span>
                        <span className="font-semibold text-white font-sans">{item.itemName}</span>
                      </td>
                      <td className="py-3 text-center font-bold font-mono text-slate-200">
                        {item.total}
                      </td>
                      <td className="py-3 text-center text-amber-500 font-mono">
                        {item.rented}
                      </td>
                      <td className="py-3 text-center text-emerald-400 font-bold font-mono">
                        {item.available}
                      </td>
                      <td className="py-3 text-center text-purple-400 font-mono">
                        {item.maintenance}
                      </td>
                      <td className="py-3 text-center">
                        <div className="inline-flex items-center gap-1">
                          <span className={`font-semibold font-mono text-[11px] ${isLow ? 'text-rose-500' : 'text-emerald-400'}`}>
                            {availabilityRate}%
                          </span>
                          <span className={`w-1.5 h-1.5 rounded-full ${isLow ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-amber-500 hover:text-white transition p-1 bg-slate-900/30 rounded-lg inline-block">
                          <Edit2 className="w-3 h-3" />
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {filteredInventory.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      Tidak ada komponen scaffolding yang cocok dengan kriteria pencarian Anda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Control Panel Simulator (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Editor/Add Panel */}
          {selectedItemId ? (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                  <Edit2 className="w-4 h-4 text-amber-500 animate-pulse" />
                  Parameter & Stok Fisik
                </h4>
                <button onClick={() => setSelectedItemId(null)} className="text-slate-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/50 text-[10px] font-mono text-slate-400 justify-between flex">
                  <span>KODE ALAT: <b className="text-amber-500 font-bold">{selectedItemId}</b></span>
                  <span>STATUS: <b className={canEdit ? "text-emerald-400" : "text-rose-500"}>{canEdit ? "MUTASI AKTIF" : "READ-ONLY"}</b></span>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 block font-bold uppercase">Nama Komponen Master</label>
                  <input
                    type="text"
                    value={editName}
                    disabled={!canEdit}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 disabled:opacity-50 font-semibold"
                  />
                </div>

                {/* Core Stock Fields Input */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-emerald-400 block font-semibold uppercase">Tersedia (Gudang)</label>
                    <input
                      type="number"
                      value={editAvailable}
                      disabled={!canEdit}
                      min={0}
                      onChange={(e) => setEditAvailable(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-emerald-850 border-emerald-900/40 rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 font-mono focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-purple-400 block font-semibold uppercase">Pemeliharaan</label>
                    <input
                      type="number"
                      value={editMaintenance}
                      disabled={!canEdit}
                      min={0}
                      onChange={(e) => setEditMaintenance(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-purple-900/40 rounded-lg px-2.5 py-1.5 text-xs text-purple-400 font-mono focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-amber-500 block font-semibold uppercase">Sedang Disewa (Rented)</label>
                  <input
                    type="number"
                    value={editRented}
                    disabled={!canEdit}
                    min={0}
                    onChange={(e) => setEditRented(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-amber-900/40 rounded-lg px-2.5 py-1.5 text-xs text-amber-500 font-mono focus:outline-none disabled:opacity-50"
                  />
                  <p className="text-[9px] text-slate-500">
                    * Catatan: Data disewa harus disesuaikan dengan kuantitas kontrak aktif untuk menjamin audit balance.
                  </p>
                </div>

                {/* Computed Total */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Computed Total Fisik:</span>
                  <span className="font-mono font-black text-white text-base">
                    {Number(editAvailable) + Number(editRented) + Number(editMaintenance)} <font className="text-[9px] text-slate-500">PCS</font>
                  </span>
                </div>

                {canEdit ? (
                  <div className="space-y-2">
                    <button
                      type="submit"
                      className="w-full py-2 bg-amber-500 hover:bg-amber-650 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Simpan Perubahan Stok
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Apakah Anda yakin ingin menghapus komponen "${editName}" (${selectedItemId}) dari daftar inventaris master?`)) {
                          onDeleteStockItem(selectedItemId);
                          setSelectedItemId(null);
                        }
                      }}
                      className="w-full py-2 bg-rose-950/20 hover:bg-rose-600 border border-rose-900/50 hover:border-transparent text-rose-450 text-rose-400 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus Komponen Master
                    </button>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-400 text-center">
                    Masuklah sebagai <b>Admin Gudang</b> atau <b>Manager</b> untuk membuka akses perbaikan stok manual.
                  </div>
                )}
              </form>
            </div>
          ) : isAddingNew ? (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                  <PackagePlus className="w-4 h-4 text-emerald-500" />
                  Gigi Alat Baru (Master Catalog)
                </h4>
                <button onClick={() => setIsAddingNew(false)} className="text-slate-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateNew} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 block font-bold uppercase">KODE ALAT UNIK (Kecil)</label>
                  <input
                    type="text"
                    placeholder="Contoh: mf-200, tb-05"
                    value={newId}
                    onChange={(e) => setNewId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 block font-bold uppercase">Nama Komponen Alat</label>
                  <input
                    type="text"
                    placeholder="Contoh: Main Frame Premium 2.0m"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-medium"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 block font-bold uppercase">Stok Gudang Awal</label>
                  <input
                    type="number"
                    min={1}
                    value={newAvailable}
                    onChange={(e) => setNewAvailable(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md hover:shadow-emerald-500/10 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Daftarkan Model Baru
                </button>
              </form>
            </div>
          ) : null}

          {/* Sinyal Kritis Stok Gudang */}
          <div className="bg-slate-800 border border-slate-700/55 rounded-2xl p-5 shadow-lg space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Sinyal Kritis Stok Gudang
            </h4>

            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {inventory
                .filter(item => (item.available / item.total) * 100 < 30)
                .map(item => (
                  <div 
                    key={item.itemId} 
                    onClick={() => selectItemForEdit(item)}
                    className="p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/10 hover:border-rose-500/30 text-xs flex justify-between items-start gap-2 cursor-pointer transition"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-200 block truncate max-w-[170px]">{item.itemName}</span>
                      <span className="text-[10px] text-slate-500 block font-mono">Sisa Gudang: {item.available} pcs</span>
                    </div>
                    <div className="text-right">
                      <span className="text-rose-500 font-bold block font-mono">KRITIS</span>
                      <span className="text-[9px] text-slate-500 block">Batas Ambil</span>
                    </div>
                  </div>
                ))}

              {inventory.filter(item => (item.available / item.total) * 100 < 30).length === 0 && (
                <p className="text-xs text-slate-500 italic py-4 text-center leading-relaxed">
                  Hebat! Seluruh suku cadang scaffolding aman & berada di atas ambang minimum.
                </p>
              )}
            </div>
          </div>

          {/* Quick restock and transfer controls */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1">
              <Plus className="w-4 h-4 text-amber-500" />
              Konsol Restock Logistik
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Bertindak sebagai Admin Logistik. Tambah stok baru atau kirim komponen scaffolding yang rusak ke bengkel pemeliharaan.
            </p>

            <div className="space-y-3.5 animate-fade-in">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 block font-bold uppercase">Jumlah Kontrol Mutasi/Restock:</label>
                <div className="flex gap-2 items-center">
                  <div className="flex gap-1 shrink-0">
                    {[10, 20, 50, 100].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setRestockAmount(amt)}
                        className={`px-2 py-1.5 rounded bg-slate-900 border text-xs font-mono font-bold cursor-pointer transition ${
                          restockAmount === amt ? 'border-amber-500 text-amber-500 font-black' : 'border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        +{amt}
                      </button>
                    ))}
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min={1}
                      value={restockAmount}
                      onChange={(e) => {
                        const val = Math.max(1, parseInt(e.target.value) || 0);
                        setRestockAmount(val);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-2 pr-7 py-1 text-xs text-amber-500 font-bold font-mono focus:outline-none focus:border-amber-500"
                      placeholder="Custom"
                    />
                    <span className="absolute right-2 top-1 text-[9px] text-slate-500 font-bold pointer-events-none">PCS</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 block font-semibold uppercase">PILIH JALUR RE-STOCK CEPAT:</span>
                
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {inventory.map(item => (
                    <div key={item.itemId} className="p-2 border border-slate-700/50 hover:border-slate-650 bg-slate-900/40 rounded-lg flex items-center justify-between text-xs gap-4">
                      <div className="truncate">
                        <span className="font-bold text-slate-200 block truncate max-w-[130px]">{item.itemName}</span>
                        <span className="text-[10px] text-slate-500 font-mono block">Sisa: {item.available} / Total: {item.total}</span>
                      </div>
                      
                      <div className="flex gap-1 shrink-0">
                        <button
                          title={`Kirim ${restockAmount} unit ke Pemeliharaan`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.available < restockAmount) {
                              alert(`Maaf, barang ready di gudang hanya ada ${item.available}, tidak cukup untuk mengirim ${restockAmount} unit ke pemeliharaan.`);
                              return;
                            }
                            onSendToMaintenance(item.itemId, restockAmount);
                            alert(`Berhasil! Mengirim ${restockAmount} ${item.itemName} ke unit Pemeliharaan Korektif.`);
                          }}
                          className="p-1 rounded bg-purple-500/10 hover:bg-purple-500/30 text-purple-400 transition cursor-pointer"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title={`Tambah (Restock) ${restockAmount} unit ke Gudang`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRestockItem(item.itemId, restockAmount);
                            alert(`Berhasil! Menambahkan (Restock) ${restockAmount} unit baru untuk ${item.itemName} ke dalam sistem.`);
                          }}
                          className="p-1 rounded bg-emerald-500/10 hover:bg-emerald-500/30 text-emerald-400 transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
