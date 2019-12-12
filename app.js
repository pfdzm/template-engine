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
      // generate the html
      let html = await render(team);
      // save it to disk
      await fs.writeFile("./output/index.html", html);
    } else {
      console.log("Bye!");
    }
  } catch (error) {
    console.error(error);
  }
}

function replace(template, employee) {
  const result = template.replace(/{{([a-z]+)}}/gi, (match_full, match) => {
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

async function render(team = []) {
  try {
    const teamHTML = await team
      .map(async employee => {
        const template = await fs.readFile(
          `./templates/${employee.getRole().toLowerCase()}.html`,
          "utf-8"
        );
        return replace(template, employee);
      })
      .reduce(async (prev, curr) => (await prev) + (await curr));

    const main = await fs.readFile("./templates/main.html", "utf-8");

    return main.replace("{{target}}", teamHTML);
  } catch (error) {
    console.error(error);
  }
}

init();
