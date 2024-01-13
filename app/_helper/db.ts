import sqlite3 from "sqlite3"
import { open } from "sqlite"

export async function openDb() {
  return open({
    filename: `${process.cwd()}/${process.env.DB}`,
    driver: sqlite3.Database,
  })
}
