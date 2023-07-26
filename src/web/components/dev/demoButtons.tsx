import DropDownButton from '#veewme/web/common/buttons/dropDownButton'
import { DropDownListGroups } from '#veewme/web/common/dropDownList'
import * as log from '#veewme/web/common/log'
import Panel from '#veewme/web/common/panel'
import Tooltipped from '#veewme/web/common/tooltipped'
import * as React from 'react'
import Arrow from '../../assets/svg/arrow.svg'
import Button from '../../common/buttons/basicButton'
import styled from '../../common/styled-components'

// Hack to make styled recognize props passed to extended styled-component
const ExtendedButton = styled(props => <Button {...props} />)``

const DemoButtonsWrapper = styled.div`
  padding: 15px 30px;
  & > * {
    margin: 5px;
  }
  & > ${ExtendedButton} {
    display: block;
    margin: 20px auto;
  }
`

const DropDownButtonsWrapper = styled.div `
  display: flex;
  justify-content: flex-start;
  & > * {
    margin-right: 20px;
  }
`

const dropDownOptions: DropDownListGroups = [
  {
    items: [{
      label: 'Option 1',
      onClick: () => log.debug(`Option 1 in group 1 clicked`)
    }, {
      label: 'Option 2',
      onClick: () => log.debug(`Option 2 in group 1 clicked`)
    }, {
      label: 'Option 3',
      onClick: () => log.debug(`Option 3 in group 1 clicked`)
    }]
  }
]

const dropDownOptionsWithGroups: DropDownListGroups = [
  {
    items: [{
      label: 'Option 1',
      onClick: () => log.debug(`Option 1 in group 1 clicked`)
    }, {
      label: 'Option 2',
      onClick: () => log.debug(`Option 2 in group 1 clicked`)
    }, {
      label: 'Option 3',
      onClick: () => log.debug(`Option 3 in group 1 clicked`)
    }]
  }, {
    items: [{
      label: 'Link 1',
      linkTo: '#'
    }, {
      label: 'Link 2',
      linkTo: '#'
    }, {
      label: 'Link 3',
      linkTo: '#'
    }]
  }
]

const dropDownOptionsWithGroupHeaders: DropDownListGroups = [
  {
    header: 'Group 1',
    items: [{
      label: 'Option 1',
      onClick: () => log.debug(`Option 1 in group 1 clicked`)
    }, {
      label: 'Option 2',
      onClick: () => log.debug(`Option 2 in group 1 clicked`)
    }, {
      label: 'Option 3',
      onClick: () => log.debug(`Option 3 in group 1 clicked`)
    }]
  }, {
    header: 'Group 2',
    items: [{
      label: 'Option 2 1',
      onClick: () => log.debug(`Option 1 in group 2 clicked`)
    }, {
      label: 'Option 2 2',
      onClick: () => log.debug(`Option 2 in group 2 clicked`)
    }, {
      label: 'Option 2 3',
      onClick: () => log.debug(`Option 3 in group 2 clicked`)
    }]
  }
]

const TooltipButtonsWrapper = styled.div `
  display: flex;
  justify-content: flex-start;
  & > * {
    margin: 5px;
  }
`

