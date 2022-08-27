import Aigle from 'aigle'

import { isEmpty, isNil } from 'lodash'

const { each, map, promisifyAll } = Aigle

class AbstractCrudService {
  constructor(serviceName, client, logger) {
    this._serviceName = serviceName
    this._client = promisifyAll(client)
    this._logger = logger
    this._jsonFields = []
  }

  async find(query) {
    this._logger.info(`${this._serviceName}#find.call %o`, query)

    const result = await this._client.findAsync({
      select: !isEmpty(query.select) ? query.select : undefined,
      where: !isEmpty(query.where) ? JSON.stringify(query.where) : undefined,
      orderBy: !isEmpty(query.orderBy) ? JSON.stringify(query.orderBy) : undefined,
      limit: !isNil(query.limit) ? query.limit : 25,
      before: !isEmpty(query.before) ? query.before : undefined,
      after: !isEmpty(query.after) ? query.after : undefined
    })

    let { edges } = result

    edges = edges || []

    if (!isEmpty(this._jsonFields)) {
      edges = await map(edges, async (edge) => {
        const { node, cursor } = edge

        if (!isEmpty(node)) {
          await each(this._jsonFields, async (field) => {
            if (Buffer.isBuffer(node[field])) {
              const json = node[field].toString()

              if (!isEmpty(json)) node[field] = JSON.parse(json)
            }
          })
        }

        return {
          node,
          cursor
        }
      })
    }

    this._logger.info(`${this._serviceName}#find.result %o %o`, edges, result.pageInfo)

    return {
      edges,
      pageInfo: result.pageInfo
    }
  }

  async findById(id) {
    this._logger.info(`${this._serviceName}#findById.call %o`, { id })

    const result = await this._client.findByIdAsync({ id })

    if (!isEmpty(result) && !isEmpty(this._jsonFields)) {
      await each(this._jsonFields, async (field) => {
        if (Buffer.isBuffer(result[field])) {
          const json = result[field].toString()

          if (!isEmpty(json)) result[field] = JSON.parse(json)
        }
      })
    }

    this._logger.info(`${this._serviceName}#findById.result %o`, result)

    return result
  }

  async findOne(query) {
    this._logger.info(`${this._serviceName}#findOne.call %o`, query)

    const result = await this._client.findOneAsync({
      select: !isEmpty(query.select) ? query.select : undefined,
      where: !isEmpty(query.where) ? JSON.stringify(query.where) : undefined
    })

    if (!isEmpty(result) && !isEmpty(this._jsonFields)) {
      await each(this._jsonFields, async (field) => {
        if (Buffer.isBuffer(result[field])) {
          const json = result[field].toString()

          if (!isEmpty(json)) result[field] = JSON.parse(json)
        }
      })
    }

    this._logger.info(`${this._serviceName}#findOne.result %o`, result)

    return result
  }

  async count(query) {
    this._logger.info(`${this._serviceName}#count.call %o`, query)

    const result = await this._client.countAsync({
      where: !isEmpty(query.where) ? JSON.stringify(query.where) : undefined
    })

    this._logger.info(`${this._serviceName}#count.result %o`, result)

    return result.count
  }

  async create(data) {
    this._logger.info(`${this._serviceName}#create.call %o`, data)

    const model = data

    if (!isEmpty(this._jsonFields)) {
      await each(this._jsonFields, async (field) => {
        if (!isEmpty(model[field])) model[field] = Buffer.from(JSON.stringify(model[field]))
      })
    }

    const result = await this._client.createAsync(model)

    if (!isEmpty(result) && !isEmpty(this._jsonFields)) {
      await each(this._jsonFields, async (field) => {
        if (Buffer.isBuffer(result[field])) {
          const json = result[field].toString()

          if (!isEmpty(json)) result[field] = JSON.parse(json)
        }
      })
    }

    this._logger.info(`${this._serviceName}#create.result %o`, result)

    return result
  }

  async update(id, data) {
    this._logger.info(`${this._serviceName}#update.call %o`, { id, data })

    const model = data

    if (!isEmpty(this._jsonFields)) {
      await each(this._jsonFields, async (field) => {
        if (!isEmpty(model[field])) model[field] = Buffer.from(JSON.stringify(model[field]))
      })
    }

    const result = await this._client.updateAsync({ id, data: model })

    if (!isEmpty(result) && !isEmpty(this._jsonFields)) {
      await each(this._jsonFields, async (field) => {
        if (Buffer.isBuffer(result[field])) {
          const json = result[field].toString()

          if (!isEmpty(json)) result[field] = JSON.parse(json)
        }
      })
    }

    this._logger.info(`${this._serviceName}#update.result %o`, result)

    return result
  }

  async destroy(query) {
    this._logger.info(`${this._serviceName}#destroy.call %o`, query)

    const result = await this._client.destroyAsync({
      where: !isEmpty(query.where) ? JSON.stringify(query.where) : undefined
    })

    this._logger.info(`${this._serviceName}#destroy.result %o`, result)

    return result.count
  }
}

export default AbstractCrudService
