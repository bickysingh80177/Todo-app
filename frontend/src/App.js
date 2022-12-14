import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import Plan from "./Plan";

const ai = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

class App extends Component {
  state = {
    items: [],
    text: "",
  };

  submit = (id) => {
    confirmAlert({
      title: "Delele Item?",
      message: "Are you sure to delete.",
      buttons: [
        {
          label: "Yes",
          onClick: () => this.handleDelete(id),
        },
        {
          label: "No",
          onClick: () => this.showPlan(),
        },
      ],
    });
  };

  showPlan = () => {
    ai.get("/list/").then((res) => {
      // console.log(res.data)
      this.setState({ items: res.data });
    });
  };
  addPlan = (d) => {
    if (this.state.text !== "") {
      ai.post("/create/", d).then((res) => {
        this.setState({ text: "" });
        this.showPlan();
      });
    }
  };
  handleChange = (e) => {
    this.setState({ text: e.target.value });
  };
  handleAdd = (e) => {
    let dt = { item: this.state.text };
    this.addPlan(dt);
  };
  handleDelete = (id) => {
    console.log("Deleted", id);
    ai.delete(`/delete/${id}`).then((res) => {
      this.showPlan();
    });
  };

  componentDidMount() {
    this.showPlan();
  }
  render() {
    return (
      <div className="container-fluid my-5">
        <div className="row">
          <div className="col-sm-6 mx-auto text-white shadow-lg p-3">
            <h2 className="text-center"> Today's Plan </h2>
            <div className="container-fluid">
              <div className="row">
                <div className="col-9">
                  <input
                    type="text"
                    className="form-control text-white"
                    placeholder="Write Plan Here"
                    value={this.state.text}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="col-2">
                  <button
                    className="btn btn-warning px-5 font-weight-bold"
                    onClick={this.handleAdd}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="conatiner">
                <ul className="list-unstyled row m-5">
                  {this.state.items.map((value, i) => {
                    // console.log(value.id, value.item)
                    return (
                      <Plan
                        key={i}
                        id={value.id}
                        value={value.item}
                        sendData={this.submit}
                        // sendData={this.handleDelete}
                      />
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
