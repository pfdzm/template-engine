const manager_q = [
  {
    name: "name",
    message: "What's the team manager's name?",
    type: "input"
  },
  {
    name: "email",
    message: "Enter their e-mail address:"
  },
  {
    name: "id",
    message: "Enter their id number:",
    type: "number"
  },
  {
    name: "office",
    message: "Enter their office number:",
    type: "number"
  }
];
const employee_q = [
  {
    name: "role",
    message: "Pick their role:",
    type: "list",
    choices: ["Intern", "Engineer"]
  },
  {
    name: "name",
    message: "What's their name?",
    type: "input"
  },
  {
    name: "email",
    message: "Enter their e-mail address:",
    type: "input"
  },
  {
    name: "id",
    message: "Enter their id number:",
    type: "number"
  },
  {
    name: "school",
    message: "Enter their school name:",
    type: "input",
    when: answers => answers.role === "Intern"
  },
  {
    name: "github",
    message: "Enter their GitHub username:",
    type: "input",
    when: answers => answers.role === "Engineer"
  }
];
const addTeamMember_q = {
  name: "addTeamMember",
  message: "Would you like to add a team member?",
  type: "list",
  choices: ["Yes", "No"]
};

module.exports = { manager_q, employee_q, addTeamMember_q };
