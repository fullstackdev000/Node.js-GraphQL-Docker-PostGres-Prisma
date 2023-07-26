import { privateUrls } from '#veewme/lib/urls'
import * as log from '#veewme/web/common/log'
import { ImageWrapper, MailIcon, StyledDropDownButton } from '#veewme/web/common/styled-listItem'
import * as React from 'react'
import Avatar from '../../../assets/svg/male-user.svg'
import { DropDownListGroups } from '../../../common/dropDownList'
import { Employee } from '../types'
import { PersonBox, StyledCell, StyledRow } from './styled'

interface EmployeeItemProps {
  employee: Employee
}

const EmployeeItem: React.FunctionComponent<EmployeeItemProps> = ({ employee }) => {
  const actionOptions: DropDownListGroups = [{
    items: [{
      label: 'Edit',
      linkTo: `${privateUrls.employees}/${employee.id}`
    }, {
      label: 'Delete',
      onClick: () => log.debug(`Delete clicked ${employee.id}`)
    }]
  }]

  return (
    <StyledRow>
      <StyledCell>
        <PersonBox>
          <div>
            <ImageWrapper>
              {employee.photo ? <img src={employee.photo} alt='User thumb image' /> : <Avatar width='40' height='40' />}
            </ImageWrapper>
            <span>{`${employee.firstName} ${employee.lastName}`}</span>
          </div>
          <div>
            <a href={`mailto: ${employee.email}`}><MailIcon /></a>
          </div>
        </PersonBox>
      </StyledCell>
      <StyledCell darker>
        <StyledDropDownButton list={actionOptions} />
      </StyledCell>
    </StyledRow>
  )
}

export default EmployeeItem
