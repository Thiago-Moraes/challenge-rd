function idOutOfRange(arr, start, end) {
  return arr.some((item) => item.id < start || item.id > end);
}

function leghtOutOfRange(arr, start, end) {
  return arr.length < start || arr.length > end;
}

function validateData(customerSuccess, customerSuccessAway, customers) {

  if (leghtOutOfRange(customerSuccess, 0, 1000) || leghtOutOfRange(customers, 0, 1000000)){
    throw new Error("Length value greather than allowed");
  }

  if (idOutOfRange(customerSuccess, 0, 1000) || idOutOfRange(customers, 0, 1000000)){
    throw new Error("Id value greather than allowed");
  }
  
  if (customerSuccessAway.length > Math.floor(customerSuccess.length / 2)){
    throw new Error("Number of disconnected CS greater than allowed");
  }

}

function availableCustomers(customerSuccess, customerSuccessAway) {
  return customerSuccess.filter(
    (customer) => !customerSuccessAway.includes(customer.id)
  );
}

function orderByScore(arr) {
  return arr.sort((a, b) => a.score - b.score);
}

function callsByCS(ordenedAvailableCS, ordenedCustomers) {
  const result = [];
  for (let i = 0; i < ordenedAvailableCS.length; i++) {
    const remaningValues = [];
    const filteredScore = [];
    for (let j = 0; j < ordenedCustomers.length; j++) {
      if (ordenedCustomers[j].score <= ordenedAvailableCS[i].score) {
        filteredScore.push(ordenedCustomers[j]);
        continue ;
      } 
      
      remaningValues.push(ordenedCustomers[j]);
    }
    ordenedCustomers = remaningValues;
    result.push({ id: ordenedAvailableCS[i].id, calls: filteredScore });
  }
  return result;
}

function csForMoreCalls(calls) {
  const ordenedCalls = calls.sort((a, b) => b.calls.length - a.calls.length);
  if (ordenedCalls[0].calls.length === ordenedCalls[1].calls.length) {
    return 0;
  }

  return ordenedCalls[0].id;
}

/**
 * Returns the id of the CustomerSuccess with the most customers
 * @param {array} customerSuccess
 * @param {array} customers
 * @param {array} customerSuccessAway
 */
function customerSuccessBalancing(
  customerSuccess,
  customers,
  customerSuccessAway
) {
  /**
   * ===============================================
   * =========== Write your solution here ==========
   * ===============================================
   */
  validateData(customerSuccess, customerSuccessAway, customers);
  
  const constAvailableCS = availableCustomers(
    customerSuccess,
    customerSuccessAway
  );
  const ordenedAvailableCS = orderByScore(constAvailableCS);
  const ordenedCustomers = orderByScore(customers);

  const calls = callsByCS(ordenedAvailableCS, ordenedCustomers);
  return csForMoreCalls(calls)
  
}

test("Scenario 1", () => {
  const css = [
    { id: 1, score: 60 },
    { id: 2, score: 20 },
    { id: 3, score: 95 },
    { id: 4, score: 75 },
  ];
  const customers = [
    { id: 1, score: 90 },
    { id: 2, score: 20 },
    { id: 3, score: 70 },
    { id: 4, score: 40 },
    { id: 5, score: 60 },
    { id: 6, score: 10 },
  ];
  const csAway = [2, 4];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

function buildSizeEntities(size, score) {
  const result = [];
  for (let i = 0; i < size; i += 1) {
    result.push({ id: i + 1, score });
  }
  return result;
}

function mapEntities(arr) {
  return arr.map((item, index) => ({
    id: index + 1,
    score: item,
  }));
}

function arraySeq(count, startAt) {
  return Array.apply(0, Array(count)).map((it, index) => index + startAt);
}

test("Scenario 2", () => {
  const css = mapEntities([11, 21, 31, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 3", () => {
  const testTimeoutInMs = 100;
  const testStartTime = new Date().getTime();

  const css = mapEntities(arraySeq(999, 1));
  const customers = buildSizeEntities(10000, 998);
  const csAway = [999];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(998);

  if (new Date().getTime() - testStartTime > testTimeoutInMs) {
    throw new Error(`Test took longer than ${testTimeoutInMs}ms!`);
  }
});

test("Scenario 4", () => {
  const css = mapEntities([1, 2, 3, 4, 5, 6]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 5", () => {
  const css = mapEntities([100, 2, 3, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

test("Scenario 6", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [1, 3, 2];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 7", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [4, 5, 6];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(3);
});
