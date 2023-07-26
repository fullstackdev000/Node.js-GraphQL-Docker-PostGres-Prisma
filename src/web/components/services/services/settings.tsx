import * as log from '#veewme/web/common/log'

import Button from '#veewme/web/common/buttons/basicButton'
import { ColorFieldRaw, rgbaToString } from '#veewme/web/common/formikFields/colorField'
import Modal from '#veewme/web/common/modal'
import styled, { createGlobalStyle } from '#veewme/web/common/styled-components'
import arrayMove from 'array-move'
import * as React from 'react'
import { RGBColor } from 'react-color'
import Scrollbars from 'react-custom-scrollbars'
import { getServiceCategoryIcon } from '../common/util'
import { ServiceCategory } from '../types'

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'

import { Sort } from 'styled-icons/fa-solid'
import { Settings as SettingsIcon } from 'styled-icons/feather'

// Z-index and important is required becuase of https://github.com/clauderic/react-sortable-hoc/issues/87
const GlobalStyles = createGlobalStyle`
  .sortableHelper {
    z-index: 10000 !important;
  }
`

const SettingsButton = styled.span`
  position: relative;
  top: 5px;
  cursor: pointer;
  color: ${props => props.theme.colors.FIELD_TEXT};
  transition: transform .5s;

  &:hover {
    transform: rotate(90deg);
  }
`

const Hint = styled.p`
  font-size: 15px;
  color: ${props => props.theme.colors.FIELD_TEXT};
`

const StyledItem = styled.div<{
  color: string
  unused: boolean
}>`
  position: relative;
  display: flex;
  align-items: center;
  margin: 12px 0;
  // z-index: 1000 !important;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;

  svg:first-child {
    fill: ${props => props.color};
    width: 22px;
    height: 22px;
    margin-right: 10px;
    ${props => props.unused && 'opacity: 0.5;'}
  }
`

const CategoryLabel = styled.span<{
  unused: boolean
}>`
  ${props => props.unused && 'opacity: 0.5;'}
`

const StyledMoveIcon = styled(Sort)`
  position: absolute;
  padding: 0 5px 5px 5px;
  top: 3px;
  left: -40px;
  color: ${props => props.theme.colors.ICON_UNSELECTED};
  cursor: pointer;
  transition: transform .5s;

  &:hover {
    transform: scale(1.3);
  }
`

const StyledCategories = styled.div`
  margin: 20px 15px 30px 0;
  padding: 0 20px 0 40px;
  border-top: 1px solid ${props => props.theme.colors.BORDER};

  h3 {
    padding-top: 20px;
    padding-bottom: 10px;
    font-size: 14px;
    font-weight: 500;
    color: ${props => props.theme.colors.GREY};
  }
`

const SortHandler = SortableHandle(StyledMoveIcon)

const ModalContent = styled.div`
  width: 400px;
  max-height: 80vh;
`

const SubmitWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
`

const ColorHolder = styled.span`
  display: flex;
  flex: 1 0 auto;
  justify-content: flex-end;

`

const StyledColorPicker = styled(ColorFieldRaw)`
  padding: 0;

  & > div {
    box-shadow: none;
    border: 0 none;
  }

  & > div > div:first-child {
    width: 20px;
    height: 20px;
    border: 0 none;

    &:after {
      border-radius: 100%;
    }
  }
