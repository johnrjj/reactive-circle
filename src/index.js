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
function DOMEffect(text) {
  text.subscribe(text => {
    const container = document.querySelector('#root');
    container.textContent = text;
  });
}

//imperative
function ConsoleLogEffect(text) {
  text.subscribe(text => console.log(text));
}

function run(mainFn) {
  const sinks = mainFn();
  ConsoleLogEffect(sinks.Log);
  DOMEffect(sinks.DOM);
}

run(main);
