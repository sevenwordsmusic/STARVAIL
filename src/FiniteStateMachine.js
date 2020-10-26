export default class FiniteStateMachine {
  constructor(){}

  //se inicializa la máquina de estados con un num de estados determinados y se establece que pasa cuando se llama turnOff y turnOnn stateOnEnd
  //si se llama en tiempo real (después de crea un enemigo, aliado ... que la use) toda la máquina de estados se reinicia (las funciones anidadas a la FSM se pierden)
  initializeAI(numberStates){
    this.states = [numberStates];
    for(var i=0; i<numberStates; i++){
      this.states[i] = new State(this, i);
      this.states[i].turnOnState = function(){
        this.parent.updateAI = this.update;
        this.onStart.call(this.parent);
      }
      this.states[i].turnOffState = function(){
        this.parent.updateAI = function(){};
        this.onEnd.call(this.parent);
      }
    }
    this.currentState = this.states[0];
  }

  startAI(){
    this.currentState.turnOnState();
  }

  stopAI(){
    this.currentState.turnOffState();
  }

  goTo(num){
    if(this.currentStateId() != num){
      this.states[this.currentStateId()].turnOffState();
      this.currentState = this.states[num];
      this.states[num].turnOnState();
    }
  }

  resetState(){
    this.states[this.currentStateId()].turnOffState();
    this.states[this.currentStateId()].turnOnState();
  }

  numberOfStates(){
    return this.states.length;
  }
  currentState(){
    return this.currentState;
  }
  currentStateId(){
    return this.currentState.id;
  }
  stateUpdate(num, updateFunc){
    this.states[num].update = updateFunc;
  }
  stateOnStart(num, startFunc){
    this.states[num].onStart = startFunc;
  }
  stateOnEnd(num, endFunc){
    this.states[num].onEnd = endFunc;
  }
}
class State{
  constructor(parent, id){
    this.parent = parent
    this.scene = parent.scene;
    this.id = id;
    this.update = function(){};
    this.turnOffState = undefined;
    this.turnOnState = undefined;
    this.onStart = function(){};
    this.onEnd = function(){};
  }
}
