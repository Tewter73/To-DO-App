const NATIONAL_ID_REGEX = /^\d{13}$/
const PASSWORD_REGEX = /^\S{8,}$/

export function sanitizeNoSpaces(value) {
  return value.replace(/\s/g, '')
}

export function validateNationalId(value) {
  if (!value) return 'กรุณากรอกเลขบัตรประชาชน'
  if (!NATIONAL_ID_REGEX.test(value)) return 'เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก'
  return ''
}

export function validatePassword(value) {
  if (!value) return 'กรุณากรอกรหัสผ่าน'
  if (!PASSWORD_REGEX.test(value)) return 'รหัสผ่านต้องอย่างน้อย 8 ตัว และห้ามมีช่องว่าง'
  return ''
}

export function validatePersonName(value, label) {
  const trimmed = value.trim()
  if (!trimmed) return `กรุณากรอก${label}`
  if (trimmed.length < 2) return `${label}ต้องมีอย่างน้อย 2 ตัวอักษร`
  return ''
}

export function validateActivityName(value) {
  const trimmed = value.trim()
  if (!trimmed) return 'กรุณากรอกชื่องาน'
  if (trimmed.length > 100) return 'ชื่องานต้องไม่เกิน 100 ตัวอักษร'
  return ''
}
