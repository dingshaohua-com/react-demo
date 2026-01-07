import { lazy } from 'react'
import Root from '../components/root'
import { createHashRouter } from 'react-router'

const router = createHashRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: lazy(() => import('../pages/home')) },
      { path: '/screenshot', Component: lazy(() => import('../pages/screenshot')) },
      { path: '/screenshot-long', Component: lazy(() => import('../pages/screenshot-long')) }
    ]
  }
])

export default router
