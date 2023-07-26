import { DeleteServicePackage } from '#veewme/lib/graphql/queries'
import { privateUrls } from '#veewme/lib/urls'
import * as React from 'react'
import { SortableContainer } from 'react-sortable-hoc'
import PackageCard from '../cards/packageCard'
import { Card, PackageCard as PackageCardType } from '../types'
import SortableServiceItem, { ServiceItemActionId } from './serviceItem'
import { StyledListWrapper } from './servicesList'

export interface PackageCardsListProps {
  className?: string
  packageCards: PackageCardType[]
  onActionClick: (card: Card, actionId: ServiceItemActionId) => void
}

const PackageCardsList: React.FunctionComponent<PackageCardsListProps> = props => {
  return (
    <StyledListWrapper className={props.className}>
      {props.packageCards.map((card, index) => (
        <SortableServiceItem
          key={`${card.name}-${card.id}`}
          index={index}
          card={card}
          onActionClick={props.onActionClick}
          deleteMutation={DeleteServicePackage}
          editUrl={`${privateUrls.editPackageCore}/${card.id}`}
        >
          <PackageCard
            card={card}
          />
        </SortableServiceItem>
      ))}
    </StyledListWrapper>
  )
}

const SortablePackageCardsList = SortableContainer(PackageCardsList)

export default SortablePackageCardsList
