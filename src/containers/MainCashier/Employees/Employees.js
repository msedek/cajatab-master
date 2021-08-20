import React from "react";

import Employe from "../../../components/Employe/Employe";
import classes from "./Employees.scss";

const Employees = props => {
  let index = null;
  let myEmployees = [];

  props.employees.forEach((emp, ind) => {
    index = ind;
    myEmployees.push(
      <Employe
        empClicked={() => props.empClicked(emp)}
        key={index}
        index={index}
        nameMesero={emp.vendor_name}
      />
    );
  });

  return (
    <div className={classes.Container}>
      <div className={classes.MarginEmp}>{myEmployees}</div>
    </div>
  );
};

export default Employees;
