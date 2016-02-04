import Cycle from '@cycle/core';
import {div, input, label, h2, makeDOMDriver} from '@cycle/dom';

// intent - DOM Read effect: detect slider change
// model - LOGIC: reclaculate BMI
// view - DOM Write Efffect: Display BMI
function intent(DOMSource) {
  const changeWeight$ = DOMSource.select('.weight').events('input')
    .map(ev => ev.target.value);
  const changeHeight$ = DOMSource.select('.height').events('input')
    .map(ev => ev.target.value);
  return { changeWeight$, changeHeight$ };
}

function model(changeWeight$, changeHeight$) {
  return Rx.Observable.combineLatest(
    changeWeight$.startWith(150),
    changeHeight$.startWith(60),
    (weight, height) => {
      const bmi = Math.round((weight * 703) / (height * height));
      return {bmi, weight, height};
    }
  );
}

function view(state$) {
  return state$.map(state =>
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

function main(sources) {
  const {changeWeight$, changeHeight$} = intent(sources.DOM);
  const state$ = model(changeWeight$, changeHeight$);
  const vtree$ = view(state$);
  const sinks = {
    DOM: vtree$
  }
  return sinks;
}

const drivers = {
  DOM: makeDOMDriver('#root'),
}

Cycle.run(main, drivers);
