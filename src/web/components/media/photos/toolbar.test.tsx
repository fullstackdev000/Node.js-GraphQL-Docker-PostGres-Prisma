import * as React from 'react'
import Toolbar from './toolbar'

import { mockOrderPhotos } from '../mockPhotosData'

/**
 * Migrating from Enzyme to React Testing Library (RTL)
 */
import { ThemeProvider } from '#veewme/web/common/styled-components'
import theme from '#veewme/web/common/theme'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// import userEvent from '@testing-library/user-event'

describe('Toolbar (RTL)', () => {
  const onUpdate = jest.fn()
  const onDelete = jest.fn()
  const onSelectAll = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Renders correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <Toolbar
          photos={mockOrderPhotos}
          photosSelection={{}}
          onSelectAll={onSelectAll}
          onUpdateSelected={onUpdate}
          onDeleteSelected={onDelete}
          onSort={() => null}
        />
      </ThemeProvider>
    )
    expect(screen.getAllByRole('button').length).toBe(2)

  })

  it('Shows additional buttons when photos selected', () => {
    render(
      <ThemeProvider theme={theme}>
        <Toolbar
          photos={mockOrderPhotos}
          photosSelection={{ 1: true, 2: true, 3: true }}
          onSelectAll={onSelectAll}
          onUpdateSelected={onUpdate}
          onDeleteSelected={onDelete}
          onSort={() => null}
        />
      </ThemeProvider>
    )
    expect(screen.getAllByRole('button').length).toBe(5)
  })

  it('Triggers callbacks on click', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider theme={theme}>
        <Toolbar
          photos={mockOrderPhotos}
          photosSelection={{ 1: true, 2: true, 3: true }}
          onSelectAll={onSelectAll}
          onUpdateSelected={onUpdate}
          onDeleteSelected={onDelete}
          onSort={() => null}
        />
      </ThemeProvider>
    )

    // fireEvent.click(screen.getByText('Star'))
    await user.click(screen.getByText('Star'))
    expect(onUpdate).toHaveBeenLastCalledWith({
      star: true
    })

    await user.click(screen.getByText('Hide'))
    expect(onUpdate).toHaveBeenLastCalledWith({
      hidden: true
    })

  })

  it('Displays correct buttons - Star or Unstar', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <Toolbar
          photos={mockOrderPhotos}
          photosSelection={{ 1: true, 2: true, 3: true }}
          onSelectAll={onSelectAll}
          onUpdateSelected={onUpdate}
          onDeleteSelected={onDelete}
          onSort={() => null}
        />
      </ThemeProvider>
    )

    expect(screen.getByText('Star')).toBeInTheDocument()
    expect(screen.queryByText('Unstar')).not.toBeInTheDocument()
    await user.click(screen.getByText('Star'))
    expect(onUpdate).toHaveBeenLastCalledWith({
      star: true
    })

    // only photos with star: true
    rerender(
      <ThemeProvider theme={theme}>
        <Toolbar
          photos={mockOrderPhotos}
          photosSelection={{ 1: false, 2: true, 3: false, 4: true }}
          onSelectAll={onSelectAll}
          onUpdateSelected={onUpdate}
          onDeleteSelected={onDelete}
          onSort={() => null}
        />
      </ThemeProvider>
    )

    expect(screen.queryByText('Star')).not.toBeInTheDocument()
    expect(screen.getByText('Unstar')).toBeInTheDocument()
    await user.click(screen.getByText('Unstar'))
    expect(onUpdate).toHaveBeenLastCalledWith({
      star: false
    })
  })

  it('Displays correct buttons - Show or hide', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <Toolbar
          photos={mockOrderPhotos}
          photosSelection={{ 3: true, 4: true }}
          onSelectAll={onSelectAll}
          onUpdateSelected={onUpdate}
          onDeleteSelected={onDelete}
          onSort={() => null}
        />
      </ThemeProvider>
    )

    expect(screen.getByText('Hide')).toBeInTheDocument()
    expect(screen.queryByText('Show')).not.toBeInTheDocument()
    await user.click(screen.getByText('Hide'))
    expect(onUpdate).toHaveBeenLastCalledWith({
      hidden: true
    })

    // only photos with hidden: true
    rerender(
      <ThemeProvider theme={theme}>
        <Toolbar
          photos={mockOrderPhotos}
          photosSelection={{ 1: true, 3: false, 4: false }}
          onSelectAll={onSelectAll}
          onUpdateSelected={onUpdate}
          onDeleteSelected={onDelete}
          onSort={() => null}
        />
      </ThemeProvider>
    )
    expect(screen.queryByText('Hide')).not.toBeInTheDocument()
    expect(screen.getByText('Show')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Show'))
    expect(onUpdate).toHaveBeenLastCalledWith({
      hidden: false
    })
  })

  it('Calls onSelectAll callback', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider theme={theme}>
        <Toolbar
          photos={mockOrderPhotos}
          photosSelection={{ 1: true, 2: true, 3: true }}
          onSelectAll={onSelectAll}
          onUpdateSelected={onUpdate}
          onDeleteSelected={onDelete}
          onSort={() => null}
        />
      </ThemeProvider>
    )
    const SelectAllBtn = screen.getByText('Select all')
    const DeselectAllBtn = screen.getByText('Deselect')

    await user.click(SelectAllBtn)

    expect(onSelectAll).toHaveBeenLastCalledWith(true)

    await user.click(DeselectAllBtn)

    expect(onSelectAll).toHaveBeenLastCalledWith(false)
  })
})
