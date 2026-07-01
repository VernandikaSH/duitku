// Daftar kategori tetap — dipisah antara pemasukan dan pengeluaran
export const EXPENSE_CATEGORIES = [
  'Makan & Minum',
  'Transport',
  'Belanja',
  'Tagihan',
  'Hiburan',
  'Kesehatan',
  'Pendidikan',
  'Lainnya',
]

export const INCOME_CATEGORIES = [
  'Gaji',
  'Bonus',
  'Investasi',
  'Hadiah',
  'Lainnya',
]

export function getCategoriesByType(type) {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
}