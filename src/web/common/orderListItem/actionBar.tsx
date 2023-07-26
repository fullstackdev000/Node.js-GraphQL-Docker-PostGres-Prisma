import { Role } from '#veewme/graphql/types'
import Button from '#veewme/web/common/buttons/basicButton'
import DropDownButton from '#veewme/web/common/buttons/dropDownButton'
import IconButton from '#veewme/web/common/buttons/iconButton'
import HideForRole from '#veewme/web/common/hideForRole'
import Tooltipped from '#veewme/web/common/tooltipped'
import { OrderAction } from '#veewme/web/components/orders/orders/useActionsList'
import { OrderQueryData } from '#veewme/web/components/orders/types'
import * as React from 'react'
import { StyledIcon } from 'styled-icons/types'
import AcceptServices from './acceptServicesModal'
import FinalizePaymentBtn from './finalizeSplitPaymentBtn'
import { StyledActionBar, StyledActionBarButtonsContainer, StyledTooltipContent } from './styled'

const delayShow = 1500

export type Action = ActionLink | ActionClick

interface ActionLink {
  label: string
  linkTo: string
  openInNewWindow?: boolean
  tooltip?: string
  onClick?: never
}

interface ActionClick {
  label: string
  tooltip?: string
  linkTo?: never
  onClick: () => void
}

export interface TooltippedIconButton {
  icon: React.SVGFactory | StyledIcon
  linkTo?: string
  onClick?: () => void
  tooltip: string
  hideForRoles?: Role[]
  openInNewWindow?: boolean
}

interface ActionBarProps {
  order: OrderQueryData
  buttonActions: Action[]
  dropDownButtonLabel: string
  dropDownActions: OrderAction[]
  tooltippedIconButtons: TooltippedIconButton[]
  onPaidClick?: () => void
}

const ActionBar: React.FunctionComponent<ActionBarProps> = props => {

  return (
    <StyledActionBar>
      <StyledActionBarButtonsContainer>
        <HideForRole action='show' roles={['AFFILIATE']}>
          <AcceptServices
            orderedService={props.order.services || []}
            orderId={props.order.id}
          />
        </HideForRole>
        {props.buttonActions.map((action, idx) => {
          if (action.linkTo) {
            if (!action.openInNewWindow) {
              return (
                <Tooltipped
                  key={idx}
                  tooltip={action.tooltip}
                >
                  <div>
                    <Button
                      label={action.label}
                      to={action.linkTo}
                    />
                  </div>
                </Tooltipped>
              )
            } else {
              return (
                <Tooltipped
                  key={idx}
                  tooltip={action.tooltip}
                >
                  <div>
                    <Button
                      label={action.label}
                      href={action.linkTo}
                      target={action.openInNewWindow ? '_blank' : '_self'}
                    />
                  </div>
                </Tooltipped>
              )
            }
          } else if (action.onClick) {
            return (
              <Button
                key={idx}
                label={action.label}
                onClick={() => action.onClick()}
              />
            )
          } else {
            return null
          }
        })}
        <HideForRole roles={['PHOTOGRAPHER', 'PROCESSOR']}>
          <DropDownButton
            label={props.dropDownButtonLabel}
            list={[
              {
                items: props.dropDownActions.map(action => {
                  if (action.to) {
                    return ({
                      label: action.label,
                      linkTo: action.to
                    })
                  } else {
                    return ({
                      label: action.label,
                      onClick: action.onClick
                    })
                  }
                }),
                itemSize: 's'
              }
            ]}
          />
        </HideForRole>
        {
          props.onPaidClick && (
            <HideForRole action='show' roles={['AFFILIATE']}>
              <Button
                label='Mark as Paid'
                onClick={props.onPaidClick}
              />
            </HideForRole>
          )
        }

        <HideForRole action='show' roles={['AGENT']}>
          <FinalizePaymentBtn
            order={props.order}
          />
        </HideForRole>
      </StyledActionBarButtonsContainer>
      <StyledActionBarButtonsContainer>
        {props.tooltippedIconButtons.map((button, idx) => {
          if (button.linkTo && !button.openInNewWindow) {
            const hideForRoles = button.hideForRoles || []
            return (
              <HideForRole key={idx} action='hide' roles={hideForRoles}>
                <Tooltipped
                  tooltip={<StyledTooltipContent>{button.tooltip}</StyledTooltipContent>}
                  delayShow={delayShow}
                >
                  <IconButton
                    castAs='link'
                    size='big'
                    Icon={button.icon}
                    to={button.linkTo}
                  />
                </Tooltipped>
              </HideForRole>
            )
          } else if (button.linkTo && button.openInNewWindow) {
            const hideForRoles = button.hideForRoles || []
            return (
              <HideForRole key={idx} action='hide' roles={hideForRoles}>
                <Tooltipped
                  tooltip={<StyledTooltipContent>{button.tooltip}</StyledTooltipContent>}
                  delayShow={delayShow}
                >
                  <IconButton
                    castAs='a'
                    size='big'
                    Icon={button.icon}
                    href={button.linkTo}
                    target='_blank'
                  />
                </Tooltipped>
              </HideForRole>
            )
          } else if (button.onClick) {
            const hideForRoles = button.hideForRoles || []
            return (
              <HideForRole key={idx} action='hide' roles={hideForRoles}>
                <Tooltipped
                  key={idx}
                  tooltip={<StyledTooltipContent>{button.tooltip}</StyledTooltipContent>}
                  delayShow={delayShow}
                >
                  <IconButton
                    castAs='button'
                    type='button'
                    size='big'
                    Icon={button.icon}
                    onClick={button.onClick}
                  />
                </Tooltipped>
              </HideForRole>
            )
          } else {
            return null
          }
        })}
        </StyledActionBarButtonsContainer>
    </StyledActionBar>
  )
}

export default ActionBar
