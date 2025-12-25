import { lazy } from 'react'
import Root from '../components/root'
import { createHashRouter } from 'react-router'

const router = createHashRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: lazy(() => import('../pages/home')) },
      { path: '/teacher', Component: lazy(() => import('../pages/teacher')) },
      { path: '/html-to-img', Component: lazy(() => import('../pages/html-to-img')) }
    ]
  }
])

export default router
