/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  UserPlus, 
  Shield, 
  Trash2, 
  Mail, 
  Phone, 
  Check, 
  UserCheck, 
  Users,
  ShieldAlert,
  Fingerprint
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface UserManagerProps {
  users: UserProfile[];
  currentUser: UserProfile;
  onAddUser: (newUser: UserProfile) => void;
  onDeleteUser: (userId: string) => void;
  onSwitchUser: (user: UserProfile) => void;
}

const AVATAR_COLORS = [
  { class: 'bg-emerald-600', name: 'Emerald Green' },
  { class: 'bg-indigo-600', name: 'Indigo Blue' },
  { class: 'bg-amber-600', name: 'Amber Yellow' },
  { class: 'bg-rose-600', name: 'Rose Red' },
  { class: 'bg-sky-600', name: 'Sky Blue' },
  { class: 'bg-violet-600', name: 'Violet Purple' },
];

export default function UserManager({
  users,
  currentUser,
  onAddUser,
  onDeleteUser,
  onSwitchUser
}: UserManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('sales_admin');
  const [avatarColor, setAvatarColor] = useState('bg-emerald-600');

  const canEdit = currentUser.role === 'manager';

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setRole('sales_admin');
    setAvatarColor('bg-emerald-600');
    setIsAdding(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) {
      alert('Maaf, hanya Manager yang diijinkan untuk menambahkan user baru.');
      return;
    }

    const newUser: UserProfile = {
      id: 'USR-' + Math.floor(100 + Math.random() * 900),
      name,
      email,
      phone,
      role,
      avatar: avatarColor
    };

    onAddUser(newUser);
    resetForm();
  };

  const handleDelete = (userId: string, userName: string) => {
    if (!canEdit) {
      alert('Maaf, hanya Manager yang diijinkan menghapus anggota staf.');
      return;
    }

    if (userId === currentUser.id) {
      alert('Anda tidak bisa menghapus akun Anda sendiri yang sedang aktif digunakan.');
      return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus user "${userName}" secara permanen dari sistem logistik?`)) {
      onDeleteUser(userId);
    }
  };

  return (
    <div id="users-tab" className="space-y-6">
      
      {/* Tab Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight text-white mb-1.5 flex items-center gap-2">
            Kelola <span className="text-amber-500">Anggota & Peran</span>
          </h1>
          <p className="text-slate-400 text-xs">
            Atur otorisasi hak akses staf gudang, administrasi penjualan, dan manajer. Klik kartu user untuk beralih aktor sistem instan.
          </p>
        </div>

        {canEdit && !isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            Tambah User Baru
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* User Card Grid / Main Section (Left 7 or 8 columns) */}
        <div className={isAdding ? 'lg:col-span-7' : 'lg:col-span-12'}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-500" /> Daftar Akun Terdaftar ({users.length})
              </h3>
              <span className="text-[10px] text-slate-500 font-mono italic">
                * Klik 'Simulasi Login' untuk menguji hak akses mereka.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {users.map((user) => {
                const isActive = user.id === currentUser.id;
                return (
                  <div 
                    key={user.id}
                    className={`relative border rounded-2xl p-5 cursor-pointer transition flex flex-col justify-between h-52 group ${
                      isActive 
                        ? 'bg-amber-500/5 border-amber-500 shadow-md shadow-amber-500/5' 
                        : 'bg-slate-800 hover:bg-slate-750 border-slate-705 border-slate-700/50 hover:border-slate-600'
                    }`}
                    onClick={() => {
                      onSwitchUser(user);
                    }}
                  >
                    <div>
                      {/* Top status bar of card */}
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                          {user.id}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <span className={`text-[8px] font-black tracking-wide font-mono px-2 py-0.5 rounded uppercase ${
                            user.role === 'manager' 
                              ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                              : user.role === 'sales_admin' 
                                ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
                                : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                          }`}>
                            {user.role === 'manager' ? 'Manager' : user.role === 'sales_admin' ? 'Sales' : 'Gudang'}
                          </span>
                        </div>
                      </div>

                      {/* User Core info */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl ${user.avatar} text-white font-extrabold flex items-center justify-center text-sm shadow-md`}>
                          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition truncate">{user.name}</h4>
                          <span className="text-[10px] text-slate-400 block truncate">{user.email}</span>
                        </div>
                      </div>

                      {/* Contacts detail */}
                      <div className="space-y-1 text-[10px] text-slate-400 font-mono border-t border-slate-700/30 pt-3">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{user.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom action zone of card */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-700/30 mt-3">
                      {isActive ? (
                        <span className="text-[9px] text-amber-500 font-bold flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5" />
                          Akun Aktif Anda
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-400 group-hover:text-slate-350 transition flex items-center gap-1">
                          <Fingerprint className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-500" />
                          Simulasi Login
                        </span>
                      )}

                      {canEdit && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(user.id, user.name);
                          }}
                          disabled={isActive}
                          className="p-1 rounded bg-slate-900 border border-slate-700/60 hover:bg-rose-500/10 hover:border-rose-500/40 text-slate-400 hover:text-rose-500 transition disabled:opacity-30 disabled:pointer-events-none"
                          title="Hapus Pengguna"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right side - Form Add User (Required only if adding style is turned on) */}
        {isAdding && (
          <div className="lg:col-span-5 animate-fade-in">
            <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 shadow-md space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-700/60 pb-3">
                <UserPlus className="w-4 h-4 text-amber-500" />
                Registrasi Anggota Baru
              </h3>

              {!canEdit && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-450 text-[10px] rounded-xl font-bold flex gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  Anda harus bertindak sebagai Role Manager untuk mendaftarkan akun baru ke sistem.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!canEdit}
                    placeholder="Misal: Hermawan Prasetyo"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Email Staf</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!canEdit}
                      placeholder="hermawan@scafforent.id"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Nomor Telefon</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!canEdit}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Tingkatan Hak Akses (Role)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'warehouse_admin', label: 'Admin Gudang', desc: 'Mutasi Stok & Alat' },
                      { id: 'sales_admin', label: 'Sales Admin', desc: 'Sewa & Invoice' },
                      { id: 'manager', label: 'Manager Utama', desc: 'Semua Kontrol & Staf' }
                    ].map((roleOpt) => (
                      <button
                        key={roleOpt.id}
                        type="button"
                        onClick={() => setRole(roleOpt.id as UserRole)}
                        disabled={!canEdit}
                        className={`p-2.5 rounded-xl border text-xs text-center flex flex-col items-center justify-center transition cursor-pointer ${
                          role === roleOpt.id 
                            ? 'border-amber-500 bg-amber-500/5 text-amber-400 font-bold' 
                            : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <Shield className="w-3.5 h-3.5 mb-1 text-slate-400" />
                        <span className="text-[9px] font-bold block">{roleOpt.label}</span>
                        <span className="text-[7px] text-slate-500 leading-none mt-0.5 block">{roleOpt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Warna Avatar Pengguna</label>
                  <div className="flex gap-2 flex-wrap">
                    {AVATAR_COLORS.map((col) => (
                      <button
                        key={col.class}
                        type="button"
                        onClick={() => setAvatarColor(col.class)}
                        disabled={!canEdit}
                        className={`w-7 h-7 rounded-lg ${col.class} flex items-center justify-center border-2 transition cursor-pointer ${
                          avatarColor === col.class ? 'border-amber-400 scale-110 shadow-lg' : 'border-transparent hover:scale-105'
                        }`}
                        title={col.name}
                      >
                        {avatarColor === col.class && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-700/40">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-400 border border-slate-750 transition text-center"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={!canEdit}
                    className="flex-1 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition text-center cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Daftarkan User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
