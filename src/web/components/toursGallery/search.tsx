// import * as log from '#veewme/web/common/log'
import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'

import { Search as SearchIcon } from 'styled-icons/boxicons-regular'

const Container = styled.form`
  margin: 0 auto;
  width: 430px;
  position: absolute;
  bottom: 30%;
  right: 54px;
  z-index: 10;

`

const Label = styled.label`
  font-size: 48px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
`

const InputWrapper = styled.div`
  display: flex;
  height: 40px;
`

const Input = styled.input`
  flex: 1 0 auto;
  padding: 8px 15px;
  font-size: 20px;
  color: #000;
  border: 0 none;
  outline: 0 none;
  background-color: rgba(255, 255, 255, 0.7);

  ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
    color: #fff;
  }
  ::-moz-placeholder { /* Firefox 19+ */
    color: #fff;
  }
  :-ms-input-placeholder { /* IE 10+ */
    color: #fff;
  }
  :-moz-placeholder { /* Firefox 18- */
    color: #fff;
  }
`

const Button = styled.button`
  width: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  cursor: pointer;
  border: 0 none;
  outline: 0 none;
  transition: all .6s;
  opacity: 0.8;;

  &:hover {
    opacity: 1;

    svg {
      transform: scale(1);
    }
  }

  svg {
    transition: all .6s;
    margin-top: 2px;
    fill: #fff;
    transform: scale(0.9);
  }
`

interface SearchProps {
  onSubmit: (val: string) => void
}

const Search: FunctionComponent<SearchProps> = props => {
  const [query, setQuery] = React.useState('')

  return (
    <Container>
      <Label>
        Find your place...
      </Label>
      <InputWrapper>
        <Input
          placeholder='City/Address'
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        />
        <Button
          type='submit'
          onClick={e => {
            e.preventDefault()
            props.onSubmit(query)
          }}
        >
          <SearchIcon size={32} />
        </Button>
      </InputWrapper>
    </Container>
  )
}
export default Search
