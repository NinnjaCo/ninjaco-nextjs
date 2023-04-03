import '@testing-library/jest-dom/extend-expect'
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes'
import mockRouter from 'next-router-mock'

jest.mock('next/router', () => require('next-router-mock'))

mockRouter.useParser(
  createDynamicRouteParser([
    // These paths should match those found in the `/pages` folder:
  ])
)
