import React, { useState } from "react";
import "./App.css";
import {
  Card,
  CardBody,
  CardImg,
  CardTitle,
  CardSubtitle,
  Button,
  CardText,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";
import data from "./db.json";
import _ from "lodash";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const App = () => {
  const [cartItems, setCartItem] = useState([]);
  const [modal, setModal] = useState(false);
  const [transactionModal, setTransactionModal] = useState(false);
  const [date, setSelectedDate] = useState();
  const [transactions, setTransactions] = useState([]);
  const toggle = () => setModal(!modal);
  const transactionToggle = () => setTransactionModal(!transactionModal);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let totalPrice = 0;
  let totalReward = 0;

  const getRewardPoints = (price) => {
    let over50 = 0;
    let over100 = 0;
    if (price > 100) {
      over50 = 50;
      over100 = price - 100;
    } else if (price > 50 && price < 100) {
      over50 = price - 50;
      over100 = 0;
    }
    return over50 * 1 + over100 * 2;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="row d-flex justify-content-center">
      <div>
        <nav class="navbar navbar-light bg-light mb-5  p-5 pt-2 pb-2 d-flex justify-content-between ">
          <span class="navbar-brand mb-0 h1">Phani-Store</span>
          <div>
            <span onClick={toggle} className="cartIcon">
              <img
                style={{ maxWidth: "3em" }}
                src="https://img.favpng.com/12/18/15/shopping-cart-icon-png-favpng-e5DiMUYLNYaTjdsibphFUCAxC.jpg"
              />
              {cartItems.length > 0 && (
                <Badge color="danger" pill>
                  {cartItems.reduce((a, b) => a + (b["quantity"] || 0), 0)}
                </Badge>
              )}
            </span>
            {transactions.length > 0 && (
              <span onClick={transactionToggle} className="cartIcon">
                <img
                  style={{ maxWidth: "2em" }}
                  src="https://www.pngjoy.com/pngm/208/4074155_report-icon-report-icon-vector-png-png-download.png"
                />
                {transactions.length > 0 && (
                  <Badge color="danger" pill>
                    {transactions.length}
                  </Badge>
                )}
              </span>
            )}
          </div>
        </nav>
      </div>

      {data.products.map((item) => (
        <div className="col-md-3 m-2" key={item.id}>
          <Card>
            <div className=" d-flex justify-content-center">
              <CardImg
                className="img-container"
                top
                src={item.image}
                alt="Card image cap"
              />
            </div>
            <CardBody>
              <CardTitle tag="h5">{item.title}</CardTitle>
              <CardText style={{ "min-height": "6rem" }}>
                {item.description}
              </CardText>
              <CardSubtitle
                tag="h3"
                className="mb-2 text-danger font-weight-bold"
              >
                ${item.price}
              </CardSubtitle>
              <Button
                className="w-100"
                onClick={() => {
                  let cart = _.cloneDeep(cartItems);
                  let newItem = _.cloneDeep(item);
                  if (cart.find((cartItem) => cartItem.id === newItem.id)) {
                    cart.forEach((cItem) => {
                      if (cItem.id === newItem.id) {
                        cItem.quantity = cItem.quantity + 1;
                      }
                    });
                  } else {
                    newItem.quantity = 1;
                    cart.push(newItem);
                  }
                  setCartItem([...cart]);
                }}
              >
                Add to Cart
              </Button>
            </CardBody>
          </Card>
        </div>
      ))}
      {modal && (
        <Modal isOpen={modal} toggle={toggle} centered size="lg">
          <ModalBody>
            <div className="d-flex justify-content-between border-botton-1">
              <h5>Cart View</h5>
              <div className="pr-2">
                <span> Transaction Date: </span>
                <DatePicker selected={date} onChange={handleDateChange} />
              </div>
            </div>
            {cartItems.length > 0 ? (
              <Table striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Reward point</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => {
                    const itemPrice = item.price * item.quantity;
                    const itemRewardPoint = getRewardPoints(itemPrice);
                    totalPrice = totalPrice + itemPrice;
                    totalReward = totalReward + itemRewardPoint;
                    return (
                      <tr>
                        <th scope="row">{index+1}</th>
                        <td>{item.description}</td>
                        <td>{item.quantity}</td>
                        <td>{itemPrice}</td>
                        <td>{itemRewardPoint}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            ) : (
              <span className="d-flex justify-content-center">
                Your cart is empty
              </span>
            )}
          </ModalBody>
          {cartItems.length > 0 && (
            <ModalFooter>
              <Table striped>
                <tbody>
                  <tr>
                    <th scope="row"></th>
                    <td style={{ width: "31em" }}>Total</td>
                    <td style={{ width: "5em" }}>
                      {" "}
                      {cartItems.reduce((a, b) => a + (b["quantity"] || 0), 0)}
                    </td>
                    <td>{totalPrice}</td>
                    <td>{totalReward}</td>
                  </tr>
                </tbody>
              </Table>
              <div className="d-flex justify-content-between w-100">
                <Button color="secondary" onClick={toggle}>
                  Cancel{" "}
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    if (!date) {
                      alert("Please select transaction date");
                    } else {
                      const transaction = {
                        transactionDate: date,
                        transactionMonth: new Date(date).getMonth(),
                        products: [cartItems],
                        totalPrice: totalPrice,
                        totalReward: totalReward,
                      };
                      setTransactions([...transactions, transaction]);
                      setCartItem([]);
                      setSelectedDate(null);
                      totalReward=0;
                      totalPrice=0;
                      toggle();
                    }
                  }}
                >
                  Complete Translation
                </Button>
              </div>
            </ModalFooter>
          )}
        </Modal>
      )}
      {transactions.length > 0 && (
        <Modal isOpen={transactionModal} toggle={transactionToggle} size="lg">
          <ModalHeader toggle={transactionToggle}>Transactions</ModalHeader>
          <ModalBody>
            <Table striped>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Month</th>
                  <th>No of Transactions</th>
                  <th>Reward Points</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(_.groupBy(transactions, "transactionMonth")).map(
                  (item, index) => {
                    return (
                      <tr>
                        <td>{index+1}</td>
                        <td>{monthNames[item]}</td>
                        <td>{_.groupBy(transactions, "transactionMonth")[
                            item
                          ].length}</td>
                        <td>
                          {_.groupBy(transactions, "transactionMonth")[
                            item
                          ].reduce((a, b) => a + (b["totalReward"] || 0), 0)}
                        </td>
                        
                      </tr>
                    );
                  }
                )}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
};

export default App;
