import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import KEYCODES from './constants/keyCodes';
import {DIRECTION, DIRECTIONAXIS} from './constants/directions';

import PenItem from './components/PenItem';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isPlaced: false,
      x: null,
      y: null,
      f: null,
      command: '',
      info: ''
    };

    this.commands = {
      'left': this.rotateLeft,
      'right': this.rotateRight,
      'move': this.move
    }

    this.moveActions = {
      0: this.incrementalMove('x', this.state.x),
      1: this.incrementalMove('y', this.state.x),
      2: this.decrementalMove('x', this.state.x),
      3: this.decrementalMove('y', this.state.y)
    }
  }

  componentWillMount = () => {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.handleKeyDown.bind(this));
  }

  createPen = () => {
    return (
      [4,3,2,1,0].map((y, yindex)=>{
        return <div key={yindex} className="row">{[0,1,2,3,4].map((x, xindex)=> {
          return <PenItem 
                    className="col"
                    id={`${x}-${y}`} 
                    x={this.state.x} 
                    y={this.state.y} 
                    direction={this.state.f} 
                    key={xindex+yindex}
                    penItemClick={this.onPenItemClick}></PenItem>;
        })}</div>
      })
    )
  }

  handleKeyDown = (event) => {
    event && 
      this.handleArrowKeys(event);
  }

  handleArrowKeys = (event) => {
    this.state.isPlaced && [KEYCODES.LEFT, KEYCODES.RIGHT].includes(event.keyCode) 
      ? this.rotateTurtle(event.keyCode)
      : (event.keyCode === KEYCODES.DOWN)
        ? this.report()
        : (event.keyCode === KEYCODES.UP) 
          && this.move()
  }

  rotateTurtle = (keyCode) => {
    keyCode === KEYCODES.RIGHT 
      ? this.rotateRight()
      : this.rotateLeft()
  }

  rotateRight = () => {
    (this.state.f + 1) > (DIRECTION.length -1)
    ? this.setState({f: 0})
    : this.setState({f: this.state.f + 1})
  }

  rotateLeft = () => {
    (this.state.f - 1) < 0
    ? this.setState({f: DIRECTION.length-1})
    : this.setState({f: this.state.f - 1})
  }

  move = () => {
    const axis = DIRECTIONAXIS[this.state.f];
    [0, 1].includes(this.state.f)
      ? this.incrementalMove(axis, this.state[axis])
      : this.decrementalMove(axis, this.state[axis])
  }

  incrementalMove = (axis, currentValue) => {
    if(this.withinUpperBound(currentValue)) {
      console.log(this.state[axis]);
      this.setState({[axis]: this.state[axis] + 1});
    }
  }

  decrementalMove = (axis, currentValue) => {
    if(this.withinLowerBound(currentValue)) {
      this.setState({[axis]: this.state[axis] - 1});
    }
  }

  withinUpperBound = (currentValue) => {
    return (currentValue + 1) <= 4;
  }

  withinLowerBound = (currentValue) => {
    return (currentValue - 1) >= 0;
  }

  handleCommand = () => {
    this.state.command.toLowerCase().startsWith('place') 
      ? this.placeTurtle(this.state.command)
      : this.commands[this.state.command] && this.commands[this.state.command]();        
  }

  placeTurtle = (command) => {
    const commandSegments = command.split(' ');
    this.isValidPlaceCommand(commandSegments) &&
    this.setState({
      isPlaced: true,
      x: parseInt(commandSegments[1]),
      y: parseInt(commandSegments[2]),
      f: DIRECTION.indexOf(commandSegments[3].toUpperCase())
    })
  }

  isValidPlaceCommand = (commandSegments) => {
    return commandSegments.length === 4 &&
      commandSegments[0].toLowerCase() === 'place' &&
      (parseInt(commandSegments[1]) >=0 && parseInt(commandSegments[1]) <= 4) &&
      (parseInt(commandSegments[2]) >=0 && parseInt(commandSegments[2]) <= 4) &&
      DIRECTION.includes(commandSegments[3].toUpperCase());
  }

  report = () => {
    this.setState({info: `${this.state.x}, ${this.state.y}, ${DIRECTION[this.state.f]}`});
  }

  onPenItemClick = (x, y) => {
    this.setState({isPlaced: true, x, y, f: 0});
  }

  handleChange = (e) => {
    this.setState({command: e.target.value});
  }

  render() {
    return (
      <div className="App" onKeyDown={this.keyDown}>
          <div className="container">
            <p>
              Turtle in the pond
            </p>
            <div className="command-entry">
              <input type="text" className="form-field" placeholder="Enter command" value={this.state.command} onChange={this.handleChange.bind(this)}  />
              <input type="button" className="btn" value="GO" onClick={this.handleCommand.bind(this)} />
            </div>

            <div className="turtle-pen">
              {this.createPen()}        
            </div>

            <div className="info">
              {this.state.info}
            </div>
          </div>
      </div>
    );
  }
}

export default App;
