// import * as log from '#veewme/web/common/log'
import Pagination from '#veewme/web/common/footer/pagination'
import Modal from '#veewme/web/common/modal'
import { DotSpinner } from '#veewme/web/common/spinners/dotSpinner'
import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import List, { PhotoPlaceholder } from './estatesList'
import Search from './search'
import Sidebar, { SidebarWrapper } from './sidebar'
import { Gallery } from './types'

import { Menu as MenuIcn } from 'styled-icons/boxicons-regular'

const Container = styled.div`
  margin: 0 auto;
  max-width: 1480px;
`

const Main = styled(Container)`
  display: flex;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    flex-wrap: wrap;

    & > ${SidebarWrapper} {
      display: none;
    }
  }

`

const Wrapper = styled(Container)`

`

const Content = styled.section`
  flex: 1 0 auto;
  padding: 30px 30px;
  order: 1;
  position: relative;
`

const Banner = styled.div<{
  showGradient?: boolean
}>`
  position: relative;
  height: 30vh;
  min-height: 220px;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    ${props => {
      const color = `#fff`
      return ` background: linear-gradient(0, ${color} 0%, rgba(255,255,255,0) 7%);`
    }}

    ${props => !props.showGradient && `display: none;`}
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const Footer = styled.footer`
  ${Container} {
    padding: 0 20px;
  }
`

const FooterTop = styled.div`
  padding: 15px 20px;
  background: ${props => props.theme.colors.DARKER_GREY};

  img {
    max-height: 80px;
  }
`

const FooterBottom = styled.div`
  padding: 25px 20px;
  background: #000;
  color: ${props => props.theme.colors.BACKGROUND};
  font-size: 13px;
   p {
     opacity: 0.6;
   }
`

const Title = styled.h1`
  display: inline-block;;
  font-size: 21px;
  font-weight: 500;
  color: ${props => props.theme.colors.DARKER_GREY};
  padding-bottom: 10px;
  margin-bottom: 20px;
  border-bottom: 5px solid ${props => props.theme.colors.BLUE};
`

const HamburgerBtn = styled.span`
  display: block;
  position: fixed;
  top: 20px;
  right: 20px;
  cursor: pointer;
  z-index: 10;
  padding: 2px;
  background: #fff;
  border-radius: 3px;

  span {
    display: block;
    position: relative;
    top: -5px;
    color: #fff;
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    text-align: center;
    line-height: 10px;
  }

  svg {
    fill:  ${props => props.theme.colors.DARK_GREY};
  }

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    display: none;
  }
`

export const Spinner = styled(DotSpinner)<{
  isProcessComplete: boolean
}>`
  ${props => !props.isProcessComplete && `
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.8);
  `}
`

const StyledPagination = styled(Pagination)`
  margin-top: 30px;

  .page-item {
    border: 1px solid  ${props => props.theme.colors.BORDER};
    border-right: 0 none;
    border-radius: 0;
    margin: 0;

    &.active {
      background: ${props => props.theme.colors.DARKER_GREY};
      color: #fff;
    }
  }

  .prev,
  .next {
    margin: 0;
    border: 1px solid  ${props => props.theme.colors.BORDER};
    color: ${props => props.theme.colors.DARKER_GREY};
  }

  .prev {
    border-radius: 5px 0 0 5px;
    border-radius-right: 0 none;
  }

  .next {
    border-radius: 0 5px 5px 0;
  }
`

const BannerPlaceholder = styled(PhotoPlaceholder)`
  position: absolute;
  top: 0;
  left:0;
  height: 100%;
  width: 100%;
  background: ${props => props.theme.colors.GREY};
  font-size: 30px;
`

interface LayoutProps {
  data: Gallery
  onSearch: (searchQuery: string) => void
  refetching?: boolean
  onPageChange?: (p: number) => void
  pageCount: number
  showSearchBar?: boolean
}

const Layout: FunctionComponent<LayoutProps> = props => {
  const [mobileMenuVisible, toggleMobileMenu] = React.useState(false)
  const [searchKey, setKey] = React.useState('')
  const { data: { bannerUrl }, showSearchBar = true } = props
  return (
    <Wrapper>
      <HamburgerBtn
       onClick={() => toggleMobileMenu(true)}
      >
        <MenuIcn width='36' height='36' />
      </HamburgerBtn>
      <Banner showGradient={!!bannerUrl}>
        {bannerUrl ? <img src={bannerUrl} /> : <BannerPlaceholder />}
        {showSearchBar && (
          <Search
            onSubmit={value => {
              setKey(value)
              props.onSearch(value)
            }}
          />
        )}
      </Banner>
      <Main>
        <Sidebar data={props.data.contact} />
        <Content>
          <Title>
            Tour Showcase
          </Title>
          <List data={props.data.tours} />
          <StyledPagination
            key={searchKey}
            pageCount={props.pageCount}
            onChange={p => {
              if (props.onPageChange) {
                props.onPageChange(p)
              }
            }}
          />
          <Spinner isProcessComplete={!props.refetching} />
        </Content>
      </Main>
      <Footer>
        <FooterTop>
          <Container>
            {props.data.contact.logo && <img src={props.data.contact.logo} />}
          </Container>
        </FooterTop>
        <FooterBottom>
          <Container>
            <p>
            Copyright &copy; 2021 |
            All tour media are copyright of their respective owners.
            </p>
          </Container>
        </FooterBottom>
      </Footer>
      <Modal
        background='LIGHT'
        fullSide
        isOpen={mobileMenuVisible}
        onRequestClose={() => toggleMobileMenu(false)}
      >
        <Scrollbars autoHeight={true} autoHeightMax='calc(100vh - 70px)'>
          <Sidebar data={props.data.contact} mobileView />
        </Scrollbars>
      </Modal>
    </Wrapper>
  )
}
export default Layout
