import Cycle from '@cycle/core';
import {div, input, label, h2, makeDOMDriver} from '@cycle/dom';

// DOM Read effect: detect slider change
// LOGIC: reclaculate BMI
// DOM Write Efffect: Display BMI

function main(sources) {

  const changeWeight$ = sources.DOM.select('.weight').events('input')
    .map(ev => ev.target.value);
  const changeHeight$ = sources.DOM.select('.height').events('input')
    .map(ev => ev.target.value);

  const state$ = Rx.Observable.combineLatest(
    changeWeight$.startWith(150),
    changeHeight$.startWith(60),
    (weight, height) => {
      const bmi = Math.round((weight * 703) / (height * height));
      return {bmi, weight, height};
    }
  );


  const sinks = {
    DOM: state$.map(state =>
      div([
        div([
          label('Weight: ' + state.weight + 'lb'),
          input('.weight', {type: 'range', min: 10, max: 350, value: state.weight})
        ]),
        div([
          label('Height: ' +  state.height + ' in'),
          input('.height', {type: 'range', min: 10, max: 96, value: state.height})
        ]),
        h2('BMI is ' + state.bmi),
      ])
    )
  }
  return sinks;
}

const drivers = {
  DOM: makeDOMDriver('#root'),
}

Cycle.run(main, drivers);
