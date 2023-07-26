import * as React from 'react'
import { AccountDetailsCaption, AccountDetailsDescription, AccountDetailsDescriptionWrapper } from './styled'

export const AffiliateDetails: React.FunctionComponent = () => {
  return (
    <>
      <AccountDetailsCaption>
        You have an option of two affiliate levels Basic and Pro. Please read carefully the differences.
        You will be able to upgrade but not downgrade so it is imperative that you make the right choice
      </AccountDetailsCaption>
      <AccountDetailsDescriptionWrapper>
        <h6>Basic level</h6>
        <AccountDetailsDescription>Affiliate & Photographer level Job Reports</AccountDetailsDescription>
      </AccountDetailsDescriptionWrapper>
      <AccountDetailsDescriptionWrapper>
        <h6>Pro level</h6>
        <ul>
          <li>Assignable regions across the platform</li>
          <li>Users and user levels</li>
          <li>Granular Broker, office and agent levels</li>
          <li>Promote add-on sales at check-out</li>
          <li>Offer Broker subsidy </li>
          <li>Premium Affiliate Dashboard to track sales</li>
          <li>Track emails and exports</li>
          <li>Photographer Pay</li>
          <li>Custom Reports</li>
        </ul>
      </AccountDetailsDescriptionWrapper>
    </>
  )
}
