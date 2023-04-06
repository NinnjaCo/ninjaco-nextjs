import { fireEvent, render, screen } from '@/utils/test-utils'
import Menu from '@/components/layout/menu'
import mockRouter from 'next-router-mock'

describe('mock-router', () => {
  it('mocks the useRouter hook', () => {
    // Set the initial url:
    mockRouter.push('/')

    // Render the component:
    render(
      <Menu
        menuOption={{
          isSticky: true,
          logoToUse: 'dark',
          startBackgroundDark: false,
          startButtonDark: true,
          startTextWhite: false,
          startWithBottomBorder: true,
        }}
      />
    )
    expect(screen.getByText('Courses')).toHaveTextContent('Courses')

    // Click the button:
    fireEvent.click(screen.getByText('Courses'))

    // Ensure the router was updated:
    expect(mockRouter).toMatchObject({
      asPath: '/courses',
    })
  })
})
