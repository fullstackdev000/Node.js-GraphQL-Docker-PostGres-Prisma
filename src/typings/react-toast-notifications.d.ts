declare module 'react-toast-notifications' {
  import * as React from 'react'

  type Id = string

  interface Options {
    appearance: 'error' | 'info' | 'success' | 'warning'
    autoDismiss?: boolean
    onDismiss?: Callback
    pauseOnHover?: boolean
    autoDismissTimeout?: number
  }

  export type Placement =
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
    | 'top-left'
    | 'top-center'
    | 'top-right'

  export interface ToastProps {
    appearance: AppearanceTypes
    autoDismiss: boolean | number
    autoDismissTimeout: number
    children: React.Node
    isRunning: boolean
    onDismiss: Callback
    pauseOnHover: boolean
    placement: Placement
    transitionDuration: number
  }

  export interface ToastContainerProps {
    children?: React.Node
    hasToasts: boolean
  }

  interface Components {
    Toast: React.ComponentType<ToastProps>
    ToastContainer?: React.ComponentType<ToastContainerProps>
  }

  export interface ToastProviderProps {
    components: Components
    autoDismissTimeout?: number
    placement?: Placement
  }

  type Callback = (id: Id) => void

  export type ToastType = Options & { content: Rect.Node, id: Id }
  export type ToastsType = ToastType[]

  export type AddToast = (content: React.Node, options: Options, callback?: Callback) => void
  export type RemoveToast = (id: Id, callback: Callback) => void

  interface UseToastApi {
    addToast: AddToast
    removeToast: RemoveToast
    toastStack: ToastsType
    removeAllToasts: () => void
  }

  export function useToasts (): UseToastApi

  export interface WithToastManagerApi {
    toastManager: {
      add: AddToast
      remove: RemoveToast
      toasts: ToastsType
    }
  }
  export declare function withToastManager<P> (Comp: React.ComponentType<P & WithToastManagerApi>): React.ComponentType<P>

  export class ToastProvider extends React.Component<ToastProviderProps> {}
  export class DefaultToast extends React.Component<ToastProps> {}
  export class DefaultToastContainer extends React.Component<ToastContainerProps> {}
}
