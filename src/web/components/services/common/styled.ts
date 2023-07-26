import * as Grid from '#veewme/web/common/grid'
import styled from '#veewme/web/common/styled-components'

export const StyledFormWrapper = styled.div`
  input {
    max-width: 100%;

    &[type='number'] {
      -moz-appearance:textfield;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
  }
`

export const StyledGridWrapper = styled(Grid.Wrapper) `
  padding:0 0 60px;
  &:before {
    width: 100%;
    left: 0;
  }
`

export const SourceWrapper = styled.div`
  padding-bottom: 20px;
  margin-bottom: 25px;
  border-bottom: 1px solid ${props => props.theme.colors.BORDER};
`

export const InlineFields = styled.div`
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  margin-bottom: 5px;
`

export const DuplicateHolder = styled(InlineFields)`
  display: flex;
  flex: 1 0 auto;
  align-items: flex-end;

  & > div:last-child {
    flex: 1 0 auto;
    position: relative;
    top: 2px;
    min-width: 150px;

    & > div {
      min-width: 150px;
    }
  }
`

export const TextInlineFields = styled(InlineFields)`
  flex-wrap: wrap;

  & > div {
    flex: 0 1 0;
    padding-right: 15px;
    max-width: 40%;

    &:last-child {
      padding-right: 0;
    }
  }

  input {
    max-width: 100%;
  }


  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    & > div {
      flex: 1 1 auto;
      width: 100%;
      max-width: unset;
      padding-right: 0;

      input {
        width: 100%;
      }
    }
  }
`

export const TextInlineFieldsFull = styled(TextInlineFields)`
  & > div {
    flex: 1 1 50%;
    max-width: unset;
  }

  input {
    width: 100%;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    & > div {
      flex: 1 1 auto;
    }
  }
`

export const DurationWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;

  & > div:first-child {
    flex: 0 1 0;
    padding-right: 15px;
    max-width: 40%;
  }
`

export const CounterTextDiv = styled.div<{ alignRight?: boolean}>`
  padding: 5px 0;
  font-size: 13px;
  font-weight: 500;
  text-align: ${props => props.alignRight ? 'right' : 'left'};
`
