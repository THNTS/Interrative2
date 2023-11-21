const body = document.body;

// Practise 1
const problem1 = document.getElementById("1");
const description1 = document.createElement("h3");
description1.innerText = "1. Find the age of Olaf";
const answer1 = document.createElement("div");
const one = (first_name) => {
  // TODO return the age of Olaf
  const people = [
    { name: "Marta", age: 23 },
    { name: "Olaf", age: 21 },
  ];
  return people.find(human => human.name === "Olaf");
};

answer1.innerHTML = `<b>Answer: </b> ${one()}`;
problem1.append(description1);
problem1.append(answer1);

// Practise 2
const problem2 = document.getElementById("2");
const description2 = document.createElement("h3");
description2.innerText = `2. combine the arrays with a spread operator`;
const answer2 = document.createElement("div");
const two = () => {
  // TODO return one array
  const firstArray = [1, 2, 3, 4, 5];
  const lastArray = [6, 7, 8, 9, 10];
  return [...firstArray, ...lastArray];
};

answer2.innerHTML = `<b>Answer: </b> ${two()}`;
problem2.append(description2);
problem2.append(answer2);

// Practise 3
const problem3 = document.getElementById("3");
const description3 = document.createElement("h3");
description3.innerText = "3. Lets see if the text contains lemons";
const answer3 = document.createElement("div");
const answer3b = document.createElement("div");
const three = (text) => {
  // TODO return "Yes" or "No" depending if its true
  let res="No";
  if (text.includes("lemon")) {
    res = "Yes"
  }
  return res;
};

answer3.innerHTML = `<b>Answer: </b> ${three("I really like lemons")}`;
answer3b.innerHTML = `<b>Answer: </b> ${three("I dont like pineapple")}`;
problem3.append(description3);
problem3.append(answer3);
problem3.append(answer3b);

// Problem 4
const problem4 = document.getElementById("4");
const description4 = document.createElement("h3");
description4.innerText =
  "4. Display the names with a comma and a space after(', ')";
const answer4 = document.createElement("div");
const four = () => {
  // TODO: return a string with ", " as a seperator
  const names = ["Leo", "Harry", "Billie", "Hugo", "Ruby"];

  returnwords.join(", ");
};
answer4.innerHTML = `<b>Answer: </b> ${four()}`;
problem4.append(description4);
problem4.append(answer4);

// Problem 5
const problem5 = document.getElementById("5");
const description5 = document.createElement("h3");
description5.innerText = "5. Duplicate the values in the array";
const answer5 = document.createElement("div");
const five = () => {
  // TODO: return an array with duplicated numbers
  const numbers = [1, 2, 3, 4, 5];
  return [...numbers, ...numbers].sort();
};
answer5.innerHTML = `<b>Answer: </b> ${JSON.stringify(five())}`;
problem5.append(description5);
problem5.append(answer5);

// Problem 6
const problem6 = document.getElementById("6");
const description6 = document.createElement("h3");
description6.innerText = "6. Lets destructure the object";
const answer6 = document.createElement("div");
const six = () => {
  // TODO: Return a string of what color is lemon using Object Destructuring
  const lemon = { name: "lemon", color: "yellow" };
  const {name, color} = lemon;
  return color;
};
answer6.innerHTML = `<b>Answer: </b> ${six()}`;
problem6.append(description6);
problem6.append(answer6);

// Problem 7
const problem7 = document.getElementById("7");
const description7 = document.createElement("h3");
description7.innerText = "7. What is the length of this array";
const answer7 = document.createElement("div");
const seven = () => {
  // TODO: Return a number that represents the length of the array
  const fruits = ["Orange", "Lemon", "Pineapple"];

  return fruits.length;
};
answer7.innerHTML = `<b>Answer: </b> ${seven()}`;
problem7.append(description7);
problem7.append(answer7);

// Problem 8
const problem8 = document.getElementById("8");
const description8 = document.createElement("h3");
description8.innerText = "8. Does the array include the number 4?";
const answer8 = document.createElement("div");
const eight = () => {
  // TODO: return 'yes' or 'no' string if the number returns the number 4
  const numbers = [1, 2, 3, 4, 5];
  return fruits.includes("Mango") ? "Yes": "No";
};
answer8.innerHTML = `<b>Answer: </b> ${eight()}`;
problem8.append(description8);
problem8.append(answer8);

