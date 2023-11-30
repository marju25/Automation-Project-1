beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

/*
BONUS TASK: add visual tests for registration form 3
Task list:
* Test suite for visual tests for registration form 3 is already created
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns
    * checkboxes, their content and links
    * email format
 */

describe('Visual Tests for Registration Form 3', () => {
    it('Check that radio button list is correct', () => {
        // Array of found elements with given selector has 4 elements in total
        cy.get('input[type="radio"]').should('have.length', 4)

        // Verify labels of the radio buttons
        cy.get('input[type="radio"]').next().eq(0).should('have.text', 'Daily')
        cy.get('input[type="radio"]').next().eq(1).should('have.text', 'Weekly')
        cy.get('input[type="radio"]').next().eq(2).should('have.text', 'Monthly')
        cy.get('input[type="radio"]').next().eq(3).should('have.text', 'Never')

        //Verify default state of radio buttons
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
        cy.get('input[type="radio"]').eq(1).should('not.be.checked')
        cy.get('input[type="radio"]').eq(2).should('not.be.checked')
        cy.get('input[type="radio"]').eq(3).should('not.be.checked')

        // Selecting one will remove selection from other radio button
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')

    })

    it('Country dropdown is correct', () => {
        // Check the length of array of elements in Cars dropdown
        cy.get('#country').find('option').should('have.length', 4)

        // Create screenshot for this area, and full page
        cy.get('#country').select(2).screenshot('Country drop-down')
        cy.screenshot('Full page screenshot')

        // Check that third element in the dropdown is Estonia
        cy.get('#country').find('option').eq(2).should('have.text', 'Estonia')

    })

    it('City selection dropdown is correct', () => {
        // To activate the "City" selection you have to choose "Country" first
        cy.get('#country').select('Estonia')

        // Check that the dropdown has four options
        cy.get('#city').find('option').should('have.length', 4)
        cy.get('#city').select(3).screenshot('City drop-down')
        cy.screenshot('Full page screenshot')

        // Check that second element in the dropdown is Tallinn
        cy.get('#city').find('option').eq(1).should('have.text', 'Tallinn')
    })

    it('Check that checkbox content and links are working', () => {
        // "Accept our privacy policy" checkbox
        cy.get('input[type="checkbox"]').check()
        cy.get('input[type="checkbox"]').should('be.checked')
        cy.screenshot('after_checkbox_checked')

        // "Accept our cookie policy" link opens correctly
        // Get navigation element, find siblings that contains h1 and check if it has Registration form in string
        cy.get('a')
            .contains('Accept our cookie policy')
            .should('be.visible')
            .click()

        // Check that currently opened URL is correct
        cy.url().should('contain', '/cookiePolicy.html')
        cy.go('back')
    })

    it('Check that user can submit a form with only valid email format ', () => {
        // Type an invalid email address to the email field
        cy.get('input[name="email"]').type('marjuemail')
        // Check that error message appears
        cy.get('span:contains("Invalid email address.")').should('be.visible')

        // Type a correct email format
        // First clear the email field 
        cy.get('input[name="email"]').clear()
        cy.get('input[name="email"]').type('marju@test.ee')
        cy.get('span:contains("Invalid email address.")').should('not.be.visible')
    })
})


/*
BONUS TASK: add functional tests for registration form 3
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + validation
    * only mandatory fields are filled in + validations
    * mandatory fields are absent + validations (try using function)
    * If city is already chosen and country is updated, then city choice should be removed
    * add file (google yourself for solution)
 */

describe('Functional tests- Registration Form 3', () => {
    it('User can submit form when all fields are filled', () => {
        cy.get('#name').type('ME')
        cy.get('input[name="email"]').type('marju@test.ee')
        cy.get('#country').select('Estonia')
        cy.get('#city').select('string:Tallinn')
        cy.get('input[type="date"]').first().type('1983-05-29')
        cy.get('input[type="radio"]').next().eq(2).should('have.text', 'Monthly')
        cy.get('input[type="date"][name="birthday"]').type('1983-05-29')
        cy.get('input[type="checkbox"][required][ng-model="checkbox"]').check()
        cy.get('input[type="checkbox"][required]').check()

        // Assert that error message is not visible
        cy.get('.error_message').should('not.exist')
        // Asserting that submit button is enabled
        cy.get('input[type="submit"][ng-disabled="myForm.$invalid"]').should('be.enabled')
    })

    it('User can submit form with valid data and only mandatory fields filled', () => {
        cy.get('#name').type('ME')
        cy.get('input[name="email"]').type('marju@test.ee')
        cy.get('#country').select('Estonia')
        cy.get('#city').select('string:Tallinn')
        cy.get('input[type="checkbox"][required][ng-model="checkbox"]').check()

        // Assert that error message is not visible
        cy.get('.error_message').should('not.exist')
        // Asserting that submit button is enabled
        cy.get('input[type="submit"][ng-disabled="myForm.$invalid"]').should('be.enabled')
    })

    it('User cannot submit form when mandatory field email is absent ', () => {
        cy.get('#name').type('ME')
        cy.get('input[name="email"]').type('marju@test.ee')
        cy.get('#country').select('Estonia')
        cy.get('#city').select('string:Tallinn')
        cy.get('input[type="date"]').first().type('1983-05-29')
        cy.get('input[type="radio"]').next().eq(2).should('have.text', 'Monthly')
        cy.get('input[type="date"][name="birthday"]').type('1983-05-29')

        // Clear the email input field
        cy.get('input[name="email"]').clear()
        // Assert that the error message is visible

        cy.get('span[ng-show="myForm.email.$error.required"]')
            .should('be.visible')
            .and('have.text', 'Email is required.')

        // Assert that submit button is disabled
        cy.get('input[type="submit"][ng-disabled="myForm.$invalid"]').should('not.be.enabled')
    })

    it('Check that "City" choice will be removed when "Country" choice is updated', () => {
        cy.get('#name').type('ME')
        cy.get('input[name="email"]').type('marju@test.ee')
        cy.get('#country').select('Estonia')
        cy.get('#city').select('string:Tallinn')
        cy.get('input[type="date"]').first().type('1983-05-29')
        cy.get('input[type="radio"]').next().eq(2).should('have.text', 'Monthly')
        cy.get('input[type="date"][name="birthday"]').type('1983-05-29')
        cy.get('input[type="checkbox"][required][ng-model="checkbox"]').check()
        cy.get('input[type="checkbox"][required]').check()

        // Change the "Country" choice in the dropdown
        cy.get('#country').select('Spain')
        cy.get('#city').eq(0)
    })
    
    it('User can add files to the form', () => {
        cy.get('input[type=file]').selectFile('cypress/fixtures/cerebrum_hub_logo.png')

    })
})