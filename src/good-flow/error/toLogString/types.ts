import { CallSite } from 'stack-utils'
import { GFString } from '../../string/types'
import { GFError } from '../types'

export type StackTraceRendererOutput = GFString[]

export type NativeStackTraceRenderer = (stack: string) => StackTraceRendererOutput

export type CustomStackTraceRenderer = (stack: CallSite[]) => StackTraceRendererOutput

export type GFErrorHeaderRenderer = (error: GFError) => GFString | GFString[]

export type NativeErrorHeaderRenderer = (error: Error) => GFString | GFString[]

export type ToLogStringOptions = {
  /**
   * Determines how many lines vertically separate the textual nodes of the error.
   *
   * @default 0 // (No vertical spacing)
   */
  linesBetweenNodes?: number
  /**
   * Controls the rendering of native error stack traces (i.e. from the native Javascript `Error` class).
   *
   * Define as `false` to not show at all.
   *
   * To illustrate where this corresponds to and the default rendering:
   * ```text
   * Error: Could not do task
   * task (path/to/file:1:1))
   * ┣━ Caused by: Could not do subtask
   * ┃  subTask (path/to/file:1:1) <-- This section
   * ...
   * ```
   */
  nativeStackTraceRenderer?: NativeStackTraceRenderer | false
  /**
   * Controls the rendering of GFError stack traces (captured with `stack-util`).
   *
   * Define as `false` to not show at all.
   *
   * To illustrate where this corresponds to and the default rendering:
   * ```text
   * Error: Could not do task
   * task (path/to/file:1:1)) <-- This section
   * ┣━ Caused by: Could not do subtask
   * ┃  subTask (path/to/file:1:1)
   * ...
   * ```
   */
  customStackTraceRenderer?: CustomStackTraceRenderer | false
  /**
   * Controls the rendering of the header of the root error.
   *
   * To illustrate where this corresponds to and the default rendering:
   * ```text
   * Error: Could not do task <-- This section
   * task (path/to/file:1:1))
   * ┣━ Caused by: Could not do subtask
   * ┃  subTask (path/to/file:1:1)
   * ...
   * ```
   */
  rootErrorHeaderRenderer?: GFErrorHeaderRenderer
  /**
   * Controls the rendering of the header of non-root errors.
   *
   * To illustrate where this corresponds to and the default rendering:
   * ```text
   * Error: Could not do task
   * task (path/to/file:1:1))
   * ┣━ Caused by: Could not do subtask <-- This section
   * ┃  subTask (path/to/file:1:1)
   * ...
   * ```
   */
  nonRootGFErrorHeaderRenderer?: GFErrorHeaderRenderer
  /**
   * Controls the rendering of the header of non-root native errors (i.e. the native Javascript `Error` class).
   *
   * To illustrate where this corresponds to and the default rendering:
   * ```text
   * Error: Could not do task
   * task (path/to/file:1:1))
   * ┣━ Caused by: Could not do subtask <-- This section
   * ┃  subTask (path/to/file:1:1)
   * ...
   * ```
   */
  nonRootNativeErrorHeaderRenderer?: NativeErrorHeaderRenderer
}

export type ResolvedToLogStringOptions = Required<ToLogStringOptions>
