//This gets the elements to modify/get data from and to//
const calculate = document.getElementById('Calculate');
const basicSalaryForm = document.getElementById('BasicSalaryForm');
const basicSalary = document.getElementById('BasicSalaryInputField');
const basicSalaryModalDiv = document.getElementById('BasicSalaryModal');
const familyExemption = document.getElementById('familyExemption');
let basicSalaryValue;
let isValidForm = false;

//This a bootstrap class 'shown.bs.modal' means when the Modal (Popup) shown to the user then focus on the iput field 'basicSalary'//
basicSalaryModalDiv.addEventListener('shown.bs.modal', () => {
  basicSalary.focus();
});

basicSalaryForm.addEventListener('submit', (e) => {
  //this prevents the default refresh behavior for the submit event in the form//
  e.preventDefault();
  basicSalaryValue = basicSalary.value;

  // Call to validate the basic salary //
  ValidateBasicSalary();

  // If the function is valid then calucate the required informaion by calling hte fucntions//
  if (isValidForm == true) {
    let socialSecurity = CalculateSocialSecurity();
    let incomeTax = CalculateIncomeTax();

    document.getElementById('SocialSecuritySpan').textContent = socialSecurity;
    document.getElementById('BasicSalarySpan').textContent = basicSalaryValue;
    document.getElementById('IncomeTaxSpan').textContent = incomeTax;

    document.getElementById('NetSalarySpan').textContent =
      basicSalaryValue - (socialSecurity + Number(incomeTax));

    // Some styling manipulation//
    const mainContainerDiv = document.getElementById('MainContainer');
    mainContainerDiv.classList.replace('d-none', 'd-block');
    const initialContainerDiv = document.getElementById('InitialContainer');
    initialContainerDiv.classList.add('d-none');

    const basicSalaryModalDiv = document.getElementById('BasicSalaryModal');
    basicSalaryModalDiv.classList.replace('show', 'hide');
    basicSalaryModalDiv.classList.add('d-none');

    const basicSalaryModalContainer =
      document.getElementsByClassName('modal-backdrop')[0];
    if (basicSalaryModalContainer != undefined) {
      basicSalaryModalContainer.classList.replace('show', 'hide');
      basicSalaryModalContainer.classList.add('d-none');
    }
  }
});

// This validates if the entered basicSalary is valid and if it does not then add a class 'is-invalid' which triggers the bootsrap styles //
function ValidateBasicSalary() {
  if (basicSalaryValue == '' || basicSalaryValue <= 0) {
    basicSalary.classList.add('is-invalid');
  } else if (basicSalary.classList.contains('is-invalid')) {
    basicSalary.classList.replace('is-invalid', 'is-valid');
    isValidForm = true;
  } else {
    isValidForm = true;
  }
}


// Calcualte the Income Tax according to the rule (Personal Income)
// First 5,000 after the yearly income (8,400 JOD) will be 5%
// Second 5,000 10%
// Third 5,000 15%
// Forth 5,000 20%
// Over 20,000 and up to 1,000,000 will be 25%
// The remaining 30%
function CalculateIncomeTax() {
  let yearlyIncomeTax = 0;
  
  // This for the Single person (without Family Exemption)//
  if (familyExemption.checked == false) {
    if (basicSalaryValue >= 700) {
      let yearlyIncome = basicSalaryValue * 12;
      yearlyIncome -= 8400;
      for (let i = 5; i <= 30; i += 5) {
        if (yearlyIncome < 0) break;

        if (yearlyIncome < 5000 || (yearlyIncome >= 20000 && yearlyIncome <= 1000000 && i == 25)) {
          yearlyIncomeTax += yearlyIncome * (i / 100);
          break;
        }
        if (yearlyIncome > 1000000 && i == 30) {
          yearlyIncomeTax += yearlyIncome * (i / 100);
          break;
        } else {
          yearlyIncomeTax += 5000 * (i / 100);
          yearlyIncome -= 5000;
        }
      }
    }
  }
  // This for the married person (with Family Exemption)//
  else {
    if (basicSalaryValue > 1400) {
      let yearlyIncome = basicSalaryValue * 12;
      yearlyIncome -= 16800;
      for (let i = 5; i <= 30; i += 5) {
        if (yearlyIncome < 0) break;

        if (yearlyIncome < 5000 || (yearlyIncome >= 20000 && yearlyIncome <= 1000000 && i == 25)) {
          yearlyIncomeTax += yearlyIncome * (i / 100);
          break;
        }
        if (yearlyIncome > 1000000 && i == 30) {
          yearlyIncomeTax += yearlyIncome * (i / 100);
          break;
        } else {
          yearlyIncomeTax += 5000 * (i / 100);
          yearlyIncome -= 5000;
        }
      }
    }
  }


//This rounds the outcome to two decimal digits//
return (yearlyIncomeTax / 12).toFixed(2);
}

//This calculates the Social Security which 7.5% of the salary//
function CalculateSocialSecurity() {
  return basicSalaryValue * (7.5 / 100);
}
