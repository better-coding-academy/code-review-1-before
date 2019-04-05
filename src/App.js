import _ from "lodash";
import React, { Component } from "react";
import ResultsList from "./components/ResultsList/ResultsList";
import Input from "./components/Input/Input";
import Button from "./components/Button/Button";
import "./App.css";

const API_URL = "http://localhost:8010/proxy/suburbs.json?q=";

export default class App extends Component {
  state = {
    apiData: [],
    formError: false,
    showResults: false,
    suburbDetails: null,
    value: ""
  };

  // Fetches the suburbs data from the API_URL delays the fetch by 500ms
  getAPIData = _.throttle(async () => {
    try {
      let response = await fetch(API_URL + `${this.state.value}`);
      let responseJSON = await response.json();

      if (this.state.value === "") {
        this.setState({
          apiData: [],
          showResults: false
        });
      } else {
        this.setState({
          apiData: responseJSON.filter(item =>
            item.name.toLowerCase().startsWith(this.state.value.toLowerCase())
          ),
          formError: false,
          showResults: true
        });
      }

      // console.log(this.state.apiData);
    } catch (error) {
      console.log(error);
    }
  }, 500);

  // alerts the value of the user input/ user selection
  getButtonText = () => {
    if (this.state.value) {
      if (
        this.state.suburbDetails &&
        this.state.value === this.state.suburbDetails.name
      ) {
        alert("Your recent selection is " + this.state.value);
      } else {
        if (this.state.apiData.length) {
          alert("Please select a suburb from results list");
        } else {
          alert(
            "Your input " +
              this.state.value +
              " does not match any search result"
          );
        }
      }

      this.setState({
        formError: false,
        showResults: true
      });
    } else {
      this.setState({
        formError: true,
        showResults: false
      });
    }
  };

  // Runs when the user updates the input field and sets the input value inside `value`
  handleInputChange = val => {
    this.setState(
      {
        value: val
      },
      () => {
        // If the searchbar has value then call getAPIData
        if (this.state.value && this.state.value.length >= 1) {
          this.getAPIData();
        } else {
          // Otherwise if the searchbar is empty, remove the data from ResultsList
          this.setState({
            apiData: [],
            showResults: false
          });
        }
      }
    );
  };

  // Gets the name of suburb based on the button the user clicked
  onSelect = val => {
    this.setState({
      suburbDetails: val,
      value: val.name
    });
  };

  render() {
    return (
      <section>
        <div className="searchBarWrapper" role="search">
          <div className="searchCategory">
            <label htmlFor="suburb">Suburb</label>
          </div>
          <div className="searchBar">
            <Input onChange={this.handleInputChange} value={this.state.value} />
            {this.state.showResults ? (
              <ResultsList
                items={this.state.apiData}
                onSelect={this.onSelect}
              />
            ) : null}

            <Button className="searchButton" onClick={this.getButtonText} />
          </div>
        </div>
        {this.state.formError ? (
          <div className="errorWrapper">
            <p role="alert">Please enter a suburb name</p>
          </div>
        ) : null}
      </section>
    );
  }
}