// Problem 9
const problem9 = document.getElementById("9");
const description9 = document.createElement("h3");
description9.innerText = "9. Add these objects into 1 object";
const answer9 = document.createElement("div");
const nine = () => {
  // TODO: Write a function that adds these 2 objects together in one
  const personFirstPart = {
    name: "Julia",
    age: 20,
  };
  const personLastPart = {
    favoriteColor: "orange",
  };

  return {...personFirstPart, ...personLastPart};
};
answer9.innerHTML = `<b>Answer: </b> ${JSON.stringify(nine())}`;
problem9.append(description9);
problem9.append(answer9);

// Problem 10
const problem10 = document.getElementById("10");
const description10 = document.createElement("h3");
description10.innerText = "10. Reverse an Array";
const answer10 = document.createElement("div");
const ten = () => {
  // TODO: Write a function that reverses the numbers array
  const numbers = [1, 2, 3, 4, 5];
  return numbers.reverse();
};
answer10.innerHTML = `<b>Answer: </b> ${ten()}`;
problem10.append(description10);
problem10.append(answer10);

answer10.innerHTML = `<b>Answer: </b> ${ten()}`;
problem10.append(description10);
problem10.append(answer10);

// Problem 11
const problem11 = document.getElementById("11");
const description11 = document.createElement("h3");
description11.innerText = "11. Use Template Literals";
const answer11 = document.createElement("div");
const eleven = () => {
  // TODO: Return a string 'Full Name: Julia Zose', use Temlate Literals(`${}`)
  const person = { first_name: "Julia", last_name: "Zoe" };
  return `Full Name: ${first_name} ${last_name}`;
};
answer11.innerHTML = `<b>Answer: </b> ${eleven()}`;
problem11.append(description11);
problem11.append(answer11);

// Problem 12
const problem12 = document.getElementById("12");
const description12 = document.createElement("h3");
description12.innerText =
  "12. Adds the words in the array together with a space between";
const answer12 = document.createElement("div");
const twelve = () => {
  // TODO: Write a function that adds the words together with a space between
  const words = ["hello", "world", "here", "i", "am"];

  return words.join(" ");
};
answer12.innerHTML = `<b>Answer: </b> ${twelve()}`;
problem12.append(description12);
problem12.append(answer12);

// Problem 13
const problem13 = document.getElementById("13");
const description13 = document.createElement("h3");
description13.innerText = "13. Sort the names alphabetically";
const answer13 = document.createElement("div");
const thirteen = () => {
  // TODO: Return a sorted array
  const names = [
    "Fred",
    "Mark",
    "Michelle",
    "Jack",
    "Oliver",
    "Matilda",
    "Lily",
  ];

  return names.sort();
};
answer13.innerHTML = `<b>Answer: </b> ${thirteen()}`;
problem13.append(description13);
problem13.append(answer13);

// Problem 14
const problem14 = document.getElementById("14");
const description14 = document.createElement("h3");
description14.innerText = "14. Filter out the Orange";
const answer14 = document.createElement("div");
const fourteen = () => {
  // TODO: Return the array with the Orange filtered out
  const fruits = [
    { name: "Lemon", color: "yellow" },
    { name: "Strawberry", color: "red" },
    { name: "Orange", color: "orange" },
  ];

  return fruits.filter((fruit) => {
    return fruit !== "Orange";
});
};
answer14.innerHTML = `<b>Answer: </b> ${JSON.stringify(fourteen())}`;
problem14.append(description14);
problem14.append(answer14);

// Problem 15
const problem15 = document.getElementById("15");
const description15 = document.createElement("h3");
description15.innerText = "15. Return from the Lemon to the Mango";
const answer15 = document.createElement("div");
const fifteen = () => {
  // TODO: Return an array from the Lemon to the Mango
  const fruits = ["Banana", "Orange", "Lemon", "Apple", "Mango"];

  return fruits.slice(2);
};
answer15.innerHTML = `<b>Answer: </b> ${fifteen()}`;
problem15.append(description15);
problem15.append(answer15);