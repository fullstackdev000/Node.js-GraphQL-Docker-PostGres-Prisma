import Button from '#veewme/web/common/buttons/basicButton'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { CalendarPhotographer, EventData } from './types'

const Wrapper = styled.div`
  display: flex;
  padding: 0 0 20px 0;
  flex-wrap: wrap;

  p {
    width: 100%;
    padding: 5px 0 10px 0;
    font-size: 14px;
  }

  button {
    margin-right: 10px;
  }
`

const Item = styled.div<{
  active: boolean
  color: string
}>`
  margin: 0 10px 0 0;
  padding: 5px 15px;
  border-radius: 3px;
  height: 30px;
  background-color: ${props => props.active ? props.color : '#fff'};
  border: 2px solid ${props => props.color};
  border-color: ${props => props.active ? props.color : props.theme.colors.BORDER};
  color: ${props => props.active ? '#fff' : props.theme.colors.FIELD_TEXT};
  cursor: pointer;
  font-size: 14px;
  transition: opacity .5s;
  font-weight: 500;

  &:hover {
    opacity: 0.8;
  }
`

interface PhotographersProps {
  photographers: CalendarPhotographer[]
  setPhotographers: (photographers: CalendarPhotographer[]) => void
}

const Photographers: React.FunctionComponent<PhotographersProps> = props => {
  const { photographers, setPhotographers } = props

  const toggle = (id: EventData['photographer']['id']) => {
    const updatedPhotographers = photographers.map(p => {
      if (p.id === id) {
        return {
          ...p,
          checked: !p.checked
        }
      } else {
        return p
      }
    })

    setPhotographers(updatedPhotographers)
  }

  const toggleAll = (selected: boolean) => {
    const updatedPhotographers = photographers.map(p => ({
      ...p,
      checked: selected
    }))

    setPhotographers(updatedPhotographers)
  }
  const allSelected = React.useMemo(() => photographers.every(p => !!p.checked), [photographers])
  const allDeselected = React.useMemo(() => photographers.every(p => !p.checked), [photographers])

  return (
    <Wrapper>
      <Button
        buttonTheme='primary'
        label='Select All'
        onClick={() => toggleAll(true)}
        disabled={allSelected}
      />
      <Button
        buttonTheme='primary'
        label='Deselect All'
        onClick={() => toggleAll(false)}
        disabled={allDeselected}
      />
      {
        photographers.map(p => (
          <Item
            key={p.id}
            onClick={() => toggle(p.id)}
            color={p.color}
            active={!!p.checked}
          >
            {`${p.firstName} ${p.lastName}`}
          </Item>
        ))
      }
    </Wrapper>
  )
}

export default Photographers
