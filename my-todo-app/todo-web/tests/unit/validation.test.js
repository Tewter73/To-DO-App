import test from 'node:test'
import assert from 'node:assert/strict'
import {
  sanitizeNoSpaces,
  validateActivityName,
  validateNationalId,
  validatePassword,
  validatePersonName,
} from '../../src/utils/validation.js'

test('sanitizeNoSpaces removes all whitespace characters', () => {
  assert.equal(sanitizeNoSpaces(' 12 3\t4\n5 '), '12345')
})

test('validateNationalId accepts exactly 13 digits', () => {
  assert.equal(validateNationalId('1234567890123'), '')
})

test('validateNationalId rejects invalid formats', () => {
  assert.equal(validateNationalId(''), 'กรุณากรอกเลขบัตรประชาชน')
  assert.equal(validateNationalId('1234'), 'เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก')
  assert.equal(validateNationalId('123456789012a'), 'เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก')
})

test('validatePassword enforces min length and no spaces', () => {
  assert.equal(validatePassword('password123'), '')
  assert.equal(validatePassword(''), 'กรุณากรอกรหัสผ่าน')
  assert.equal(validatePassword('short'), 'รหัสผ่านต้องอย่างน้อย 8 ตัว และห้ามมีช่องว่าง')
  assert.equal(
    validatePassword('password 123'),
    'รหัสผ่านต้องอย่างน้อย 8 ตัว และห้ามมีช่องว่าง',
  )
})

test('validatePersonName trims value and requires at least two chars', () => {
  assert.equal(validatePersonName('John', 'ชื่อ'), '')
  assert.equal(validatePersonName('  ', 'ชื่อ'), 'กรุณากรอกชื่อ')
  assert.equal(validatePersonName(' A ', 'ชื่อ'), 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร')
})

test('validateActivityName requires non-empty and max 100 chars', () => {
  assert.equal(validateActivityName('Buy milk'), '')
  assert.equal(validateActivityName('   '), 'กรุณากรอกชื่องาน')
  assert.equal(validateActivityName('a'.repeat(101)), 'ชื่องานต้องไม่เกิน 100 ตัวอักษร')
})
