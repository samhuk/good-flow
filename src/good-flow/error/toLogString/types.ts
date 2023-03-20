import { CallSite } from 'stack-utils'
import { GFString } from '../../string/types'
import { GFError } from '../types'

export type StackTraceRendererOutput = GFString[]

export type NativeStackTraceRenderer = (stack: string) => StackTraceRendererOutput

export type CustomStackTraceRenderer = (stack: CallSite[]) => StackTraceRendererOutput

export type GFErrorHeaderRenderer = (error: GFError) => GFString | GFString[]

export type NativeErrorHeaderRenderer = (error: Error) => GFString | GFString[]

export type ToLogStringOptions = {
  nativeStackTraceRenderer?: NativeStackTraceRenderer
  customStackTraceRenderer?: CustomStackTraceRenderer
  rootErrorHeaderRenderer?: GFErrorHeaderRenderer
  nonRootGFErrorHeaderRenderer?: GFErrorHeaderRenderer
  nonRootNativeErrorHeaderRenderer?: NativeErrorHeaderRenderer
}

export type ResolvedToLogStringOptions = {
  /**
   * Controls the rendering of native stack traces (i.e. from the native Javascript `Error` class).
   *
   * To illustrate where corresponds to and the default rendering:
   * ```text
   * Error: Could not do task
   * task (path/to/file:1:1))
   * ┣━ Caused by: Could not do subtask
   * ┃  subTask (path/to/file:1:1) <-- This section
   * ...
   * ```
   */
  nativeStackTraceRenderer: NativeStackTraceRenderer
  /**
   * Controls the rendering of custom stack traces (captured with stack-util).
   *
   * To illustrate where corresponds to and the default rendering:
   * ```text
   * Error: Could not do task
   * task (path/to/file:1:1)) <-- This section
   * ┣━ Caused by: Could not do subtask
   * ┃  subTask (path/to/file:1:1)
   * ...
   * ```
   */
  customStackTraceRenderer: CustomStackTraceRenderer
  /**
   * Controls the rendering of the header of the root error.
   *
   * To illustrate where corresponds to and the default rendering:
   * ```text
   * Error: Could not do task <-- This section
   * task (path/to/file:1:1))
   * ┣━ Caused by: Could not do subtask
   * ┃  subTask (path/to/file:1:1)
   * ...
   * ```
   */
  rootErrorHeaderRenderer: GFErrorHeaderRenderer
  /**
   * Controls the rendering of the header of non-root errors.
   *
   * To illustrate where corresponds to and the default rendering:
   * ```text
   * Error: Could not do task
   * task (path/to/file:1:1))
   * ┣━ Caused by: Could not do subtask <-- This section
   * ┃  subTask (path/to/file:1:1)
   * ...
   * ```
   */
  nonRootGFErrorHeaderRenderer: GFErrorHeaderRenderer
  /**
   * Controls the rendering of the header of non-root native errors (i.e. the native Javascript `Error` class).
   *
   * To illustrate where corresponds to and the default rendering:
   * ```text
   * Error: Could not do task
   * task (path/to/file:1:1))
   * ┣━ Caused by: Could not do subtask <-- This section
   * ┃  subTask (path/to/file:1:1)
   * ...
   * ```
   */
  nonRootNativeErrorHeaderRenderer: NativeErrorHeaderRenderer
}
