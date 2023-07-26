import { shallow, ShallowWrapper } from 'enzyme'
import * as React from 'react'
import { mockOrderPhotos } from '../mockPhotosData'
import * as PL from './photosList'
import Toolbar from './toolbar'

jest.mock('#veewme/web/common/slideshow', () => {
  return {
    __esModule: true,
    default: () => null
  }
})

jest.mock('#veewme/web/common/sizeSlider', () => {
  return {
    __esModule: true,
    default: () => null
  }
})

jest.mock('react-modal', () => {
  return {
    __esModule: true,
    default: () => null
  }
})

/*
jest.mock('./photosList', () => {
  return {
    ...jest.requireActual('./photosList'),
    SortablePhoto: () => <div />
  }
})
*/

jest.mock('react-tooltip', () => {
  return {
    __esModule: true,
    default: () => null
  }
})

jest.mock('react-sortable-hoc', () => {
  const SortableElement = () => <div className='a' />
  return {
    __esModule: true,
    SortableContainer: () => null,
    SortableElement: () => SortableElement,
    SortableHandle: () => ''
  }
})

describe('Photos list tests', () => {
  let wrapper: ShallowWrapper<PL.PhotosListProps, PL.PhotosListState, PL.PhotosList>
  const onUpdate = jest.fn()
  const onDelete = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    wrapper = shallow(
      <PL.PhotosList
        photos={mockOrderPhotos}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onSort={jest.fn()}
        showBannerSettings={false}
        processedPhotos={[]}
      />
    )
  })

  it('Renders correctly', () => {
    expect(wrapper.find(PL.SortablePhoto).length).toBe(mockOrderPhotos.length)
    expect(wrapper.find(Toolbar).exists()).toBe(true)
    expect(wrapper.find('SortableElement').length).toBe(mockOrderPhotos.length)
  })

  it('Returns selected photos', () => {
    const instance = wrapper.instance()
    let selectedPhotos = instance.selectedPhotosIds

    instance.setState({
      photosSelection: {
        2: true,
        3: true,
        5: true
      }
    })

    selectedPhotos = instance.selectedPhotosIds

    expect(selectedPhotos).toEqual([2, 3, 5])
  })

  it('Selects/deselects photos', () => {
    const instance = wrapper.instance()
    let selectedPhotos = instance.selectedPhotosIds

    expect(selectedPhotos.length).toBe(0)

    instance.handleSelect([1, 3, 5, 6], true)

    selectedPhotos = instance.selectedPhotosIds
    expect(selectedPhotos).toEqual([1, 3, 5, 6])
    expect(wrapper.state('photosSelection')).toEqual(expect.objectContaining({
      1: true,
      3: true,
      5: true,
      6: true
    }))

    instance.handleSelect([1, 3, 5], false)

    selectedPhotos = instance.selectedPhotosIds
    expect(selectedPhotos).toEqual([6])
    expect(wrapper.state('photosSelection')).toEqual(expect.objectContaining({
      1: false,
      3: false,
      5: false,
      6: true
    }))
  })

  it('Select/deselect all photos', () => {
    const instance = wrapper.instance()
    let selectedPhotos = instance.selectedPhotosIds
    jest.spyOn(instance, 'handleSelect')

    expect(selectedPhotos.length).toBe(0)

    instance.handleSelectAll(true)

    const allIds = Array.from({ length: 7 }, (_, i) => i + 1)
    selectedPhotos = instance.selectedPhotosIds
    expect(instance.handleSelect).toHaveBeenCalledTimes(1)
    expect(instance.handleSelect).toHaveBeenLastCalledWith(allIds, true)
    expect(selectedPhotos).toEqual(allIds)

    instance.handleSelectAll(false)

    selectedPhotos = instance.selectedPhotosIds
    expect(instance.handleSelect).toHaveBeenCalledTimes(2)
    expect(instance.handleSelect).toHaveBeenLastCalledWith(allIds, false)
    expect(selectedPhotos).toEqual([])
  })

  it('Updates selected photos', () => {
    const instance = wrapper.instance()
    instance.handleSelect([1, 3], true)
    instance.handleUpdateSelected({
      star: true
    })
    expect(onUpdate).toHaveBeenCalledWith(expect.arrayContaining([1, 3]), expect.objectContaining({ star: true }))

    instance.handleSelect([4, 5, 6], true)
    instance.handleUpdateSelected({
      hidden: false
    })
    expect(onUpdate).toHaveBeenCalledWith(expect.arrayContaining([1, 3, 4, 5, 6]), expect.objectContaining({ hidden: false }))
  })

  it('Deletes selected photos', () => {
    const instance = wrapper.instance()
    instance.handleSelect([1, 3], true)

    instance.handleDeleteSelected()

    expect(onDelete).toHaveBeenLastCalledWith(expect.arrayContaining([1, 3]))

  })

})
