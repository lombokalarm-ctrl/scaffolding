import { ScaffoldingItem, InventoryStock, RentalOrder, Invoice, SystemNotification, UserProfile, Customer, AuditLog } from '../types';

export const SCAFFOLDING_ITEMS: ScaffoldingItem[] = [
  {
    id: 'mf-190',
    name: 'Main Frame 1.9m',
    category: 'frame',
    dailyRate: 2000,
    monthlyRate: 35000,
    depositRate: 50000,
    weightKg: 11.2,
    description: 'Rangka scaffolding utama setinggi 1.9 meter. Material pipa baja hitam berkualitas tinggi.'
  },
  {
    id: 'mf-170',
    name: 'Main Frame 1.7m',
    category: 'frame',
    dailyRate: 1800,
    monthlyRate: 30000,
    depositRate: 45000,
    weightKg: 10.1,
    description: 'Rangka scaffolding utama setinggi 1.7 meter. Ideal untuk area plafon sedang.'
  },
  {
    id: 'lf-090',
    name: 'Ladder Frame 0.9m',
    category: 'frame',
    dailyRate: 1200,
    monthlyRate: 20000,
    depositRate: 30000,
    weightKg: 6.5,
    description: 'Rangka tangga sambungan atas setinggi 0.9 meter.'
  },
  {
    id: 'cb-220',
    name: 'Cross Brace 2.20m',
    category: 'frame',
    dailyRate: 1000,
    monthlyRate: 15000,
    depositRate: 25000,
    weightKg: 3.5,
    description: 'Batang silang pengikat antar Main Frame agar struktur kokoh dan stabil.'
  },
  {
    id: 'jp-01',
    name: 'Joint Pin',
    category: 'accessories',
    dailyRate: 300,
    monthlyRate: 4000,
    depositRate: 8000,
    weightKg: 0.4,
    description: 'Pasak penyambung vertikal antar tiang Main Frame.'
  },
  {
    id: 'jb-60',
    name: 'Jack Base 60cm Adjustable',
    category: 'support',
    dailyRate: 1500,
    monthlyRate: 25000,
    depositRate: 35000,
    weightKg: 4.2,
    description: 'Dudukan ulir bawah untuk menyesuaikan ketinggian di atas tanah tidak rata.'
  },
  {
    id: 'uh-60',
    name: 'U-Head 60cm Adjustable',
    category: 'support',
    dailyRate: 1500,
    monthlyRate: 25000,
    depositRate: 35000,
    weightKg: 4.5,
    description: 'Penyangga atas berbentuk U untuk menopang balok kayu atau cetakan bekisting.'
  },
  {
    id: 'cw-01',
    name: 'Catwalk / Plat Deck (Alas)',
    category: 'safety',
    dailyRate: 3500,
    monthlyRate: 60000,
    depositRate: 100000,
    weightKg: 14.5,
    description: 'Dek alas pijakan baja anti slip berlubang untuk area berjalan pekerja.'
  },
  {
    id: 'st-01',
    name: 'Staircase / Tangga Baja',
    category: 'safety',
    dailyRate: 5000,
    monthlyRate: 75000,
    depositRate: 150000,
    weightKg: 28.0,
    description: 'Tangga scaffolding modular dengan pegangan tangan terpadu untuk keselamatan ekstra.'
  },
  {
    id: 'sc-02',
    name: 'Swivel Clamp 2 Inch',
    category: 'accessories',
    dailyRate: 500,
    monthlyRate: 8000,
    depositRate: 15000,
    weightKg: 1.2,
    description: 'Klem putar penyambung pipa siku fleksibel di berbagai sudut konstruksi.'
  }
];

export const INITIAL_INVENTORY: InventoryStock[] = [
  { itemId: 'mf-190', itemName: 'Main Frame 1.9m', total: 500, rented: 320, available: 165, maintenance: 15 },
  { itemId: 'mf-170', itemName: 'Main Frame 1.7m', total: 400, rented: 210, available: 175, maintenance: 15 },
  { itemId: 'lf-090', itemName: 'Ladder Frame 0.9m', total: 200, rented: 80, available: 110, maintenance: 10 },
  { itemId: 'cb-220', itemName: 'Cross Brace 2.20m', total: 800, rented: 530, available: 250, maintenance: 20 },
  { itemId: 'jp-01', itemName: 'Joint Pin', total: 1200, rented: 850, available: 330, maintenance: 20 },
  { itemId: 'jb-60', itemName: 'Jack Base 60cm Adjustable', total: 300, rented: 150, available: 140, maintenance: 10 },
  { itemId: 'uh-60', itemName: 'U-Head 60cm Adjustable', total: 300, rented: 140, available: 150, maintenance: 10 },
  { itemId: 'cw-01', itemName: 'Catwalk / Plat Deck (Alas)', total: 150, rented: 85, available: 55, maintenance: 10 },
  { itemId: 'st-01', itemName: 'Staircase / Tangga Baja', total: 80, rented: 35, available: 40, maintenance: 5 },
  { itemId: 'sc-02', itemName: 'Swivel Clamp 2 Inch', total: 1000, rented: 450, available: 530, maintenance: 20 }
];

