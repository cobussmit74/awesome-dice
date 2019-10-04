import React, { Component, Fragment } from "react";
import { Button, Picker, StatusBar, StyleSheet, View } from "react-native";
import sensors, { setUpdateIntervalForType } from "react-native-sensors";
import { Subject } from "rxjs";
import { filter, map } from "rxjs/operators";

import FourSidedDice from "./four-sided-dice";
import SixSidedDice from "./six-sided-dice";

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
export const DiceShapes = {
  fourSides: '1',
  sixSides: '2',
};
export const DiceCount = {
  one: '1',
  two: '2',
  four: '4',
};

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      sides: DiceShapes.fourSides,
      count: DiceCount.two,
      dice: [],
    };

    setUpdateIntervalForType('accelerometer', 100);
    sensors.accelerometer
      .pipe(
        map(({x, y, z}) => x + y + z),
        filter(speed => speed > 50),
      )
      .subscribe(s => {
        this.spin();
      });
  }

  componentDidMount() {
    this.updateDiceShape(DiceShapes.fourSides);
  }

  generateNewValues = new Subject();

  spin = () => {
    this.generateNewValues.next();
  };

  updateDiceShape = sides => {
    this.setState({
      sides: sides,
    });

    this.updateDice(sides, this.state.count);
  };

  updateDiceCount = count => {
    this.setState({
      count: count,
    });

    this.updateDice(this.state.sides, count);
  };

  updateDice = (sides, count) => {
    const dice = [];

    for (let x = 1; x <= count; x++) {
      if (sides === DiceShapes.fourSides) {
        const newDice = (
          <FourSidedDice key={x} generateNewValues={this.generateNewValues} />
        );
        dice.push(newDice);
      } else if (sides === DiceShapes.sixSides) {
        const newDice = (
          <SixSidedDice key={x} generateNewValues={this.generateNewValues} />
        );
        dice.push(newDice);
      }
    }

    this.setState({
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
            onValueChange={this.updateDiceShape}>
            <Picker.Item label="Four Sided" value={DiceShapes.fourSides} />
            <Picker.Item label="Six Sided" value={DiceShapes.sixSides} />
          </Picker>
          <Picker
            selectedValue={this.state.count}
            onValueChange={this.updateDiceCount}>
            <Picker.Item label="One" value={DiceCount.one} />
            <Picker.Item label="Two" value={DiceCount.two} />
            <Picker.Item label="Four" value={DiceCount.four} />
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
