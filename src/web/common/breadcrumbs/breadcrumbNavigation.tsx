import * as R from 'ramda'
import * as React from 'react'
import { MemoryRouter, Route, RouteComponentProps, RouteProps, Switch, withRouter } from 'react-router-dom'
import BreadcrumbList from './breadcrumbList'

type Step = {
  label: string
  onClick?: () => void
} & Pick<RouteProps, 'children' | 'component' | 'render'>

type Footer = {
  onNextClick?: () => void
  onPrevClick?: () => void
} & Pick<RouteProps, 'children' | 'component' | 'render'>

interface ContextType {
  steps: Step[]
  footers?: Footer[]
}

const Context = React.createContext<ContextType>({
  footers: [],
  steps: []
})

const Consumer = Context.Consumer

interface ProviderProps {
  steps: Step[]
  footers?: Footer[]
}

const Provider: React.FunctionComponent<ProviderProps> = props => {
  const ctx = {
    footers: props.footers,
    steps: props.steps
  }
  return (
    <Context.Provider value={ctx}>
      <MemoryRouter initialEntries={[{ pathname: '0' }]}>
        <>
          {props.children}
        </>
      </MemoryRouter>
    </Context.Provider>
  )
}

const SelectedStep: React.FunctionComponent<RouteComponentProps> = props => (
  <Consumer>
    {({ steps }) => (
      <Switch>
        {steps.map((step, idx) => (
          <Route
            history={props.history}
            key={idx}
            path={idx.toString()}
            {...R.pick<Step, keyof Step>(['children', 'component', 'render'], step)}
          />
        ))}
      </Switch>
    )}
  </Consumer>
)

const SelectedFooter: React.FunctionComponent<RouteComponentProps> = props => (
  <Consumer>
    {({ footers }) => (
      <Switch>
        {footers && footers.map((footer, idx) => (
          <Route
            history={props.history}
            key={idx}
            path={idx.toString()}
            {...R.pick<Footer, keyof Footer>(['children', 'component', 'render'], footer)}
          />
        ))}
      </Switch>
    )}
  </Consumer>
)

const Breadcrumbs: React.FunctionComponent<RouteComponentProps> = props => (
  <Consumer>
    {({ steps }) => (
      <BreadcrumbList
        breadcrumbs={steps.map((step, idx) => ({
          active: props.history.location.pathname === idx.toString(),
          completed: parseInt(props.history.location.pathname, 10) > idx, // TODO figure out how to check if form completed
          label: step.label,
          onClick: () => {
            if (step.onClick) {
              step.onClick()
            }
            props.history.replace(idx.toString())
          }
        }))}
      />
    )}
  </Consumer>
)

export const BreadcrumbNavigation = {
  Breadcrumbs: withRouter(Breadcrumbs),
  Consumer,
  Provider,
  SelectedFooter: withRouter(SelectedFooter),
  SelectedStep: withRouter(SelectedStep)
}
