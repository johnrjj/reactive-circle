import Rx from 'rx';

//functional
function main() {
  return {
    DOM:  Rx.Observable.timer(0, 1000)
        .map(i => `Seconds elapsed ${i}`),
    Log: Rx.Observable.timer(0,2000)
        .map(i => (2*i)),
  };
}

//imperative
function DOMDriver(text) {
  text.subscribe(text => {
    const container = document.querySelector('#root');
    container.textContent = text;
  });
}

//imperative
function consoleLogDriver(text) {
  text.subscribe(text => console.log(text));
}

function run(mainFn, drivers) {
  const sinks = mainFn();
  Object.keys(drivers).forEach(key => {
    drivers[key](sinks[key]);
  });
}

const drivers = {
  DOM: DOMDriver,
  Log: consoleLogDriver,
}

run(main, drivers);
