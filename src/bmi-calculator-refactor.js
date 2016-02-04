import Cycle from '@cycle/core';
import {div, input, label, h2, makeDOMDriver} from '@cycle/dom';

function intent(DOMSource) {
  return DOMSource.select('.slider').events('input')
    .map(e => e.target.value);
}

function model(newValue$, props$) {
  const initialValue$ = props$.map(props => props.init).first();
  const value$ = initialValue$.concat(newValue$);
  return Rx.Observable.combineLatest(value$, props$, (value, props) => {
    // return the state object
    return {
      label: props.label,
      unit: props.unit,
      min: props.min,
      max: props.max,
      value: value,
    };
  });
}

function view(state$) {
  return state$.map(state =>
    div('.labeled-slider', [
      label('.label', `${state.label}: ${state.value}${state.unit}`),
      input('.slider', {type: 'range', min: state.min, max: state.max, value: state.value})
    ])
  )
}

function main(sources) {
  const change$ = intent(sources.DOM);
  const state$ = model(change$, sources.props);
  const vtree$ = view(state$);

  return {
    DOM: vtree$,
  };
}

const drivers = {
  DOM: makeDOMDriver('#root'),
  props: () => Rx.Observable.of({
        label: 'Height',
        unit: 'cm',
        min: 140,
        max: 220,
        init: 170,
  })
}

Cycle.run(main, drivers);
