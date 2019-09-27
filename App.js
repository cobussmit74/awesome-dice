import React, { Component, Fragment } from "react";
import { Animated, Button, Easing, Picker, StatusBar, StyleSheet, View } from "react-native";
import sensors, { setUpdateIntervalForType } from "react-native-sensors";
import { interval, Subject } from "rxjs";
import { filter, map, take } from "rxjs/operators";

import FourSidedDice from "./four-sided-dice";
import SixSidedDice from "./six-sided-dice";

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
    this.state = {
      sides: DiceSideOptions.fourSides,
      dice: [],
    };

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

  componentDidMount() {
    this.updateDiceSideOption(DiceSideOptions.fourSides);
  }

  spinValue = new Animated.Value(0);
  generateNewValues = new Subject();

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

  updateDiceSideOption = sides => {
    const dice =
      sides === DiceSideOptions.fourSides
        ? [
            <FourSidedDice
              key="1"
              spinValue={this.spinValue}
              generateNewValues={this.generateNewValues}
            />,
            <FourSidedDice
              key="2"
              spinValue={this.spinValue}
              generateNewValues={this.generateNewValues}
            />,
          ]
        : [
            <SixSidedDice
              key="1"
              spinValue={this.spinValue}
              generateNewValues={this.generateNewValues}
            />,
            <SixSidedDice
              key="2"
              spinValue={this.spinValue}
              generateNewValues={this.generateNewValues}
            />,
          ];

    this.setState({
      sides: sides,
      dice: dice,
    });
  };

  render() {
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <View>
          <Button onPress={this.spin} title="SPIN" />
        </View>
        <View>
          <Picker
            selectedValue={this.state.sides}
            onValueChange={this.updateDiceSideOption}>
            <Picker.Item label="Four Sided" value="1" />
            <Picker.Item label="Six Sided" value="2" />
          </Picker>
        </View>
        <View style={styles.diceContainer}>{this.state.dice}</View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  diceContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
