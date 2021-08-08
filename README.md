# pipact

Piped react hook component constructor.

## piphook

Piphook is a function that takes any callback (mostly) or some other arguments
and returns piped Component with spreading state to props.

## pipac

Pipac is a passed to piphook function.

## API

### pipactFlowToRender()

Creates piped chained Component.

### .pipeRender(Component)

Takes a dumb react-component and appends it to all previously piped hooks.
Method `pipeRender` destroys all pipact methods.
If no pipeRender pipehook is provided, returns useful component with no DOM-render, but with all of pipact API.
To kill pipact API use `destroyPipact` function.

### .pipeProps(mapper)

Changes props spreading.
Mapper is a function that takes props collection and returns next props collection.

### .pipeState(valueKey, setterKey, getInitialValue)

Takes valueKey string - name of next prop that contains state value;
setterKey string - name of next prop that contains state setter;
getDefaultValue function - function that takes props and returns initialValue.

### .pipeReducer(stateKeyMapper, dispatchKey, reducer, getInitialArg, initializer)

Takes stateKeyMapper function - getter from reducer state names of next props those contain state values;
dispatchKey string - name of next prop that contains state setter;
reducer function - pure function that takes previous state and returns new object of state;
getInitialArg - function that takes props and returns inital state of reducer;
initializer function - function that takes getInitialArg result and computes result only when is needed.

### .pipeContext(contextKey, context)

Takes contextKey string - name of next prop that contains consumered context;
context object - is just result of React.createContext() for context consumering.

### .pipeRef(refKey, getInitialValue)

Takes refKey string - name of next prop that contains ref to pass;
getInitialValue function - getter for initialValue passed to useRef hook.

### .pipeEffect(effect, changer)

Takes effect function - body of useEffect that can takes props as argument;
changer function - takes props and returns array of values for effect memoization.

### .pipeCallback(callbackKey, callbackConstructor, changer)

Takes callbackKey string - name of next prop that contains memoized callback;
callbackConstructor function - body of callback calculation that can takes props as argument and that must returns callback;
changer function - takes props and returns array of values for callback memoization.

### .pipeMemo(memoKey, memoConstructor, changer)

Takes memoKey string - name of next prop that contains memoized value;
memoConstructor function - body of calculation that must be memoized, it can takes props as argument;
changer function - takes props and returns array of values for memo memoization.

### .pipeLayoutEffect(effect, changer)

Takes effect function - body of useLayoutEffect that can takes props as argument;
changer function - takes props and returns array of values for layout effect memoization.

### .pipeImperativeHandle(createHandle, changer)

TODO: correct documentation

### .pipeDebugValue(getDebugValue)

Takes getDebugValue function - getter for result of props computation for debugging pipe chain.

### createPipe()

TODO: create method

### destroyPipact()

TODO: create method

### anyChanger()

Returns undefined. Use it when your pipac do not need to be memoized.

### noChanger()

Returns empty array. Use it when your pipac must be memoized all the time.

### indentChanger()

Returns array of all props. Use it when your pipac do not need to be memoized.

## TODO LIST

* typescript
* optimizations
* branches of pipes
* unit tests
* codestyle
* CI
* more examples
* displayName
