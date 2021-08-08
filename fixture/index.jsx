import React from 'react'
import { render } from 'react-dom'

import { pipactFlowToRender, anyChanger, noChanger, indent } from '../src'

const DumbCounter = (props) => ( 
    <> 
        <h1>count: {props.count}</h1> 
        <button onClick={props.onClickDecrement}>DECREMENT</button> 
        <button onClick={props.onClickIncrement}>INCREMENT</button> 
    </> 
)

function reducer (state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 }
    case 'DECREMENT':
      return { count: state.count - 1 }
    default:
      return state
 }
}

function autoCount (props) { 
    const intervarId = setInterval(() => { 
      props.setCount({ type: 'INCREMENT' }) 
    }, 1000)
    return () => clearInterval(intervarId)
}
const countChanger = (props) => [props.setCount]
const stateToProps = (state) => ({ count: state.count })
const callbackBuilder = (type) => (props) => () => props.setCount({ type })
const getInitialState = (props) => ({ count: props.initialValue })
const omitSetCount = ({ setCount, ...props }) => props

const CounterReducer = pipactFlowToRender()
    .pipeReducer(stateToProps, 'setCount', reducer, getInitialState) 
    .pipeEffect(autoCount, noChanger)
    .pipeCallback('onClickDecrement', callbackBuilder('DECREMENT'), countChanger) 
    .pipeCallback('onClickIncrement', callbackBuilder('INCREMENT'), countChanger)
    .pipeProps(omitSetCount)
    .pipeDebugValue(indent)
    .pipeRender(DumbCounter)

    
const CustomPipeHookCounterReducer = pipactFlowToRender({
    customPipes: {
        MultipleCallbacks: (callbacksMap, changer = anyChanger) => (props) => {
            const nextCallbacks = {}
    
            for (let callbackKey in callbacksMap) {
                nextCallbacks[callbackKey] = React.useCallback(callbacksMap[callbackKey](props), changer(props));
            }
    
            return { ...props, ...nextCallbacks }
        }
    }
})
    .pipeReducer(stateToProps, 'setCount', reducer, getInitialState) 
    .pipeEffect(autoCount, noChanger)
    .pipeMultipleCallbacks({
        onClickDecrement: callbackBuilder('DECREMENT'),
        onClickIncrement: callbackBuilder('INCREMENT')
    }, countChanger)
    .pipeProps(omitSetCount)
    .pipeDebugValue(indent)
    .pipeRender(DumbCounter)

const App = () => (
    <>
        <CounterReducer initialValue={5} />
        <CustomPipeHookCounterReducer initialValue={5} />
    </>
)
render(<App />, document.getElementById('app'))
