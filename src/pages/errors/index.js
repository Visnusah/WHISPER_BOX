// Error pages exports
export { default as NotFoundPage } from './NotFoundPage'
export { default as ServerErrorPage } from './ServerErrorPage'
export { default as UnauthorizedPage } from './UnauthorizedPage'
export { default as ForbiddenPage } from './ForbiddenPage'
export { default as NetworkErrorPage } from './NetworkErrorPage'
export { default as GeneralErrorPage } from './GeneralErrorPage'
export { default as MaintenancePage } from './MaintenancePage'

// Error page component mapping
export const ERROR_PAGES = {
  404: 'NotFoundPage',
  401: 'UnauthorizedPage', 
  403: 'ForbiddenPage',
  500: 'ServerErrorPage',
  network: 'NetworkErrorPage',
  maintenance: 'MaintenancePage',
  general: 'GeneralErrorPage'
}

// Utility function to get error page component by type
export const getErrorPageComponent = (errorType) => {
  switch (errorType) {
    case 404:
    case '404':
      return import('./NotFoundPage')
    case 401:
    case '401':
      return import('./UnauthorizedPage')
    case 403:
    case '403':
      return import('./ForbiddenPage')
    case 500:
    case '500':
      return import('./ServerErrorPage')
    case 'network':
      return import('./NetworkErrorPage')
    case 'maintenance':
      return import('./MaintenancePage')
    default:
      return import('./GeneralErrorPage')
  }
}
