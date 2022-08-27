import errorUtils from '../utils/error'

const ErrorMiddleware = {
  async Query(resolve, root, args, context, info) {
    const { logger } = context

    try {
      const result = await resolve(root, args, context, info)

      return result
    } catch (error) {
      logger.error(error)

      throw error
    }
  },
  async Mutation(resolve, root, args, context, info) {
    const { logger } = context

    try {
      const result = await resolve(root, args, context, info)

      return result
    } catch (error) {
      logger.error(error)

      const errors = await errorUtils.buildError(error)

      return { errors }
    }
  }
}

export default ErrorMiddleware
