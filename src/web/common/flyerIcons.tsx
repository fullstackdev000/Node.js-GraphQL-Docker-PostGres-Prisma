import { FlyerLayoutName } from '#veewme/gen/graphqlTypes'
import Featured1 from '../assets/svg/flyerFeatured1.svg'
import Featured1minor5 from '../assets/svg/flyerFeatured1minor5.svg'
import Featured2minor3 from '../assets/svg/flyerFeatured2minor3.svg'
import Featured2minor6 from '../assets/svg/flyerFeatured2minor6.svg'
import Featured2minor6withHorizontalBars from '../assets/svg/flyerFeatured2minor6withHorizontalBars.svg'

export type FlyerLayoutPhotosCount = {[K in FlyerLayoutName]: number}

export const flyerLayoutPhotosCount: FlyerLayoutPhotosCount = {
  FEATURED1: 1,
  FEATURED1MINOR5: 6,
  FEATURED2MINOR3: 5,
  FEATURED2MINOR6: 8,
  FEATURED2MINOR6WITHHORIZONTALBARS: 8
}

export type FlyerLayoutIcons = {[K in FlyerLayoutName]: React.SVGFactory}

const flyerLayoutIcons: FlyerLayoutIcons = {
  FEATURED1: Featured1,
  FEATURED1MINOR5: Featured1minor5,
  FEATURED2MINOR3: Featured2minor3,
  FEATURED2MINOR6: Featured2minor6,
  FEATURED2MINOR6WITHHORIZONTALBARS: Featured2minor6withHorizontalBars
}

export default flyerLayoutIcons
