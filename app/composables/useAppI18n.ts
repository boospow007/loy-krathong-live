import { defaults } from '#shared/models'
import { resolveLocale, translate, localizedCountryName, type Locale } from '#shared/i18n'
export function useAppI18n() {
  const preference = useCookie<string>('khuen-chan-language', { default: () => 'en', sameSite: 'lax', maxAge: 60 * 60 * 24 * 365, path: '/' })
  const current = useState<Locale>('app-language', () => resolveLocale(preference.value))
  const locale = computed<Locale>({ get: () => current.value, set: value => { current.value = resolveLocale(value); preference.value = current.value } })
  const t = (text: string | undefined) => translate(text, locale.value)
  const countryName = (name: string) => localizedCountryName(name, locale.value)
  const flagLabel = (name: string) => locale.value === 'en' ? `${countryName(name)} flag` : `ธง${countryName(name)}`
  const eventText = (text: string, field: 'title' | 'subtitle') => text === defaults[field] ? t(text) : text
  return { locale, t, countryName, flagLabel, eventText }
}
