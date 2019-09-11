import React, { Component, Fragment } from "react";
import { Animated, Button, Easing, StatusBar, StyleSheet, View } from "react-native";
import sensors, { setUpdateIntervalForType } from "react-native-sensors";
import { interval, Subject } from "rxjs";
import { filter, map, take } from "rxjs/operators";

import FourSidedDice from "./four-sided-dice";

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
export const DiceSideOptions = {
  fourSides: '1',
  sixSides: '2',
};

export default class App extends Component {
  constructor() {
    super();
    /*const sides = DiceSideOptions.fourSides;
    var info = this.getSidesInfo(sides);
    this.state = {
      dice1: this.randomDiceNumber(info.maxRoll),
      dice2: this.randomDiceNumber(info.maxRoll),
      sides: sides,
    };*/

    setUpdateIntervalForType('accelerometer', 100);
    sensors.accelerometer
      .pipe(
        map(({x, y, z}) => x + y + z),
        filter(speed => speed > 15),
      )
      .subscribe(s => {
        this.spin();
      });
  }

  spinValue = new Animated.Value(0);
  generateNewValues = new Subject();

  /*updateDiceSideOption = sides => {
    var info = this.getSidesInfo(sides);
    this.setState({
      sides: sides,
      dice1: this.randomDiceNumber(info.maxRoll),
      dice2: this.randomDiceNumber(info.maxRoll),
    });
  };*/

  spin = () => {
    this.spinValue.setValue(0);
    Animated.timing(this.spinValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
    }).start();

    interval(100)
      .pipe(take(5))
      .subscribe(_ => {
        this.generateNewValues.next();
      });
  };

  /*getSidesInfo(sides) {
    let style = styles.fourSidedDice;
    let textStyle = styles.diceTextFourSidedDice;
    let maxRoll = 4;
    if (sides === DiceSideOptions.sixSides) {
      style = styles.sixSidedDice;
      textStyle = styles.diceTextSixSidedDice;
      maxRoll = 6;
    }
    return {
      style: style,
      textStyle: textStyle,
      maxRoll: maxRoll,
    };
  }

  randomDiceNumber(maxRoll) {
    const min = 1;
    const max = maxRoll;
    const random = Math.random() * (+max - +min) + +min;
    return random.toFixed(0);
  }*/

  render() {
    /*const rotateDataDice1 = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    const spinDataDice1 = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    const rotateDataDice2 = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['360deg', '0deg'],
    });
    const spinDataDice2 = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['360deg', '0deg'],
    });*/
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <View>
          <Button onPress={this.spin} title="SPIN" />
        </View>
        <View>
          {/* <Picker
            selectedValue={this.state.sides}
            onValueChange={this.updateDiceSideOption}>
            <Picker.Item label="Four Sided" value="1" />
            <Picker.Item label="Six Sided" value="2" />
          </Picker> */}
          {/* <Text style={styles.text}>{this.state.user}</Text> */}
        </View>
        <View style={styles.diceContainer}>
          <FourSidedDice
            spinValue={this.spinValue}
            generateNewValues={this.generateNewValues}
          />
          <FourSidedDice
            spinValue={this.spinValue}
            generateNewValues={this.generateNewValues}
          />
          <FourSidedDice
            spinValue={this.spinValue}
            generateNewValues={this.generateNewValues}
          />

          {/* <Animated.View
            style={[
              styles.dice,
              this.getSidesInfo(this.state.sides).style,
              {
                transform: [
                  {rotate: rotateDataDice1},
                  {rotateY: spinDataDice1},
                ],
              },
            ]}>
            <Text
              style={[
                styles.diceText,
                this.getSidesInfo(this.state.sides).textStyle,
              ]}>
              {this.state.dice1}
            </Text>
          </Animated.View> */}
          {/* <Animated.View
            style={[
              styles.dice,
              styles.sixSidedDice,
              {
                backgroundColor: 'coral',
                transform: [
                  {rotate: rotateDataDice2},
                  {rotateY: spinDataDice2},
                ],
              },
            ]}>
            <Text style={[styles.diceText, styles.diceTextSixSidedDice]}>
              {this.state.dice2}
            </Text>
          </Animated.View> */}
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 500,
  },
  diceContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dice: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  sixSidedDice: {
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: 'darkblue',
    backgroundColor: 'skyblue',
  },
  fourSidedDice: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 100,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'red',
    backgroundColor: 'white',
  },
  diceText: {
    fontSize: 40,
    color: 'white',
  },
  diceTextSixSidedDice: {},
  diceTextFourSidedDice: {
    top: 35,
    position: 'absolute',
  },
});
