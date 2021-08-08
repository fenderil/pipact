import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useContext,
  useDebugValue,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
  forwardRef,
} from 'react';

export const anyChanger = () => undefined;
export const noChanger = () => [];
export const indentChanger = (props) => [...props];

export const noop = () => undefined;
export const indent = (props) => props;

// TODO: forwardRef, memo, lazy pipact
// pipeMemoState...
// pipeForwardRefState...

const pipactApi = Symbol()

export function destroyPipact(pipact) {
    for (let key in pipact[pipactApi]) {
        delete pipact[key]
    }
    delete pipact[pipactApi]
}

// TODO: defaultPipes
const defaultPipes = {
    // State:  ...
}

export function pipactFlowToRender({ customPipes } = {}) {
  const renders = [];
  const api = {
      [pipactApi]: api
  };

  const bind = (NextComponent) => {
    renders.push(NextComponent);

    for (let key in api) {
      NextComponent[key] = api[key]
    }

    return NextComponent;
  };
  
  function renderNextWithProps(index, props) {
    return React.createElement(renders[index + 1], props);
  }

  const createPipe = (key, pipe) => function (...args) {
    const index = renders.length;
    const CustomPiped = (props) => renderNextWithProps(index, pipe(...args)(props));
    CustomPiped.displayName = 'Piped' + key

    return bind(CustomPiped);
  }

  if (customPipes) {
      for (let key in customPipes) {
        const pipeHookName = 'pipe' + key
        api[pipeHookName] = createPipe(key, customPipes[key])
      }
  }

  // TODO: rewrite to custom hooks api
  api.pipeState = function (valueKey, setterKey, getInitialValue = noop) {
    const index = renders.length;
    const PipedState = (props) => {
      const [value, setter] = useState(getInitialValue(props));

      return renderNextWithProps(index, { ...props, [valueKey]: value, [setterKey]: setter });
    };

    return bind(PipedState);
  }

  api.pipeReducer = function (
    stateKeyMapper = () => ({}),
    dispatchKey,
    reducer,
    getInitialArg = noop,
    initializer,
  ) {
    const index = renders.length;
    const PipedReducer = (props) => {
      const [state, dispatch] = useReducer(reducer, getInitialArg(props), initializer);

      return renderNextWithProps(
        index,
        {
          ...props,
          ...stateKeyMapper(state),
          [dispatchKey]: dispatch,
        },
      );
    };

    return bind(PipedReducer);
  }

    api.pipeContext = function (contextKey, context) {
      const index = renders.length;
      const PipedContext = (props) => {
        const contextProps = useContext(context);

        return renderNextWithProps(index, { ...props, [contextKey]: contextProps });
      };

      return bind(PipedContext);
    }
    api.pipeDebugValue = function (getDebugValue = noop) {
      const index = renders.length;
      const PipedDebugValue = (props) => {
        useDebugValue(getDebugValue(props));

        return renderNextWithProps(index, { ...props });
      };

      return bind(PipedDebugValue);
    }
    api.pipeRef = function (refKey, getInitialValue = noop) {
      const index = renders.length;
      const PipedRef = (props) => {
        const ref = useRef(getInitialValue(props));

        return renderNextWithProps(index, { ...props, [refKey]: ref });
      };

      return bind(PipedRef);
    }
    api.pipeImperativeHandle = function (createHandle, changer = anyChanger) {
      const index = renders.length;
      const PipedImperativeHandle = forwardRef((props, ref) => {
        const currentRef = useRef();
        useImperativeHandle(ref, createHandle, changer(props, ref));

        return renderNextWithProps(index, { ...props, ref: currentRef });
      });

      return bind(PipedImperativeHandle);
    }
    api.pipeMemo = function (memoKey, memoConstructor, changer = anyChanger) {
      const index = renders.length;
      const PipedMemo = (props) => {
        const nextValue = useMemo(memoConstructor(props), changer(props));

        return renderNextWithProps(index, { ...props, [memoKey]: nextValue });
      };

      return bind(PipedMemo);
    }
    api.pipeCallback = function (callbackKey, callbackConstructor, changer = anyChanger) {
      const index = renders.length;
      const PipedCallback = (props) => {
        const nextCallback = useCallback(callbackConstructor(props), changer(props));

        return renderNextWithProps(index, { ...props, [callbackKey]: nextCallback });
      };

      return bind(PipedCallback);
    }
    api.pipeEffect = function (effect, changer = anyChanger) {
      const index = renders.length;
      const PipedEffect = (props) => {
        useEffect(() => effect(props), changer(props));

        return renderNextWithProps(index, props);
      };

      return bind(PipedEffect);
    }
    api.pipeLayoutEffect = function (effect, changer = anyChanger) {
      const index = renders.length;
      const PipedLayoutEffect = (props) => {
        useLayoutEffect(() => effect(props), changer(props));

        return renderNextWithProps(index, props);
      };

      return bind(PipedLayoutEffect);
    }
    api.pipeProps = function (mapper = indent) {
      const index = renders.length;
      const PipedProps = (props) => renderNextWithProps(index, mapper(props));

      return bind(PipedProps);
    }
    api.pipeRender = function (PipedRender) {
      renders.push(PipedRender);

      const NextPipedRender = (props) => renderNextWithProps(-1, props);

      return NextPipedRender;
    }

  return api;
}