export const INITIAL_ORDERS: RentalOrder[] = [
  {
    id: 'TRX-94821',
    contractorName: 'PT Jaya Wijaya Konstruksi',
    contractorPhone: '0812-3456-7890',
    projectName: 'Pembangunan Gedung Kantor Antara',
    projectAddress: 'Jl. Jenderal Sudirman No. 42, Jakarta Pusat',
    items: [
      { itemId: 'mf-190', itemName: 'Main Frame 1.9m', quantity: 50, dailyRate: 2000, monthlyRate: 35000, depositRate: 50000 },
      { itemId: 'cb-220', itemName: 'Cross Brace 2.20m', quantity: 80, dailyRate: 1000, monthlyRate: 15000, depositRate: 25000 },
      { itemId: 'jp-01', itemName: 'Joint Pin', quantity: 100, dailyRate: 300, monthlyRate: 4000, depositRate: 8000 },
      { itemId: 'jb-60', itemName: 'Jack Base 60cm Adjustable', quantity: 20, dailyRate: 1500, monthlyRate: 25000, depositRate: 35000 },
      { itemId: 'cw-01', itemName: 'Catwalk / Plat Deck (Alas)', quantity: 10, dailyRate: 3500, monthlyRate: 60000, depositRate: 100000 }
    ],
    rentMethod: 'bulanan',
    durationValue: 1, // 1 Bulan
    startDate: '2026-05-15',
    endDate: '2026-06-14',
    securityDepositPaid: 6500000, // (50*50k + 80*25k + 100*8k + 20*35k + 10*100k) -> 2.5jt + 2jt + 800k + 700k + 1jt = 7jt. Adjusted
    status: 'active',
    trackingStep: 3, // Delivered and active
    shippingProgress: 100,
    gpsLat: -6.21462,
    gpsLng: 106.82153,
    createdAt: '2026-05-14T09:00:00Z',
    isExtended: false,
    refundStatus: 'none'
  },
  {
    id: 'TRX-83141',
    contractorName: 'CV Bangun Sejahtera Mandiri',
    contractorPhone: '0857-1122-3344',
    projectName: 'Renovasi Ruko Green Lake',
    projectAddress: 'Ruko Sentra Niaga Blok F-12, Tangerang',
    items: [
      { itemId: 'mf-170', itemName: 'Main Frame 1.7m', quantity: 15, dailyRate: 1800, monthlyRate: 30000, depositRate: 45000 },
      { itemId: 'cb-220', itemName: 'Cross Brace 2.20m', quantity: 20, dailyRate: 1000, monthlyRate: 15000, depositRate: 25000 },
      { itemId: 'jp-01', itemName: 'Joint Pin', quantity: 30, dailyRate: 300, monthlyRate: 4000, depositRate: 8000 }
    ],
    rentMethod: 'harian',
    durationValue: 10, // 10 Hari
    startDate: '2026-06-02',
    endDate: '2026-06-12',
    securityDepositPaid: 1415000, // 15*45000 + 20*25000 + 30*8000 = 675 + 500 + 240 = 1.415.000
    status: 'shipping', // Currently on the way!
    trackingStep: 2, // Shipping
    shippingProgress: 45,
    gpsLat: -6.18244,
    gpsLng: 106.68925,
    createdAt: '2026-06-02T10:30:00Z',
    isExtended: false,
    refundStatus: 'none'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-2026-0001',
    orderId: 'TRX-94821',
    contractorName: 'PT Jaya Wijaya Konstruksi',
    projectName: 'Pembangunan Gedung Kantor Antara',
    type: 'initial',
    createdAt: '2026-05-14T10:00:00Z',
    rentCost: 4450000, // Rent cost breakdown
    securityDeposit: 7000000, // Deposit
    discount: 150000,
    totalAmount: 11300000, // rent(4450000) + deposit(7000000) - discount(150000) = 11300000 (Rp 11.300.000)
    isPaid: true,
    dueDate: '2026-05-15'
  },
  {
    id: 'INV-2026-0002',
    orderId: 'TRX-83141',
    contractorName: 'CV Bangun Sejahtera Mandiri',
    projectName: 'Renovasi Ruko Green Lake',
    type: 'initial',
    createdAt: '2026-06-02T11:00:00Z',
    rentCost: 560000, // (15*1800 + 20*1000 + 30*300) * 10 days = 560000
    securityDeposit: 1415000,
    discount: 0,
    totalAmount: 1975000, // 560000 + 1415000 - 0 = 1975000 (Rp 1.975.000)
    isPaid: true,
    dueDate: '2026-06-02'
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'NTF-001',
    orderId: 'TRX-94821',
    title: 'Pengingat Masa Sewa Berakhir (H-11)',
    message: 'Masa sewa scaffold untuk proyek "Pembangunan Gedung Kantor Antara" akan berakhir pada 14 Juni 2026. Anda dapat mengajukan perpanjangan kontrak untuk bulan ke-2 langsung melalui aplikasi.',
    type: 'warning',
    createdAt: '2026-06-03T08:00:00Z',
    read: false,
    actionType: 'extend'
  },
  {
    id: 'NTF-002',
    orderId: 'TRX-83141',
    title: 'Pengiriman Sedang Berlangsung',
    message: 'Armada pengiriman ScaffoRent sedang membawa pesanan TRX-83141 menuju proyek "Renovasi Ruko Green Lake". Estimasi tiba 45 menit lagi.',
    type: 'info',
    createdAt: '2026-06-03T21:40:00Z',
    read: false,
    actionType: 'view_tracker'
  }
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'USR-001',
    name: 'Budi Santoso',
    role: 'warehouse_admin',
    email: 'budi.santoso@scafforent.id',
    avatar: 'bg-emerald-600',
    phone: '0812-4455-8899'
  },
  {
    id: 'USR-002',
    name: 'Siti Aminah',
    role: 'sales_admin',
    email: 'siti.aminah@scafforent.id',
    avatar: 'bg-indigo-600',
    phone: '0857-2233-4455'
  },
  {
    id: 'USR-003',
    name: 'Zamroni Taufik',
    role: 'manager',
    email: 'Zamroni.Taufik@gmail.com',
    avatar: 'bg-amber-600',
    phone: '0878-1122-3344'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'PT Jaya Wijaya Konstruksi',
    phone: '0812-3456-7890',
    companyName: 'PT Jaya Wijaya Konstruksi',
    address: 'Jl. Jenderal Sudirman No. 42, Jakarta Pusat',
    activeProjectsCount: 1
  },
  {
    id: 'CUST-002',
    name: 'CV Bangun Sejahtera Mandiri',
    phone: '0857-1122-3344',
    companyName: 'CV Bangun Sejahtera Mandiri',
    address: 'Ruko Sentra Niaga Blok F-12, Tangerang',
    activeProjectsCount: 1
  },
  {
    id: 'CUST-003',
    name: 'PT Adhi Megah Persada',
    phone: '0813-9876-5432',
    companyName: 'PT Adhi Megah Persada',
    address: 'Gedung Wisma Perkasa Lt. 5, Kuningan, Jakarta Selatan',
    activeProjectsCount: 0
  },
  {
    id: 'CUST-004',
    name: 'CV Sinar Baru Kontraktor',
    phone: '0877-6543-2109',
    companyName: 'CV Sinar Baru Kontraktor',
    address: 'Kawasan Industri Cikarang Blok C-4, Bekasi',
    activeProjectsCount: 0
  }
];

