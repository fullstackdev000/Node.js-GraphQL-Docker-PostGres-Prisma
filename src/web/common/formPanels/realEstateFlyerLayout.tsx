import { nameof } from '#veewme/lib/util'
import Checkmark from '#veewme/web/assets/svg/checkmark.svg'
import Carousel, { StyledCarouselContent } from '#veewme/web/common/carousel/carousel'
import flyerLayoutIcons from '#veewme/web/common/flyerIcons'
import Checkbox from '#veewme/web/common/formikFields/checkboxField'
import Textarea from '#veewme/web/common/formikFields/textareaField'
import InlineHelp from '#veewme/web/common/inlineHelp'
import Panel, { Heading } from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field, FieldProps } from 'formik'
import * as React from 'react'
import { RealEstateFlyer } from './valuesInterfaces'

const FlyerPanel = styled(Panel)`
  ${Heading} {
    justify-content: flex-start;
    & > *:nth-child(2) {
      margin-left: 10px;
    }
  }
`

const DisclaimerTextarea = styled(Textarea)`
  & label {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    & > * {margin-left: 10px;}
  }
`

const carouselWidthXS = 514
const carouselWidthLG = 726
const carouselWidthXL = 494
const carouselWidthFHD = 834
const carouselArrowWidth = 35
const carouselItemAspectRatio = 1.38

const generateFlyerItemWidth = (carouselWidth: number): number => ((carouselWidth - carouselArrowWidth * 2) / 3) - 4
const generateCarouselHeight = (carouselWidth: number): number => generateFlyerItemWidth(carouselWidth) * carouselItemAspectRatio

const FlyerCarousel = styled(Carousel)`
  margin: 0 auto 10px;
  width: ${carouselWidthXS}px;
  height: ${generateCarouselHeight(carouselWidthXS)}px;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    width: ${carouselWidthLG}px;
    height: ${generateCarouselHeight(carouselWidthLG)}px;
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    width: ${carouselWidthXL}px;
    height: ${generateCarouselHeight(carouselWidthXL)}px;
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_FHD}) {
    width: ${carouselWidthFHD}px;
    height: ${generateCarouselHeight(carouselWidthFHD)}px;
  }
  ${StyledCarouselContent} {
    counter-reset: flyer;
  }
`

const FlyerItem = styled.div`
  padding: 5px;
  position: relative;
  counter-increment: flyer;
  width: ${generateFlyerItemWidth(carouselWidthXS)}px;
  height: ${generateCarouselHeight(carouselWidthXS)}px;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    width: ${generateFlyerItemWidth(carouselWidthLG)}px;
    height: ${generateCarouselHeight(carouselWidthLG)}px;
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    width: ${generateFlyerItemWidth(carouselWidthXL)}px;
    height: ${generateCarouselHeight(carouselWidthXL)}px;
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_FHD}) {
    width: ${generateFlyerItemWidth(carouselWidthFHD)}px;
    height: ${generateCarouselHeight(carouselWidthFHD)}px;
  }
  &:after {
    content: counter(flyer);
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.theme.colors.LABEL_TEXT};
    bottom: 15px;
    right: 15px;
    border-radius: 100%;
    border: 1px solid ${props => props.theme.colors.BORDER};
    width: ${generateFlyerItemWidth(carouselWidthXS) * 0.2}px;
    height: ${generateFlyerItemWidth(carouselWidthXS) * 0.2}px;
    @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
      width: ${generateFlyerItemWidth(carouselWidthLG) * 0.2}px;
      height: ${generateFlyerItemWidth(carouselWidthLG) * 0.2}px;
    }
    @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
      width: ${generateFlyerItemWidth(carouselWidthXL) * 0.2}px;
      height: ${generateFlyerItemWidth(carouselWidthXL) * 0.2}px;
    }
    @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_FHD}) {
      width: ${generateFlyerItemWidth(carouselWidthFHD) * 0.2}px;
      height: ${generateFlyerItemWidth(carouselWidthFHD) * 0.2}px;
    }
  }
`

const InvisibleRadio = styled.input`
  display: none;
`

const FlyerRadioButton = styled.label`
  border: 2px solid ${props => props.theme.colors.BORDER};
  cursor: pointer;
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  ${InvisibleRadio}:checked + & {
    border-color: ${props => props.theme.colors.GREEN};
  }
  & > svg {
    width: 60%;
  }
`

const CheckmarkWrapper = styled.div`
  width: 25%;
  position: absolute;
  border-radius: 100%;
  border: 1px solid ${props => props.theme.colors.BORDER};
  left: 5%;
  top: 5%;
  &:before {
    padding-bottom: 100%;
    display: block;
    content: '';
  }
  & > svg {
    fill: ${props => props.theme.colors.LIGHT_BLUISH_GREY};
    width: 50%;
    position: absolute;
    left: 23%;
    top: 30%;
  }
  ${InvisibleRadio}:checked + ${FlyerRadioButton} & {
    border-color: ${props => props.theme.colors.GREEN};
    background-color: ${props => props.theme.colors.GREEN};
    & > svg { fill: white;}
  }
`

interface FlyerRadioProps {
  flyer: React.SVGFactory
  value: string
}

const FlyerRadio: React.FunctionComponent<FieldProps & FlyerRadioProps> = ({ field, form, ...props }) => {
  return (
    <FlyerItem>
      <InvisibleRadio
        {...field}
        {...props}
        type='radio'
        checked={field.value === props.value}
        id={`${field.name}-${props.value}`}
      />
      <FlyerRadioButton htmlFor={`${field.name}-${props.value}`}>
        <CheckmarkWrapper><Checkmark /></CheckmarkWrapper>
        <props.flyer/>
      </FlyerRadioButton>
    </FlyerItem>
  )
}

interface RealEstateFlyerLayout {
  showDisclaimer?: boolean
}

const RealEstateFlyerLayout: React.FunctionComponent<RealEstateFlyerLayout> = props => {
  return (
    <FlyerPanel
      heading='Property Flyer Layout'
      id='realEstateFlyerLayout'
      toggleable
      headingPlacedComponent={
        <InlineHelp
          text={`Select Flyer layout\nto display on property site / tour`}
        />
      }
    >
      <FlyerCarousel>
        {
          Object.entries(flyerLayoutIcons).map(flyer => {
            const [value, icon] = flyer
            return (
              <Field
                component={FlyerRadio}
                flyer={icon}
                key={value}
                value={value}
                name={nameof<RealEstateFlyer>('flyerLayout')}
              />
            )
          })
        }
      </FlyerCarousel>
      <Field
        component={Checkbox}
        label='Hide flyer from property site / tour'
        name={nameof<RealEstateFlyer>('hideFlyerFromRealEstateSiteTour')}
      />
      <Field
        component={DisclaimerTextarea}
        name={nameof<RealEstateFlyer>('flyerDisclaimer')}
        label={
          <>
            Disclaimer:
            <InlineHelp
              text='If broker requires a disclaimer on flyer enter text here.'
            />
          </>
        }
      />
    </FlyerPanel>
  )
}

export default RealEstateFlyerLayout
