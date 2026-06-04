/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building, 
  Globe, 
  Phone, 
  Mail, 
  CreditCard, 
  FileText, 
  Sparkles, 
  Save,
  CheckCircle,
  Hash
} from 'lucide-react';
import { CompanyProfile, UserProfile } from '../types';

interface CompanyProfileManagerProps {
  profile: CompanyProfile;
  onUpdateProfile: (newProfile: CompanyProfile) => void;
  currentUser: UserProfile;
}

export default function CompanyProfileManager({
  profile,
  onUpdateProfile,
  currentUser
}: CompanyProfileManagerProps) {
  const [formData, setFormData] = useState<CompanyProfile>({ ...profile });
  const [isSuccess, setIsSuccess] = useState(false);

  const canEdit = currentUser.role === 'manager';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <div id="company-profile-tab" className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight text-white mb-1.5 flex items-center gap-2">
            Profil <span className="text-amber-500">Perusahaan</span>
          </h1>
          <p className="text-slate-400 text-xs">
            Atur identitas resmi, alamat kantor, detail rekening bank, dan ketentuan umum untuk diletakkan otomatis pada Surat Kontrak, Kop Surat & Invoice.
          </p>
        </div>
        
        {!canEdit && (
          <div className="px-3.5 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] rounded-xl font-bold font-mono">
            ⚠️ HANYA LEVEL MANAGER YANG DAPAT MENGUBAH PROFIL
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column - Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 shadow-md space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-700/60 pb-3">
              <Building className="w-4 h-4 text-amber-500" />
              Identitas Bisnis & Logo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-2">
                <label className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider">Nama Perusahaan Resmi</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  disabled={!canEdit}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-50"
                  placeholder="Misal: PT SCAFFORENT LOGISTIK INDONESIA"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider">Inisial Logo (Kop)</label>
                <input
                  type="text"
                  name="logoText"
                  maxLength={4}
                  value={formData.logoText}
                  onChange={handleChange}
                  disabled={!canEdit}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-amber-500 font-bold uppercase text-center focus:outline-none focus:border-amber-500 disabled:opacity-50"
                  placeholder="Misal: SR"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider">Slogan / Tagline Bisnis</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                disabled={!canEdit}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-50"
                placeholder="Misal: Penyedia Sewa Modular Keselamatan Scaffolding Konstruksi Profesional"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider">Alamat Kantor Utama</label>
              <textarea
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                disabled={!canEdit}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-50 resize-none"
                placeholder="Alamat lengkap operasional"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Telepon
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!canEdit}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-50"
                  placeholder="021-xxxxxxxx"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email Resmi
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!canEdit}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-50"
                  placeholder="info@perusahaan.id"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Website
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  disabled={!canEdit}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-50"
                  placeholder="www.perusahaan.id"
                />
              </div>
            </div>

            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-700/60 pt-4 pb-3">
              <CreditCard className="w-4 h-4 text-emerald-500" />
              Informasi Rekening Bank Penagihan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider">Nama Bank</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  disabled={!canEdit}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-50"
                  placeholder="Misal: Bank Mandiri"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider flex items-center gap-1">
                  <Hash className="w-3 h-3" /> No. Rekening
                </label>
                <input
                  type="text"
                  name="bankAccountNo"
                  value={formData.bankAccountNo}
                  onChange={handleChange}
                  disabled={!canEdit}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-50 font-mono"
                  placeholder="xxx-xx-xxxxxx-x"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider">Atas Nama (Holder)</label>
                <input
                  type="text"
                  name="bankAccountHolder"
                  value={formData.bankAccountHolder}
                  onChange={handleChange}
                  disabled={!canEdit}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-50"
                  placeholder="Nama pemegang rekening"
                />
              </div>
            </div>

            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-700/60 pt-4 pb-3">
              <FileText className="w-4 h-4 text-blue-500" />
              S&K Ketentuan Umum Invoice
            </h3>

            <div className="space-y-2">
              <label className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider">Catatan Syarat Ketentuan Sewa</label>
              <textarea
                name="generalTerms"
                rows={4}
                value={formData.generalTerms}
                onChange={handleChange}
                disabled={!canEdit}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-50 leading-relaxed"
                placeholder="Rincian S&K penagihan dan jaminan..."
              />
            </div>

            {canEdit && (
              <div className="pt-4 border-t border-slate-700/40 flex items-center justify-between gap-4">
                {isSuccess ? (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-fade-in pointer-events-none">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    Profil perusahaan berhasil disimpan & dieksekusi ke dokumen!
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">
                    * Perubahan langsung memengaruhi Kop Surat Invoice, WA share, & Print.
                  </span>
                )}
                
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs transition duration-150 flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/10 shrink-0"
                >
                  <Save className="w-4 h-4" />
                  Simpan Perubahan
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Right Column - Live Paper Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-3.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Live Letterhead Preview (Uji Kop Surat)
            </h3>

            {/* Standard simulated physical Letterhead page paper */}
            <div className="bg-white text-slate-950 border border-slate-350/50 rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 space-y-6 min-h-[440px] flex flex-col justify-between font-sans">
              
              {/* Kop Surat Header */}
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 bg-slate-900 text-white font-extrabold text-sm flex items-center justify-center rounded">
                        {formData.logoText || 'SR'}
                      </span>
                      <span className="font-display font-extrabold text-base tracking-tight text-slate-950 uppercase">
                        {formData.companyName || 'NAMA PERUSAHAAN'}
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-600 font-medium tracking-tight max-w-[260px] leading-tight">
                      {formData.tagline || 'Slogan perusahaan Anda'}
                    </p>
                    <p className="text-[8px] text-slate-500 leading-normal max-w-[260px]">
                      {formData.address || 'Alamat operasional kantor...'}
                    </p>
                  </div>

                  <div className="text-right space-y-0.5 text-slate-600 text-[8px] font-mono">
                    <div className="font-bold text-slate-800">KONTAK UTAMA</div>
                    <div>T: {formData.phone || '-'}</div>
                    <div className="underline">{formData.email || '-'}</div>
                    <div>{formData.website || '-'}</div>
                  </div>
                </div>

                {/* Simulated doc body */}
                <div className="space-y-3.5 pt-2">
                  <div className="h-4 bg-slate-100 rounded w-1/3 mx-auto text-center font-bold text-[10px] text-slate-800 leading-none py-1 block uppercase font-mono tracking-widest bg-slate-200">
                    INVOICE PENAGIHAN
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[8px] border border-slate-200 p-2.5 rounded bg-slate-50/50">
                    <div className="space-y-1">
                      <span className="text-slate-400 font-bold block uppercase text-[7px]">DITAGIHKAN KEPADA:</span>
                      <div className="font-bold text-slate-800">PT Pelanggan Sejahtera</div>
                      <div className="text-slate-500 italic block">Proyek Pembangunan MRT Segmen 2</div>
                    </div>
                    <div className="text-right space-y-0.5 text-slate-600 font-mono">
                      <div>No Invoice: <strong className="text-slate-900">INV-2026-X01</strong></div>
                      <div>Tanggal: 04 Juni 2026</div>
                      <div>Tempo: 11 Juni 2026</div>
                    </div>
                  </div>

                  {/* Lines mock */}
                  <div className="border border-slate-200 rounded overflow-hidden">
                    <div className="grid grid-cols-12 bg-slate-100 p-1.5 text-[8px] font-bold text-slate-700">
                      <div className="col-span-8">Komponen Scaffolding</div>
                      <div className="col-span-2 text-right">Qty</div>
                      <div className="col-span-2 text-right">Total</div>
                    </div>
                    <div className="p-1.5 space-y-1 text-[8px] text-slate-600 border-t border-slate-150">
                      <div className="grid grid-cols-12">
                        <div className="col-span-8 font-semibold">Main Frame 1.9m</div>
                        <div className="col-span-2 text-right font-mono">100 Pcs</div>
                        <div className="col-span-2 text-right font-mono">Rp 3.500.000</div>
                      </div>
                      <div className="grid grid-cols-12">
                        <div className="col-span-8 font-semibold">U-Head 60cm Adjustable</div>
                        <div className="col-span-2 text-right font-mono">100 Pcs</div>
                        <div className="col-span-2 text-right font-mono">Rp 2.500.005</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kop Surat Footer (Bank + S&K) */}
              <div className="border-t border-slate-200 pt-3 space-y-2.5">
                <div className="grid grid-cols-2 gap-3 text-[8px] text-slate-600 leading-normal">
                  <div>
                    <span className="font-black text-slate-800 block text-[7px] mb-0.5 uppercase tracking-wide">METODE TRANSFER:</span>
                    <div className="font-mono bg-slate-50 p-1.5 rounded border border-slate-150 text-[7px] space-y-0.5 font-bold">
                      <div>Bank: {formData.bankName || '-'}</div>
                      <div>No. Rek: {formData.bankAccountNo || '-'}</div>
                      <div>A.N: {formData.bankAccountHolder || '-'}</div>
                    </div>
                  </div>

                  <div>
                    <span className="font-black text-slate-800 block text-[7px] mb-0.5 uppercase tracking-wide">SYARAT & KETENTUAN:</span>
                    <p className="text-[7px] text-slate-500 whitespace-pre-wrap leading-tight line-clamp-3 italic">
                      {formData.generalTerms || 'Ketentuan umum penagihan...'}
                    </p>
                  </div>
                </div>

                <div className="text-center text-[7px] text-slate-400 font-medium border-t border-slate-100 pt-1.5">
                  Dokumen resmi diterbitkan tersistem oleh {formData.companyName}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
