import Button from '#veewme/web/common/buttons/basicButton'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { H1, H5, H6, Section } from './styled'
import withImage, { WrappedComponentProps, WrappedComponentPropsWithRef } from './withImage'

interface TourItemProps {
  area: string
  estateType: string
  image: string
  link: string
}

const tourItems: TourItemProps[] = [
  {
    area: 'GROSSE POINTE PARK, MI 48230',
    estateType: 'Residential Home',
    image: '/public/static/img/c49a15d87b38d7c676f858dc7a9f5eb5.jpeg',
    link: '/tour/1/l/l1'
  },
  {
    area: 'CHELSEA, MI 48118',
    estateType: 'Residential Home',
    image: '/public/static/img/6a2025d2b07f3c381173a1b0a33b2b11.jpeg',
    link: '/tour/1/l/l2'
  },
  {
    area: 'ANN ARBOR , MI 48103',
    estateType: 'Residential Home',
    image: '/public/static/img/8da1c283e97501337878184d7bef1b97.jpeg',
    link: 'http://tours.mixedmediaco.com/691/2770-e-delhi-rd-ann-arbor-mi-48103'
  },
  {
    area: 'BERKELEY, CA 94708',
    estateType: 'Residential Home',
    image: '/public/static/img/ba58d76f8d774277519a7d7209a69639.jpg',
    link: 'http://pro.walkintour.com/930/1530-grizzly-peak-blvd-berkeley-ca-94708'
  },
  {
    area: 'ANNAPOLIS, MD 21403',
    estateType: 'Residential Home',
    image: '/public/static/img/556ee58d1577d60d1a6033983822db18.jpg',
    link: ''
  },
  {
    area: 'LITTLETON, CO 80123',
    estateType: 'Residential Home',
    image: '/public/static/img/e6e13749d4dd93bdccc4e44172ab9aa4.jpg',
    link: 'http://vtours.realpatience.com/1189/2700-wild-holly-road-annapolis-md-21403'
  },
  {
    area: 'Howell, MI 48855',
    estateType: 'Residential Home',
    image: '/public/static/img/8f3bf3f60be16f915fe218a832055400.jpeg',
    link: 'http://tours.mixedmediaco.com/1255/8715-hidden-lake-dr-howell-mi-48855'
  },
  {
    area: 'NORTH VENICE, FL 34275',
    estateType: 'Residential Home',
    image: '/public/static/img/080918fc8e98eaa988bb043435d017c0.jpeg',
    link: 'http://tours.srq360marketingwithvision.com/1262/107-valenza-loop-north-venice-fl-34275'
  },
  {
    area: 'HERMOSA BEACH, CA 90254',
    estateType: 'Condo/Town/Co-op',
    image: '/public/static/img/88271a2e29c5e50fd2160f590298b15b.jpg',
    link: 'http://tours.danatphotography.com/1332'
  },
  {
    area: 'Bradenton, FL 34207',
    estateType: 'Residential Home',
    image: '/public/static/img/c0f895faad4436b18f15aa07796fdf0b.jpg',
    link: 'http://tours.srq360marketingwithvision.com/1344/7052-hawks-harbor-circle-bradenton-fl-34207'
  },
  {
    area: 'NORTHVILLE, MI 48168',
    estateType: 'Residential Home',
    image: '/public/static/img/c63344c61cd58819f6906d332cbe2917.jpeg',
    link: 'http://tours.mixedmediaco.com/1380/46879-pickford-st-northville-mi-48168'
  },
  {
    area: 'TORONTO, ON M4R1L2',
    estateType: 'Residential Home',
    image: '/public/static/img/5735317667a58e67e4bd3f6e409a19d8.jpg',
    link: 'http://tours.bizzimage.com/10530'
  },
  {
    area: 'TORONTO, ON M5V 4B2',
    estateType: 'Single Family Home',
    image: '/public/static/img/509d1cd3cf229c52e9177c2e6457fc54.jpeg',
    link: 'http://tours.bizzimage.com/32578/38-dan-leckie-way-toronto-on-m5v-4b2'
  },
  {
    area: 'Milford, ON K0K 2P0',
    estateType: 'Single Family Home',
    image: '/public/static/img/377ac235ce8a398da148b30cd15305e2.jpeg',
    link: 'http://tours.bizzimage.com/55838/4039-4045-county-road-13-milford-on-k0k-2p0'
  }
]

const TourImage = styled.img`
  width: 100%;
  border: white 5px solid;
`

const TourItemLink = styled.a`
  display: block;
  position: relative;
  margin: 30px 0;
  & > ${TourImage} {
    border-radius: 0;
  }
`
const ToursSubSection = styled.div`
  display: grid;
  margin: 30px 0;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    grid-template-columns: repeat(2, 48%);
    grid-column-gap: 4%;
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    grid-template-columns: repeat(4, 22%);
    grid-column-gap: 3%;
  }
`

type TourItems = TourItemProps[] | undefined

const TourItem: React.FunctionComponent<TourItemProps> = props => {
  return (
    <TourItemLink href={props.link} target='_blank'>
      <TourImage src={props.image} />
      <H5>{props.area}</H5>
      <H6>{props.estateType}</H6>
    </TourItemLink>
  )
}

type ExampleTroursProps = WrappedComponentProps & {imageRef: React.Ref<HTMLDivElement>}

interface ExampleToursState {
  renderedTourItems: IteratorResult<TourItems>
}

class ExampleTours extends React.PureComponent<ExampleTroursProps, ExampleToursState> {
  tourItemsIterator: IterableIterator<TourItems>

  constructor (props: ExampleTroursProps) {
    super(props)
    this.tourItemsIterator = this.printTourItems(tourItems)
    this.state = {
      renderedTourItems: this.tourItemsIterator.next()
    }
  }

  printTourItems: (dataToRender: TourItemProps[]) => IterableIterator<TourItems> = function* (dataToRender) {
    const numberOfDataToRender = 8
    let outputData: TourItemProps[] = []
    while (outputData.length < dataToRender.length) {
      const start = outputData.length
      let end = outputData.length + numberOfDataToRender
      end = end <= dataToRender.length ? end : dataToRender.length
      outputData = outputData.concat(dataToRender.slice(start, end))
      if (outputData.length < dataToRender.length) {
        yield outputData
      } else {
        return outputData
      }
    }
  }

  render () {
    return (
      <Section showImage={this.props.showImage} ref={this.props.imageRef} id='example_tours'>
        <H1>Example Tours</H1>
        <ToursSubSection>
          {this.state.renderedTourItems.value && this.state.renderedTourItems.value.map(tourItem => <TourItem {...tourItem} key={tourItem.link} />)}
        </ToursSubSection>
        {!this.state.renderedTourItems.done && <Button
          label='SHOW MORE TOURS'
          buttonTheme='info'
          full
          size='big'
          onClick={() => { this.setState({ renderedTourItems: this.tourItemsIterator.next() }) }}
        />}
      </Section>
    )
  }
}

const ToursWithRef: React.FunctionComponent<WrappedComponentPropsWithRef> = React.forwardRef(
  ({ ref, ...props }, imageRef: React.Ref<HTMLDivElement>) => <ExampleTours {...props} imageRef={imageRef} />
)

export default withImage(ToursWithRef)
