import PropTypes from "prop-types";
import React, { Component } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { interval } from "rxjs";
import { take } from "rxjs/operators";

export default class SixSidedDice extends Component {
  static propTypes = {
    generateNewValues: PropTypes.any,
  };

  maxValue = 6;
  spinValue = new Animated.Value(0);
  generateNewValues = null;
  newValueSubscription = null;

  constructor(props) {
    super(props);
    this.generateNewValues = props.generateNewValues;

    this.state = {
      diceValue: this.randomDiceNumber(this.maxValue),
    };
  }

  componentDidMount() {
    this.newValueSubscription = this.generateNewValues.subscribe({
      next: _ => {
        const spinRandom = this.randomNumber(2, 10);
        this.spinValue.setValue(0);
        Animated.timing(this.spinValue, {
          toValue: 1,
          duration: spinRandom * 100,
          easing: Easing.linear,
        }).start();

        interval(100)
          .pipe(take(spinRandom))
          .subscribe(_ => {
            this.setState({
              diceValue: this.randomDiceNumber(this.maxValue),
            });
          });
      },
    });
  }

  componentWillUnmount() {
    this.newValueSubscription.unsubscribe();
  }

  randomDiceNumber(maxRoll) {
    return this.randomNumber(1, maxRoll);
  }

  randomNumber(min, max) {
    const random = Math.random() * (+max - +min) + +min;
    return random.toFixed(0);
  }

  render() {
    const rotateDataDice1 = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    const spinDataDice1 = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <View style={styles.diceContainer}>
        <Animated.View
          style={[
            styles.dice,
            styles.sixSidedDice,
            {
              transform: [{rotate: rotateDataDice1}, {rotateY: spinDataDice1}],
            },
          ]}>
          <Text style={[styles.diceText, styles.diceTextSixSidedDice]}>
            {this.state.diceValue}
          </Text>
        </Animated.View>
      </View>
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
  diceText: {
    fontSize: 40,
    color: 'white',
  },
  diceTextSixSidedDice: {},
});
