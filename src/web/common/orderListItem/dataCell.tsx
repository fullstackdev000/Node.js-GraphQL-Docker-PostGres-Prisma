import EditSvg from '#veewme/web/assets/svg/edit.svg'
import ItemDataLine from '#veewme/web/common/orderListItem/itemDataLine'
import styled from '#veewme/web/common/styled-components'
import { OrderQueryData } from '#veewme/web/components/orders/types'
import * as React from 'react'
import IconButton from '../buttons/iconButton'
import { StyledCellEditIconContainer, StyledDataCell, StyledLineDoubleCell } from './styled'

const StyledArea = styled(ItemDataLine)`
  &&& {
    margin-right: 0;
  }
`

interface DataCellProps {
  order: OrderQueryData
}

const DataCell: React.FunctionComponent<DataCellProps> = props => {
  return (
    <StyledDataCell>
      <StyledLineDoubleCell>
        <StyledArea
          title={props.order.realEstate.homeSizeUnit === 'SquareMeters' ? 'Sq. M.: ' : 'Sq.Ft: '}
          value={String(props.order.realEstate.homeSize)}
        />
      </StyledLineDoubleCell>
      {/* TODO use actual value when API includes MLS fields */}
      <ItemDataLine
        title={'MLS: '}
        value={props.order.mlsPrimary ? String(props.order.mlsPrimary) : '-'}
      />
      <ItemDataLine
        title={'Order ID: '}
        value={String(props.order.id)}
      />
      <ItemDataLine
        title={'Order date: '}
        value={props.order.date}
      />
      <StyledCellEditIconContainer>
        <IconButton
          castAs='link'
          size='small'
          Icon={EditSvg}
          to={`orders/order/${props.order.id}/edit`}
        />
      </StyledCellEditIconContainer>
    </StyledDataCell>
  )
}

export default DataCell
