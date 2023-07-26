import {

  ReorderServicePackagesMutationVariables,
  ReorderServicesMutationVariables,
  ServiceCategoryWhereInput,
  ServiceFeeAdjustedByRegionWhereInput,
  ServicesUiStateQuery,
  ServiceType,
  UpdateCatCollapsedMutationVariables,
  UpdateCatColorsMutationVariables,
  UpdateCatOrderMutationVariables,
  UpdatePackageMutation,
  UpdatePackageMutationVariables,
  UpdateServiceMutation,
  UpdateServiceMutationVariables
} from '#veewme/graphql/types'
import { UnreachableCaseError } from '#veewme/lib/error'
import {
  ReorderServicePackages,
  ReorderServices,
  ServiceListData,
  ServicesUIState,
  UpdateCatCollapsed,
  UpdateCatColors,
  UpdateCatOrder,
  UpdatePackage,
  UpdateService
} from '#veewme/lib/graphql/queries/service'
import { convertToServiceTypeCards } from '#veewme/lib/util'
import { rgbaToString } from '#veewme/web/common/formikFields/colorField'
import InnerPanel from '#veewme/web/common/innerPanel/innerPanel'
import * as log from '#veewme/web/common/log'
import Panel from '#veewme/web/common/panel'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import styled from '#veewme/web/common/styled-components'
import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import arrayMove from 'array-move'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import { abstractAdminServiceCategory, getServiceCategoryIcon, getServiceTypeLabel } from '../common/util'
import { Card, PackageCard, ServiceCategory, ServiceListDataQuery, ServiceListElement, ServiceTypeCards } from '../types'
import Filters, { FiltersFormValues } from './filters'
import SortablePackageCardsList from './packagesList'
import { ServiceItemActionId } from './serviceItem'
import SortableServiceCardsList from './servicesList'
import Settings from './settings'

import { privateUrls } from '#veewme/lib/urls'
import PlusIcon from '#veewme/web/assets/svg/plus.svg'
import Button from '#veewme/web/common/buttons/basicButton'

const StyledWrapper = styled.div `
  margin: 20px 0;
  user-select: none;
  & > div {
    margin: 20px 0 10px 0;
  }
`

const StyledInnerPanel = styled(InnerPanel) <{ category: ServiceCategory }> `
  margin: 20px 0 10px 0;
  & header {
      svg {fill: ${props => rgbaToString(props.category.color)}};
  }
`

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  &&& {
    margin: 0;
  }
`

const StyledSortablePackageCardsList = styled(SortablePackageCardsList) `
  margin-top: 16px;
`

const StyledPlus = styled(props => <Button {...props} />)`
  margin-left: 10px;
`

const StyledSectionHeading = styled.div`
  font-size: 17px;

  &&& {
    margin: 30px 0 15px 0;
  }

  padding-top: 25px;
  border-top: 1px solid ${props => props.theme.colors.BORDER};
  font-weight: 500;
  color: ${props => props.theme.colors.LABEL_TEXT_HOVER};
`

const StyledSection = styled.section`
  & > div {
    margin: 20px 0 10px 0;
  }
