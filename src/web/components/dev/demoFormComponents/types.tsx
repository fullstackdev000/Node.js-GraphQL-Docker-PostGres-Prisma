import { DateRange } from '#veewme/lib/types'
import { EditorState } from 'draft-js'
import { RGBColor } from 'react-color'

export interface DemoFormValues {
  audio?: string
  color1?: RGBColor
  color2?: RGBColor
  userName: string
  region?: string
  role: string
  size: string
  subscribe: boolean
  type: string
  type2?: string
  note?: string
  done: boolean
  wysiwyg: EditorState
  wysiwyg2?: EditorState
  slider?: number
  rangeSlider?: number[]
  dateRange?: DateRange
  date?: Date
  withSearch?: string
}

export interface GridPanelProps {
  dirty: boolean
}
