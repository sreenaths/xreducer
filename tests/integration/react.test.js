import React from 'react';
import { mount } from 'enzyme';
import App from './app';

describe('Integration tests on React', () => {
  let wrapper;

  function clickIncButton() {
    wrapper.find('button').at(0).simulate('click');
  }

  function clickDecButton() {
    wrapper.find('button').at(1).simulate('click');
  }

  beforeEach(() => {
    wrapper = mount(<App />);
  });

  test('Test for initial state', () => {
    expect(wrapper.find("p").text()).toEqual("1");
  });

  test('Test increment & decrement actions', () => {
    expect(wrapper.find("p").text()).toEqual("1");
    clickIncButton();
    expect(wrapper.find("p").text()).toEqual("2");
    clickIncButton();
    expect(wrapper.find("p").text()).toEqual("3");
    clickIncButton();
    expect(wrapper.find("p").text()).toEqual("4");

    clickDecButton();
    expect(wrapper.find("p").text()).toEqual("3");
  });

  test('Test stored state', () => {
    expect(wrapper.find("p").text()).toEqual("3");
  });

});