`

interface ServiceTypePanelProps {
  categories: ServiceCategory[]
  categoriesOrder: string[]
  serviceType: ServiceType
  serviceTypeCards: ServiceTypeCards
  onOrderChange: (categoryId: ServiceCategory['label'], oldIndex: number, newIndex: number) => void
  onActionClick: (card: Card, actionId: ServiceItemActionId, categoryId: ServiceCategory['label']) => void
  headingPlacedComponent?: JSX.Element
  onCategoryCollapse: (type: ServiceType, id: number, collapsed: boolean) => Promise<{}>
  collapsedCategories: number[]
}

const ServiceTypePanel: React.FunctionComponent<ServiceTypePanelProps> = props => {
  const usedCategories = Object.keys(props.serviceTypeCards)
  const sortedUsedCategories = props.categoriesOrder.filter(cat => usedCategories.find(v => v === cat))
  return (
    <Panel
      heading={getServiceTypeLabel(props.serviceType)}
      toggleable
      headingPlacedComponent={props.headingPlacedComponent}
    >
      {sortedUsedCategories.map(catId => {
        const category = props.categories.find(cat => cat.label === catId)
        const initiallyCollapsed = category ? props.collapsedCategories.includes(category.id) : false
        if (category) {
          return (
            <StyledInnerPanel
              key={category.label}
              label={category.label}
              icon={getServiceCategoryIcon(category.icon)}
              category={category}
              toggleable
              collapsed={initiallyCollapsed}
              onToggle={collapsed => props.onCategoryCollapse(props.serviceType, category.id, collapsed)}
            >
              <SortableServiceCardsList
                axis='xy'
                category={category}
                serviceCards={props.serviceTypeCards[catId]}
                onActionClick={(card: Card, actionId: ServiceItemActionId) => props.onActionClick(card, actionId, category.label)}
                useDragHandle
                onSortEnd={({ oldIndex, newIndex }: {oldIndex: number, newIndex: number}) => {
                  props.onOrderChange(catId, oldIndex, newIndex)
                }}
              />
            </StyledInnerPanel>
          )
        } else return null
      })}
    </Panel>
  )
}

interface AdminServicesPanelProps {
  services: ServiceListElement[]
  onOrderChange: (oldIndex: number, newIndex: number) => void
  onActionClick: (card: Card, actionId: ServiceItemActionId, categoryId: ServiceCategory['label']) => void
  headingPlacedComponent?: JSX.Element
}

const AdminServicesPanel: React.FunctionComponent<AdminServicesPanelProps> = props => {
  return (
    <Panel
      heading={getServiceTypeLabel('Admin')}
      toggleable
      headingPlacedComponent={props.headingPlacedComponent}
    >
      <SortableServiceCardsList
        axis='xy'
        category={abstractAdminServiceCategory}
        serviceCards={props.services}
        onActionClick={(card: Card, actionId: ServiceItemActionId) => props.onActionClick(card, actionId, abstractAdminServiceCategory.label)}
        useDragHandle
        onSortEnd={({ oldIndex, newIndex }: {oldIndex: number, newIndex: number}) => {
          props.onOrderChange(oldIndex, newIndex)
        }}
      />
    </Panel>
  )
}

interface UIStateData extends ServicesUiStateQuery {
  serviceCategories: NoNullableArrayItems<ServicesUiStateQuery['serviceCategories']>
  primary: NoNullableArrayItems<NoNullableFields<ServicesUiStateQuery['primary']>>
  addOn: NoNullableArrayItems<NoNullableFields<ServicesUiStateQuery['addOn']>>
}

// TODO: use single generic mutation for updating UI state (panel collapsed, categories orders, colors)
const ServicesContainer: React.FunctionComponent = () => {
  const { addToast } = useToasts()
  const { data, loading, refetch } = useQuery<ServiceListDataQuery>(ServiceListData, {
    notifyOnNetworkStatusChange: true
  })
  const [addOnCards, setAddOnCards] = useState<ServiceTypeCards>({})
  const [adminCards, setAdminCards] = useState<ServiceListElement[]>([])
  const [primaryCards, setPrimaryCards] = useState<ServiceTypeCards>({})
  const [packageCards, setPackageCards] = useState<PackageCard[]>([])
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([])

  const [updateService, { loading: updatingService }] = useMutation<UpdateServiceMutation, UpdateServiceMutationVariables>(
    UpdateService,
    {
      onCompleted: () => {
        addToast(
          `Service was updated successfully`,
          { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 }
        )
      },
      onError: error => {
        addToast(
          `Error ${error.message} while updating the service`,
          { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 }
        )
      }
    }
  )

  const [updatePackage, { loading: updatingPackage }] = useMutation<UpdatePackageMutation, UpdatePackageMutationVariables>(
    UpdatePackage,
    {
      onCompleted: () => {
        addToast(
          `Service package was updated successfully`,
          { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 }
        )
      },
      onError: error => {
        addToast(
          `Error ${error.message} while updating the service package`,
          { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 }
        )
      }
    }
  )

  const { data: uiStateData, loading: loadingUIState, refetch: refetchUIState } = useQuery<UIStateData>(ServicesUIState, {
    notifyOnNetworkStatusChange: true
  })

  const [ reorderServices ] = useMutation<{}, ReorderServicesMutationVariables>(ReorderServices, {
    onError: error => {
      refetch().catch(e => null)
      addToast(error.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 })
    }
  })

  const [ reorderServicePackages ] = useMutation<{}, ReorderServicePackagesMutationVariables>(ReorderServicePackages, {
    onError: error => {
      refetch().catch(e => null)
      addToast(error.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 })
    }
  })

  const [ reorderCategories, { loading: reorderingCategories } ] = useMutation<{}, UpdateCatOrderMutationVariables>(UpdateCatOrder, {
    // awaitRefetchQueries: true,
    // notifyOnNetworkStatusChange: true,
    onError: error => {
      refetch().catch(e => null)
      addToast(error.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 })
    },
    refetchQueries: ['ServicesUIState']
  })

  const [ saveCollapsed ] = useMutation<{}, UpdateCatCollapsedMutationVariables>(UpdateCatCollapsed, {
    onError: error => {
      addToast(error.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 })
    }
  })

  const [ updateColors ] = useMutation<{}, UpdateCatColorsMutationVariables>(UpdateCatColors, {
    onError: error => {
      addToast(error.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 })
    }
  })

  useEffect(() => {
    if (data) {
      setAddOnCards(convertToServiceTypeCards(data.addOnServices))
      setPrimaryCards(convertToServiceTypeCards(data.primaryServices))
      setServiceCategories(data.serviceCategories)
      setPackageCards(data.servicePackages)
      setAdminCards(data.adminServices)
    }
  }, [data])

  useEffect(() => {
    if (!uiStateData) {
      return
    }
    setServiceCategories(uiStateData.serviceCategories)
  }, [uiStateData])

  function handleFiltersChange (values: FiltersFormValues) {
    // regionId and categoryId can't be passed directly, they must be wrapped in object.
    // Otherwise services with no region/category defined would't be returned if regionId/categoryId is undefined (user hasn't selected any region/category in filters)
    // Wrapping regionId/categoryId in object as below allows for "optional filtering"
    let region: ServiceFeeAdjustedByRegionWhereInput | undefined = {}
    let category: ServiceCategoryWhereInput | undefined = {}
    if (values.region) {
      region.regionId = {
        id: values.region
      }
    } else {
      region = undefined
    }

    if (values.category) {
      category = {
        id: values.category
      }
    } else {
      category = undefined
    }

    refetch({
      category,
      region
    }).catch(e => log.debug(e))
  }

  const setCardSuspended = <T extends Card>(cards: T[], cardId: Card['id'], isPackage?: boolean): T[] => {
    const updateIndex = cards.findIndex(c => c.id === cardId)
    const cardNewState = !cards[updateIndex].suspended

    const mutation = isPackage ? updatePackage : updateService
    mutation({
      variables: {
        data: {
          suspended: cardNewState
        },
        where: {
          id: cardId
        }
      }
    })
    return [
      ...cards.slice(0, updateIndex),
      {
        ...cards[updateIndex],
        suspended: cardNewState
      },
      ...cards.slice(updateIndex + 1)
    ]
  }

  const handleAddOnServiceCardAction = (cardId: Card['id'], actionId: ServiceItemActionId, categoryLabel: ServiceCategory['label']) => {
    switch (actionId) {
      case ServiceItemActionId.Suspend:
        setAddOnCards({
          ...addOnCards,
          [categoryLabel]: setCardSuspended(addOnCards[categoryLabel], cardId)
        })
        // TODO send cards to server
        break
      case ServiceItemActionId.Edit:
        break
      default: throw new UnreachableCaseError(actionId)
    }
  }

  const handleAdminCardAction = (cardId: Card['id'], actionId: ServiceItemActionId) => {
    switch (actionId) {
      case ServiceItemActionId.Suspend:
        setAdminCards(adminCards.map(card => {
          if (card.id === cardId) {
            return {
              ...card,
              suspended: !card.suspended
            }
          } else {
            return card
          }
        }))
        break
      case ServiceItemActionId.Edit:
        break
      default: throw new UnreachableCaseError(actionId)
    }
  }

  const handlePrimaryServiceCardAction = (cardId: Card['id'], actionId: ServiceItemActionId, categoryLabel: ServiceCategory['label']) => {
    switch (actionId) {
      case ServiceItemActionId.Suspend:
        setPrimaryCards({
          ...primaryCards,
          [categoryLabel]: setCardSuspended(primaryCards[categoryLabel], cardId)
        })
        // TODO send cards to server
        break
      case ServiceItemActionId.Edit:
        break
      default: throw new UnreachableCaseError(actionId)
    }
  }

  const handlePackageCardAction = (cardId: Card['id'], actionId: ServiceItemActionId) => {
    switch (actionId) {
      case ServiceItemActionId.Suspend:
        setPackageCards(setCardSuspended(packageCards, cardId, true))
        // TODO send cards to server
        break
      case ServiceItemActionId.Edit:
        break
      default: throw new UnreachableCaseError(actionId)
    }
  }

  const sortedCategories = React.useMemo(() => {
    const primaryCategoriesOrderLabels = uiStateData && uiStateData.primary.length > 0 ? uiStateData.primary.map(v => v.category.label) : []
    const addOnCategoriesOrderLabels = uiStateData && uiStateData.addOn.length > 0 ? uiStateData.addOn.map(v => v.category.label) : []

    const primaryCategoriesOrderIds = uiStateData && uiStateData.primary.length > 0 ? uiStateData.primary.map(v => v.category.id) : []
    const addOnCategoriesOrderIds = uiStateData && uiStateData.addOn.length > 0 ? uiStateData.addOn.map(v => v.category.id) : []

    const primaryCollapsedIds = uiStateData ? uiStateData.primary.filter(c => c.collapsed).map(v => v.category.id) : []
    const addOnCollapsedIds = uiStateData ? uiStateData.addOn.filter(c => c.collapsed).map(v => v.category.id) : []

    return {
      addOn: {
        collapsedIds: addOnCollapsedIds,
        ids: addOnCategoriesOrderIds,
        labels: addOnCategoriesOrderLabels,
        usedCategories: Object.keys(addOnCards)
      },
      primary: {
        collapsedIds: primaryCollapsedIds,
        ids: primaryCategoriesOrderIds,
        labels: primaryCategoriesOrderLabels,
        usedCategories: Object.keys(primaryCards)
      }
    }
  }, [uiStateData, primaryCards, addOnCards])

  const usedCategories = {
    addOn: sortedCategories.addOn.usedCategories,
    primary: sortedCategories.primary.usedCategories
  }

  const showSpinner = loading || loadingUIState || reorderingCategories || updatingPackage || updatingService

  return (
    <StyledWrapper>
      <DotSpinnerModal isOpen={showSpinner} />
      <Toolbar>
        <Filters
          onSubmit={handleFiltersChange}
          categories={serviceCategories}
        />
        {serviceCategories.length > 0 && uiStateData && <Settings
          refetch={refetchUIState}
          title='Service card control'
          primaryOrder={sortedCategories.primary.ids}
          addOnOrder={sortedCategories.addOn.ids}
          categories={serviceCategories}
          usedCategories={usedCategories}
          updateColors={colorsData => updateColors({
            variables: {
              data: colorsData
            }
          })}
          onReorder={(type: 'AddOn' | 'Primary', ids: number[]) => reorderCategories({
            variables: {
              ids,
              type
            }
          })}
        />}
      </Toolbar>
      <StyledSection>
        <StyledSectionHeading>
          Packages
          <StyledPlus
            to={privateUrls.addPackage}
            buttonTheme='action'
            full
            icon={PlusIcon}

            size='small'
          />
        </StyledSectionHeading>
        {packageCards &&
          <Panel
            toggleable
          >
            <StyledSortablePackageCardsList
              axis='xy'
              packageCards={packageCards}
              onActionClick={(card: Card, actionId: ServiceItemActionId) => {
                handlePackageCardAction(card.id, actionId)
              }}
              useDragHandle
              onSortEnd={({ oldIndex, newIndex }: {oldIndex: number, newIndex: number}) => {
                const sortedPackages = arrayMove(packageCards, oldIndex, newIndex)

                setPackageCards(sortedPackages)
                reorderServicePackages({
                  variables: {
                    ids: sortedPackages.map(c => c.id)
                  }
                }).catch(() => null)
              }}
            />
          </Panel>
        }
      </StyledSection>
      <StyledSection>
        <StyledSectionHeading>
          Services
          <StyledPlus
            to={privateUrls.addService}
            buttonTheme='action'
            full
            icon={PlusIcon}

            size='small'
          />
        </StyledSectionHeading>
        {primaryCards && serviceCategories.length > 0 && uiStateData &&
          <ServiceTypePanel
            onCategoryCollapse={(type, id, collapsed) => saveCollapsed({
              variables: {
                collapsed,
                id,
                type
              }
            })}
            categories={serviceCategories}
            serviceType={'Primary'}
            categoriesOrder={sortedCategories.primary.labels}
            collapsedCategories={sortedCategories.primary.collapsedIds}
            serviceTypeCards={primaryCards}
            onActionClick={(card: Card, actionId: ServiceItemActionId, category: ServiceCategory['label']) => {
              handlePrimaryServiceCardAction(card.id, actionId, category)
            }}
            onOrderChange={(categoryLabel: ServiceCategory['label'], oldIndex: number, newIndex: number) => {
              const sortedCards = arrayMove(primaryCards[categoryLabel], oldIndex, newIndex)

              setPrimaryCards({
                ...primaryCards,
                [categoryLabel]: sortedCards
              })

              reorderServices({
                variables: {
                  ids: sortedCards.map(c => c.id)
                }
              }).catch(() => null)
            }}
          />
        }
        {addOnCards && serviceCategories.length > 0 && uiStateData &&
          <ServiceTypePanel
            categories={serviceCategories}
            onCategoryCollapse={(type, id, collapsed) => saveCollapsed({
              variables: {
                collapsed,
                id,
                type
              }
            })}
            categoriesOrder={sortedCategories.addOn.labels}
            collapsedCategories={sortedCategories.addOn.collapsedIds}
            serviceType={'AddOn'}
            serviceTypeCards={addOnCards}
            onActionClick={(card: Card, actionId: ServiceItemActionId, category: ServiceCategory['label']) => {
              handleAddOnServiceCardAction(card.id, actionId, category)
            }}
            onOrderChange={(categoryLabel: ServiceCategory['label'], oldIndex: number, newIndex: number) => {
              const sortedCards = arrayMove(addOnCards[categoryLabel], oldIndex, newIndex)

              setAddOnCards({
                ...addOnCards,
                [categoryLabel]: sortedCards
              })

              reorderServices({
                variables: {
                  ids: sortedCards.map(c => c.id)
                }
              }).catch(() => null)
            }}
          />
        }

        {adminCards && adminCards.length > 0 &&
          <AdminServicesPanel
            services={adminCards}
            onActionClick={(card: Card, actionId: ServiceItemActionId, category: ServiceCategory['label']) => {
              handleAdminCardAction(card.id, actionId)
            }}
            onOrderChange={(oldIndex: number, newIndex: number) => {
              const sortedCards = arrayMove(adminCards, oldIndex, newIndex)

              setAdminCards([...sortedCards])

              reorderServices({
                variables: {
                  ids: sortedCards.map(c => c.id)
                }
              }).catch(() => null)
            }}
          />
        }
      </StyledSection>
    </StyledWrapper>
  )
}

export default ServicesContainer
