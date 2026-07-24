@ui
Feature: Sign in
  As a registered vessel owner, skipper or agent
  I want to sign in to the Catch Recording service
  So that I can record and manage my catch data

  Background:
    Given I am on the Catch Recording sign-in page

  @smoke
  Scenario: Sign-in form is displayed correctly
    Then I should see the email and password fields and a sign in button

  Scenario: Successful sign in with valid credentials
    When I sign in with a valid email and password
    Then I should be redirected to my dashboard

  Scenario Outline: Unsuccessful sign in with invalid credentials
    When I sign in with email "<email>" and password "<password>"
    Then I should see a sign-in error message

    Examples:
      | email                  | password      |
      | not-an-email           | Password123!  |
      | valid.user@example.com | wrongpassword |