export const INITIAL_LOGS: AuditLog[] = [
  {
    id: 'LOG-001',
    userName: 'Budi Santoso',
    userRole: 'warehouse_admin',
    action: 'Restock Alat',
    details: 'Melakukan penambahan stok 20 Pcs untuk Main Frame 1.9m.',
    timestamp: '2026-06-03T09:12:00Z',
    category: 'inventory'
  },
  {
    id: 'LOG-002',
    userName: 'Siti Aminah',
    userRole: 'sales_admin',
    action: 'Transaksi Baru',
    details: 'Mencatatkan penyewaan baru TRX-83141 untuk CV Bangun Sejahtera Mandiri.',
    timestamp: '2026-06-02T10:30:00Z',
    category: 'sales'
  },
  {
    id: 'LOG-003',
    userName: 'Zamroni Taufik',
    userRole: 'manager',
    action: 'Edit Pelanggan',
    details: 'Memperbarui rincian alamat penagihan PT Adhi Megah Persada.',
    timestamp: '2026-06-02T08:15:00Z',
    category: 'customer'
  },
  {
    id: 'LOG-004',
    userName: 'Budi Santoso',
    userRole: 'warehouse_admin',
    action: 'Pemeliharaan',
    details: 'Mengirimkan 5 unit tangga baja rusak ke bengkel pemeliharaan korektif.',
    timestamp: '2026-06-01T14:45:00Z',
    category: 'inventory'
  }
];
