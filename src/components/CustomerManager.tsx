/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Customer, UserProfile } from '../types';
import { 
  Building2, 
  Phone, 
  MapPin, 
  Search, 
  Plus, 
  Edit3, 
  X, 
  Check, 
  UserCheck,
  UserPlus
} from 'lucide-react';

interface CustomerManagerProps {
  customers: Customer[];
  onAddCustomer: (newCustomer: Customer) => void;
  onUpdateCustomer: (updatedCustomer: Customer) => void;
  currentUser: UserProfile;
}

export default function CustomerManager({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  currentUser
}: CustomerManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCompanyName, setFormCompanyName] = useState('');
  const [formAddress, setFormAddress] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
    );
  }, [customers, searchQuery]);

  const startEdit = (cust: Customer) => {
    setIsEditing(cust.id);
    setIsAddingNew(false);
    setFormName(cust.name);
    setFormPhone(cust.phone);
    setFormCompanyName(cust.companyName);
    setFormAddress(cust.address);
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setIsAddingNew(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCompanyName || !formPhone || !formAddress) {
      alert('Mohon lengkapi semua baris informasi pelanggan.');
      return;
    }

    if (isEditing) {
      const original = customers.find(c => c.id === isEditing);
      if (original) {
        onUpdateCustomer({
          ...original,
          name: formName,
          companyName: formCompanyName,
          phone: formPhone,
          address: formAddress
        });
      }
      setIsEditing(null);
    } else if (isAddingNew) {
      const newCust: Customer = {
        id: 'CUST-' + Math.floor(1000 + Math.random() * 9000),
        name: formName,
        companyName: formCompanyName,
        phone: formPhone,
        address: formAddress,
        activeProjectsCount: 0
      };
      onAddCustomer(newCust);
      setIsAddingNew(false);
    }
    
    // Clear form
    setFormName('');
    setFormPhone('');
    setFormCompanyName('');
    setFormAddress('');
  };

  const openAddForm = () => {
    setIsAddingNew(true);
    setIsEditing(null);
    setFormName('');
    setFormPhone('');
    setFormCompanyName('');
    setFormAddress('');
  };

  return (
    <div id="customer-manager-tab" className="space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-white flex items-center gap-2">
            👥 Database Rekanan Kontraktor & Pelanggan
          </h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Kelola profil informasi kontak kontraktor, telpon perwakilan proyek, dan rincian penagihan sewa scaffolding.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-amber-500/10 cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Registrasi Pelanggan Baru
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Customer Table List (8 sub columns) */}
        <div className="lg:col-span-8 bg-slate-800 border border-slate-700/50 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span className="text-xs font-bold font-mono tracking-widest text-amber-500 uppercase">
              REKANAN SEWA AKTIF ({filteredCustomers.length})
            </span>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Cari pelanggan / instansi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-700 pb-2 text-slate-500 uppercase tracking-wider text-[9px] font-bold">
                  <th className="py-2.5 text-left">Kode & Nama Instansi</th>
                  <th className="py-2.5 text-left">Nama Representatif</th>
                  <th className="py-2.5 text-left">Nomor Telpon</th>
                  <th className="py-2.5 className text-left">Alamat Pengiriman Utama</th>
                  <th className="py-2.5 text-center">Proyek</th>
                  <th className="py-2.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {filteredCustomers.map((cust) => {
                  const isActiveEdit = isEditing === cust.id;
                  return (
                    <tr 
                      key={cust.id} 
                      className={`hover:bg-slate-900/10 transition ${isActiveEdit ? 'bg-amber-500/5 border-l-2 border-l-amber-500' : ''}`}
                    >
                      <td className="py-3.5">
                        <span className="font-mono text-[9px] text-amber-500 font-bold block">{cust.id}</span>
                        <span className="font-semibold text-white flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          {cust.companyName}
                        </span>
                      </td>
                      <td className="py-3.5 font-medium text-slate-200">
                        {cust.name}
                      </td>
                      <td className="py-3.5 font-mono text-slate-300">
                        {cust.phone}
                      </td>
                      <td className="py-3.5 text-slate-400 max-w-[180px] break-words truncate" title={cust.address}>
                        {cust.address}
                      </td>
                      <td className="py-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cust.activeProjectsCount > 0 
                            ? 'bg-emerald-500/15 text-emerald-400' 
                            : 'bg-slate-700/50 text-slate-500'
                        }`}>
                          {cust.activeProjectsCount} Aktif
                        </span>
                      </td>
                      <td className="py-3.5 text-center">
                        <button
                          onClick={() => startEdit(cust)}
                          title="Perbarui Data Pelanggan"
                          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 transition cursor-pointer inline-flex items-center"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 italic">
                      Tidak ada data rekanan kontraktor yang cocok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit or Add Customer Panel (4 sub columns) */}
        <div className="lg:col-span-4">
          <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-5 shadow-xl space-y-4">
            
            <div className="border-b border-slate-700/50 pb-3">
              <h3 className="text-sm font-display font-bold text-white flex items-center gap-1.5">
                {isEditing ? (
                  <>
                    <Edit3 className="w-4 h-4 text-amber-500" />
                    Perbarui Profil Pelanggan
                  </>
                ) : isAddingNew ? (
                  <>
                    <UserPlus className="w-4 h-4 text-emerald-500" />
                    Registrasi Pelanggan Baru
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 text-slate-400" />
                    Manajemen Info Rekanan
                  </>
                )}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                {isEditing 
                  ? `Mengedit data profil untuk ID ${isEditing}` 
                  : isAddingNew 
                    ? 'Tambahkan perusahaan kontraktor baru ke dalam sistem logistik' 
                    : 'Pilih ikon edit pada salah satu rekanan kontraktor untuk memperbarui profil fisik perusahaan/proyek.'}
              </p>
            </div>

            {(isEditing || isAddingNew) ? (
              <form onSubmit={handleSave} className="space-y-4">
                
                {/* Instansi Perusahaan */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Nama Perusahaan / Instansi</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Contoh: PT Hutama Karya Persada"
                      value={formCompanyName}
                      onChange={(e) => setFormCompanyName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Nama Representatif */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Representatif (Nama PIC)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Ir. Hermawan"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                {/* Nomor HP */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Telepon / HP Representatif</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Contoh: 0812-7493-2000"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Alamat Terdaftar */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Alamat Kantor / Pengiriman</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2 text-slate-500 w-4 h-4" />
                    <textarea
                      placeholder="Alamat lengkap lokasi pengantaran utama atau alamat kantor..."
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 py-2 bg-slate-900 hover:bg-slate-750 text-slate-400 border border-slate-700 text-xs font-semibold rounded-xl transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 shadow-md shadow-amber-500/5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Simpan
                  </button>
                </div>

              </form>
            ) : (
              <div className="py-8 text-center text-slate-500 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mx-auto text-slate-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <p className="text-xs max-w-[200px] mx-auto leading-relaxed">
                  Pilih salah satu baris rekanan kontraktor untuk memperbarui alamat, no telpon, atau mendaftarkan instansi baru.
                </p>
                
                <button
                  onClick={openAddForm}
                  className="px-4 py-1.5 bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold rounded-lg transition"
                >
                  Registrasi Instansi Baru
                </button>
              </div>
            )}

            <div className="p-3 bg-slate-905 rounded-xl border border-slate-700/30 text-[10px] text-slate-400 space-y-1 leading-relaxed">
              <span className="font-semibold text-slate-300 block">ℹ Otoritas Logistik</span>
              <span>
                Setiap pembaruan data kontraktor akan terekam secara otomatis di dalam <b>Log Audit Logistik</b> untuk menjamin integritas rekam jejak pengiriman scaffolding.
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
