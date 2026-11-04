export interface CountryOption {
  code: string
  name: string
  flag: string
  flagImage?: string
}

export const countries: CountryOption[] = [
  { code: 'BN', flagImage: '/flags/bn.svg', name: 'บรูไนดารุสซาลาม (Brunei Darussalam)', flag: '🇧🇳' },
  { code: 'KH', flagImage: '/flags/kh.svg', name: 'กัมพูชา (Cambodia)', flag: '🇰🇭' },
  { code: 'ID', flagImage: '/flags/id.svg', name: 'อินโดนีเซีย (Indonesia)', flag: '🇮🇩' },
  { code: 'LA', flagImage: '/flags/la.svg', name: 'ลาว (Lao PDR)', flag: '🇱🇦' },
  { code: 'MY', flagImage: '/flags/my.svg', name: 'มาเลเซีย (Malaysia)', flag: '🇲🇾' },
  { code: 'MM', flagImage: '/flags/mm.svg', name: 'เมียนมา (Myanmar)', flag: '🇲🇲' },
  { code: 'PH', flagImage: '/flags/ph.svg', name: 'ฟิลิปปินส์ (Philippines)', flag: '🇵🇭' },
  { code: 'SG', flagImage: '/flags/sg.svg', name: 'สิงคโปร์ (Singapore)', flag: '🇸🇬' },
  { code: 'TH', flagImage: '/flags/th.svg', name: 'ไทย (Thailand)', flag: '🇹🇭' },
  { code: 'TL', flagImage: '/flags/tl.svg', name: 'ติมอร์-เลสเต (Timor-Leste)', flag: '🇹🇱' },
  { code: 'VN', flagImage: '/flags/vn.svg', name: 'เวียดนาม (Vietnam)', flag: '🇻🇳' },
  { code: 'JP', flagImage: '/flags/jp.svg', name: 'ญี่ปุ่น (Japan)', flag: '🇯🇵' },
  { code: 'ASEAN', name: 'อาเซียน (ASEAN)', flag: '', flagImage: '/flags/asean.png' },
  { code: 'OTHER', flagImage: '/flags/other.svg', name: 'ประเทศอื่น ๆ (Other)', flag: '🌏' }
]
