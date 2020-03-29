const HEX_JPEG = 0xffd8
const HEX_APP1 = 0xffe1
const HEX_LITTLE_ENDIAN = 0x4949
const HEX_ORIENTATION = 0x0112
const EXIF_ID = 0x45786966

const OFFSET_SOI = 0
// 最初のAPPnまでのオフセット
const OFFSET_FIRST_APPN = 2
// 各マーカーの先頭からLength属性までのオフセット
const OFFSET_MARKER_LENGTH = 2
// APP1マーカーからExif識別コードまでのオフセット
const OFFSET_EXIF_ID = 4
// APP1マーカーの先頭からTIFF HEADERのバイトオーダーまでのオフセット
const OFFSET_APP1_BITE_ORDER = 10
// APP1の先頭からIFDのフィールドカウントまでのオフセット
const OFFSET_APP1_IFD_FILED_COUNT = 18
// APP1の先頭からIFDの最初のフィールドまでのオフセット
const OFFSET_APP1_FIRST_FIELD = 20
// 各フィールドの先頭からValue属性までのオフセット
const OFFSET_FIELD_VALUE = 8
// フィールドのサイズ
const FIELD_LENGTH = 12

const ORIENTATION_UNKNOWN = -1

export function getOrientation(buf: ArrayBuffer): number {
  const view = new DataView(buf)
  if (!isJpeg(view)) return ORIENTATION_UNKNOWN
  const app1Offset = getApp1Offset(view)
  if (!app1Offset) return ORIENTATION_UNKNOWN
  if (!isValidEXIF(view, app1Offset)) return ORIENTATION_UNKNOWN
  const endian = isLittleEndian(view, app1Offset)
  return findOrientationValue(view, app1Offset, endian)
}

function findOrientationValue(view: DataView, app1Offset: number, endian: boolean) {
  const count = getFieldCount(view, app1Offset, endian)
  const firstFieldOffset = getFirstFieldOffset(app1Offset)
  let i = 0
  for (; i < count; i++) {
    const offset = getFieldOffset(firstFieldOffset, i)
    if (isOrientation(view, offset, endian)) return getFieldValue(view, offset, endian)
  }
  return ORIENTATION_UNKNOWN
}

function isJpeg(view: DataView): boolean {
  return view.byteLength >= 2 && view.getUint16(OFFSET_SOI, false) === HEX_JPEG
}

function isValidEXIF(view: DataView, app1Offset: number): boolean {
  const id = view.getUint32(app1Offset + OFFSET_EXIF_ID, false)
  return id === EXIF_ID
}

export function getApp1Offset(view: DataView): number | undefined {
  const length = view.byteLength
  let offset = OFFSET_FIRST_APPN

  while (offset < length) {
    /*
      EXIFの規格ではSOIマーカーの直後にAPP1マーカーが記録されることになっている。
      （参照: http://www.cipa.jp/std/documents/j/DC-008-2012_J.pdf P.19）
      しかしPhotoShopのようなアプリケーションによって加工された画像の場合はAPP1より先にAPP0マーカーが記録されることもあるため
      APP1が見つかるまで探索する必要がある
    */
    const value = view.getUint16(offset, false)

    if (HEX_APP1 === value) return offset
    offset = getNextAPPnOffset(view, offset)
  }

  return undefined
}

function getNextAPPnOffset(view: DataView, offset: number): number {
  // 現在のAPPnマーカーのLength属性から値を取り出し次のAPPnマーカーまでのOffsetを求める
  const nextMarkerOffset = view.getUint16(offset + OFFSET_MARKER_LENGTH) + 2
  // 最初のAPPnまでの2byteを足してviewの先頭から次のAPPnマーカーまでのOffsetを返す
  return OFFSET_FIRST_APPN + nextMarkerOffset
}

function isLittleEndian(view: DataView, app1Offset: number): boolean {
  const endian = view.getUint16(app1Offset + OFFSET_APP1_BITE_ORDER, false)
  return endian === HEX_LITTLE_ENDIAN
}

function getFirstFieldOffset(app1Offset: number): number {
  return app1Offset + OFFSET_APP1_FIRST_FIELD 
}

function getFieldOffset(firstFieldOffset: number, fieldNumber: number): number {
  return firstFieldOffset + fieldNumber * FIELD_LENGTH 
}

function getFieldCount(view: DataView, app1Offset: number, endian: boolean): number {
  return view.getUint16(app1Offset + OFFSET_APP1_IFD_FILED_COUNT, endian)
}

function isOrientation(view: DataView, fieldOffset: number, endian: boolean): boolean {
  const hex = view.getUint16(fieldOffset, endian)
  return hex === HEX_ORIENTATION
}

function getFieldValue(view: DataView, fieldOffset: number, endian: boolean): number {
  return view.getUint16(fieldOffset + OFFSET_FIELD_VALUE, endian)
}
