import styled from '#veewme/web/common/styled-components'
import FlyerLayoutIcon, { FlyerLayoutIconProps } from '#veewme/web/components/media/flyer/flyerLayoutIcon'
import * as React from 'react'
import { BottomHolder, DownloadLink, Meta } from '../styled'

import { Download } from 'styled-icons/boxicons-regular'

const Item = styled(FlyerLayoutIcon)`
  padding: 24px 22px;
  height: 100%;
  margin: 0;
  text-align: center;
  height: 185px;
  border-bottom-width: 0;

  & > div {
    width: 38px;
    height: 38px;
    padding: 9px 10px;
    left: 14px;
    top: 10px;

    svg {
      height: auto;
    }
  }
`

const Wrapper = styled.div`
  position: relative;
`

const ItemInfo = styled(BottomHolder)`
  height: 55px;
  border: 1px solid ${props => props.theme.colors.BORDER};
  transition: border-color .5s;
`

const ItemMeta = styled(Meta)`
  margin-top: 0;
  font-weight: 500;
  font-size: 15px;
`

interface FlyerItemProps extends FlyerLayoutIconProps {
  title: string
}

const FlyerItem: React.FunctionComponent<FlyerItemProps> = ({
  layoutName,
  title
}) => {
  return (
    <Wrapper>
      <Item
        key={layoutName}
        layoutName={layoutName}
      />
      <ItemInfo>
        <ItemMeta>
          <DownloadLink href='' title='Download' download>
            {title}
            <Download size='24' />
          </DownloadLink>
        </ItemMeta>
      </ItemInfo>
    </Wrapper>
  )
}

export default FlyerItem
