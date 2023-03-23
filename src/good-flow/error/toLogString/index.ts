import colors from 'colors/safe'
import StackUtils from 'stack-utils'
import { isGFError, isStackTraceNative } from '..'
import { toLogString as termTreeNodeToLogString } from '../../../term-tree-formatter'
import { Node, NodeContent } from '../../../term-tree-formatter/types'
import { ensureArray } from '../../common'
import { normalizeGFString } from '../../string'
import { GFError, GFErrorInner, GFErrorOrError, StackTrace } from '../types'
import { adviceToNodes } from './advice'
import {
  CustomStackTraceRenderer,
  GFErrorHeaderRenderer,
  NativeErrorHeaderRenderer,
  NativeStackTraceRenderer,
  ResolvedToLogStringOptions,
  StackTraceRendererOutput,
  ToLogStringOptions,
} from './types'

const DEFAULT_NATIVE_STACK_TRACE_RENDERER: NativeStackTraceRenderer = stack => {
  const st = new StackUtils({ cwd: process.cwd(), internals: StackUtils.nodeInternals() })
  return st.clean(stack).trimEnd().split('\n')
}

export const DEFAULT_CUSTOM_STACK_TRACE_RENDERER: CustomStackTraceRenderer = stack => (
  stack.map(cs => `${cs.getFunctionName() ?? '<anonymous>'} (${cs.getFileName().replace(/\\/g, '/')}:${cs.getLineNumber()}:${cs.getColumnNumber()})`)
)

const DEFAULT_ROOT_ERROR_HEADER_RENDERER: GFErrorHeaderRenderer = error => (
  `${colors.bold(colors.red('Error:'))} ${normalizeGFString(error.msg)}`
)

const DEFAULT_NON_ROOT_GF_ERROR_HEADER_RENDERER: GFErrorHeaderRenderer = error => (
  `${colors.bold(colors.bold('Caused by:'))} ${normalizeGFString(error.msg)}`
)

const DEFAULT_NON_ROOT_NATIVE_ERROR_HEADER_RENDERER: NativeErrorHeaderRenderer = error => (
  `${colors.bold('Caused by:')} [${colors.red(error.name)}] ${error.message}`
)

const normalizeStackTraceRendererOutput = (output: StackTraceRendererOutput): string[] => output.map(item => (
  normalizeGFString(item)
))

const singleErrorInnerToNode = (
  error: GFErrorOrError,
  options: ResolvedToLogStringOptions,
): Node => (isGFError(error)
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  ? errorToNode(error, false, options)
  : {
    content: ensureArray(options.nonRootNativeErrorHeaderRenderer(error)).map(gfString => normalizeGFString(gfString))
      .concat(normalizeStackTraceRendererOutput(options.nativeStackTraceRenderer(error.stack))),
  })

const errorInnerToNodes = (inner: GFErrorInner, options: ResolvedToLogStringOptions): Node[] => (
  ensureArray(inner).map(singleInner => singleErrorInnerToNode(singleInner, options))
)

const stackTraceToNodeContent = (
  stackTrace: StackTrace,
  options: ResolvedToLogStringOptions,
): NodeContent => (
  normalizeStackTraceRendererOutput(
    isStackTraceNative(stackTrace)
      ? options.nativeStackTraceRenderer(stackTrace)
      : options.customStackTraceRenderer(stackTrace),
  )
)

const errorToNode = (
  error: GFError,
  isRoot: boolean,
  options: ResolvedToLogStringOptions,
): Node => {
  /* Use renderer corresponding to whether error is root or not,
   * then normalize the resulting GFString | GFString[] to GFString[],
   * then normalize the GFString[] to string[].
   */
  const headerContent = ensureArray(
    (isRoot ? options.rootErrorHeaderRenderer : options.nonRootGFErrorHeaderRenderer)(error),
  ).map(gfString => normalizeGFString(gfString))
  const stackTraceContent = error.stack != null ? stackTraceToNodeContent(error.stack, options) : []
  const innerErrorNodes = error.inner != null ? errorInnerToNodes(error.inner, options) : []
  const adviceNodes = error.advice != null ? adviceToNodes(error.advice) : []
  return {
    content: headerContent.concat(stackTraceContent),
    children: innerErrorNodes.concat(adviceNodes),
  }
}

/**
 * Resolves the given options, providing default values for nullish properties.
 */
const resolveOptions = (options: ToLogStringOptions | undefined | null): ResolvedToLogStringOptions => ({
  linesBetweenNodes: options?.linesBetweenNodes ?? 0,
  customStackTraceRenderer: options?.customStackTraceRenderer ?? DEFAULT_CUSTOM_STACK_TRACE_RENDERER,
  nativeStackTraceRenderer: options?.nativeStackTraceRenderer ?? DEFAULT_NATIVE_STACK_TRACE_RENDERER,
  nonRootGFErrorHeaderRenderer: options?.nonRootGFErrorHeaderRenderer ?? DEFAULT_NON_ROOT_GF_ERROR_HEADER_RENDERER,
  rootErrorHeaderRenderer: options?.rootErrorHeaderRenderer ?? DEFAULT_ROOT_ERROR_HEADER_RENDERER,
  nonRootNativeErrorHeaderRenderer: options?.nonRootNativeErrorHeaderRenderer ?? DEFAULT_NON_ROOT_NATIVE_ERROR_HEADER_RENDERER,
})

export const toLogString = (error: GFError, options?: ToLogStringOptions): string => {
  const resovledOptions = resolveOptions(options)
  // Resolve options -> convert error to node -> convert node to log stirng
  return termTreeNodeToLogString(errorToNode(error, true, resovledOptions), { linesBetweenNodes: resovledOptions.linesBetweenNodes })
}
