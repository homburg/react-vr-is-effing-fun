import React from 'react';
import {
  AppRegistry,
  asset,
  Pano,
  Text,
  View,
  Box,
  DirectionalLight,
  Plane,
} from 'react-vr';
import throttle from 'lodash/fp/throttle';
import sample from 'lodash/fp/sample';

const color = {
  red: 'rgb(244, 67, 54)',
  pink: 'rgb(233, 30, 99)',
  purple: 'rgb(156, 39, 176)',
  deepPurple: 'rgb(103, 58, 183)',
  indigo: 'rgb(63, 81, 181)',
  blue: 'rgb(33, 150, 243)',
  lightBlue: 'rgb(3, 169, 244)',
  cyan: 'rgb(0, 188, 212)',
  teal: 'rgb(0, 150, 136)',
  green: 'rgb(76, 175, 80)',
  lightGreen: 'rgb(139, 195, 74)',
  lime: 'rgb(205, 220, 57)',
  yellow: 'rgb(255, 235, 59)',
  amber: 'rgb(255, 193, 7)',
  orange: 'rgb(255, 152, 0)',
  deepOrange: 'rgb(255, 87, 34)',
  brown: 'rgb(121, 85, 72)',
  grey: 'rgb(158, 158, 158)',
  blueGrey: 'rgb(96, 125, 139)',
};

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

const dim = 0.4;
const margin = 0.3;

function B({style, ...props}) {
  const styl = {margin, ...style};
  return (
    <Box
      {...props}
      style={styl}
      dimDepth={dim}
      dimWidth={dim}
      dimHeight={dim}
      lit={true}
    />
  );
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
    // x: r(),
    x: -2,
    dim,
  };

  componentDidMount() {
    console.log('Did mount');
    // setInterval(this.animate, 1000);
  }

  componentDidReceiveProps() {
    console.log('Now?');
    return;
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

  getTransform(x) {
    return [
      {translate: [-1, 1, -3]},
      ...['rotateX', 'rotateY', 'rotateZ'].map(key => ({[key]: 45})),
    ];
    [
      {translate: [x, 0, -6]},
      {rotate: x * 60},
      {rotateX: -1 * x * 600},
      {rotateY: -1 * x * 300},
    ];
  }

  render() {
    const {x, width, dim} = this.state;

    const widthStyle = width ? {width} : {};
    return (
      <View>
        <Pano source={asset('chess-world.jpg')} />
        <DirectionalLight />
        <View
          onLayout={this.handleTextLayout}
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            padding: 0.3,
            transform: this.getTransform(x),
          }}>
          <B />
          <Plane
            style={{
              transform: [{rotateX: 90}],
              height: dim + margin,
            }}
            wireframe={true}>
            {Array.from({length: 2}).map((_, i) =>
              <View key={i} style={{flex: 1, flexDirection: 'row'}}>
                <B />
                <B />
              </View>,
            )}
          </Plane>
          <B />
          {/*
          <B style={{color: color.red}} />
			 <B
            style={{color: sample(color), transform: [{translate: [0, 0, -1]}]}}
          />  */}
        </View>
      </View>
    );
  }
}

AppRegistry.registerComponent('hello_react_vr', () => hello_react_vr);
