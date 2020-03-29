import { promises as fs } from 'fs'
import { getOrientation } from '../src'

describe('getOrientation', () => {
  describe('Orientation値が0の画像の場合', () => {
    test('0が返ること', async () => {
      const buf = await fs.readFile('__tests__/files/Portrait_0.jpg');
      const result = getOrientation(buf.buffer)
      expect(result).toBe(0)
    })
  })

  describe('Orientation値が1の画像の場合', () => {
    test('1が返ること', async () => {
      const buf = await fs.readFile('__tests__/files/Portrait_1.jpg')
      const result = getOrientation(buf.buffer)
      expect(result).toBe(1)
    })
  })
  
  describe('Orientation値が2の画像の場合', () => {
    test('2返ること', async () => {
      const buf = await fs.readFile('__tests__/files/Portrait_2.jpg')
      const result = getOrientation(buf.buffer)
      expect(result).toBe(2)
    })
  })

  describe('Orientation値が3の画像の場合', () => {
    test('3返ること', async () => {
      const buf = await fs.readFile('__tests__/files/Portrait_3.jpg')
      const result = getOrientation(buf.buffer)
      expect(result).toBe(3)
    })
  })
  
  describe('Orientation値が4の画像の場合', () => {
    test('4返ること', async () => {
      const buf = await fs.readFile('__tests__/files/Portrait_4.jpg')
      const result = getOrientation(buf.buffer)
      expect(result).toBe(4)
    })
  })
  
  describe('Orientation値が5の画像の場合', () => {
    test('5返ること', async () => {
      const buf = await fs.readFile('__tests__/files/Portrait_5.jpg')
      const result = getOrientation(buf.buffer)
      expect(result).toBe(5)
    })
  })
  
  describe('Orientation値が6の画像の場合', () => {
    test('6返ること', async () => {
      const buf = await fs.readFile('__tests__/files/Portrait_6.jpg')
      const result = getOrientation(buf.buffer)
      expect(result).toBe(6)
    })
  })
  
  describe('Orientation値が7の画像の場合', () => {
    test('7返ること', async () => {
      const buf = await fs.readFile('__tests__/files/Portrait_7.jpg')
      const result = getOrientation(buf.buffer)
      expect(result).toBe(7)
    })
  })
  
  describe('Orientation値が8の画像の場合', () => {
    test('8返ること', async () => {
      const buf = await fs.readFile('__tests__/files/Portrait_8.jpg')
      const result = getOrientation(buf.buffer)
      expect(result).toBe(8)
    })
  })

  describe('jpegファイル以外の場合', () => {
    test('-1が返ること', async () => {
      const buf = await fs.readFile('__tests__/files/test.txt')
      const result = getOrientation(buf.buffer)
      expect(result).toBe(-1)
    })
  })
})