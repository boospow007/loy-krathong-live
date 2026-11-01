export interface CountryOption {
  code: string
  name: string
  flag: string
  flagImage?: string
}

export const countries: CountryOption[] = [
  { code: 'BN', name: 'บรูไนดารุสซาลาม (Brunei Darussalam)', flag: '🇧🇳' },
  { code: 'KH', name: 'กัมพูชา (Cambodia)', flag: '🇰🇭' },
  { code: 'ID', name: 'อินโดนีเซีย (Indonesia)', flag: '🇮🇩' },
  { code: 'LA', name: 'ลาว (Lao PDR)', flag: '🇱🇦' },
  { code: 'MY', name: 'มาเลเซีย (Malaysia)', flag: '🇲🇾' },
  { code: 'MM', name: 'เมียนมา (Myanmar)', flag: '🇲🇲' },
  { code: 'PH', name: 'ฟิลิปปินส์ (Philippines)', flag: '🇵🇭' },
  { code: 'SG', name: 'สิงคโปร์ (Singapore)', flag: '🇸🇬' },
  { code: 'TH', name: 'ไทย (Thailand)', flag: '🇹🇭' },
  { code: 'TL', name: 'ติมอร์-เลสเต (Timor-Leste)', flag: '🇹🇱' },
  { code: 'VN', name: 'เวียดนาม (Vietnam)', flag: '🇻🇳' },
  { code: 'JP', name: 'ญี่ปุ่น (Japan)', flag: '🇯🇵' },
  { code: 'ASEAN', name: 'อาเซียน (ASEAN)', flag: '', flagImage: '/flags/asean.png' },
  { code: 'OTHER', name: 'ประเทศอื่น ๆ (Other)', flag: '🌏' }
]