`

interface CategoryItemProps {
  updateColor: (categoryId: number, color: RGBColor) => void
  category: ServiceCategory
  unused: boolean
  color: RGBColor
}

const CategoryItem: React.FC<CategoryItemProps> = props => {
  const Icon = getServiceCategoryIcon(props.category.icon)
  return (
    <StyledItem
      color={rgbaToString(props.color)}
      unused={props.unused}
    >
      <Icon />
      <CategoryLabel
        unused={props.unused}
      >
        {props.category.label}
      </CategoryLabel>
      <ColorHolder>
        <StyledColorPicker
          position='left'
          value={props.color}
          pickerType='github'
          onChange={color => props.updateColor(props.category.id, color.rgb)}
        />
      </ColorHolder>
      <SortHandler size={24} />
    </StyledItem>
  )
}

const SortableCategory = SortableElement(CategoryItem)
type ServiceType = 'primary' | 'addOn'

const Categories: React.FC<{
  categories: ServiceCategory[]
  type: ServiceType
  colors: CatColors
  usedCategories: string[]
  updateColor: (categoryId: number, color: RGBColor) => void
}> = props => {
  return (
    <StyledCategories>
      <h3>{props.type === 'primary' ? 'Primary' : 'Add On'}</h3>
      {
        props.categories.map((c, i) => {
          const used = props.usedCategories.includes(c.label)
          return (
            <SortableCategory
              key={c.id}
              category={c}
              unused={!used}
              index={i}
              updateColor={(id, color) => props.updateColor(id, color)}
              color={props.colors[c.id]}
            />
          )
        })
      }
    </StyledCategories>
  )
}

const SortableCategories = SortableContainer(Categories)

interface ColorUpdate {
  id: number
  color: Required<RGBColor>
}

interface SettingsModal {
  title?: string
  categories: ServiceCategory[]
  onReorder: (type: 'Primary' | 'AddOn', ids: number[]) => Promise<{}>
  refetch: () => Promise<{}>
  addOnOrder: number[]
  primaryOrder: number[]
  updateColors: (data: ColorUpdate[]) => Promise<{}>
  usedCategories: {
    addOn: string[]
    primary: string[]
  }
}

interface CatColors {
  [catId: number]: RGBColor
}

const SettingsModal: React.FunctionComponent<SettingsModal> = props => {
  const [isOpen, toggleModal] = React.useState<boolean>(false)
  const [addOnOrder, setAddOnOrder] = React.useState(props.addOnOrder)
  const [primaryOrder, setPrimaryOrder] = React.useState(props.primaryOrder)

  const initialColors = () => {
    const initColors: CatColors = {}
    return props.categories.reduce((acc, currentVal) => {
      acc[currentVal.id] = currentVal.color
      return acc
    }, initColors)

  }

  const [catColors, setCatColor] = React.useState<CatColors>(initialColors())
  const updateColor = (catId: number, color: RGBColor) => {
    const colors = {
      ...catColors
    }

    colors[catId] = color
    setCatColor(colors)
  }

  React.useEffect(() => {
    setAddOnOrder(props.addOnOrder)
    setPrimaryOrder(props.primaryOrder)
    setCatColor(initialColors)
  }, [isOpen])

  const handleSort = (type: ServiceType, oldIndex: number, newIndex: number) => {
    const data = type === 'primary' ? primaryOrder : addOnOrder
    const setter = type === 'primary' ? setPrimaryOrder : setAddOnOrder
    const newOrder = arrayMove(data, oldIndex, newIndex)
    setter(newOrder)
  }

  const sortedPrimaryCategories = React.useMemo(
    () => {
      return primaryOrder.map(id => props.categories.find(c => c.id === id))
    },
    [primaryOrder, props.categories]
  ).filter(v => v) as ServiceCategory[] // https://www.benmvp.com/blog/filtering-undefined-elements-from-array-typescript/

  const sortedAddOnCategories = React.useMemo(
    () => {
      return addOnOrder.map(id => props.categories.find(c => c.id === id))
    },
    [addOnOrder, props.categories]
  ).filter(v => v) as ServiceCategory[] // https://www.benmvp.com/blog/filtering-undefined-elements-from-array-typescript/

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => {
          toggleModal(prev => !prev)
        }}
        title={props.title}
      >
        <ModalContent>
          <GlobalStyles />
          <Scrollbars
            autoHeight={true}
            autoHeightMax='calc(80vh - 180px)'
          >
            <Hint>Set order of appearance</Hint>
            <SortableCategories
              categories={sortedPrimaryCategories}
              onSortEnd={({ oldIndex, newIndex }) => handleSort('primary', oldIndex, newIndex)}
              type='primary'
              usedCategories={props.usedCategories.primary}
              useDragHandle
              colors={catColors}
              updateColor={(catId, color) => updateColor(catId, color)}
              helperClass='sortableHelper'
            />
            <SortableCategories
              categories={sortedAddOnCategories}
              onSortEnd={({ oldIndex, newIndex }) => handleSort('addOn', oldIndex, newIndex)}
              type='addOn'
              usedCategories={props.usedCategories.addOn}
              useDragHandle
              colors={catColors}
              updateColor={(catId, color) => updateColor(catId, color)}
              helperClass='sortableHelper'
            />
          </Scrollbars>
          <SubmitWrapper>
            <Button
              buttonTheme='action'
              label='Submit'
              full
              onClick={async () => {
                toggleModal(prev => !prev)

                const r1 = props.onReorder('Primary', primaryOrder).catch(() => null)
                const r2 = props.onReorder('AddOn', addOnOrder).catch(() => null)

                const colors = Object.keys(catColors).map(v => {
                  const id = Number(v) // typescript doesn't type `keys` correctly

                  const color = {
                    ...catColors[id],
                    a: catColors[id].a || 1,
                    id: undefined
                  }

                  return {
                    color,
                    id
                  }
                })
                const r3 = props.updateColors(colors)
                const allReuqests = Promise.all([r1, r2, r3])
                await allReuqests
                props.refetch().catch(e => log.debug(e))
              }}
            />
          </SubmitWrapper>
        </ModalContent>
      </Modal>
      <SettingsButton
        onClick={() => toggleModal(true)}
      >
        <SettingsIcon size={22} />
      </SettingsButton>
    </>
  )
}

export default SettingsModal
