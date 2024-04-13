// https://github.com/programming-in-th/programming.in.th/blob/25afbe943d41b5b031600d2523089e1fc612d2b9/src/lib/codeTransformer.ts

import { brotliCompress, brotliDecompress } from 'zlib'

export async function compressCode(code: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    brotliCompress(code, (err, res) => {
      if (err) reject(err)
      resolve(res)
    })
  })
}

export async function decompressCode(code: Buffer): Promise<string[]> {
  return new Promise((resolve, reject) => {
    brotliDecompress(code, (err, res) => {
      if (err) reject(err)
      resolve(JSON.parse(res.toString('utf8')))
    })
  })
}
