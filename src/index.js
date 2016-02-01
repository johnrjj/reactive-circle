// import Rx from 'rx';
import Cycle from '@cycle/core';

// source: input (read) effects
// sink: output (write) effects

function html(tagName, children) {
  return {
    tagName: tagName,
    children: children,
  };
}

function h1(children) {
  return {
    tagName: 'H1',
    children: children,
  };
}

function span(children) {
  return {
    tagName: 'SPAN',
    children: children,
  };
}

function main(sources) {
  const mouseoverStream = sources.DOM.selectEvents('span', 'mouseover');
  const sinks = {
    DOM:  mouseoverStream
        .startWith(null)
        .flatMapLatest(() =>
          Rx.Observable.timer(0, 1000)
            .map(i =>
              h1([
                span([
                  `Seconds elapsed: ${i}`
                ])
              ])
            )
        ),
    Log: Rx.Observable.timer(0,2000)
        .map(i => 2*i),
  };
  return sinks;
}

//imperative
function DOMDriver(objStream) {
  function createElement(obj) {
    const element = document.createElement(obj.tagName);
    obj.children
      .filter(c => typeof c === 'object')
      .map(createElement)
      .forEach(c => element.appendChild(c));
    obj.children
      .filter(c => typeof c === 'string')
      .forEach(c => element.innerHTML += c);
    return element;
  }

  objStream.subscribe(obj => {
    const container = document.querySelector('#root');
    container.innerHTML = '';
    const element = createElement(obj);
    container.appendChild(element);
  });
  // input from DOM (clicks from user)
  const DOMSource = {
    selectEvents: function(tagName, eventType) {
      // returns obsv of events that happen only on elements that match below
      return Rx.Observable.fromEvent(document, eventType)
        .filter(ev => ev.target.tagName === tagName.toUpperCase());
    }
  }
  return DOMSource;
}

//imperative
function consoleLogDriver(text) {
  text.subscribe(text => console.log(text));
}

const drivers = {
  DOM: DOMDriver,
  Log: consoleLogDriver,
}

Cycle.run(main, drivers);

// function run(mainFn, drivers) {
//   const proxySources = {};
//   //create a source for each driver
//   Object.keys(drivers).forEach(key => {
//     proxySources[key] = new Rx.Subject();
//   });
//   const sinks = mainFn(proxySources);
//   Object.keys(drivers).forEach(key => {
//     const source = drivers[key](sinks[key]);
//     source.subscribe(x => proxySources[key].onNext(x)); //feed event
//   });
// }
