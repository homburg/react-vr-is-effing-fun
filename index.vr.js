import React from 'react';
import {AppRegistry, asset, Pano, Text, View} from 'react-vr';
import throttle from 'lodash/fp/throttle';

function dump(x) {
  return JSON.stringify(x, null, 2);
}

function rotator(from, by, to) {
  return function(value) {
    if (arguments.length === 0) {
      return from;
    }

    const newValue = value + by;
    if (newValue > to) {
      return from;
    }
    return newValue;
  };
}

const r = rotator(-3, 0.005, 3);

const textStyle = {
  fontSize: 0.8,
  color: 'black',
  fontWeight: '400',
  textAlign: 'left',
  textAlignVertical: 'center',
};

export default class hello_react_vr extends React.Component {
  state = {
    x: r(),
  };

  componentDidMount() {
    console.log('Did mount');
    setInterval(this.animate, 1000 / 60);
  }

  animate = x => {
    this.setState(oldState => ({...oldState, x: r(oldState.x)}));
  };

  handleTextLayout = ({nativeEvent: {width}}) => {
    this.updateWidth(width);
  };

  updateWidth = throttle(200, width => {
    this.setState(({width: oldWidth, ...oldState}) => {
      oldWidth = oldWidth || 0;
      return {...oldState, width: Math.max(oldWidth, width)};
    });
  });

  render() {
    const {x, width} = this.state;

    const widthStyle = width ? {width} : {};
    return (
      <View>
        <Pano source={asset('chess-world.jpg')} />
        <View
          onLayout={this.handleTextLayout}
          style={{
            backgroundColor: 'lightgray',
            layoutOrigin: [0.5, 0.5],
            padding: 0.3,
            transform: [
              {translate: [x, 0, -6]},
              {rotate: x * 60},
              {rotateX: -1 * x * 600},
              {rotateY: -1 * x * 300},
            ],
            ...widthStyle,
          }}>
          <Text style={textStyle}>
            Hello {x.toFixed(3)} {width && width.toFixed(3)}
          </Text>
        </View>
      </View>
    );
  }
}

AppRegistry.registerComponent('hello_react_vr', () => hello_react_vr);