const DemoButtons = () => (
  <DemoButtonsWrapper>
    <ExtendedButton buttonTheme='action' full label='Test Button' />
    <Button inverseTextColor buttonTheme='action' label='Test Button' to='#' />
    <Button inverseTextColor buttonTheme='info' full label='Test Button' />
    <Button buttonTheme='info' to='#' label='Test Button' />
    <Button buttonTheme='alert' full label='Test Button' />
    <Button buttonTheme='alert' to='#' label='Test Button' />
    <Button inverseTextColor full label='Test Button' />
    <Button to='#' label='Test Button' />
    <Button iconLast buttonTheme='action' full icon={Arrow} label='Test Button' />
    <Button iconLast buttonTheme='action' icon={Arrow} label='Test Button' to='#' />
    <Button buttonTheme='info' full icon={Arrow} label='Test Button' />
    <Button buttonTheme='info' icon={Arrow} to='#' label='Test Button' />
    <Button buttonTheme='alert' full icon={Arrow} label='Test Button' />
    <Button buttonTheme='alert' icon={Arrow} to='#' label='Test Button' />
    <Button inverseTextColor full icon={Arrow} label='Test Button' />
    <Button to='#' icon={Arrow} label='Test Button' />
    <Button buttonTheme='action' full icon={Arrow} />
    <Button buttonTheme='action' inverseTextColor icon={Arrow} to='#' />
    <Button buttonTheme='info' full icon={Arrow} />
    <Button buttonTheme='info' inverseTextColor icon={Arrow} to='#' />
    <Button buttonTheme='alert' full icon={Arrow} />
    <Button buttonTheme='alert' inverseTextColor icon={Arrow} to='#' />
    <Button inverseTextColor full icon={Arrow} />
    <Button to='#' inverseTextColor icon={Arrow} />
    <Button buttonTheme='action' full size='big' label='Test Button' />
    <Button buttonTheme='action' size='big' label='Test Button' to='#' />
    <Button buttonTheme='info' full size='big' label='Test Button' />
    <Button buttonTheme='info' size='big' to='#' label='Test Button' />
    <Button buttonTheme='alert' full size='big' label='Test Button' />
    <Button buttonTheme='alert' size='big' to='#' label='Test Button' />
    <Button inverseTextColor full size='big' label='Test Button' />
    <Button to='#' size='big' label='Test Button' />
    <Button buttonTheme='action' full size='big' icon={Arrow} label='Test Button' />
    <Button iconLast buttonTheme='action' size='big' icon={Arrow} label='Test Button' to='#' />
    <Button buttonTheme='info' full size='big' icon={Arrow} label='Test Button' />
    <Button buttonTheme='info' size='big' icon={Arrow} to='#' label='Test Button' />
    <Button buttonTheme='alert' full size='big' icon={Arrow} label='Test Button' />
    <Button buttonTheme='alert' size='big' icon={Arrow} to='#' label='Test Button' />
    <Button inverseTextColor full icon={Arrow} size='big' label='Test Button' />
    <Button to='#' icon={Arrow} size='big' label='Test Button' />
    <Button buttonTheme='action' full icon={Arrow} size='big' />
    <Button buttonTheme='action' icon={Arrow} size='big' to='#' />
    <Button buttonTheme='info' full icon={Arrow} size='big' />
    <Button buttonTheme='info' icon={Arrow} size='big' to='#' />
    <Button buttonTheme='alert' full icon={Arrow} size='big' />
    <Button buttonTheme='alert' icon={Arrow} size='big' to='#' />
    <Button inverseTextColor full icon={Arrow} size='big' />
    <Button to='#' icon={Arrow} size='big' />
    <Button buttonTheme='action' full size='small' label='Test Button' />
    <Button buttonTheme='action' size='small' label='Test Button' to='#' />
    <Button buttonTheme='info' full size='small' label='Test Button' />
    <Button buttonTheme='info' size='small' to='#' label='Test Button' />
    <Button buttonTheme='alert' full size='small' label='Test Button' />
    <Button buttonTheme='alert' size='small' to='#' label='Test Button' />
    <Button inverseTextColor full label='Test Button' size='small' />
    <Button to='#' label='Test Button' size='small' />
    <Button buttonTheme='action' full icon={Arrow} size='small' label='Test Button' />
    <Button iconLast buttonTheme='action' icon={Arrow} size='small' label='Test Button' to='#' />
    <Button buttonTheme='info' full icon={Arrow} size='small' label='Test Button' />
    <Button buttonTheme='info' icon={Arrow} size='small' to='#' label='Test Button' />
    <Button buttonTheme='alert' full icon={Arrow} size='small' label='Test Button' />
    <Button buttonTheme='alert' icon={Arrow} size='small' to='#' label='Test Button' />
    <Button inverseTextColor full icon={Arrow} size='small' label='Test Button' />
    <Button to='#' icon={Arrow} size='small' label='Test Button' />
    <Button buttonTheme='action' full icon={Arrow} size='small' />
    <Button buttonTheme='action' icon={Arrow} size='small' to='#' />
    <Button buttonTheme='info' full icon={Arrow} size='small' />
    <Button buttonTheme='info' icon={Arrow} size='small' to='#' />
    <Button buttonTheme='alert' full icon={Arrow} size='small' />
    <Button buttonTheme='alert' icon={Arrow} size='small' to='#' />
    <Button inverseTextColor full icon={Arrow} size='small' />
    <Button to='#' icon={Arrow} size='small' />
    <Panel heading='Dropdown button'>
      <DropDownButtonsWrapper>
        <DropDownButton list={dropDownOptions} label={'Dropdown'}/>
        <DropDownButton list={dropDownOptionsWithGroups} label={'Dropdown with groups'}/>
        <DropDownButton list={dropDownOptionsWithGroupHeaders} label={'Dropdown with group headers'}/>
      </DropDownButtonsWrapper>
    </Panel>
    <Panel heading='Tooltip'>
      <TooltipButtonsWrapper>
        <Tooltipped tooltip='test tip'>
          <div>
            <Button buttonTheme='action' label='Tiptool Button' size='small' />
          </div>
        </Tooltipped>
        <Tooltipped tooltip={<span>Lorem Ipsum jest tekstem stosowanym jako przykładowy wypełniacz w przemyśle poligraficznym.<br/>Został po raz pierwszy użyty w XV w. przez nieznanego drukarza do wypełnienia tekstem próbnej książki.<br/>Pięć wieków później zaczął być używany przemyśle elektronicznym, pozostając praktycznie niezmienionym.<br/>Spopularyzował się w latach 60. XX w. wraz z publikacją arkuszy Letrasetu, zawierających fragmenty Lorem Ipsum,<br/>a ostatnio z zawierającym różne wersje Lorem Ipsum oprogramowaniem przeznaczonym do realizacji druków na komputerach osobistych,<br/>jak Aldus PageMaker</span>}>
          <div>
            <Button buttonTheme='action' label='Long tiptool Button' size='small' />
          </div>
        </Tooltipped>
      </TooltipButtonsWrapper>
    </Panel>
  </DemoButtonsWrapper>
)

export default DemoButtons
