// npm packages
const inquirer = require("inquirer");
const fs = require("fs").promises;

// own packages
const { manager_q, addTeamMember_q, employee_q } = require("./lib/questions");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

async function init() {
  try {
    let answers = await inquirer.prompt([
      {
        name: "start",
        message: "Build an engineering team",
        type: "list",
        choices: ["Start", "Quit"]
      }
    ]);

    if (answers.start === "Start") {
      let team = [];
      answers = await inquirer.prompt(manager_q);

      team.push(
        new Manager(answers.name, answers.id, answers.email, answers.office)
      );

      console.log("Team manager added");

      answers = await inquirer.prompt(addTeamMember_q);

      while (answers.addTeamMember === "Yes") {
        answers = await inquirer.prompt(employee_q);

        if (answers.role === "Intern") {
          team.push(
            new Intern(answers.name, answers.id, answers.email, answers.school)
          );
          console.log("Intern added");
        } else if (answers.role === "Engineer") {
          team.push(
            new Engineer(
              answers.name,
              answers.id,
              answers.email,
              answers.github
            )
          );
          console.log("Engineer added");
        }

        answers = await inquirer.prompt(addTeamMember_q);
      }

      team.map(employee => {
        console.log(employee.getName());
      });
    } else {
      console.log("Bye!");
    }
  } catch (error) {
    console.error(error);
  }
}

init();
