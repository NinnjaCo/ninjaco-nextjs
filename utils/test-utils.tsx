import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider'
import { TranslationsProvider } from '@/contexts/TranslationContext'
import { render } from '@testing-library/react'

// Add in any providers here if necessary:
const Providers = ({ children }) => {
  // TranslateProvider
  // MemoryRouterProvider (for links to affect the mock router)

  return (
    <MemoryRouterProvider>
      <TranslationsProvider initialLocale="en">{children}</TranslationsProvider>
    </MemoryRouterProvider>
  )
}

const customRender = (ui, options = {}) => render(ui, { wrapper: Providers, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
