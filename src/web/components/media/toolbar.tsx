// import * as log from '#veewme/web/common/log'
// import HideForRole from '#veewme/web/common/hideForRole'
// import AcceptServices from '#veewme/web/common/orderListItem/acceptServicesModal'
import styled from '#veewme/web/common/styled-components'
import Tooltipped from '#veewme/web/common/tooltipped'
import * as React from 'react'
import DownloadButton from './download'
import SendEmail from './mediaEmailModal'

import { Camera } from 'styled-icons/boxicons-regular'

const ToolbarStyled = styled.div`
  width: 150px;
  height: 70px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-bottom: 3px solid ${props => props.theme.colors.BUTTON_BORDER};

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    border-bottom: 0 none;
  }

  svg {
    fill: ${props => props.theme.colors.GREEN};
    cursor: pointer;
  }
`

const TooltipContent = styled.div`
  padding: 3px;
  font-size: 12px;
  line-height: 15px;
`

const DefaultTabSelect = styled.div`
  margin-left: 5px;

`
interface ToolbarProps {
  address: string
}

const Toolbar: React.FunctionComponent<ToolbarProps> = props => (
  <ToolbarStyled>
    {
      /*
       <HideForRole action='show' roles={['AFFILIATE']}>
          <AcceptServices
            orderedService={props.order.services || []}
            orderId={props.order.id}
          />
        </HideForRole>
       */
    }
    <Tooltipped tooltip={<TooltipContent>Notify Media Added</TooltipContent>}>
      <div>
        <SendEmail />
      </div>
    </Tooltipped>
    <Tooltipped tooltip={<TooltipContent>Media Downloads</TooltipContent>}>
      <div>
        <DownloadButton address={props.address}/>
      </div>
    </Tooltipped>
    <DefaultTabSelect>
      <Tooltipped tooltip={<TooltipContent>Set media to show <br /> in Tour Overview</TooltipContent>}>
         <Camera size='28' />
      </Tooltipped>
    </DefaultTabSelect>
  </ToolbarStyled>
)

export default Toolbar
