import b4a from 'b4a'
import Hyperdrive from 'hyperdrive'
import Corestore from 'corestore'
import { mkdir } from 'node:fs/promises';


const fields = {
  username: 'test',
}

const LOCAL_BASEDIR = './uploads'
const CORESTORE_BASEDIR = './drives'

// Create a new Corestore instance
const store = new Corestore(`${CORESTORE_BASEDIR}/${fields.username}`)

// Create a new Localdrive path
await mkdir(`${LOCAL_BASEDIR}/${fields.username}`, {recursive: true})
// Create a new Hyperdrive instance
const drive = new Hyperdrive(store)
await drive.ready()

const res = { message: 'Drive created successfully!', key: b4a.toString(drive.key, 'hex') }

console.log(res)
