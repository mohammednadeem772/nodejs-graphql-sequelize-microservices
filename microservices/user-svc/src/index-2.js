import main from './main-2'

const app = {}

async function gracefulExit() {
  const { server, cache, db } = app

  if (server) await server.close()
  if (cache) cache.disconnect()
  if (db) await db.close()

  process.exit(0)
}

;['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, gracefulExit)
})

main()
  .then((obj) => {
    Object.assign(app, obj)
  })
  .catch((err) => {
    throw err
  })
