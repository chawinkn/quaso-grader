// https://github.com/programming-in-th/programming.in.th/blob/25afbe943d41b5b031600d2523089e1fc612d2b9/src/utils/apiResponse.ts

import { NextResponse } from 'next/server'

export function json<T = unknown>(data: T) {
  return NextResponse.json(data)
}

export function badRequest(msg = 'Bad Request') {
  return NextResponse.json({ error: msg }, { status: 400 })
}

export function unauthorized(msg = 'Unauthorized') {
  return NextResponse.json({ error: msg }, { status: 401 })
}

export function forbidden(msg = 'Forbidden') {
  return NextResponse.json({ error: msg }, { status: 403 })
}

export function internalServerError(msg = 'Internal Server Error') {
  return NextResponse.json({ error: msg }, { status: 500 })
}
