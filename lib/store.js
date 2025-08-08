import fs from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'

const DATA_DIR = path.join(process.cwd(), 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const PROPS_FILE = path.join(DATA_DIR, 'properties.json')
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads')

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR)
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR)
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2))
  if (!fs.existsSync(PROPS_FILE)) fs.writeFileSync(PROPS_FILE, JSON.stringify([], null, 2))
}

function readJson(file){
  try {
    return JSON.parse(fs.readFileSync(file,'utf-8')||'[]')
  } catch(e){
    return []
  }
}

function writeJson(file, data){
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

export function initStore(){
  ensure()
  // ensure users are hashed
  let users = readJson(USERS_FILE)
  let changed = false
  users = users.map(u=>{
    if (u.password && !u.password.startsWith('$2')) {
      // hash it
      const hash = bcrypt.hashSync(u.password, 10)
      u.password = hash
      changed = true
    }
    return u
  })
  if (changed) writeJson(USERS_FILE, users)
}

export function getUsers(){
  ensure()
  return readJson(USERS_FILE)
}

export function saveUsers(users){
  ensure()
  writeJson(USERS_FILE, users)
}

export function getProperties(){
  ensure()
  return readJson(PROPS_FILE)
}

export function saveProperties(props){
  ensure()
  writeJson(PROPS_FILE, props)
}

export function uploadsDir(){
  ensure()
  return UPLOADS_DIR
}
