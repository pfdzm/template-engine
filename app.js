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

      let html = await render(team);
      await fs.writeFile("./output/index.html", html);
    } else {
      console.log("Bye!");
    }
  } catch (error) {
    console.error(error);
  }
}

function replace(data, employee) {
  const result = data.replace(/{{([a-z]+)}}/gi, (match_full, match) => {
    let replacement = "";
    switch (match) {
      case "role":
        replacement = employee.getRole();
        break;
      case "name":
        replacement = employee.getName();
        break;
      case "id":
        replacement = employee.getId();
        break;
      case "officeNumber":
        replacement = employee.getOfficeNumber();
        break;
      case "school":
        replacement = employee.getSchool();
        break;
      case "github":
        replacement = employee.getGithub();
      case "email":
        replacement = employee.getEmail();
        break;
      default:
        break;
    }
    return replacement;
  });
  return result;
}

async function render(team) {
  try {
    const main = await fs.readFile("./templates/main.html", "utf-8");
    const manager = await fs.readFile("./templates/manager.html", "utf-8");
    const intern = await fs.readFile("./templates/intern.html", "utf-8");
    const engineer = await fs.readFile("./templates/engineer.html", "utf-8");
    const teamHTML = team.map(employee => {
      let data = "";
      switch (employee.getRole()) {
        case "Manager":
          data = manager;
          break;
        case "Engineer":
          data = engineer;
          break;
        case "Intern":
          data = intern;
          break;
        default:
          break;
      }
      data = replace(data, employee);
      return data;
    });

    return main.replace(
      "{{target}}",
      teamHTML.reduce((prev, curr) => {
        return prev + curr;
      })
    );
  } catch (error) {
    console.error(error);
  }
}

init();
