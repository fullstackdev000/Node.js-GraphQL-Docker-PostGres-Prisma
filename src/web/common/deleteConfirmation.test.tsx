import { shallow, ShallowWrapper } from 'enzyme'
import * as React from 'react'
import DeleteConfirmation, { DeleteConfirmationProps, DeleteConfirmationState, Message } from './deleteConfirmation'

jest.mock('react-modal', () => {
  return {
    __esModule: true,
    default: () => null
  }
})

describe('Delete Confirmation', () => {
  let wrapper: ShallowWrapper<DeleteConfirmationProps, DeleteConfirmationState, DeleteConfirmation>
  const onDelete = jest.fn()
  const message = 'Text ipsum 123'

  beforeEach(() => {
    jest.clearAllMocks()
    wrapper = shallow(
      <DeleteConfirmation
        onConfirm={onDelete}
        message={message}
      >
        {toggleDeleteConfirmation => (<div className='test-div' onClick={() => toggleDeleteConfirmation()} />)}
      </DeleteConfirmation>
    )
  })

  it('Renders correctly', () => {
    expect(wrapper.find('.test-div').length).toBe(1)
  })

  it('Toggle function is called onClick', () => {
    const instance = wrapper.instance()

    spyOn(instance, 'toggleDeleteConfirmation')
    wrapper.setProps({})

    wrapper.find('.test-div').simulate('click')
    expect(instance.toggleDeleteConfirmation).toHaveBeenCalledTimes(1)

    wrapper.find('.test-div').simulate('click')
    expect(instance.toggleDeleteConfirmation).toHaveBeenCalledTimes(2)
  })

  it('Toggle function toggles state', async () => {
    const instance = wrapper.instance()

    expect(wrapper.state('showDeleteConfirmation')).toBe(false)

    instance.toggleDeleteConfirmation()

    expect(wrapper.state('showDeleteConfirmation')).toBe(true)

    instance.toggleDeleteConfirmation()

    expect(wrapper.state('showDeleteConfirmation')).toBe(false)
  })

  it('Calls delete function', async () => {
    const instance = wrapper.instance()
    spyOn(instance, 'toggleDeleteConfirmation')

    instance.handleDelete()

    expect(instance.toggleDeleteConfirmation).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('Modal is shown', async () => {
    const instance = wrapper.instance()

    expect(wrapper.find('Styled(Modal)').prop('isOpen')).toBe(false)

    instance.toggleDeleteConfirmation()

    expect(wrapper.find('Styled(Modal)').prop('isOpen')).toBe(true)
  })

  it('Modal displays correct message', async () => {
    const text = wrapper.find(Message).text()

    expect(text).toBe(message)
  })

})
