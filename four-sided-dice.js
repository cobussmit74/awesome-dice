import PropTypes from "prop-types";
import React, { Component } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

export default class FourSidedDice extends Component {
  static propTypes = {
    spinValue: PropTypes.any,
    generateNewValues: PropTypes.any,
  };

  maxValue = 4;
  spinValue = new Animated.Value(0);
  generateNewValues = null;
  newValueSubscription = null;

  constructor(props) {
    super(props);
    this.spinValue = props.spinValue;
    this.generateNewValues = props.generateNewValues;

    this.state = {
      diceValue: this.randomDiceNumber(this.maxValue),
    };
  }

  componentDidMount() {
    this.newValueSubscription = this.generateNewValues.subscribe({
      next: _ => {
        this.setState({
          diceValue: this.randomDiceNumber(this.maxValue),
        });
      },
    });
  }

  componentWillUnmount() {
    this.newValueSubscription.unsubscribe();
  }

  randomDiceNumber(maxRoll) {
    const min = 1;
    const max = maxRoll;
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
            styles.fourSidedDice,
            {
              transform: [{rotate: rotateDataDice1}, {rotateY: spinDataDice1}],
            },
          ]}>
          <Text style={[styles.diceText, styles.diceTextFourSidedDice]}>
            {this.state.diceValue}
          </Text>
        </Animated.View>
      </View>
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
